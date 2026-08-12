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
  Link,
} from "@react-pdf/renderer";

// Register Noto Sans Ethiopic for Amharic script support
Font.register({
  family: "NotoSansEthiopic",
  src: "https://cdn.flexmonster.com/fonts/NotoSansEthiopic-Regular.ttf",
});

const pdfStyles = StyleSheet.create({
  portraitPage: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#0c152a",
    backgroundColor: "#ffffff",
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  landscapePage: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#0c152a",
    backgroundColor: "#ffffff",
    padding: 24,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  coverContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    flex: 1,
  },
  brandHeaderCenter: {
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#00000022",
    paddingBottom: 8,
  },
  logo: {
    width: 72,
    height: 72,
    objectFit: "contain",
    marginBottom: 6,
    borderRadius: 36,
  },
  brandTextContainerCenter: {
    alignItems: "center",
  },
  brandTitleEn: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0c152a",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  brandTitleAm: {
    fontFamily: "NotoSansEthiopic",
    fontSize: 9,
    fontWeight: "bold",
    color: "#0c152a",
    textAlign: "center",
    marginTop: 2,
  },
  formRowCenter: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  formLabel: {
    fontFamily: "NotoSansEthiopic",
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#0c152a",
    marginRight: 6,
  },
  formValueCenter: {
    fontSize: 7.5,
    color: "#0c152a",
    fontWeight: "bold",
    textAlign: "center",
  },
  contactBoxCentered: {
    marginTop: 10,
    marginBottom: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9fbff",
    borderWidth: 1,
    borderColor: "#00000015",
    borderRadius: 4,
    alignItems: "center",
  },
  contactRowCenter: {
    fontSize: 8,
    color: "#0c152a",
    marginBottom: 3.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  contactLabelAm: {
    fontFamily: "NotoSansEthiopic",
  },
  contactLink: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#5d77ec",
    textDecoration: "underline",
  },
  sectionHeaderAmCenter: {
    fontFamily: "NotoSansEthiopic",
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#0c152a",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  checkboxGridCentered: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 4,
  },
  checkboxText: {
    fontFamily: "NotoSansEthiopic",
    fontSize: 7.5,
    color: "#0c152a",
    marginBottom: 3,
    textAlign: "center",
  },
  filledBlackBox: {
    backgroundColor: "#0c152a",
    color: "#0c152a",
    fontWeight: "bold",
  },
  emptyBox: {
    color: "#0c152a88",
  },
  bottomNote: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#00000022",
    paddingTop: 5,
    alignItems: "center",
  },
  brandHeaderBox: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0000002c",
    paddingBottom: 6,
    marginBottom: 8,
  },
  logoSmall: {
    width: 44,
    height: 44,
    objectFit: "contain",
    marginBottom: 3,
    borderRadius: 22,
  },
  materialHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0000002c",
    paddingBottom: 6,
    marginBottom: 8,
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
  colNum: { width: "4%", paddingHorizontal: 2, textAlign: "center" },
  colMaterial: { width: "18%", paddingHorizontal: 2 },
  colCategory: { width: "10%", paddingHorizontal: 2 },
  colType: { width: "10%", paddingHorizontal: 2 },
  colBrand: { width: "10%", paddingHorizontal: 2 },
  colDiameter: { width: "10%", paddingHorizontal: 2 },
  colSpec: { width: "14%", paddingHorizontal: 2 },
  colQty: { width: "6%", paddingHorizontal: 2, textAlign: "center" },
  colPrice: { width: "9%", paddingHorizontal: 2, textAlign: "right" },
  colTotal: { width: "9%", paddingHorizontal: 2, textAlign: "right" },
  thText: { fontSize: 6.5, fontWeight: "bold", textTransform: "uppercase", color: "#0c152a88" },
  tdText: { fontSize: 6, color: "#0c152a" },
  tdSpecText: { fontSize: 5, color: "#0c152a" },
  amharicText: { fontFamily: "NotoSansEthiopic", fontSize: 5.5, color: "#0c152a88" },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#00000022",
    paddingTop: 6,
    alignItems: "center",
    backgroundColor: "#f9fbff",
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 10,
  },
  footerBioText: {
    fontFamily: "NotoSansEthiopic",
    fontSize: 8,
    fontWeight: "bold",
    color: "#5d77ec",
    marginBottom: 4,
    textAlign: "center",
  },
  footerText: {
    fontSize: 6.5,
    color: "#000000",
    marginBottom: 2,
    textAlign: "center",
  },
  footerLink: {
    fontSize: 6.5,
    fontWeight: "bold",
    color: "#5d77ec",
    marginBottom: 2,
    textAlign: "center",
    textDecoration: "underline",
  },
});

