'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Layers, Sparkles, Send, DollarSign } from "lucide-react";

// ==========================================
// CENTRALIZED DYNAMIC CONFIGURATION
// Extracted directly from the PDF Material Charts
// ==========================================
const materialOptions = {
  plumbing: {
    types: [
      'CI',
      'Copper',
      'DI',
      'GI',
      'HDP/HDPE',
      'MS',
      'PEX',
      'PEX-AL-PEX',
      'Stainless Steel',
      'PPR',
      'ANY'
    ],
    brands: ['Aquapa', 'Lesso', 'RAK', 'Teflo', 'Any'],
    diameters: [
      'N/A',
      '1/2" (20mm)',
      '3/4" (25mm)',
      '1" (32mm)',
      '1 1/4" (40mm)',
      '1 1/2" (50mm)',
      '2" (63mm)',
      '2 1/2" (75mm)',
      '3" (90mm)',
      '4" (110mm)',
      '5" (140mm)',
      '6" (160mm)',
      '8" (200mm)',
      '10" (250mm)',
      '12" (315mm)',
    ]
  },
  sanitary: {
    types: ['PVC', 'CPVC', 'RCC', 'UPVC','N/A','ANY'],
    brands: ['Era', 'Lesso', 'Teflo', 'Any','N/A'],
    diameters: [
      'N/A',
      '1 1/2" (50mm)',
      '2" (63mm)',
      '2 1/2" (75mm)',
      '3" (90mm)',
      '4" (110mm)',
      '5" (140mm)',
      '6" (160mm)',
      '8" (200mm)',
      '10" (250mm)',
      '12" (315mm)',
    ]
  },
  electrical: {
    types: [
      'Solid',
      'Stranded',
      'Flexible armoured',
      'Mineral-insulated cable',
      'Flexible',
      'Semi-Flexible',
      'Semi-Rigid',
      'Rigid',
      'Rollo',
      'Guroro',
      'ANY',
      'N/A'
    ],
    brands: ['Rhino', 'Euro', 'UF', 'BMET', 'Any', 'N/A'],
    diameters: [
      'N/A',
      '1x1.5 mm2', '2x1.5 mm2', '3x1.5 mm2', '4x1.5 mm2', '5x1.5 mm2', '6x1.5 mm2',
      '1x2.5 mm2', '2x2.5 mm2', '3x2.5 mm2', '4x2.5 mm2', '5x2.5 mm2', '6x2.5 mm2',
      '1x4 mm2', '2x4 mm2', '3x4 mm2', '4x4 mm2', '5x4 mm2', '6x4 mm2',
      '1x6 mm2', '2x6 mm2', '3x6 mm2', '4x6 mm2', '5x6 mm2', '6x6 mm2',
      '1x10 mm2', '2x10 mm2', '3x10 mm2', '4x10 mm2', '5x10 mm2', '6x10 mm2',
      '1x16 mm2', '2x16 mm2', '3x16 mm2', '4x16 mm2', '5x16 mm2', '6x16 mm2',
      '1x25 mm2', '2x25 mm2', '3x25 mm2', '4x25 mm2', '5x25 mm2', '6x25 mm2',
      '1x35 mm2', '2x35 mm2', '3x35 mm2', '4x35 mm2', '5x35 mm2', '6x35 mm2',
      '1x50 mm2', '2x50 mm2', '3x50 mm2', '4x50 mm2', '5x50 mm2', '6x50 mm2',
      '1x70 mm2', '2x70 mm2', '3x70 mm2', '4x70 mm2', '5x70 mm2', '6x70 mm2',
      '1x95 mm2', '2x95 mm2', '3x95 mm2', '4x95 mm2', '5x95 mm2', '6x95 mm2',
      '1x120 mm2', '2x120 mm2', '3x120 mm2', '4x120 mm2', '5x120 mm2', '6x120 mm2',
      '1x150 mm2', '2x150 mm2', '3x150 mm2', '4x150 mm2', '5x150 mm2', '6x150 mm2',
      '1x185 mm2', '2x185 mm2', '3x185 mm2', '4x185 mm2', '5x185 mm2', '6x185 mm2',
      '1x240 mm2', '2x240 mm2', '3x240 mm2', '4x240 mm2', '5x240 mm2', '6x240 mm2',
    ]
  }
};

const installationStages = [
  { label: 'First Installation', value: 'first_installation' },
  { label: 'Finishing', value: 'finishing' }
];

const categories = [
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Sanitary', value: 'sanitary' },
  { label: 'Electrical', value: 'electrical' }
];

