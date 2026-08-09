"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Register Noto Sans Ethiopic online using a direct reliable TTF font URL.
// Requires zero local font files.
Font.register({
  family: "NotoSansEthiopic",
  src: "https://cdn.flexmonster.com/fonts/NotoSansEthiopic-Regular.ttf",
});

const pdfStyles = StyleSheet.create({
  coverPage: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#0c152a",
    backgroundColor: "#ffffff",
    padding: 28,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  coverHeader: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0000002c",
    paddingBottom: 12,
  },
  logo: {
    width: 88,
    height: 88,
    objectFit: "contain",
    marginBottom: 6,
    borderRadius: 88,
  },
  companyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5d77ec",
    textAlign: "center",
  },
  companyServices: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1ebef8",
    marginTop: 3,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  coverMain: {
    marginVertical: "auto",
    gap: 12,
  },
  heroTitleBox: {
    alignItems: "center",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0c152a",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroSubtitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#5d77ec",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#0000002c",
    backgroundColor: "#f2f7ff88",
  },
  cardTitle: {
    fontSize: 8.5,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#5d77ec",
    borderBottomWidth: 1,
    borderBottomColor: "#0000002c",
    paddingBottom: 4,
    marginBottom: 5,
  },
  label: {
    fontSize: 7,
    color: "#0c152a77",
    marginBottom: 1,
  },
  value: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: "#0000002c",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7.5,
    color: "#0c152a88",
  },
  footerLink: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#5d77ec",
  },
  materialPage: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#0c152a",
    backgroundColor: "#ffffff",
    padding: 24,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  materialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0000002c",
    paddingBottom: 8,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f7ff",
    borderBottomWidth: 1,
    borderBottomColor: "#0000002c",
    borderTopWidth: 1,
    borderTopColor: "#0000002c",
    paddingVertical: 6,
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#00000015",
    paddingVertical: 5,
    alignItems: "center",
  },
  colNum: { width: "4%", paddingHorizontal: 2, textAlign: "center" },
  colMaterial: { width: "14%", paddingHorizontal: 2 },
  colCategory: { width: "8%", paddingHorizontal: 2 },
  colType: { width: "8%", paddingHorizontal: 2 },
  colBrand: { width: "9%", paddingHorizontal: 2 },
  colDiameter: { width: "8%", paddingHorizontal: 2 },
  colSpec: { width: "17%", paddingHorizontal: 2 },
  colQty: { width: "6%", paddingHorizontal: 2, textAlign: "center" },
  colPrice: { width: "12%", paddingHorizontal: 2, textAlign: "right" },
  colTotal: { width: "14%", paddingHorizontal: 2, textAlign: "right", fontWeight: "bold", color: "#5d77ec" },
  thText: { fontSize: 7.5, fontWeight: "bold", textTransform: "uppercase", color: "#0c152a88" },
  tdText: { fontSize: 7, color: "#0c152a" },
  amharicText: { fontFamily: "NotoSansEthiopic", fontSize: 6.5, color: "#0c152a88" },
  summarySection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#0000002c",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  grandTotalBox: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#0000002c",
    backgroundColor: "#f2f7ff",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});