function EstimatePDF({ estimate }) {
  const data = estimate?.data || estimate || {};
  const items = data.items || [];
  const loc = (data.customerLocation || "").toLowerCase();
  const workType = (data.workType || data.jobType || "").toLowerCase();

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

  const formatNumber = (val) => {
    if (val === undefined || val === null || val === "") return "-";
    const num = Number(val);
    if (isNaN(num)) return val;
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  };

  const formatPrice = (val) => {
    const num = Number(val);
    if (isNaN(num)) return val;
    if (num === 1) return "0";
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  };

  const isMatchLoc = (target) => loc.includes(target);
  const isMatchWork = (target) => workType.includes(target);

  return (
    <Document>
      {/* PAGE 1: PORTRAIT COVER PAGE */}
      <Page size="A4" orientation="portrait" style={pdfStyles.portraitPage}>
        <View style={pdfStyles.coverContainer}>
          
          {/* Centered Brand Header with Much Larger Logo */}
          <View style={pdfStyles.brandHeaderCenter}>
            <Image src="/images/logo.jpg" style={pdfStyles.logo} />
            <View style={pdfStyles.brandTextContainerCenter}>
              <Text style={pdfStyles.brandTitleEn}>Abuhanifa Installation Ethiopia</Text>
              <Text style={pdfStyles.brandTitleAm}>አቡሐኒፋ ኢንስታሌሽን ኢትዮጵያ</Text>
            </View>
          </View>

          {/* Centered Customer Details */}

          <View style={pdfStyles.formRowCenter,{flexDirection:"column"}}>

            <View style={pdfStyles.formRowCenter}>
              <Text style={pdfStyles.formLabel}>ቀን / Date:</Text>
              <Text style={pdfStyles.formValueCenter}>{formatDate(data.createdAt) || "-"}</Text> 
            </View>
            <View style={pdfStyles.formRowCenter}>
              <Text style={pdfStyles.formLabel}>የደንበኛ ስም / Client Name:</Text>
              <Text style={pdfStyles.formValueCenter}>{data.customerName || "-"}</Text>
            </View>
          
            <View style={pdfStyles.formRowCenter}>
              <Text style={pdfStyles.formLabel}>የትዕዛዝ ቁጥር / Order Number:</Text>
              <Text style={pdfStyles.formValueCenter}>{data.id ? `#${data.id}` : "-"}</Text>    
            </View>
        
          </View>


          {/* Work Type Checkboxes (Centered with Gaps) */}
          <View style={pdfStyles.checkboxGridCentered}>
            <Text style={pdfStyles.sectionHeaderAmCenter}>የስራው ዓይነት / Work Type</Text>
            <Text style={pdfStyles.checkboxText}>
              Electric / መብራት{" "}
              <Text style={isMatchWork("electric") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                {isMatchWork("electric") ? "[ ■ ]" : "[   ]"}
              </Text>
            </Text>
            <Text style={pdfStyles.checkboxText}>
              Plumbing / ውሃ{" "}
              <Text style={(isMatchWork("plumb") || isMatchWork("sanitary")) ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                {(isMatchWork("plumb") || isMatchWork("sanitary")) ? "[ ■ ]" : "[   ]"}
              </Text>
            </Text>
            <Text style={pdfStyles.checkboxText}>
              Other / ሌላ{" "}
              <Text style={(!isMatchWork("electric") && !isMatchWork("plumb") && !isMatchWork("sanitary") && workType !== "") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                {(!isMatchWork("electric") && !isMatchWork("plumb") && !isMatchWork("sanitary") && workType !== "") ? "[ ■ ]" : "[   ]"}
              </Text>
            </Text>
          </View>

          {/* Work Place Checkboxes (Centered with Gaps) */}
          <View style={pdfStyles.checkboxGridCentered}>
            <Text style={pdfStyles.sectionHeaderAmCenter}>የስራው ቦታ / Work Place</Text>
            <Text style={pdfStyles.checkboxText}>
              Addis Ababa / አዲስ አበባ{" "}
              <Text style={isMatchLoc("addis") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                {isMatchLoc("addis") ? "[ ■ ]" : "[   ]"}
              </Text>
            </Text>
            <Text style={pdfStyles.checkboxText}>
              Butajira / ቡታጀራ{" "}
              <Text style={isMatchLoc("buta") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                {isMatchLoc("buta") ? "[ ■ ]" : "[   ]"}
              </Text>
            </Text>
            <Text style={pdfStyles.checkboxText}>
              Halaba / ሀላባ{" "}
              <Text style={isMatchLoc("halaba") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                {isMatchLoc("halaba") ? "[ ■ ]" : "[   ]"}
              </Text>
            </Text>
            <Text style={pdfStyles.checkboxText}>
              Worabe / ወራቤ{" "}
              <Text style={isMatchLoc("worabe") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                {isMatchLoc("worabe") ? "[ ■ ]" : "[   ]"}
              </Text>
            </Text>
                      
            <View style={[pdfStyles.formRowCenter, { marginTop: 4 }]}>
                <Text style={pdfStyles.formLabel}>ልዩ ቦታው / Specific Place:</Text>
                <Text style={pdfStyles.formValueCenter}>{data.customerSpecificLocation || data.specificLocation || "-"}</Text>
            </View>
          </View>



          {/* Centered Contacts Box placed at the end of cover page with more gap */}
          <View style={pdfStyles.contactBoxCentered}>
            <Text style={{ fontFamily: "NotoSansEthiopic", fontSize: 7, fontWeight: "bold", marginBottom: 4, textAlign: "center" }}>
              የመገናኛ መረጃዎች / Contact Information:
            </Text>
            <View style={pdfStyles.contactRowCenter}>
              <Text style={pdfStyles.contactLabelAm}>Phone / ስልክ: </Text>
              <Text>+251936489696 / +251705489696</Text>
            </View>
            <View style={pdfStyles.contactRowCenter}>
              <Text style={pdfStyles.contactLabelAm}>Telegram / ቴሌግራም: </Text>
              <Link src="https://t.me/abuhanifainstallation" style={pdfStyles.contactLink}>t.me/abuhanifainstallation</Link>
            </View>
            <View style={pdfStyles.contactRowCenter}>
              <Text style={pdfStyles.contactLabelAm}>E-mail / ኢሜይል: </Text>
              <Text>abuhanifainstallation@gmail.com</Text>
            </View>
            <View style={[pdfStyles.contactRowCenter, { marginBottom: 0 }]}>
              <Text style={pdfStyles.contactLabelAm}>Website / ዌብሳይት: </Text>
              <Link src="https://www.abuhanifainstallation.com" style={pdfStyles.contactLink}>https/www.abuhanifainstallation.com</Link>
            </View>
          </View>

        </View>

        {/* Minimalist Bottom Note */}
        <View style={pdfStyles.bottomNote}>
          <Text style={{ fontFamily: "NotoSansEthiopic", fontSize: 6.5, color: "#0c152a88", textAlign: "center" }}>
            አቡሐኒፋ ኢንስታሌሽን ኢትዮጵያ — ለታማኝነት እና ለላቀ ጥራት ሁሌም ከፊት!
          </Text>
        </View>
      </Page>

      {/* PAGE 2+: LANDSCAPE MATERIALS & PRICING */}
      <Page size="A4" orientation="landscape" style={pdfStyles.landscapePage} wrap>
        <View>
          <View style={pdfStyles.brandHeaderBox}>
            <Image src="/images/logo.jpg" style={pdfStyles.logoSmall} />
            <Text style={{ fontSize: 11, fontWeight: "bold", color: "#0c152a", textAlign: "center" }}>Abuhanifa Installation Ethiopia</Text>
            <Text style={{ fontFamily: "NotoSansEthiopic", fontSize: 6, fontWeight: "bold", color: "#", marginTop: 2, textAlign: "center" }}>
              አቡሐኒፋ ኢንስታሌሽን ኢትዮጵያ — ለታማኝነት እና ለላቀ ጥራት ሁሌም ከፊት!
            </Text>
            <Text style={{ fontSize: 5.5, fontWeight: "bold", color: "#000000", marginTop: 1, letterSpacing: 0.5, textTransform: "uppercase", textAlign: "center" }}>Electrical • Plumbing • Sanitary Installation</Text>
          </View>

          <View style={pdfStyles.materialHeader}>
            <View>
              <Text style={{ fontSize: 7.5, fontWeight: "bold", color: "#5d77ec" }}>Material Estimate & Pricing Schedule</Text>
              {data.customerName && (
                <Text style={{ fontSize: 6, color: "#0c152a99", marginTop: 1 }}>
                  Customer: {data.customerName}
                </Text>
              )}
            </View>
            <View style={{ textAlign: "right" }}>
              <Text style={{ fontSize: 6, color: "#0c152a88" }}>Order #{data.id}</Text>
              {data.createdAt && (
                <Text style={{ fontSize: 5.5, color: "#0c152a66" }}>{formatDate(data.createdAt)}</Text>
              )}
            </View>
          </View>

          <View style={pdfStyles.tableHeader} fixed>
            <View style={pdfStyles.colNum}><Text style={pdfStyles.thText}>S.No</Text></View>
            <View style={pdfStyles.colMaterial}><Text style={pdfStyles.thText}>Material</Text></View>
            <View style={pdfStyles.colCategory}><Text style={pdfStyles.thText}>Category</Text></View>
            <View style={pdfStyles.colType}><Text style={pdfStyles.thText}>Type</Text></View>
            <View style={pdfStyles.colBrand}><Text style={pdfStyles.thText}>Brand</Text></View>
            <View style={pdfStyles.colDiameter}><Text style={pdfStyles.thText}>Diameter</Text></View>
            <View style={pdfStyles.colSpec}><Text style={pdfStyles.thText}>Specification</Text></View>
            <View style={pdfStyles.colQty}><Text style={[pdfStyles.thText, { textAlign: "center" }]}>Quantity</Text></View>
            <View style={pdfStyles.colPrice}><Text style={[pdfStyles.thText, { textAlign: "right" }]}>Price</Text></View>
            <View style={pdfStyles.colTotal}><Text style={[pdfStyles.thText, { textAlign: "right" }]}>Total</Text></View>
          </View>

          {items.map((item, index) => {
            const rawPrice = item.price || 0;
            const rawTotal = item.total || (Number(item.quantity) * Number(rawPrice)) || 0;
            
            const displayPrice = formatPrice(rawPrice);
            const displayTotal = formatPrice(rawTotal);
            const displayQty = formatNumber(item.quantity);

            return (
              <View key={index} style={pdfStyles.tableRow} wrap={false}>
                <View style={pdfStyles.colNum}><Text style={pdfStyles.tdText}>{index + 1}</Text></View>
                <View style={pdfStyles.colMaterial}>
                  <Text style={[pdfStyles.tdText, { fontWeight: "bold" }]}>{item.materialNameEnglish}</Text>
                  {item.materialNameAmharic && (
                    <Text style={pdfStyles.amharicText}>{item.materialNameAmharic}</Text>
                  )}
                </View>
                <View style={pdfStyles.colCategory}><Text style={pdfStyles.tdSpecText}>{item.category || "-"}</Text></View>
                <View style={pdfStyles.colType}><Text style={pdfStyles.tdSpecText}>{item.type || "-"}</Text></View>
                <View style={pdfStyles.colBrand}><Text style={pdfStyles.tdSpecText}>{item.brand || "-"}</Text></View>
                <View style={pdfStyles.colDiameter}><Text style={pdfStyles.tdSpecText}>{item.diameter || "-"}</Text></View>
                <View style={pdfStyles.colSpec}><Text style={pdfStyles.tdSpecText}>{item.specification || "-"}</Text></View>
                <View style={pdfStyles.colQty}><Text style={[pdfStyles.tdText, { fontWeight: "bold", textAlign: "center" }]}>{displayQty}</Text></View>
                <View style={pdfStyles.colPrice}>
                  <Text style={[pdfStyles.tdText, { textAlign: "right" }]}>{displayPrice}</Text>
                </View>
                <View style={pdfStyles.colTotal}>
                  <Text style={[pdfStyles.tdText, { fontWeight: "bold", textAlign: "right" }]}>{displayTotal}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Custom Styled Footer for Material Pages */}
        <View style={pdfStyles.footerContainer}>
          <Text style={pdfStyles.amharicText}>
            አቡሐኒፋ ኢንስታሌሽን ኢትዮጵያ — ለታማኝነት እና ለላቀ ጥራት ሁሌም ከፊት!
          </Text>
          <Text style={pdfStyles.footerText}>Phone / ስልክ: +251936489696 </Text>
          <Link src="https://t.me/abuhanifainstallation" style={pdfStyles.footerLink}>
            Telegram / ቴሌግራም: t.me/abuhanifainstallation
          </Link>
        </View>
      </Page>
    </Document>
  );
}

export default function EstimatePdfDownloader({ estimate }) {
  const data = estimate?.data || estimate || {};
  return (
    <PDFDownloadLink
      document={<EstimatePDF estimate={estimate} />}
      fileName={`abuhanifainstallation-complete-${data.id || "document"}.pdf`}
      className="px-5 py-2.5 rounded-lg text-sm font-medium transition en cursor-pointer shadow-sm flex items-center gap-2 hover:opacity-90"
      style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
    >
      {({ loading }) => (loading ? "Preparing PDF..." : "📥 Export to PDF")}
    </PDFDownloadLink>
  );
}