"use client"

import Header from "@/components/header";
import Footer from "@/components/footer"
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import LanguageSwitcher from "@/components/lannguageSwitcher";

export default function Order(){
    const t = useTranslations("order");
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        phone_number: "",
        location: "",
        jobs: [],      
        job_types: [], 
        comment: ""
    });

    const totalSteps = 6;

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

    // Validation checks for each individual step
    const isStepValid = () => {
        switch(step) {
            case 1: return formData.name.trim().length > 3;
            case 2: 
                const cleanPhone = formData.phone_number.replaceAll(" ", "");
                return cleanPhone.length >= 10 && cleanPhone.length <= 12;
            case 3: return ["addis_ababa", "buta_jira", "worabe", "halaba"].includes(formData.location);
            case 4: return formData.jobs.length > 0;
            case 5: return formData.job_types.length > 0;
            case 6: return true; // Comment is optional
            default: return false;
        }
    };

    async function SendData() {
        const posting = toast.loading(t("Sending your order"));
        try {
            const response = await fetch("/api/postorder", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    comment: formData.comment.trim() === "" ? "No comment" : formData.comment
                })
            });

            if(response.ok){
                toast.success(t("Order successfully sent!"), { id: posting });
                window.location.href = "/";
            } else {
                toast.error(t("Your order couldn't be sent!"), { id: posting });
            }
        } catch(err){
            toast.error(t("Your order couldn't be sent!"), { id: posting });
        }
    }

    return (
        <>
        {/* Header is now actively used at the top */}
        <Header />

        <main className="min-h-screen bg-background flex flex-col justify-between items-center py-10 px-4 relative mt-20">

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
                <div className="min-h-[220px] flex flex-col justify-center">
                    {step === 1 && (
                        <div className="space-y-4 animate-fadeIn">
                            <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">Step 1 of 6</span>
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
                            <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">Step 2 of 6</span>
                            <h2 className="text-2xl font-black text-foreground">{t("Phone Number")}</h2>
                            <p className="text-sm text-foreground/60">{t("Please enter your phone number!")}</p>
                            {/* type="number" with onWheel prevention to stop scrolling changes */}
                            <input 
                                type="number" 
                                placeholder={t("Phone Number")} 
                                value={formData.phone_number}
                                onChange={(e) => handleChange("phone_number", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="w-full mt-2 border border-(--border) bg-background rounded-2xl px-5 py-4 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                autoFocus
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-fadeIn">
                            <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">Step 3 of 6</span>
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
                            </select>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4 animate-fadeIn">
                            <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">Step 4 of 6</span>
                            <h2 className="text-2xl font-black text-foreground">{t("Select the job")}</h2>
                            <p className="text-sm text-foreground/60">{t("Select the job type!")}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                {[
                                    { id: "electric", label: t("Electric") },
                                    { id: "plumbing", label: t("Plumbing") },
                                    { id: "sanitary", label: t("Sanitary") },
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
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-4 animate-fadeIn">
                            <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">Step 5 of 6</span>
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
                            <span className="text-xs uppercase tracking-wider text-(--primary) font-bold">Step 6 of 6</span>
                            <h2 className="text-2xl font-black text-foreground">{t("If you have any idea")}... <span className="text-xs font-normal text-foreground/40">(Optional)</span></h2>
                            <p className="text-sm text-foreground/60">{t("If you have any idea")}</p>
                            <textarea 
                                value={formData.comment}
                                onChange={(e) => handleChange("comment", e.target.value)}
                                placeholder="Describe details here..."
                                className="w-full mt-2 border border-(--border) bg-background rounded-2xl p-4 h-32 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 transition-all shadow-inner resize-none"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* Footer Controls / Navigation buttons */}
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-(--border)/40">
                    {step > 1 ? (
                        <button 
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-2.5 rounded-xl border border-(--border) font-medium text-foreground hover:bg-foreground/5 transition-all cursor-pointer"
                        >
                            {t("Back")}
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < totalSteps ? (
                        <button 
                            onClick={() => isStepValid() && setStep(step + 1)}
                            disabled={!isStepValid()}
                            className={`px-8 py-2.5 rounded-xl font-semibold transition-all duration-300 ${isStepValid() ? "bg-(--primary) text-background shadow-lg hover:opacity-90 cursor-pointer" : "bg-foreground/10 text-foreground/30 cursor-not-allowed"}`}
                        >
                            {t("Next")}
                        </button>
                    ) : (
                        <button 
                            onClick={() => isStepValid() && SendData()}
                            disabled={!isStepValid()}
                            className={`px-8 py-2.5 rounded-xl font-semibold transition-all duration-300 ${isStepValid() ? "bg-green-600 text-white shadow-lg hover:bg-green-700 cursor-pointer" : "bg-foreground/10 text-foreground/30 cursor-not-allowed"}`}
                        >
                            {t("Send")}
                        </button>
                    )}
                </div>

            </div>

            <div className="text-xs text-foreground/40 mt-4">
                Abuhanifa Installation • Secured
            </div>
        </main>

        {/* Footer is now actively used at the bottom */}
        <Footer />
        </>
    );
}