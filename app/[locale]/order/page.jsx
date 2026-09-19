"use client"

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
    Upload,
    FileText,
    X
} from "lucide-react";

export default function Order() {
    const t = useTranslations("order");
    const [step, setStep] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        contact_info: "",
        location: "",
        custom_location: "",
        jobs: [],
        custom_job: "",
        job_types: [],
        attachment: null,
        comment: ""
    });

    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [submittingOrder, setSubmittingOrder] = useState(false);

    // Image preview state management to handle memory leaks and proper lifecycle cleanup
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!formData.attachment || !formData.attachment.type.startsWith("image/")) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(formData.attachment);
        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [formData.attachment]);

    const totalSteps = 7;

    // Handle input changes dynamically for state tracking
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Toggle multi-select items (jobs and job_types)
    const handleMultiSelectToggle = (field, value) => {
        setFormData(prev => {
            const currentList = prev[field];
            if (currentList.includes(value)) {
                return { ...prev, [field]: currentList.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...currentList, value] };
            }
        });
    };

    // Helper function to validate file size and extension
    const validateFile = (file) => {
        const maxSizeBytes = 40 * 1024 * 1024; // 40 MB
        if (file.size > maxSizeBytes) {
            toast.error(t("File size exceeds 40 MB limit") || "File size exceeds 40 MB limit");
            return false;
        }

        const allowedExtensions = [
            "jpg", "jpeg", "png", "webp", "pdf",
            "doc", "docx", "dwg", "dxf", "zip"
        ];

        const fileNameParts = file.name.split(".");
        const extension = fileNameParts.length > 1 ? fileNameParts.pop().toLowerCase() : "";

        if (!allowedExtensions.includes(extension)) {
            toast.error(t("Invalid file type") || "Invalid file type");
            return false;
        }

        return true;
    };

    // File selection handler
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (validateFile(file)) {
                handleChange("attachment", file);
            } else {
                e.target.value = "";
            }
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            if (validateFile(file)) {
                handleChange("attachment", file);
            }
        }
    };

    // Format file size nicely
    const formatFileSize = (bytes) => {
        if (!bytes) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Validation checks for each individual step
    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.name.trim().length >= 1;
            case 2:
                return formData.contact_info.trim().length > 0;
            case 3:
                if (["addis_ababa", "buta_jira", "worabe", "halaba"].includes(formData.location)) {
                    return true;
                }
                if (formData.location === "other") {
                    return formData.custom_location.trim().length > 0;
                }
                return false;
            case 4:
                if (formData.jobs.length === 0) return false;
                if (formData.jobs.includes("other")) {
                    return formData.custom_job.trim().length > 0;
                }
                return true;
            case 5:
                return formData.job_types.length > 0;
            case 6:
                return true; // Attachment is optional
            case 7:
                return true; // Comment is optional
            default:
                return false;
        }
    };

    // Helper function to handle Cloudinary signature request and direct upload via XMLHttpRequest
    async function uploadOrderAttachment(file) {
        if (!validateFile(file)) {
            throw new Error("Invalid file");
        }

        const sigRes = await fetch("/api/cloudinary/order-signature", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                filename: file.name,
                file_size: file.size
            })
        });

        const signatureData = await sigRes.json();

        if (!sigRes.ok || !signatureData.success) {
            throw new Error(signatureData.message || "Failed to get upload signature");
        }

        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", file);
        cloudinaryFormData.append("api_key", signatureData.api_key);
        cloudinaryFormData.append("timestamp", String(signatureData.timestamp));
        cloudinaryFormData.append("signature", signatureData.signature);
        cloudinaryFormData.append("folder", signatureData.folder);
        cloudinaryFormData.append("public_id", signatureData.public_id);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/auto/upload`;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open("POST", uploadUrl);

            // Real-time progress tracker
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percent);
                }
            };

            xhr.onload = () => {
                let uploadData;
                try {
                    uploadData = JSON.parse(xhr.responseText);
                } catch (e) {
                    return reject(new Error("Invalid response from Cloudinary"));
                }

                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve({
                        attachment_url: uploadData.secure_url,
                        attachment_public_id: uploadData.public_id,
                        attachment_original_name: file.name,
                        attachment_mime_type: file.type || "",
                        attachment_size: file.size,
                        attachment_resource_type: uploadData.resource_type
                    });
                } else {
                    reject(new Error(uploadData.error?.message || "Failed to upload file to Cloudinary"));
                }
            };

            xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));
            xhr.onabort = () => reject(new Error("Cloudinary upload aborted"));

            xhr.send(cloudinaryFormData);
        });
    }

    async function SendData() {
        if (submittingOrder || uploadingFile) return;

        let attachmentPayload = null;
        let postingToastId = null;

        if (formData.attachment) {
            setUploadingFile(true);
            setUploadProgress(0);

            try {
                attachmentPayload = await uploadOrderAttachment(formData.attachment);
                setUploadProgress(100);
            } catch (err) {
                setUploadingFile(false);
                setUploadProgress(0);
                toast.error(err.message || t("Your order couldn't be sent!"));
                return;
            }
            setUploadingFile(false);
        }

        setSubmittingOrder(true);
        postingToastId = toast.loading(t("Sending your order"));

        // Resolve final location value if custom option was selected
        const finalLocation = formData.location === "other" ? formData.custom_location.trim() : formData.location;

        // Resolve final jobs array if "other" option was selected
        const finalJobs = formData.jobs.map(job => job === "other" ? formData.custom_job.trim() : job);

        const orderJson = {
            name: formData.name.trim(),
            contact_info: formData.contact_info.trim(),
            location: finalLocation,
            jobs: finalJobs,
            job_types: formData.job_types,
            comment: formData.comment.trim() === "" ? "No comment" : formData.comment.trim(),
            ...(attachmentPayload || {})
        };

        try {
            const response = await fetch("/api/postorder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(orderJson),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(t("Order successfully sent!"), { id: postingToastId });
                window.location.href = "/";
            } else {
                toast.error(
                    result.message || t("Your order couldn't be sent!"),
                    { id: postingToastId }
                );
            }
        } catch (err) {
            toast.error(t("Your order couldn't be sent!"), { id: postingToastId });
        } finally {
            setSubmittingOrder(false);
        }
    }

    return (
        <>
            <Header />

            <main className="min-h-screen bg-background flex flex-col justify-between items-center py-10 px-4 relative ">

                {/* Main Interactive Card Container */}
                <div className="w-full max-w-xl bg-foreground/[0.02] border border-(--border) backdrop-blur-md rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">

                    {/* Progress Indicator Bar */}
                    <div className="w-full bg-foreground/10 h-1.5 rounded-full mb-8 overflow-hidden">
                        <div
                            className="bg-(--primary) h-full transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        ></div>
                    </div>

                    {/* Step Content Wrapper */}
                    <div className="min-h-[260px] flex flex-col justify-center">
                        {step === 1 && (
                            <div className="space-y-4 animate-fadeIn">
                                <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">{t("Step 1 of 7")}</span>
                                <h2 className="text-2xl font-black text-foreground">{t("Name")}?</h2>
                                <p className="text-sm text-foreground/60">{t("Please enter your name!")}</p>
                                <input
                                    type="text"
                                    placeholder={t("Name")}
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className="w-full mt-2 border border-(--border) bg-background rounded-2xl px-5 py-4 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 transition-all shadow-inner"
                                    autoFocus
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-fadeIn">
                                <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">{t("Step 2 of 7")}</span>
                                <h2 className="text-2xl font-black text-foreground">{t("Contact Method")}</h2>
                                <p className="text-sm text-foreground/60">{t("contact_method_subtitle")}</p>
                                <input
                                    type="text"
                                    placeholder={t("contact_method_placeholder")}
                                    value={formData.contact_info}
                                    onChange={(e) => handleChange("contact_info", e.target.value)}
                                    className="w-full mt-2 border border-(--border) bg-background rounded-2xl px-5 py-4 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 transition-all shadow-inner"
                                    autoFocus
                                />
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-fadeIn">
                                <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">{t("Step 3 of 7")}</span>
                                <h2 className="text-2xl font-black text-foreground">{t("Location")}</h2>
                                <p className="text-sm text-foreground/60">{t("Please enter your location!")}</p>
                                <select
                                    value={formData.location}
                                    onChange={(e) => handleChange("location", e.target.value)}
                                    className="w-full mt-2 border border-(--border) bg-background rounded-2xl px-5 py-4 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 transition-all shadow-inner text-foreground cursor-pointer"
                                >
                                    <option value="" className="text-foreground/40">{t("Choose")}</option>
                                    <option value="addis_ababa">{t("Addis Ababa")}</option>
                                    <option value="buta_jira">{t("Buta Jira")}</option>
                                    <option value="worabe">{t("Worabe")}</option>
                                    <option value="halaba">{t("Halaba")}</option>
                                    <option value="other">{t("Other")}</option>
                                </select>

                                {formData.location === "other" && (
                                    <input
                                        type="text"
                                        placeholder={t("custom_location_placeholder")}
                                        value={formData.custom_location}
                                        onChange={(e) => handleChange("custom_location", e.target.value)}
                                        className="w-full mt-3 border border-(--border) bg-background rounded-2xl px-5 py-4 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 transition-all shadow-inner animate-fadeIn"
                                        autoFocus
                                    />
                                )}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-4 animate-fadeIn">
                                <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">{t("Step 4 of 7")}</span>
                                <h2 className="text-2xl font-black text-foreground">{t("Select the job")}</h2>
                                <p className="text-sm text-foreground/60">{t("Select the job type!")}</p>

                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    {[
                                        { id: "electric", label: t("Electric") },
                                        { id: "plumbing", label: t("Plumbing") },
                                        { id: "sanitary", label: t("Sanitary") },
                                        { id: "computer_maintenance", label: t("Computer Maintenance") },
                                        { id: "security_camera", label: t("Security Camera") },
                                        { id: "other", label: t("Other") },
                                    ].map((item) => {
                                        const isSelected = formData.jobs.includes(item.id);
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => handleMultiSelectToggle("jobs", item.id)}
                                                className={`border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${isSelected ? "border-(--primary) bg-(--primary)/10 shadow-md scale-[1.02]" : "border-(--border) hover:border-(--primary)/50"}`}
                                            >
                                                <span className="font-bold">{item.label}</span>
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? "border-(--primary) bg-(--primary)" : "border-(--border)"}`}>
                                                    {isSelected && <span className="text-background text-xs font-bold">✓</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {formData.jobs.includes("other") && (
                                    <input
                                        type="text"
                                        placeholder={t("custom_job_placeholder")}
                                        value={formData.custom_job}
                                        onChange={(e) => handleChange("custom_job", e.target.value)}
                                        className="w-full mt-3 border border-(--border) bg-background rounded-2xl px-5 py-4 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 transition-all shadow-inner animate-fadeIn"
                                        autoFocus
                                    />
                                )}
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-4 animate-fadeIn">
                                <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">{t("Step 5 of 7")}</span>
                                <h2 className="text-2xl font-black text-foreground">{t("Select the job")}</h2>
                                <p className="text-sm text-foreground/60">{t("Select the job stage!")}</p>

                                <div className="flex flex-col gap-2 mt-2">
                                    {[
                                        { id: "New Installation", label: t("New Installation") },
                                        { id: "Maintenance", label: t("Renovation and Maintenance") },
                                        { id: "Finishing", label: t("Finishing Work") }
                                    ].map((type) => {
                                        const isSelected = formData.job_types.includes(type.id);
                                        return (
                                            <div
                                                key={type.id}
                                                onClick={() => handleMultiSelectToggle("job_types", type.id)}
                                                className={`border rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all duration-300 ${isSelected ? "border-(--primary) bg-(--primary)/10 shadow-sm" : "border-(--border) hover:border-(--primary)/50"}`}
                                            >
                                                <span className="font-medium">{type.label}</span>
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? "border-(--primary) bg-(--primary)" : "border-(--border)"}`}>
                                                    {isSelected && <span className="text-background text-xs font-bold">✓</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {step === 6 && (
                            <div className="space-y-4 animate-fadeIn">
                                <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">{t("Step 6 of 7")}</span>
                                <h2 className="text-2xl font-black text-foreground">
                                    {t("Attach an Installation Plan")} <span className="text-xs font-normal text-foreground/40">({t("Optional")})</span>
                                </h2>
                                <p className="text-sm text-foreground/60">
                                    {t("attachment_description")}
                                </p>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {!formData.attachment ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 bg-background/50 hover:border-(--primary) hover:bg-(--primary)/5 ${isDragging ? "border-(--primary) bg-(--primary)/10 scale-[1.01]" : "border-(--border)"}`}
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-(--primary)/10 text-(--primary) flex items-center justify-center shadow-inner">
                                            <Upload size={24} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">
                                                {t("Choose a file")} <span className="font-normal text-foreground/60">{t("or drag and drop it here")}</span>
                                            </p>
                                            <p className="text-xs text-foreground/40 mt-1">
                                                {t("attachment_formats_hint")}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border border-(--border) rounded-3xl p-4 bg-background shadow-sm flex flex-col gap-3 animate-fadeIn">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3.5 overflow-hidden">
                                                {formData.attachment.type.startsWith("image/") && previewUrl ? (
                                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-foreground/5 shrink-0 border border-(--border)">
                                                        <img
                                                            src={previewUrl}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-14 h-14 rounded-2xl bg-(--primary)/10 text-(--primary) flex items-center justify-center shrink-0">
                                                        <FileText size={26} />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm truncate text-foreground">
                                                        {formData.attachment.name}
                                                    </p>
                                                    <p className="text-xs text-foreground/50 font-mono mt-0.5">
                                                        {formatFileSize(formData.attachment.size)} • {formData.attachment.type || t("Unknown type")}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleChange("attachment", null)}
                                                disabled={uploadingFile || submittingOrder}
                                                className="w-9 h-9 rounded-xl bg-foreground/5 hover:bg-red-500/10 hover:text-red-500 text-foreground/60 flex items-center justify-center transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={t("Remove file")}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>

                                        {uploadingFile && (
                                            <div className="w-full space-y-1.5 pt-2">
                                                <div className="flex justify-between items-center text-xs text-foreground/70 font-medium">
                                                    <span>Uploading attachment...</span>
                                                    <span className="font-bold text-(--primary)">{uploadProgress}%</span>
                                                </div>
                                                <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-(--primary) h-full transition-all duration-200 ease-out rounded-full"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 7 && (
                            <div className="space-y-4 animate-fadeIn">
                                <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">{t("Step 7 of 7")}</span>
                                <h2 className="text-2xl font-black text-foreground">{t("If you have any idea")}... <span className="text-xs font-normal text-foreground/40">({t("Optional")})</span></h2>
                                <p className="text-sm text-foreground/60">{t("If you have any idea")}</p>
                                <textarea
                                    value={formData.comment}
                                    onChange={(e) => handleChange("comment", e.target.value)}
                                    placeholder={t("comment_placeholder")}
                                    className="w-full mt-2 border border-(--border) bg-background rounded-2xl p-4 h-32 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 transition-all shadow-inner resize-none"
                                    autoFocus
                                />

                                {uploadingFile && (
                                    <div className="w-full space-y-1.5 pt-2 border-t border-(--border)/40">
                                        <div className="flex justify-between items-center text-xs text-foreground/70 font-medium">
                                            <span>Uploading attachment...</span>
                                            <span className="font-bold text-(--primary)">{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-(--primary) h-full transition-all duration-200 ease-out rounded-full"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Controls / Navigation buttons */}
                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-(--border)/40">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                disabled={uploadingFile || submittingOrder}
                                className="px-6 py-2.5 rounded-xl border border-(--border) font-medium text-foreground hover:bg-foreground/5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t("Back")}
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step < totalSteps ? (
                            <button
                                onClick={() => isStepValid() && setStep(step + 1)}
                                disabled={!isStepValid() || uploadingFile || submittingOrder}
                                className={`px-8 py-2.5 rounded-xl font-semibold transition-all duration-300 ${isStepValid() && !uploadingFile && !submittingOrder ? "bg-(--primary) text-background shadow-lg hover:opacity-90 cursor-pointer" : "bg-foreground/10 text-foreground/30 cursor-not-allowed"}`}
                            >
                                {t("Next")}
                            </button>
                        ) : (
                            <button
                                onClick={() => isStepValid() && !submittingOrder && !uploadingFile && SendData()}
                                disabled={!isStepValid() || submittingOrder || uploadingFile}
                                className={`px-8 py-2.5 rounded-xl font-semibold transition-all duration-300 ${isStepValid() && !submittingOrder && !uploadingFile ? "bg-green-600 text-white shadow-lg hover:bg-green-700 cursor-pointer" : "bg-foreground/10 text-foreground/30 cursor-not-allowed"}`}
                            >
                                {uploadingFile
                                    ? `Uploading ${uploadProgress}%...`
                                    : submittingOrder
                                        ? "Sending..."
                                        : t("Send")}
                            </button>
                        )}
                    </div>

                </div>

                <div className="text-xs text-foreground/40 mt-4">
                    Abuhanifa Installation Ethiopia • Secured
                </div>
            </main>

            <Footer />
        </>
    );
}