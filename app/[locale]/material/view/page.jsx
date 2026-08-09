'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function MaterialsListPage() {
  const router = useRouter();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Category filter state ('all' or specific category)
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Delete modal states
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch materials on load
  const fetchMaterials = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/materials');
      if (!response.ok) {
        throw new Error('Failed to fetch materials.');
      }
      const result = await response.json();
      setMaterials(result.data || []);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error('Unable to load materials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleEdit = (id) => {
    router.push(`/material/edit/${id}`);
  };

  const openDeleteModal = (material) => {
    setMaterialToDelete(material);
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setMaterialToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!materialToDelete) return;

    setIsDeleting(true);
    const toastId = toast.loading('Deleting material...');

    try {
      const response = await fetch(`/api/materials/${materialToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete material.');
      }

      setMaterials((prev) => prev.filter((item) => item.id !== materialToDelete.id));
      toast.success('Material deleted successfully', { id: toastId });
      setMaterialToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete material. Please try again.', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered materials based on selected category
  const filteredMaterials = materials.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <>
      <Header />
      <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Page Title Header & Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold en" style={{ color: 'var(--foreground)' }}>
                Materials List
              </h1>
              <p className="mt-1 text-sm opacity-80 en">
                View and manage existing installation material records.
              </p>
            </div>
            <button
              onClick={() => router.push('/material/create')}
              className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
            >
              Add Material
            </button>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm font-medium en opacity-90">Filter by Category:</span>
            {[
              { label: 'All', value: 'all' },
              { label: 'Plumbing', value: 'plumbing' },
              { label: 'Sanitary', value: 'sanitary' },
              { label: 'Electrical', value: 'electrical' },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition en cursor-pointer border ${
                  selectedCategory === cat.value ? 'shadow-md' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat.value ? 'var(--primary)' : 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <p className="text-lg opacity-80 en">Loading materials...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center py-20 p-6 rounded-xl border border-red-500/30 bg-red-500/10">
              <p className="text-lg text-red-600 dark:text-red-400 mb-4 en">
                Unable to load materials.
              </p>
              <button
                onClick={fetchMaterials}
                className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredMaterials.length === 0 && (
            <div className="text-center py-20 p-8 rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-xl font-semibold mb-2 en">No materials found.</h3>
              <p className="text-sm opacity-70 en mb-6">
                {selectedCategory === 'all'
                  ? 'Add your first material to get started.'
                  : `No materials found under the "${selectedCategory}" category.`}
              </p>
              {selectedCategory === 'all' && (
                <button
                  onClick={() => router.push('/addmaterial')}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                >
                  Add Material
                </button>
              )}
            </div>
          )}

          {/* Materials Table & Responsive Cards */}
          {!loading && !error && filteredMaterials.length > 0 && (
            <div 
              className="rounded-xl shadow-lg border overflow-hidden backdrop-blur-sm"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--border)' }}>
                      <th className="py-4 px-6 font-semibold text-sm en">Material Name</th>
                      <th className="py-4 px-6 font-semibold text-sm en">Category</th>
                      <th className="py-4 px-6 font-semibold text-sm en">Price</th>
                      <th className="py-4 px-6 font-semibold text-sm en">Diameter</th>
                      <th className="py-4 px-6 font-semibold text-sm text-right en">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {filteredMaterials.map((item) => (
                      <tr key={item.id} className="transition hover:opacity-90">
                        {/* Material Name (English & Amharic stacked) */}
                        <td className="py-4 px-6">
                          <div className="font-medium en" style={{ color: 'var(--foreground)' }}>
                            {item.materialNameEnglish}
                          </div>
                          <div className="text-sm am opacity-80" style={{ color: 'var(--foreground)' }}>
                            {item.materialNameAmharic}
                          </div>
                        </td>

                        {/* Category Badge */}
                        <td className="py-4 px-6 en capitalize" style={{ color: 'var(--foreground)' }}>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium border" style={{ borderColor: 'var(--border)' }}>
                            {item.category}
                          </span>
                        </td>

                        {/* Price formatted */}
                        <td className="py-4 px-6 en" style={{ color: 'var(--foreground)' }}>
                          {Number(item.price).toFixed(2)}
                        </td>

                        {/* Diameter */}
                        <td className="py-4 px-6 en" style={{ color: 'var(--foreground)' }}>
                          {item.diameter}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right space-x-3">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer en"
                            style={{ backgroundColor: 'var(--secondary)', color: '#ffffff' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(item)}
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer bg-red-500 text-white hover:bg-red-600 en"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {materialToDelete && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
              onClick={closeDeleteModal}
            >
              <div 
                className="w-full max-w-md p-6 rounded-xl shadow-2xl border"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-2 en text-red-500">Delete Material?</h3>
                <p className="text-sm mb-4 opacity-80 en">
                  Are you sure you want to delete this material? This action cannot be undone.
                </p>

                {/* Selected Material Preview Card */}
                <div 
                  className="p-4 rounded-lg mb-6 border"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                >
                  <div className="font-semibold en text-base">{materialToDelete.materialNameEnglish}</div>
                  <div className="text-sm am opacity-80 mb-2">{materialToDelete.materialNameAmharic}</div>
                  <div className="flex justify-between text-xs opacity-70 en">
                    <span>Diameter: {materialToDelete.diameter}</span>
                    <span>Price: {Number(materialToDelete.price).toFixed(2)}</span>
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg text-sm font-medium border transition en cursor-pointer disabled:opacity-50"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition en cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}