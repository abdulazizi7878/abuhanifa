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
  Search,
  Download,
  TrendingUp,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // New Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 shadow-sm">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-semibold text-(--foreground) mb-1">Unable to load dashboard data</h2>
        <p className="text-sm text-(--muted-foreground) mb-6">Please try again to load your platform overview.</p>
        <button
          onClick={fetchOverviewData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-(--primary) text-white text-sm font-medium hover:opacity-95 transition-all shadow-md hover:shadow-lg"
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

  // Filter recent estimates based on search input
  const filteredEstimates = recent.estimates?.filter(est => {
    const matchesSearch = est.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.project_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || est.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 bg-(--background) text-(--foreground) transition-colors">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-(--border)/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-(--foreground)">Abu Hanifa Installation</h1>
          <p className="text-sm text-(--muted-foreground) mt-1.5">
            Welcome back, Admin. Here is your real-time platform analytics overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOverviewData}
            className="p-2.5 rounded-xl border border-(--border)/80 bg-(--card) hover:bg-(--background) text-(--foreground) transition-all shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <QuickActions />
        </div>
      </div>

      {/* Statistics Grid */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-(--muted-foreground)">Platform Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* Estimates Status Overview & Chart Section */}
      {estimatesMeta.status && estimatesMeta.status.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-(--card) border border-(--border)/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-(--foreground)">Estimates Status Distribution</h3>
                <p className="text-xs text-(--muted-foreground) mt-0.5">Visual breakdown by project status</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-(--primary)/10 text-(--primary)">
                {estimatesMeta.total} Total
              </span>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={estimatesMeta.status}>
                  <XAxis dataKey="status" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="total" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Metrics Summary Box */}
          <div className="bg-(--card) border border-(--border)/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-(--foreground) mb-1">Status Summary</h3>
              <p className="text-xs text-(--muted-foreground) mb-4">Exact counts per category</p>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-56 pr-1">
              {estimatesMeta.status.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-(--border)/60 bg-(--background)/40">
                  <span className="text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                    {item.status}
                  </span>
                  <span className="text-sm font-black text-(--foreground)">
                    {item.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interactive Recent Estimates Section with Search & Filter */}
      <div className="bg-(--card) border border-(--border)/60 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-(--foreground)">Recent Estimates & Management</h3>
            <p className="text-xs text-(--muted-foreground) mt-0.5">Search and filter live estimate submissions</p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)" />
              <input
                type="text"
                placeholder="Search customer or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-(--border)/80 bg-(--background) text-xs text-(--foreground) focus:outline-none focus:border-(--primary) transition-all"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-(--border)/80 bg-(--background) text-xs text-(--foreground) focus:outline-none focus:border-(--primary) transition-all"
            >
              <option value="ALL">All Statuses</option>
              {estimatesMeta.status?.map((s, i) => (
                <option key={i} value={s.status}>{s.status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Estimates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEstimates.length > 0 ? (
            filteredEstimates.map((est, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-(--border)/60 bg-(--background)/30 text-xs space-y-2 hover:border-(--primary)/40 transition-colors">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-(--foreground) text-sm font-bold">{est.customer_name || 'Customer'}</span>
                  <span className="text-(--primary) font-black">{est.grand_total ? `$${Number(est.grand_total).toLocaleString()}` : ''}</span>
                </div>
                <p className="text-(--muted-foreground) font-medium truncate">{est.project_title || 'Untitled Project'}</p>
                <div className="flex justify-between items-center pt-2 border-t border-(--border)/40 text-[10px] text-(--muted-foreground)">
                  <span className="px-2 py-0.5 rounded-md bg-(--border)/40 font-semibold uppercase tracking-wider">{est.status}</span>
                  <span>{est.created_at ? new Date(est.created_at).toLocaleDateString() : ''}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-xs text-(--muted-foreground)">
              No matching estimates found.
            </div>
          )}
        </div>
      </div>

      {/* Recent Materials and Ordered Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Materials */}
        <div className="bg-(--card) border border-(--border)/60 rounded-2xl p-6 flex flex-col shadow-xs">
          <h3 className="text-sm font-bold text-(--foreground) mb-4">Recent Materials</h3>
          <div className="flex-1 space-y-3.5">
            {recent.materials && recent.materials.length > 0 ? (
              recent.materials.map((mat, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-(--border)/60 bg-(--background)/30 text-xs space-y-1.5 hover:bg-(--background)/60 transition-colors">
                  <div className="flex justify-between font-semibold">
                    <span className="text-(--foreground) font-bold">{mat.material_name_english || mat.material_name}</span>
                    <span className="text-(--primary) font-bold">{mat.price ? `$${Number(mat.price).toLocaleString()}` : ''}</span>
                  </div>
                  <p className="text-(--muted-foreground) font-medium">
                    <span className="capitalize">{mat.category}</span> {mat.type ? `• ${mat.type}` : ''}
                  </p>
                  <div className="flex justify-between items-center pt-2 text-[10px] text-(--muted-foreground)">
                    <span className="font-medium">Brand: {mat.brand || 'Standard'}</span>
                    <span>{mat.updated_at ? new Date(mat.updated_at).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-(--muted-foreground) py-8 text-center">No recent materials</p>
            )}
          </div>
        </div>

        {/* Recent Ordered Products */}
        <div className="bg-(--card) border border-(--border)/60 rounded-2xl p-6 flex flex-col shadow-xs">
          <h3 className="text-sm font-bold text-(--foreground) mb-4">Recent Ordered Products</h3>
          <div className="flex-1 space-y-3.5">
            {recent.orderedProducts && recent.orderedProducts.length > 0 ? (
              recent.orderedProducts.map((ord, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-(--border)/60 bg-(--background)/30 text-xs space-y-1.5 hover:bg-(--background)/60 transition-colors">
                  <div className="flex justify-between font-semibold">
                    <span className="text-(--foreground) font-bold">{ord.name || 'Customer'}</span>
                    <span className="text-(--primary) font-bold">Qty: {ord.amount || 1}</span>
                  </div>
                  <p className="text-(--muted-foreground) truncate font-medium">Location: {ord.location || 'Local'}</p>
                  <div className="flex justify-between items-center pt-2 text-[10px] text-(--muted-foreground)">
                    <span className="font-medium">Phone: {ord.phone_number}</span>
                    <span>{ord.created_at ? new Date(ord.created_at).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-(--muted-foreground) py-8 text-center">No recent ordered products</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-(--card) border border-(--border)/60 rounded-2xl p-5 flex items-center justify-between shadow-xs hover:border-(--primary)/40 transition-all">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-extrabold tracking-tight text-(--foreground)">{value ?? 0}</p>
      </div>
      {Icon && (
        <div className="p-3 rounded-xl bg-(--background) border border-(--border)/60 text-(--primary) shadow-xs">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: 'Blog', href: '/ahiadmin/create/blog' },
    { label: 'Product', href: '/ahiadmin/create/product' },
    { label: 'Material', href: '/ahiadmin/create/material' },
    { label: 'Promotion', href: '/ahiadmin/create/promotion' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action, idx) => (
        <Link
          key={idx}
          href={action.href}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-(--border)/80 bg-(--card) text-xs font-semibold text-(--foreground) hover:bg-(--background) hover:border-(--primary) transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-(--primary)" />
          {action.label}
        </Link>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-pulse bg-(--background)">
      <div className="flex justify-between items-center border-b border-(--border)/60 pb-6">
        <div className="space-y-2.5">
          <div className="h-7 w-56 bg-(--muted-foreground)/20 rounded-lg" />
          <div className="h-4 w-80 bg-(--muted-foreground)/10 rounded-md" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-28 bg-(--muted-foreground)/10 rounded-xl" />
          <div className="h-9 w-28 bg-(--muted-foreground)/10 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 bg-(--card) border border-(--border)/60 rounded-2xl" />
        ))}
      </div>

      <div className="h-72 bg-(--card) border border-(--border)/60 rounded-2xl" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-72 bg-(--card) border border-(--border)/60 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}