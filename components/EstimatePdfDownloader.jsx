"use client";

import React from "react";
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
Font.register({
  family: "NotoSansEthiopic",
  src: "https://cdn.flexmonster.com/fonts/NotoSansEthiopic-Regular.ttf",
});

const pdfStyles = StyleSheet.create({
  materialPage: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#0c152a",
    backgroundColor: "#ffffff",
    padding: 24,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  materialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0000002c",
    paddingBottom: 8,
    marginBottom: 10,
  },
  brandHeaderBox: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0000002c",
    paddingBottom: 8,
    marginBottom: 8,
  },
  logo: {
    width: 44,
    height: 44,
    objectFit: "contain",
    marginBottom: 3,
    borderRadius: 44,
  },
  companyTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#5d77ec",
    textAlign: "center",
  },
  companyServices: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#1ebef8",
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  metaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9fbff",
    borderWidth: 1,
    borderColor: "#00000015",
    borderRadius: 4,
    padding: 6,
    marginBottom: 10,
  },
  metaBox: {
    flexDirection: "column",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f7ff",
    borderBottomWidth: 1,
    borderBottomColor: "#0000002c",
    borderTopWidth: 1,
    borderTopColor: "#0000002c",
    paddingVertical: 5,
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#00000015",
    paddingVertical: 4,
    alignItems: "center",
  },
  colNum: { width: "5%", paddingHorizontal: 2, textAlign: "center" },
  colMaterial: { width: "20%", paddingHorizontal: 2 },
  colCategory: { width: "10%", paddingHorizontal: 2 },
  colType: { width: "10%", paddingHorizontal: 2 },
  colBrand: { width: "11%", paddingHorizontal: 2 },
  colDiameter: { width: "11%", paddingHorizontal: 2 },
  colSpec: { width: "23%", paddingHorizontal: 2 },
  colQty: { width: "10%", paddingHorizontal: 2, textAlign: "center" },
  thText: { fontSize: 7, fontWeight: "bold", textTransform: "uppercase", color: "#0c152a88" },
  tdText: { fontSize: 6.5, color: "#0c152a" },
  amharicText: { fontFamily: "NotoSansEthiopic", fontSize: 6, color: "#0c152a88" },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: "#0000002c",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 6.5,
    color: "#0c152a88",
  },
  footerLink: {
    fontSize: 6.5,
    fontWeight: "bold",
    color: "#5d77ec",
  },
});

function EstimatePDF({ estimate }) {
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
      <Page size="A4" style={pdfStyles.materialPage} wrap>
        <View>
          <View style={pdfStyles.brandHeaderBox}>
            <Image src="/images/logo.jpg" style={pdfStyles.logo} />
            <Text style={pdfStyles.companyTitle}>Abu Hanifa Installation</Text>
            <Text style={pdfStyles.companyServices}>Electrical • Plumbing • Sanitary Installation</Text>
          </View>

          <View style={pdfStyles.materialHeader}>
            <View>
              <Text style={{ fontSize: 8.5, fontWeight: "bold", color: "#5d77ec" }}>Material Estimate & Quotation Schedule</Text>
              {estimate.customerName && (
                <Text style={{ fontSize: 7, color: "#0c152a99", marginTop: 1 }}>
                  Customer: {estimate.customerName} {estimate.customerPhone ? `(${estimate.customerPhone})` : ""}
                </Text>
              )}
            </View>
            <View style={{ textAlign: "right" }}>
              <Text style={{ fontSize: 7, color: "#0c152a88" }}>Estimate #{estimate.id}</Text>
              {estimate.createdAt && (
                <Text style={{ fontSize: 6.5, color: "#0c152a66" }}>{formatDate(estimate.createdAt)}</Text>
              )}
            </View>
          </View>

          {(estimate.customerLocation || estimate.specificLocation || estimate.jobType || estimate.jobStage) && (
            <View style={pdfStyles.metaSection}>
              <View style={[pdfStyles.metaBox, { width: "25%" }]}>
                <Text style={{ fontSize: 6.5, color: "#0c152a77", textTransform: "uppercase" }}>Location</Text>
                <Text style={{ fontSize: 7, fontWeight: "bold", marginTop: 1 }}>{estimate.customerLocation || "-"}</Text>
              </View>
              <View style={[pdfStyles.metaBox, { width: "25%" }]}>
                <Text style={{ fontSize: 6.5, color: "#0c152a77", textTransform: "uppercase" }}>Specific Location</Text>
                <Text style={{ fontSize: 7, fontWeight: "bold", marginTop: 1 }}>{estimate.specificLocation || "-"}</Text>
              </View>
              <View style={[pdfStyles.metaBox, { width: "25%" }]}>
                <Text style={{ fontSize: 6.5, color: "#0c152a77", textTransform: "uppercase" }}>Job Type</Text>
                <Text style={{ fontSize: 7, fontWeight: "bold", marginTop: 1 }}>{estimate.jobType || "-"}</Text>
              </View>
              <View style={[pdfStyles.metaBox, { width: "25%" }]}>
                <Text style={{ fontSize: 6.5, color: "#0c152a77", textTransform: "uppercase" }}>Job Stage</Text>
                <Text style={{ fontSize: 7, fontWeight: "bold", marginTop: 1, textTransform: "uppercase" }}>{estimate.jobStage || "-"}</Text>
              </View>
            </View>
          )}

          <View style={pdfStyles.tableHeader} fixed>
            <View style={pdfStyles.colNum}><Text style={pdfStyles.thText}>#</Text></View>
            <View style={pdfStyles.colMaterial}><Text style={pdfStyles.thText}>Material</Text></View>
            <View style={pdfStyles.colCategory}><Text style={pdfStyles.thText}>Category</Text></View>
            <View style={pdfStyles.colType}><Text style={pdfStyles.thText}>Type</Text></View>
            <View style={pdfStyles.colBrand}><Text style={pdfStyles.thText}>Brand</Text></View>
            <View style={pdfStyles.colDiameter}><Text style={pdfStyles.thText}>Diameter</Text></View>
            <View style={pdfStyles.colSpec}><Text style={pdfStyles.thText}>Specification</Text></View>
            <View style={pdfStyles.colQty}><Text style={[pdfStyles.thText, { textAlign: "center" }]}>Qty</Text></View>
          </View>

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
              </View>
            );
          })}
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={pdfStyles.coverFooter}>
            <Text style={pdfStyles.footerText}>Phone/ስልክ: +251936489696 / +251705489696</Text>
            <Text style={pdfStyles.footerLink}>https://www.abuhanifainstallation.com</Text>
            <Text style={pdfStyles.footerText}>Telegram: t.me/abuhanifainstallation</Text>
          </View>
          <View style={{ textAlign: "center", marginTop: 3 }}>
            <Text style={{ fontSize: 6, color: "#0c152a66" }}>E-mail: abuhanifainstallation@gmail.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default function EstimatePdfDownloader({ estimate }) {
  return (
    <PDFDownloadLink
      document={<EstimatePDF estimate={estimate} />}
      fileName={`abu-hanifa-estimate-${estimate.id}.pdf`}
      className="px-5 py-2.5 rounded-lg text-sm font-medium transition en cursor-pointer shadow-sm flex items-center gap-2 hover:opacity-90"
      style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
    >
      {({ loading }) => (loading ? "Preparing PDF..." : "📥 Download PDF")}
    </PDFDownloadLink>
  );
}