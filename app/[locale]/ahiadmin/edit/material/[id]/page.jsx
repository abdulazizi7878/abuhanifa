'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Centralized material options (Exact match with Add Material page)
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
      'PPR'
    ],
    brands: ['Aquapa', 'Lesso', 'RAK', 'Teflo', 'Any'],
    diameters: [
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
      '12" (315mm)'
    ]
  },
  sanitary: {
    types: ['PVC', 'CPVC', 'RCC', 'UPVC'],
    brands: ['Era', 'Lesso', 'Teflo', 'Any'],
    diameters: [
      '1 1/2" (50mm)',
      '2" (63mm)',
      '2 1/2" (75mm)',
      '3" (90mm)',
      '4" (110mm)',
      '5" (140mm)',
      '6" (160mm)',
      '8" (200mm)',
      '10" (250mm)',
      '12" (315mm)'
    ]
  },
  electrical: {
    types: [
      'Solid',
      'Stranded',
      'Flexible armoured',
      'Mineral-insulated cable'
    ],
    brands: ['Rhino', 'Euro', 'UF', 'BMET', 'Any'],
    diameters: [
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
      '1x240 mm2', '2x240 mm2', '3x240 mm2', '4x240 mm2', '5x240 mm2', '6x240 mm2'
    ]
  },
};

export default function EditMaterialPage({ params }) {
  // Unwrap params using React.use() for Next.js App Router dynamic routes with [id]
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    installationStage: '',
    category: '',
    materialNameEnglish: '',
    materialNameAmharic: '',
    type: '',
    brand: '',
    diameter: '',
    specification: '',
    price: '',
  });

  // Fetch existing material data on load using [id]
  useEffect(() => {
    if (!id) return;

    const fetchMaterial = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const response = await fetch(`/api/materials/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Material not found.');
          }
          throw new Error('Unable to load material.');
        }
        const result = await response.json();
        const data = result.data;

        setFormData({
          installationStage: data.installationStage || '',
          category: data.category || '',
          materialNameEnglish: data.materialNameEnglish || '',
          materialNameAmharic: data.materialNameAmharic || '',
          type: data.type || '',
          brand: data.brand || '',
          diameter: data.diameter || '',
          specification: data.specification || '',
          price: data.price !== undefined ? data.price :  '',
        });
      } catch (err) {
        console.error(err);
        setLoadError(true);
        setErrorMessage(err.message || 'Unable to load material.');
        toast.error(err.message || 'Unable to load material.');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      const currentOptions = materialOptions[value] || { types: [], brands: [], diameters: [] };
      setFormData((prev) => ({
        ...prev,
        category: value,
        type: currentOptions.types.includes(prev.type) ? prev.type : '',
        brand: currentOptions.brands.includes(prev.brand) ? prev.brand : '',
        diameter: currentOptions.diameters.includes(prev.diameter) ? prev.diameter : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.installationStage ||
      !formData.category ||
      !formData.materialNameEnglish ||
      !formData.materialNameAmharic ||
      !formData.type ||
      !formData.brand ||
      !formData.diameter ||
      !formData.specification
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // this validation is temporary
    if (Number(formData.price) < 0 || isNaN(Number(formData.price))) {
      formData.price = 1;
    }
      
    setUpdating(true);
    const toastId = toast.loading('Updating material...');

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update material.');
      }

      toast.success('Material updated successfully', { id: toastId });
      router.push('/ahiadmin/view/materials');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update material. Please try again.', { id: toastId });
      setUpdating(false);
    }
  };

  const currentCategoryOptions = materialOptions[formData.category] || {
    types: [],
    brands: [],
    diameters: [],
  };

  return (
    <main className="w-full">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold en" style={{ color: 'var(--foreground)' }}>
            Edit Material
          </h1>
          <p className="mt-1 text-sm opacity-80 en">
            Update existing installation material record master data.
          </p>
        </div>

        {/* Initial Loading State */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-lg opacity-80 en">Loading material...</p>
          </div>
        )}

        {/* Load Error / Not Found State */}
        {!loading && loadError && (
          <div className="text-center py-20 p-6 rounded-xl border border-red-500/30 bg-red-500/10">
            <p className="text-lg text-red-600 dark:text-red-400 mb-4 en">
              {errorMessage === 'Material not found.' ? 'Material not found.' : 'Unable to load material.'}
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => router.push('/ahiadmin/view/materials')}
                className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
              >
                Back to Materials
              </button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {!loading && !loadError && (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-xl shadow-lg border space-y-6"
            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
          >
            {/* Installation Information Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b en" style={{ borderColor: 'var(--border)' }}>
                Installation Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Installation Stage */}
                <div>
                  <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                    Installation Stage <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="installationStage"
                    value={formData.installationStage}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  >
                    <option value="">Select Stage</option>
                    <option value="first_installation">First Installation</option>
                    <option value="finishing">Finishing</option>
                  </select>
                </div>

                {/* Material Category */}
                <div>
                  <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  >
                    <option value="">Select Category</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="sanitary">Sanitary</option>
                    <option value="electrical">Electrical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Material Information Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b en" style={{ borderColor: 'var(--border)' }}>
                Material Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Material Name English */}
                <div>
                  <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                    Material Name English <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="materialNameEnglish"
                    value={formData.materialNameEnglish}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Pipe"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  />
                </div>

                {/* Material Name Amharic */}
                <div>
                  <label className="block text-sm font-medium mb-2 am" style={{ color: 'var(--foreground)' }}>
                    Material Name Amharic <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="materialNameAmharic"
                    value={formData.materialNameAmharic}
                    onChange={handleChange}
                    required
                    placeholder="ምሳሌ፡ ቧንቧ"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm am focus:outline-none focus:ring-2"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    disabled={!formData.category}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 disabled:opacity-50"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  >
                    <option value="">Select Type</option>
                    {currentCategoryOptions.types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    disabled={!formData.category}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 disabled:opacity-50"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  >
                    <option value="">Select Brand</option>
                    {currentCategoryOptions.brands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Diameter */}
                <div>
                  <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                    Diameter <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="diameter"
                    value={formData.diameter}
                    onChange={handleChange}
                    required
                    disabled={!formData.category}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 disabled:opacity-50"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  >
                    <option value="">Select Diameter</option>
                    {currentCategoryOptions.diameters.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specification */}
                <div>
                  <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                    Specification <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="specification"
                    value={formData.specification}
                    onChange={handleChange}
                    required
                    placeholder="e.g. PN16"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b en" style={{ borderColor: 'var(--border)' }}>
                Pricing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onWheel={(e) => e.target.blur()}
                    required
                    placeholder="500"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                type="button"
                onClick={() => router.push('/material')}
                disabled={updating}
                className="px-6 py-2.5 rounded-lg text-sm font-medium border transition en cursor-pointer disabled:opacity-50"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2.5 rounded-lg text-sm font-medium transition en cursor-pointer shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
              >
                {updating ? 'Updating...' : 'Update Material'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}