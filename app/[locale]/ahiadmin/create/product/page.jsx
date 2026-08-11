"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import { PackagePlus, Image as ImageIcon, UploadCloud, Sparkles, Send, DollarSign } from "lucide-react";

export default function CreateProduct() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: ''
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
        if (!formData.name.trim()) errors.name = 'Product name is required.';
        if (!formData.price.trim()) errors.price = 'Product price is required.';
        if (!formData.description.trim()) errors.description = 'Product description is required.';
        if (!file) errors.file = 'Product image is required.';

        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error('Please fix the validation errors before posting.');
        }
        return Object.keys(errors).length === 0;
    };

    const PostProduct = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitting(true);
        const toastId = toast.loading("Uploading image and posting product...");
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formDataUpload
            });

            const data = await response.json();            

            if (data.success === true) {
                let image = data.url;

                try {
                    await fetch("/api/postproduct", {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify({
                            name: formData.name,
                            price: formData.price,
                            description: formData.description,
                            image: image
                        })
                    });

                    toast.success("Product successfully posted!", { id: toastId });
                    setFormData({ name: '', price: '', description: '' });
                    setFile(null);
                    location.reload();

                } catch (err) {
                    toast.error("We couldn't post the Product", { id: toastId });
                }
            } else {
                toast.error("We couldn't post the product", { id: toastId });
            }            
        } catch (err) {
            toast.error("We couldn't post the product", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                    Create New Product
                </h1>
                <p className="mt-2 text-sm opacity-80">
                    Add new items, merchandise, or services to your catalog.
                </p>
            </div>

            <form
                onSubmit={PostProduct}
                className="p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
            >
                {/* Header Badge Section */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}>
                            <PackagePlus className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                                Product Details
                            </h2>
                            <p className="text-xs opacity-60 font-medium">
                                Fill in the details below to add a new item
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider opacity-80" style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 5%, transparent)' }}>
                        <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                        Admin Mode
                    </div>
                </div>

                {/* Main Form Fields */}
                <div className="flex flex-col gap-6">
                    
                    {/* Product Name Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="name">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name"
                            title="Product Name" 
                            placeholder="Enter product name..." 
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition" 
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                        {validationErrors.name && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>
                        )}
                    </div>

                    {/* Product Price Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="price">
                            Product Price (in Birr) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3.5 opacity-50">
                                <DollarSign className="w-4 h-4" />
                            </span>
                            <input 
                                type="number" 
                                id="price" 
                                name="price"
                                title="Product Price" 
                                placeholder="0.00" 
                                value={formData.price}
                                onChange={handleChange}
                                onWheel={(e) => e.target.blur()}
                                className="w-full pl-10 pr-3.5 py-3 rounded-lg border text-sm outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            />
                        </div>
                        {validationErrors.price && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.price}</p>
                        )}
                    </div>

                    {/* Description Textarea */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="description">
                            Product Description <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            id="description" 
                            name="description"
                            title="Description" 
                            placeholder="Write your product description here..." 
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full min-h-[320px] rounded-lg px-3.5 py-3 border text-sm outline-none transition resize-y"
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        ></textarea>
                        {validationErrors.description && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.description}</p>
                        )}
                    </div>

                    {/* File Upload Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Product Image <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--foreground) 2%, transparent)' }}>
                            <input 
                                type="file" 
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
                                    Upload an Image
                                </button>
                                
                                <div className="flex flex-col truncate">
                                    <span className="text-xs font-bold truncate">
                                        {file ? file.name : "No file chosen"}
                                    </span>
                                    <span className="text-[10px] opacity-60">
                                        {file ? `${(file.size / 1000000).toFixed(2)} MB` : "No file selected"}
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
                            title="Post the product" 
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition shadow-md disabled:opacity-50 cursor-pointer"
                            style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                        >
                            <Send className="w-4 h-4" />
                            {submitting ? "Publishing..." : "POST"}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}