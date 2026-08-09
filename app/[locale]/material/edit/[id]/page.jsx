'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Header from '@/components/header';
import Footer from '@/components/footer';

// Centralized material options (Exact match with Add Material page)
const materialOptions = {
  plumbing: {
    types: ['PPR', 'PVC', 'HDPE', 'Galvanized Steel', 'CPVC', 'PEX'],
    brands: ['Aquapa', 'Firat', 'Pimtas', 'Manuli', 'Geberit', 'Other'],
    diameters: ['15 mm', '20 mm', '25 mm', '32 mm', '40 mm', '50 mm', '63 mm', '75 mm', '90 mm', '110 mm'],
  },
  sanitary: {
    types: ['Ceramic', 'Stainless Steel', 'Brass', 'Chrome Plated', 'Plastic'],
    brands: ['Kohler', 'Grohe', 'TOTO', 'Ideal Standard', 'Viega', 'Other'],
    diameters: ['32 mm', '40 mm', '50 mm', '110 mm', '1/2 inch', '3/4 inch', '1 inch'],
  },
  electrical: {
    types: ['Copper Wire', 'Aluminum Cable', 'Flexible Conduit', 'Rigid PVC Conduit', 'Armored Cable'],
    brands: ['Elsewedy', 'Nile', 'Aber', 'Prysmian', 'Schneider', 'Other'],
    diameters: ['1.5 mm2', '2.5 mm2', '4 mm2', '6 mm2', '10 mm2', '16 mm2', '20 mm', '25 mm', '32 mm'],
  },
};

export default function EditMaterialPage({ params }) {
  // Unwrap params using React.use() for Next.js App Router dynamic routes
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

  // Fetch existing material data on load
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
          price: data.price !== undefined ? data.price : '',
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
      // When category changes, reset dependent fields if current values are invalid for the new category
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

    // Basic validation
    if (
      !formData.installationStage ||
      !formData.category ||
      !formData.materialNameEnglish ||
      !formData.materialNameAmharic ||
      !formData.type ||
      !formData.brand ||
      !formData.diameter ||
      !formData.specification ||
      formData.price === ''
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (Number(formData.price) < 0) {
      toast.error('Price must be a valid non-negative number.');
      return;
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
      router.push('/material/view');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update material. Please try again.', { id: toastId });
      setUpdating(false);
    }
  };

  // Get dynamic options based on current category
  const currentCategoryOptions = materialOptions[formData.category] || {
    types: [],
    brands: [],
    diameters: [],
  };

  return (
    <>
      <Header />
      <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 mt-20">
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
                  onClick={() => router.push('/material')}
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
                      required
                      placeholder="500"
                      className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2"
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
      <Footer />
    </>
  );
}