export default function MaterialMasterManagementPage() {
  const [formData, setFormData] = useState({
    installationStage: '',
    category: '',
    materialNameEnglish: '',
    materialNameAmharic: '',
    type: '',
    brand: '',
    diameter: '',
    unit: '',
    specification: '',
    price: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Get current dependent options based on selected category
  const currentCategoryConfig = formData.category
    ? materialOptions[formData.category]
    : { types: [], brands: [], diameters: [] };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const newConfig = materialOptions[newCategory] || { types: [], brands: [], diameters: [] };

    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      type: newConfig.types.includes(prev.type) ? prev.type : '',
      brand: newConfig.brands.includes(prev.brand) ? prev.brand : '',
      diameter: newConfig.diameters.includes(prev.diameter) ? prev.diameter : ''
    }));

    if (validationErrors.category) {
      setValidationErrors((prev) => ({ ...prev, category: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.installationStage) errors.installationStage = 'Installation Stage is required.';
    if (!formData.category) errors.category = 'Material Category is required.';
    if (!formData.materialNameEnglish.trim()) errors.materialNameEnglish = 'English name is required.';
    if (!formData.materialNameAmharic.trim()) errors.materialNameAmharic = 'Amharic name is required.';
    if (!formData.type) errors.type = 'Type is required.';
    if (!formData.brand) errors.brand = 'Brand is required.';
    if (!formData.diameter) errors.diameter = 'Diameter is required.';
    if (!formData.unit) errors.unit = 'Unit is required.';
    if (!formData.specification.trim()) errors.specification = 'Specification is required.';

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the validation errors before submitting.');
    }
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    const toastId = toast.loading('Saving material master data...');

    try {
      const payload = {
        installationStage: formData.installationStage,
        category: formData.category,
        materialNameEnglish: formData.materialNameEnglish,
        materialNameAmharic: formData.materialNameAmharic,
        type: formData.type,
        brand: formData.brand,
        diameter: formData.diameter,
        unit: formData.unit,
        specification: formData.specification,
        price: Number(formData.price) || 1,
      };

      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save material master data. Please try again.');
      }

      toast.success('Material master data successfully created and stored!', { id: toastId });
      
      setFormData({
        installationStage: '',
        category: '',
        materialNameEnglish: '',
        materialNameAmharic: '',
        type: '',
        brand: '',
        diameter: '',
        unit: '',
        specification: '',
        price: ''
      });
    } catch (err) {
      toast.error(err.message || 'An unexpected network error occurred.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
          Material Master Data Management
        </h1>
        <p className="mt-2 text-sm opacity-80">
          Define and store installation material specifications and pricing master records.
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
      >
        {/* Header Badge Section */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}>
              <Layers className="w-6 h-6" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                Material Master Records
              </h2>
              <p className="text-xs opacity-60 font-medium">
                Configure specifications, categories, and inventory metrics
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider opacity-80" style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 5%, transparent)' }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
            Master Mode
          </div>
        </div>

        {/* Section 1: Installation Information */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4 pb-2 border-b" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
            Installation Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Installation Stage */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="installationStage">
                Installation Stage <span className="text-red-500">*</span>
              </label>
              <select
                id="installationStage"
                name="installationStage"
                value={formData.installationStage}
                onChange={handleChange}
                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="">Select Installation Stage</option>
                {installationStages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
              {validationErrors.installationStage && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.installationStage}</p>
              )}
            </div>

            {/* Material Category */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="category">
                Material Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="">Select Material Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.category}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Material Information */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4 pb-2 border-b" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
            Material Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Material Name English */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="materialNameEnglish">
                Material Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="materialNameEnglish"
                name="materialNameEnglish"
                placeholder="e.g., Pipe"
                value={formData.materialNameEnglish}
                onChange={handleChange}
                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
              {validationErrors.materialNameEnglish && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.materialNameEnglish}</p>
              )}
            </div>

            {/* Material Name Amharic */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="materialNameAmharic">
                የቁሳቁስ ስም (በአማርኛ) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="materialNameAmharic"
                name="materialNameAmharic"
                placeholder="ለምሳሌ፦ ቧንቧ"
                value={formData.materialNameAmharic}
                onChange={handleChange}
                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
              {validationErrors.materialNameAmharic && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.materialNameAmharic}</p>
              )}
            </div>

            {/* Type (Dynamic) */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="type">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={!formData.category}
                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition disabled:opacity-50"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="">{formData.category ? 'Select Type' : 'Select Category First'}</option>
                {currentCategoryConfig.types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {validationErrors.type && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.type}</p>
              )}
            </div>

            {/* Brand (Dynamic) */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="brand">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                disabled={!formData.category}
                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition disabled:opacity-50"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="">{formData.category ? 'Select Brand' : 'Select Category First'}</option>
                {currentCategoryConfig.brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {validationErrors.brand && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.brand}</p>
              )}
            </div>

            {/* Diameter (Dynamic) */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="diameter">
                Diameter <span className="text-red-500">*</span>
              </label>
              <select
                id="diameter"
                name="diameter"
                value={formData.diameter}
                onChange={handleChange}
                disabled={!formData.category}
                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition disabled:opacity-50"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="">{formData.category ? 'Select Diameter' : 'Select Category First'}</option>
                {currentCategoryConfig.diameters.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {validationErrors.diameter && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.diameter}</p>
              )}
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="unit">
                Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                placeholder="e.g., MM..."
                value={formData.unit}
                onChange={handleChange}
                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
              {validationErrors.unit && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.unit}</p>
              )}
            </div>

            {/* Specification */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="specification">
                Specification <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="specification"
                name="specification"
                placeholder="e.g., BLUE..."
                value={formData.specification}
                onChange={handleChange}
                className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
              {validationErrors.specification && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.specification}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Pricing */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4 pb-2 border-b" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
            Pricing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="price">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 opacity-50">
                  <DollarSign className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="price"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()}
                  className="w-full pl-10 pr-3.5 py-3 border text-sm outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              {validationErrors.price && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.price}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition shadow-md disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Saving Material...' : 'Add Material'}
          </button>
        </div>
      </form>
    </div>
  );
}