'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  FileText, 
  Layers, 
  Tag, 
  ShoppingCart, 
  Calculator, 
  Users, 
  MessageSquare, 
  Box, 
  Plus, 
  RefreshCw, 
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/overview', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch overview data');
      }

      const json = await response.json();
      if (json.success) {
        setData(json.data);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-7xl mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-semibold text-(--foreground) mb-1">Unable to load dashboard data</h2>
        <p className="text-sm text-(--muted-foreground) mb-6">Please try again to load your platform overview.</p>
        <button
          onClick={fetchOverviewData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--primary) text-white text-sm font-medium hover:opacity-95 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const stats = data.stats || {};
  const estimatesMeta = data.estimates || {};
  const recent = data.recent || {};

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 bg-(--background) text-(--foreground)">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-(--border) pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--foreground)">Abu Hanifa Installation</h1>
          <p className="text-sm text-(--muted-foreground) mt-1">
            Welcome back, Admin. Here's what's happening across your platform.
          </p>
        </div>
        
        <QuickActions />
      </div>

      {/* Statistics Grid */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-(--muted-foreground) mb-4">Overview Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Products" value={stats.products} icon={Package} />
          <StatCard title="Blogs" value={stats.blogs} icon={FileText} />
          <StatCard title="Materials" value={stats.materials} icon={Layers} />
          <StatCard title="Promotions" value={stats.promotions} icon={Tag} />
          <StatCard title="Orders" value={stats.orders} icon={ShoppingCart} />
          <StatCard title="Estimates" value={stats.estimates} icon={Calculator} />
          <StatCard title="Contacts" value={stats.contacts} icon={Users} />
          {stats.comments !== undefined && (
            <StatCard title="Comments" value={stats.comments} icon={MessageSquare} />
          )}
          {stats.orderedProducts !== undefined && (
            <StatCard title="Ordered Products" value={stats.orderedProducts} icon={Box} />
          )}
        </div>
      </section>

      {/* Estimates Status Overview */}
      {estimatesMeta.status && estimatesMeta.status.length > 0 && (
        <section className="bg-(--card) border border-(--border) rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-(--foreground)">Estimates Overview</h3>
              <p className="text-xs text-(--muted-foreground)">Breakdown by current status</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-(--muted-foreground)/10 text-(--foreground)">
              {estimatesMeta.total} Total
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {estimatesMeta.status.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-(--border) bg-(--background)/50 flex flex-col justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-(--muted-foreground)">
                  {item.status}
                </span>
                <span className="text-xl font-bold text-(--foreground) mt-2">
                  {item.total}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Estimates */}
        <div className="bg-(--card) border border-(--border) rounded-xl p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-(--foreground) mb-4">Recent Estimates</h3>
          <div className="flex-1 space-y-3">
            {recent.estimates && recent.estimates.length > 0 ? (
              recent.estimates.map((est, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-(--border) text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-(--foreground)">{est.customerName || est.customer_name || 'Customer'}</span>
                    <span className="text-(--muted-foreground)">{est.grandTotal || est.grand_total ? `$${est.grandTotal || est.grand_total}` : ''}</span>
                  </div>
                  <p className="text-(--muted-foreground) truncate">{est.projectTitle || est.project_title || 'Untitled Project'}</p>
                  <div className="flex justify-between items-center pt-1 text-[10px] text-(--muted-foreground)">
                    <span className="px-1.5 py-0.5 rounded bg-(--background) uppercase">{est.status}</span>
                    <span>{est.createdAt ? new Date(est.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-(--muted-foreground) py-6 text-center">No recent estimates</p>
            )}
          </div>
        </div>

        {/* Recent Materials */}
        <div className="bg-(--card) border border-(--border) rounded-xl p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-(--foreground) mb-4">Recent Materials</h3>
          <div className="flex-1 space-y-3">
            {recent.materials && recent.materials.length > 0 ? (
              recent.materials.map((mat, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-(--border) text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-(--foreground)">{mat.name || mat.material_name}</span>
                    <span className="text-(--muted-foreground)">{mat.price ? `$${mat.price}` : ''}</span>
                  </div>
                  <p className="text-(--muted-foreground)">{mat.category} {mat.type ? `• ${mat.type}` : ''}</p>
                  <div className="flex justify-between items-center pt-1 text-[10px] text-(--muted-foreground)">
                    <span>{mat.brand || 'Standard'}</span>
                    <span>{mat.updatedAt ? new Date(mat.updatedAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-(--muted-foreground) py-6 text-center">No recent materials</p>
            )}
          </div>
        </div>

        {/* Recent Ordered Products */}
        <div className="bg-(--card) border border-(--border) rounded-xl p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-(--foreground) mb-4">Recent Ordered Products</h3>
          <div className="flex-1 space-y-3">
            {recent.orderedProducts && recent.orderedProducts.length > 0 ? (
              recent.orderedProducts.map((ord, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-(--border) text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-(--foreground)">{ord.customerName || ord.customer_name || 'Customer'}</span>
                    <span className="text-(--muted-foreground)">Qty: {ord.amount || ord.quantity || 1}</span>
                  </div>
                  <p className="text-(--muted-foreground) truncate">{ord.productName || ord.product_name || ord.title || 'Product Item'}</p>
                  <div className="flex justify-between items-center pt-1 text-[10px] text-(--muted-foreground)">
                    <span>{ord.location || 'Local'}</span>
                    <span>{ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-(--muted-foreground) py-6 text-center">No recent ordered products</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-(--card) border border-(--border) rounded-xl p-4 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium text-(--muted-foreground)">{title}</p>
        <p className="text-2xl font-bold tracking-tight text-(--foreground)">{value ?? 0}</p>
      </div>
      {Icon && (
        <div className="p-2.5 rounded-lg bg-(--background) border border-(--border) text-(--foreground)">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: 'Create Blog', href: '/ahiadmin/create/blog' },
    { label: 'Create Product', href: '/ahiadmin/create/product' },
    { label: 'Create Material', href: '/ahiadmin/create/material' },
    { label: 'Create Promotion', href: '/ahiadmin/create/promotion' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action, idx) => (
        <Link
          key={idx}
          href={action.href}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--border) bg-(--card) text-xs font-medium text-(--foreground) hover:bg-(--background) transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-(--muted-foreground)" />
          {action.label}
        </Link>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-pulse bg-(--background)">
      <div className="flex justify-between items-center border-b border-(--border) pb-6">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-(--muted-foreground)/20 rounded" />
          <div className="h-4 w-72 bg-(--muted-foreground)/10 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-(--muted-foreground)/10 rounded" />
          <div className="h-8 w-24 bg-(--muted-foreground)/10 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-(--card) border border-(--border) rounded-xl" />
        ))}
      </div>

      <div className="h-32 bg-(--card) border border-(--border) rounded-xl" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-(--card) border border-(--border) rounded-xl" />
        ))}
      </div>
    </div>
  );
}