function EstimatePDF({ estimate }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
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

  return (
    <Document>
      {/* PAGE 1: PROFESSIONAL COVER PAGE */}
      <Page size="A4" style={pdfStyles.coverPage}>
        {/* 1 & 2. Company Logo & Branding */}
        <View style={pdfStyles.coverHeader}>
          <Image src="/images/logo.jpg" style={pdfStyles.logo} />
          <Text style={pdfStyles.companyTitle}>Abu Hanifa Installation</Text>
          <Text style={pdfStyles.companyServices}>Electrical • Plumbing • Sanitary Installation</Text>
        </View>

        {/* 3 & 4 & 5. Main Title, Customer Info & Estimate Info */}
        <View style={pdfStyles.coverMain}>
          <View style={pdfStyles.heroTitleBox}>
            <Text style={pdfStyles.heroTitle}>MATERIAL ESTIMATE</Text>
            <Text style={pdfStyles.heroSubtitle}>Quotation & Material Schedule</Text>
          </View>

          <View style={pdfStyles.infoGrid}>
            {/* Prepared For */}
            <View style={pdfStyles.card}>
              <Text style={pdfStyles.cardTitle}>Prepared For</Text>
              
              {estimate.customerName && (
                <>
                  <Text style={pdfStyles.label}>Customer Name</Text>
                  <Text style={pdfStyles.value}>{estimate.customerName}</Text>
                </>
              )}

              {estimate.customerPhone && (
                <>
                  <Text style={pdfStyles.label}>Customer Phone</Text>
                  <Text style={pdfStyles.value}>{estimate.customerPhone}</Text>
                </>
              )}

              {estimate.projectTitle && (
                <>
                  <Text style={pdfStyles.label}>Project Name</Text>
                  <Text style={pdfStyles.value}>{estimate.projectTitle}</Text>
                </>
              )}

              {estimate.projectDescription && (
                <>
                  <Text style={pdfStyles.label}>Project Description</Text>
                  <Text style={[pdfStyles.value, { fontWeight: "normal", fontSize: 8 }]}>
                    {estimate.projectDescription}
                  </Text>
                </>
              )}
            </View>

            {/* Estimate Information */}
            <View style={pdfStyles.card}>
              <Text style={pdfStyles.cardTitle}>Estimate Information</Text>

              <Text style={pdfStyles.label}>Estimate No</Text>
              <Text style={pdfStyles.value}>#{estimate.id}</Text>

              {estimate.createdAt && (
                <>
                  <Text style={pdfStyles.label}>Date</Text>
                  <Text style={pdfStyles.value}>{formatDate(estimate.createdAt)}</Text>
                </>
              )}

              {estimate.status && (
                <>
                  <Text style={pdfStyles.label}>Status</Text>
                  <Text style={[pdfStyles.value, { textTransform: "uppercase" }]}>{estimate.status}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* 6. Contact Information Footer */}
        <View style={pdfStyles.coverFooter}>
          <Text style={pdfStyles.footerText}>Abu Hanifa Installation</Text>
          <Text style={pdfStyles.footerLink}>www.abuhanifainstallation.com</Text>
          <Text style={pdfStyles.footerText}>Phone: 09 36 48 96 96</Text>
        </View>
      </Page>

      {/* PAGE 2+: MATERIALS SECTION */}
      <Page size="A4" style={pdfStyles.materialPage} wrap>
        <View>
          <View style={pdfStyles.materialHeader}>
            <View>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: "#5d77ec" }}>Abu Hanifa Installation</Text>
              <Text style={{ fontSize: 8, color: "#0c152a88", textTransform: "uppercase" }}>Material Estimate</Text>
            </View>
            <View style={{ textAlign: "right" }}>
              <Text style={{ fontSize: 8, color: "#0c152a88" }}>Estimate #{estimate.id}</Text>
              {estimate.createdAt && (
                <Text style={{ fontSize: 7, color: "#0c152a66" }}>{formatDate(estimate.createdAt)}</Text>
              )}
            </View>
          </View>

          {/* Table Header (Fixed / Repeating) */}
          <View style={pdfStyles.tableHeader} fixed>
            <View style={pdfStyles.colNum}><Text style={pdfStyles.thText}>#</Text></View>
            <View style={pdfStyles.colMaterial}><Text style={pdfStyles.thText}>Material</Text></View>
            <View style={pdfStyles.colCategory}><Text style={pdfStyles.thText}>Category</Text></View>
            <View style={pdfStyles.colType}><Text style={pdfStyles.thText}>Type</Text></View>
            <View style={pdfStyles.colBrand}><Text style={pdfStyles.thText}>Brand</Text></View>
            <View style={pdfStyles.colDiameter}><Text style={pdfStyles.thText}>Diameter</Text></View>
            <View style={pdfStyles.colSpec}><Text style={pdfStyles.thText}>Specification</Text></View>
            <View style={pdfStyles.colQty}><Text style={pdfStyles.thText}>Qty</Text></View>
            <View style={pdfStyles.colPrice}><Text style={pdfStyles.thText}>Price</Text></View>
            <View style={pdfStyles.colTotal}><Text style={[pdfStyles.thText, { textAlign: "right" }]}>Total</Text></View>
          </View>

          {/* Table Rows */}
          {estimate.items && estimate.items.map((item, index) => {
            return (
              <View key={index} style={pdfStyles.tableRow} wrap={false}>
                <View style={pdfStyles.colNum}><Text style={pdfStyles.tdText}>{index + 1}</Text></View>
                <View style={pdfStyles.colMaterial}>
                  <Text style={[pdfStyles.tdText, { fontWeight: "bold" }]}>{item.materialNameEnglish}</Text>

                  {item.materialNameAmharic && (
                    <Text style={pdfStyles.amharicText}>{item.materialNameAmharic}</Text>
                  )}
                </View>
                <View style={pdfStyles.colCategory}><Text style={pdfStyles.tdText}>{item.category || "-"}</Text></View>
                <View style={pdfStyles.colType}><Text style={pdfStyles.tdText}>{item.type || "-"}</Text></View>
                <View style={pdfStyles.colBrand}><Text style={pdfStyles.tdText}>{item.brand || "-"}</Text></View>
                <View style={pdfStyles.colDiameter}><Text style={pdfStyles.tdText}>{item.diameter || "-"}</Text></View>
                <View style={pdfStyles.colSpec}><Text style={pdfStyles.tdText}>{item.specification || "-"}</Text></View>
                <View style={pdfStyles.colQty}><Text style={[pdfStyles.tdText, { fontWeight: "bold", textAlign: "center" }]}>{item.quantity}</Text></View>
                <View style={pdfStyles.colPrice}><Text style={pdfStyles.tdText}>{formatCurrency(item.price)}</Text></View>
                <View style={pdfStyles.colTotal}><Text style={[pdfStyles.tdText, { fontWeight: "bold", textAlign: "right", color: "#5d77ec" }]}>{formatCurrency(item.total)}</Text></View>
              </View>
            );
          })}
        </View>

        {/* Summary & Footer */}
        <View style={{ marginTop: 20 }}>
          <View style={pdfStyles.summarySection}>
            <Text style={{ fontSize: 8, color: "#0c152a88" }}>
              Total Line Items: <Text style={{ fontWeight: "bold" }}>{estimate.items?.length || 0}</Text>
            </Text>
            <View style={pdfStyles.grandTotalBox}>
              <Text style={{ fontSize: 10, fontWeight: "bold", textTransform: "uppercase" }}>Grand Total:</Text>
              <Text style={{ fontSize: 14, fontWeight: "extrabold", color: "#5d77ec" }}>
                {formatCurrency(estimate.grandTotal)} ETB
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 24, borderTopWidth: 1, borderTopColor: "#0000002c", paddingTop: 8, textAlign: "center" }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", color: "#5d77ec" }}>Abu Hanifa Installation</Text>
            <Text style={{ fontSize: 7, color: "#0c152a77", marginTop: 2 }}>Thank you for choosing Abu Hanifa Installation.</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

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

            {/* Download PDF Button */}
            {!loading && !error && estimate && (
              <div className="flex justify-end print:hidden">
                <PDFDownloadLink
                  document={<EstimatePDF estimate={estimate} />}
                  fileName={`abu-hanifa-estimate-${estimate.id}.pdf`}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium transition en cursor-pointer shadow-sm flex items-center gap-2 hover:opacity-90"
                  style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                >
                  {({ loading: pdfLoading }) => (pdfLoading ? "Preparing PDF..." : "📥 Download PDF")}
                </PDFDownloadLink>
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

            {/* Document Content (Screen View) */}
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

                {/* Customer & Project Information Section */}
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

                  {/* Project Information */}
                  {(estimate.projectTitle || estimate.projectDescription) && (
                    <div
                      className="p-5 rounded-xl border bg-background space-y-2"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <h2 className="text-sm font-bold uppercase tracking-wider opacity-60 pb-2 border-b en" style={{ borderColor: "var(--border)" }}>
                        Project Information
                      </h2>
                      <div className="space-y-1 text-sm en pt-1">
                        {estimate.projectTitle && (
                          <div>
                            <span className="text-xs opacity-70 block">Project Title</span>
                            <span className="font-semibold text-base">{estimate.projectTitle}</span>
                          </div>
                        )}
                        {estimate.projectDescription && (
                          <div className="pt-1">
                            <span className="text-xs opacity-70 block">Project Description</span>
                            <span className="opacity-90">{estimate.projectDescription}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
                              <th className="py-3 px-3">Price (ETB)</th>
                              <th className="py-3 px-3 text-right">Total (ETB)</th>
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
                                <td className="py-3 px-3 opacity-90">{formatCurrency(item.price)}</td>
                                <td className="py-3 px-3 text-right font-semibold" style={{ color: "var(--secondary)" }}>
                                  {formatCurrency(item.total)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Grand Total Summary Section */}
                <div
                  className="pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="text-xs opacity-75 en">
                    Total Line Items: <span className="font-semibold">{estimate.items?.length || 0}</span>
                  </div>
                  <div
                    className="p-4 rounded-xl border flex items-center gap-6 bg-background"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span className="text-base font-bold uppercase tracking-wider en opacity-80">Grand Total:</span>
                    <span className="text-2xl sm:text-3xl font-extrabold en" style={{ color: "var(--secondary)" }}>
                      {formatCurrency(estimate.grandTotal)} ETB
                    </span>
                  </div>
                </div>

                {/* Professional Footer */}
                <div
                  className="pt-10 mt-12 border-t text-center space-y-2"
                  style={{ borderColor: "var(--border)" }}
                >
                  <h3 className="text-base font-bold en" style={{ color: "var(--secondary)" }}>
                    Abu Hanifa Installation
                  </h3>
                  <p className="text-xs opacity-70 en">
                    Thank you for choosing Abu Hanifa Installation.
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