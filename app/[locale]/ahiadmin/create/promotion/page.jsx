"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Megaphone, Image as ImageIcon, UploadCloud, Sparkles, Send } from "lucide-react";

export default function CreatePromotion() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        title: '',
        description: '',
        link: ''
    });
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    function imageSelect() {
        let imageFile = document.getElementById("image");
        imageFile.click();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required.';
        if (!formData.email.trim()) errors.email = 'Email is required.';
        if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required.';
        if (!formData.title.trim()) errors.title = 'Promotion title is required.';
        if (!formData.description.trim()) errors.description = 'Description is required.';
        if (!formData.link.trim()) errors.link = 'Owner link is required.';
        if (!file) errors.file = 'Media file is required.';

        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error('Please fix the validation errors before posting.');
        }
        return Object.keys(errors).length === 0;
    };

    const PostPromotion = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitting(true);
        const toastId = toast.loading("Uploading media and posting promotion...");
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formDataUpload
            });

            const data = await response.json();            

            if (data.success === true) {
                let fileUrl = data.url;

                try {
                    const response2 = await fetch("/api/postpromotion", {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify({
                            name: formData.name,
                            email: formData.email,
                            phone_number: formData.phoneNumber,
                            title: formData.title,
                            description: formData.description,
                            image: fileUrl,
                            owner_link: formData.link
                        })
                    });

                    const responseData = await response2.json();
                    if (responseData.success) {
                        toast.success("Promotion posted successfully!", { id: toastId });
                        setFormData({
                            name: '',
                            email: '',
                            phoneNumber: '',
                            title: '',
                            description: '',
                            link: ''
                        });
                        setFile(null);
                    } else {
                        toast.error("We couldn't post the promotion!", { id: toastId });
                    }

                } catch (err) {
                    toast.error("We couldn't post the promotion!", { id: toastId });
                }
            } else {
                toast.error("Media upload failed", { id: toastId });
            }            
        } catch (err) {
            toast.error("We couldn't post the promotion!", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                    Create Promotion
                </h1>
                <p className="mt-2 text-sm opacity-80">
                    Publish promotional content, upload media assets, and manage campaign details.
                </p>
            </div>

            <form
                onSubmit={PostPromotion}
                className="p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
            >
                {/* Header Badge Section */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}>
                            <Megaphone className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                                Campaign Configuration
                            </h2>
                            <p className="text-xs opacity-60 font-medium">
                                Fill out promoter contact information, campaign copy, and media assets
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider opacity-80" style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 5%, transparent)' }}>
                        <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                        Editor Mode
                    </div>
                </div>

                {/* Main Form Fields */}
                <div className="flex flex-col gap-6">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="name">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name"
                                title="Name" 
                                placeholder="Name" 
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition" 
                                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            />
                            {validationErrors.name && (
                                <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                title="Email" 
                                placeholder="Email" 
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition" 
                                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            />
                            {validationErrors.email && (
                                <p className="mt-1 text-xs text-red-500">{validationErrors.email}</p>
                            )}
                        </div>

                        {/* Phone Number Input (Changed type to "tel" to prevent scrolling value changes) */}
                        <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="phoneNumber">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="tel" 
                                id="phoneNumber" 
                                name="phoneNumber"
                                title="Phone Number" 
                                placeholder="Phone Number" 
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition" 
                                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            />
                            {validationErrors.phoneNumber && (
                                <p className="mt-1 text-xs text-red-500">{validationErrors.phoneNumber}</p>
                            )}
                        </div>

                        {/* Title Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="title">
                                Title of the Promotion <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="title" 
                                name="title"
                                title="Title of the Promotion" 
                                placeholder="Title" 
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition" 
                                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            />
                            {validationErrors.title && (
                                <p className="mt-1 text-xs text-red-500">{validationErrors.title}</p>
                            )}
                        </div>
                    </div>

                    {/* Description Textarea */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="description">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            id="description" 
                            name="description"
                            title="Description" 
                            placeholder="Description" 
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full min-h-[220px] rounded-lg px-3.5 py-3 border text-sm outline-none transition resize-y"
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        ></textarea>
                        {validationErrors.description && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.description}</p>
                        )}
                    </div>

                    {/* Owner Link Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="link">
                            Owner link <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="link" 
                            name="link"
                            title="Owner link" 
                            placeholder="Owner Link... Telegram" 
                            value={formData.link}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition" 
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                        {validationErrors.link && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.link}</p>
                        )}
                    </div>

                    {/* File Upload Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Media Upload <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--foreground) 2%, transparent)' }}>
                            <input 
                                type="file" 
                                accept="image/*,video/*" 
                                hidden 
                                onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    setFile(selectedFile);
                                    if (selectedFile) {
                                        toast.success(`Selected: ${selectedFile.name}`);
                                        if (validationErrors.file) setValidationErrors(prev => ({ ...prev, file: '' }));
                                    }
                                }} 
                                id="image" 
                            />
                            
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <button 
                                    onClick={imageSelect} 
                                    type="button"
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                >
                                    <UploadCloud className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                                    Select a file
                                </button>
                                
                                <div className="flex flex-col truncate">
                                    <span className="text-xs font-bold truncate">
                                        Selected Image Name: <i>{file ? file.name : "Not Selected"}</i>
                                    </span>
                                    <span className="text-[10px] opacity-60">
                                        Selected Image Size: <i>{file ? `${(file.size / 1000000).toFixed(2)} mb` : "Not Measured"}</i>
                                    </span>
                                </div>
                            </div>

                            {file && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    Ready
                                </div>
                            )}
                        </div>
                        {validationErrors.file && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.file}</p>
                        )}
                    </div>

                    {/* Submit Button Action */}
                    <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                        <button 
                            type="submit"
                            disabled={submitting}
                            title="Post the Promotion" 
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition shadow-md disabled:opacity-50 cursor-pointer"
                            style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                        >
                            <Send className="w-4 h-4" />
                            {submitting ? "Posting..." : "POST"}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}