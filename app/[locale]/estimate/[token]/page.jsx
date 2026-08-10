"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import Footer from "@/components/footer";

// Dynamic import for PDF Downloader with SSR disabled to prevent rendering issues / stuck state
const EstimatePdfDownloader = dynamic(
  () => import("@/components/EstimatePdfDownloader"),
  { ssr: false }
);

export default function PublicEstimatePage() {
  const params = useParams();
  const token = params?.token;

  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchPublicEstimate = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`/api/estimates/public/${token}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Estimate not found.");
          }
          throw new Error("Failed to load estimate.");
        }
        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error(result.message || "Estimate not found.");
        }
        setEstimate(result.data);
      } catch (err) {
        console.error(err);
        setError(true);
        setErrorMessage(
          err.message === "Estimate not found."
            ? "This estimate may have been removed or the link may be invalid."
            : "An unexpected error occurred while loading the estimate."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPublicEstimate();
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "final":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30";
      default:
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30";
    }
  };

  return (
    <>
       <Header />
        <div className="min-h-screen mt-26 py-10 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* Download PDF Button using Dynamic Component */}
            {!loading && !error && estimate && (
              <div className="flex justify-end print:hidden">
                <EstimatePdfDownloader estimate={estimate} />
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-32">
                <p className="text-base font-medium opacity-80 en">Loading estimate...</p>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="text-center py-24 p-8 rounded-2xl border border-red-500/30 bg-red-500/10 max-w-lg mx-auto shadow-lg">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3 en">
                  Estimate Not Found
                </h2>
                <p className="text-sm opacity-80 en leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Document Content */}
            {!loading && !error && estimate && (
              <div
                className="p-6 sm:p-12 rounded-2xl shadow-xl border bg-background space-y-8"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Document Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b gap-4" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight en" style={{ color: "var(--secondary)" }}>
                      Abu Hanifa Installation
                    </h1>
                    <p className="text-lg font-semibold opacity-80 mt-1 en tracking-wide uppercase">
                      Material Estimate & Quotation
                    </p>
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    <div className="text-sm font-medium en">
                      Estimate #{estimate.id}
                    </div>
                    {estimate.createdAt && (
                      <div className="text-xs opacity-70 en">
                        Date: {formatDate(estimate.createdAt)}
                      </div>
                    )}
                    {estimate.status && (
                      <div className="pt-1">
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider en ${getStatusBadgeStyle(
                            estimate.status
                          )}`}
                        >
                          {estimate.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer, Location & Project Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div
                    className="p-5 rounded-xl border bg-background space-y-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <h2 className="text-sm font-bold uppercase tracking-wider opacity-60 pb-2 border-b en" style={{ borderColor: "var(--border)" }}>
                      Customer Information
                    </h2>
                    <div className="space-y-1 text-sm en pt-1">
                      <div>
                        <span className="text-xs opacity-70 block">Customer Name</span>
                        <span className="font-semibold text-base">{estimate.customerName}</span>
                      </div>
                      {estimate.customerPhone && (
                        <div className="pt-1">
                          <span className="text-xs opacity-70 block">Customer Phone</span>
                          <span className="font-medium">{estimate.customerPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project & Location Details Section */}
                  <div
                    className="p-5 rounded-xl border bg-background space-y-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <h2 className="text-sm font-bold uppercase tracking-wider opacity-60 pb-2 border-b en" style={{ borderColor: "var(--border)" }}>
                      Location & Job Details
                    </h2>
                    <div className="grid grid-cols-2 gap-3 text-sm en pt-1">
                      <div>
                        <span className="text-xs opacity-70 block">Location</span>
                        <span className="font-semibold">{estimate.customerLocation || "-"}</span>
                      </div>
                      <div>
                        <span className="text-xs opacity-70 block">Specific Location</span>
                        <span className="font-semibold">{estimate.specificLocation || "-"}</span>
                      </div>
                      <div>
                        <span className="text-xs opacity-70 block">Job Type</span>
                        <span className="font-semibold">{estimate.jobType || "-"}</span>
                      </div>
                      <div>
                        <span className="text-xs opacity-70 block">Job Stage</span>
                        <span className="font-semibold uppercase">{estimate.jobStage || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Material Table Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold en">Estimate Items</h2>

                  {!estimate.items || estimate.items.length === 0 ? (
                    <div className="text-center py-10 border border-dashed rounded-xl" style={{ borderColor: "var(--border)" }}>
                      <p className="text-sm opacity-75 en">No materials listed in this estimate.</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm en">
                          <thead>
                            <tr
                              className="border-b text-xs font-semibold uppercase tracking-wider opacity-80"
                              style={{ borderColor: "var(--border)", backgroundColor: "var(--border)" }}
                            >
                              <th className="py-3 px-3">#</th>
                              <th className="py-3 px-3">Material</th>
                              <th className="py-3 px-3">Category</th>
                              <th className="py-3 px-3">Type</th>
                              <th className="py-3 px-3">Brand</th>
                              <th className="py-3 px-3">Diameter</th>
                              <th className="py-3 px-3">Specification</th>
                              <th className="py-3 px-3">Qty</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                            {estimate.items.map((item, index) => (
                              <tr key={index} className="transition">
                                <td className="py-3 px-3 opacity-70">{index + 1}</td>
                                <td className="py-3 px-3">
                                  <div className="font-semibold en">{item.materialNameEnglish}</div>
                                  {item.materialNameAmharic && (
                                    <div className="text-xs am opacity-80">{item.materialNameAmharic}</div>
                                  )}
                                </td>
                                <td className="py-3 px-3 opacity-90">{item.category || "-"}</td>
                                <td className="py-3 px-3 opacity-90">{item.type || "-"}</td>
                                <td className="py-3 px-3 opacity-90">{item.brand || "-"}</td>
                                <td className="py-3 px-3 opacity-90">{item.diameter || "-"}</td>
                                <td className="py-3 px-3 opacity-75 text-xs">{item.specification || "-"}</td>
                                <td className="py-3 px-3 font-semibold">{item.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Professional Footer Branding */}
                <div
                  className="pt-10 mt-12 border-t text-center space-y-2"
                  style={{ borderColor: "var(--border)" }}
                >
                  <h3 className="text-base font-bold en" style={{ color: "var(--secondary)" }}>
                    Abu Hanifa Installation
                  </h3>
                  <div className="text-xs opacity-80 flex flex-wrap justify-center gap-x-4 gap-y-1">
                    <span>Phone/ስልክ: +251936489696 / +251705489696</span>
                    <span>•</span>
                    <span>Telegram: t.me/abuhanifainstallation</span>
                    <span>•</span>
                    <span>E-mail: abuhanifainstallation@gmail.com</span>
                  </div>
                  <p className="text-xs opacity-70 en pt-1">
                    Website: https://www.abuhanifainstallation.com
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>

        <Footer />    
    </>
  );
}