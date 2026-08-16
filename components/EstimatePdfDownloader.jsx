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

// Register Visual Ge'ez with full dynamic origin URL to fix 404
if (typeof window !== "undefined") {
  Font.register({
    family: "VisualGeez",
    src: `${window.location.origin}/fonts/VGU.ttf`,
  });
}

// Category to Brands mapping configuration with brandname/brandname format
const CATEGORY_BRANDS = {
  plumbing: "Aquapa/Lesso/RAK/Teflo",
  sanitary: "Era/Lesso/Teflo",
  electrical: "Rhino/Euro/UF/BMET",
};

const pdfStyles = StyleSheet.create({
  portraitPage: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#0c152a",
    backgroundColor: "#ffffff",
    padding: 24,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  landscapePage: {
    fontFamily: "Times-Roman",
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
    backgroundColor:"#ffffff",
  },
  brandHeaderCenter: {
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#00000022",
    paddingBottom: 10,
  },
  logo: {
    width: 83,
    height: 83,
    objectFit: "contain",
    marginBottom: 8,
    borderRadius: 41.5,
  },
  brandTextContainerCenter: {
    alignItems: "center",
  },
  brandTitleEn: {
    fontFamily: "Times-Roman",
    fontSize: 15,
    fontWeight: "bold",
    color: "#0c152a",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  brandTitleAm: {
    fontFamily: "VisualGeez",
    fontSize: 13,
    fontWeight: "bold",
    color: "#0c152a",
    textAlign: "center",
    marginTop: 3,
  },
  formRowRight: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  formRowLeft: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  formLabel: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#0c152a",
    marginRight: 8,
  },
  formValueCenter: {
    fontFamily: "Times-Roman",
    fontSize: 9.5,
    color: "#0c152a",
    fontWeight: "bold",
    textAlign: "center",
  },
  contactBoxCentered: {
    marginTop: 15,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#00000015",
    borderRadius: 4,
    alignItems: "center",
  },
  contactRowCenter: {
    fontFamily: "Times-Roman",
    fontSize: 9,
    color: "#0c152a",
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  sectionHeaderAmCenter: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0c152a",
    marginTop: 10,
    marginBottom: 6,
    textAlign: "left",
    textDecoration:"underline"
  },
  checkboxGridCentered: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 20,
  },
  checkboxText: {
    fontSize: 11,
    color: "#0c152a",
    marginBottom: 4,
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
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
    paddingTop: 8,
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
    backgroundColor: "#ffffff",
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
  colType: { width: "18%", paddingHorizontal: 2 },
  colBrand: { width: "18%", paddingHorizontal: 2 },
  colDiameter: { width: "10%", paddingHorizontal: 2 },
  colSpec: { width: "20%", paddingHorizontal: 2 },
  colQty: { width: "8%", paddingHorizontal: 2, textAlign: "center" },
  colPrice: { width: "8%", paddingHorizontal: 2, textAlign: "right" },
  colTotal: { width: "8%", paddingHorizontal: 2, textAlign: "right" },
  colUnit: { width: "9%", paddingHorizontal: 2, textAlign: "center" },
  thText: { fontFamily: "Times-Roman", fontSize: 8.3, fontWeight: "bold", textTransform: "uppercase", color: "#000000" },
  tdTextEnglish: { fontFamily: "Times-Roman", fontSize: 8.3, color: "#0c152a" },
  tdTextAmharic: { fontFamily: "VisualGeez", fontSize: 8.3, color: "#0c152a" },
  amharicText: { fontFamily: "VisualGeez", fontSize: 7.5, color: "#0c152a88" },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#00000022",
    paddingTop: 6,
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 10,
  },
  footerLink: {
    fontFamily: "Times-Roman",
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

  const capitalizeFirstLetter = (val) => {
    if (!val) return "-";
    return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
  };

  const getAllBrandsForCategory = (item) => {
    const cat = item.category?.toLowerCase();
    if (item.brand == "N/A" || item.brand == "ANY" || item.brand == "n/a" || item.brand == "Any") {
      return item.brand;
    }
    return CATEGORY_BRANDS[cat] || item.brand || "-";
  };

  const isMatchLoc = (target) => loc.includes(target);
  const isMatchWork = (target) => workType.includes(target);

  return (
    <Document>
      {/* PAGE 1: PORTRAIT COVER PAGE */}
      <Page size="A4" orientation="portrait" style={pdfStyles.portraitPage}>
        <View style={pdfStyles.coverContainer}>
          
          <View style={pdfStyles.brandHeaderCenter}>
            <Image src="/images/logo.jpg" style={pdfStyles.logo} />
            <View style={pdfStyles.brandTextContainerCenter}>
              <Text style={pdfStyles.brandTitleEn}>
                <Text style={{ color: "#ec0800" }}>Abuhanifa</Text> <Text style={{ color: "#007fef" }}>Installation Ethiopia</Text> 
              </Text>
              <Text style={pdfStyles.brandTitleAm}>
                <Text style={{ color: "#ec0800" }}>አቡሐኒፋ</Text> <Text style={{ color: "#007fef" }}>ኢንስታሌሽን ኢትዮጵያ</Text> 
              </Text>
            </View>
          </View>

          {/* Right-aligned: Date and Order Number */}
          <View style={{position:"absolute", top:5, right:6}}>
            <View style={pdfStyles.formRowRight}>
              <Text style={pdfStyles.formLabel}>
                <Text style={{ fontFamily: "Times-Roman" }}>Date</Text>
                <Text style={{ fontFamily: "VisualGeez" }}> / ቀን:</Text>
              </Text>
              <Text style={pdfStyles.formValueCenter}>{formatDate(data.createdAt) || "-"}</Text> 
            </View>
            
            <View style={pdfStyles.formRowRight}>
              <Text style={pdfStyles.formLabel}>
                <Text style={{ fontFamily: "Times-Roman" }}>Order Number</Text>
                <Text style={{ fontFamily: "VisualGeez" }}> / የትዕዛዝ ቁጥር:</Text>
              </Text>
              <Text style={pdfStyles.formValueCenter}>{data.id ? `#${data.id}` : "-"}</Text>    
            </View>            
          </View>

          {/* Left-aligned: Client Name */}
          <View style={pdfStyles.checkboxGridCentered}>
            <Text style={pdfStyles.sectionHeaderAmCenter}>
              <Text style={{ fontFamily: "Times-Roman" }}>Client Name</Text>
              <Text style={{ fontFamily: "VisualGeez" }}> / የደንበኛው ስም:</Text>
            </Text>
            <Text style={pdfStyles.checkboxText}>{data.customerName || "-"}</Text>
          </View>

          {/* Left-aligned: Work Type Checkboxes */}
          <View style={pdfStyles.checkboxGridCentered}>
            <Text style={pdfStyles.sectionHeaderAmCenter}>
              <Text style={{ fontFamily: "Times-Roman" }}>Work Type</Text>
              <Text style={{ fontFamily: "VisualGeez" }}> / የስራው ዓይነት</Text>
            </Text>
            <View>
                <Text style={pdfStyles.checkboxText}>
                  <Text style={{ fontFamily: "Times-Roman" }}>Electric</Text>
                  <Text style={{ fontFamily: "VisualGeez" }}> / መብራት </Text>
                  <Text style={isMatchWork("electric") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                    {isMatchWork("electric") ? "[ ■ ]" : "[   ]"}
                  </Text>
                </Text>
                <Text style={pdfStyles.checkboxText}>
                  <Text style={{ fontFamily: "Times-Roman" }}>Plumbing</Text>
                  <Text style={{ fontFamily: "VisualGeez" }}> / ውሃ </Text>
                  <Text style={(isMatchWork("plumb") || isMatchWork("sanitary")) ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                    {(isMatchWork("plumb") || isMatchWork("sanitary")) ? "[ ■ ]" : "[   ]"}
                  </Text>
                </Text>
                <Text style={pdfStyles.checkboxText}>
                  <Text style={{ fontFamily: "Times-Roman" }}>Other</Text>
                  <Text style={{ fontFamily: "VisualGeez" }}> / ሌላ </Text>
                  <Text style={(!isMatchWork("electric") && !isMatchWork("plumb") && !isMatchWork("sanitary") && workType !== "") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                    {(!isMatchWork("electric") && !isMatchWork("plumb") && !isMatchWork("sanitary") && workType !== "") ? "[ ■ ]" : "[   ]"}
                  </Text>
                </Text>
            </View>
          </View>

          {/* Left-aligned: Work Place Checkboxes */}
          <View style={pdfStyles.checkboxGridCentered}>
            <Text style={pdfStyles.sectionHeaderAmCenter}>
              <Text style={{ fontFamily: "Times-Roman" }}>Work Place</Text>
              <Text style={{ fontFamily: "VisualGeez" }}> / የስራው ቦታ</Text>
            </Text>
            <Text style={pdfStyles.checkboxText}>
              <Text style={{ fontFamily: "Times-Roman" }}>Addis Ababa</Text>
              <Text style={{ fontFamily: "VisualGeez" }}> / አዲስ አበባ </Text>
              <Text style={isMatchLoc("addis") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                {isMatchLoc("addis") ? "[ ■ ]" : "[   ]"}
              </Text>
            </Text>
            <Text style={pdfStyles.checkboxText}>
              <Text style={{ fontFamily: "Times-Roman" }}>Butajira</Text>
              <Text style={{ fontFamily: "VisualGeez" }}> / ቡታጀራ </Text>
              <Text style={isMatchLoc("buta") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                {isMatchLoc("buta") ? "[ ■ ]" : "[   ]"}
              </Text>
            </Text>
            <Text style={pdfStyles.checkboxText}>
              <Text style={{ fontFamily: "Times-Roman" }}>Halaba</Text>
              <Text style={{ fontFamily: "VisualGeez" }}> / ሀላባ </Text>
              <Text style={isMatchLoc("halaba") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                {isMatchLoc("halaba") ? "[ ■ ]" : "[   ]"}
              </Text>
            </Text>
            <Text style={pdfStyles.checkboxText}>
              <Text style={{ fontFamily: "Times-Roman" }}>Worabe</Text>
              <Text style={{ fontFamily: "VisualGeez" }}> / ወራቤ </Text>
              <Text style={isMatchLoc("worabe") ? pdfStyles.filledBlackBox : pdfStyles.emptyBox}>
                {isMatchLoc("worabe") ? "[ ■ ]" : "[   ]"}
              </Text>
            </Text>
          </View>
                      
          <View style={pdfStyles.checkboxGridCentered}>
              <Text style={pdfStyles.sectionHeaderAmCenter}>
                <Text style={{ fontFamily: "Times-Roman" }}>Specific Place</Text>
                <Text style={{ fontFamily: "VisualGeez" }}> / ልዩ ቦታው:</Text>
              </Text>
              <Text style={pdfStyles.checkboxText}>{data.customerSpecificLocation || data.specificLocation || "-"}</Text>
          </View>

          {/* Contact Information Box */}
          <View style={pdfStyles.checkboxGridCentered}>
            <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 6, textAlign: "center" }}>
              <Text style={{ fontFamily: "Times-Roman" }}>Contact Information</Text>
              <Text style={{ fontFamily: "VisualGeez" }}> / የመገናኛ መረጃዎች:</Text>
            </Text>
            <View style={pdfStyles.contactRowCenter}>
              <Text style={pdfStyles.sectionHeaderAmCenter}>
                <Text style={{ fontFamily: "Times-Roman" }}>Phone</Text>
                <Text style={{ fontFamily: "VisualGeez" }}> / ስልክ: </Text>                
              </Text>
              <Link src="tel:+251936489696" style={{ fontFamily: "Times-Roman" }}>+251936489696 / +251705489696</Link>
            </View>
            <View style={pdfStyles.contactRowCenter}>
              <Text style={pdfStyles.sectionHeaderAmCenter}>
                  <Text style={{ fontFamily: "Times-Roman" }}>Telegram</Text>
                  <Text style={{ fontFamily: "VisualGeez" }}> / ቴሌግራም: </Text>                
              </Text>
              <Link src="https://t.me/abuhanifainstallation" style={pdfStyles.footerLink}>t.me/abuhanifainstallation</Link>
            </View>
            <View style={pdfStyles.contactRowCenter}>
              <Text style={pdfStyles.sectionHeaderAmCenter}>
                  <Text style={{ fontFamily: "Times-Roman" }}>E-mail</Text>
                  <Text style={{ fontFamily: "VisualGeez" }}> / ኢሜይል: </Text>                
              </Text>
              <Link src="mailto:abuhanifainstallation@gmail.com" style={pdfStyles.footerLink}>abuhanifainstallation@gmail.com</Link> 
            </View>
            <View style={[pdfStyles.contactRowCenter, { marginBottom: 0 }]}>
              <Text style={pdfStyles.sectionHeaderAmCenter}>
                  <Text style={{ fontFamily: "Times-Roman" }}>Website</Text>
                  <Text style={{ fontFamily: "VisualGeez" }}> / ድህረ-ገጽ: </Text>
              </Text>
              <Link src="https://www.abuhanifainstallation.com" style={pdfStyles.footerLink}>https/www.abuhanifainstallation.com</Link>
           </View>
           <View style={[pdfStyles.contactRowCenter, { marginBottom: 0 }]}>
              <Text style={pdfStyles.sectionHeaderAmCenter}>
                  <Text style={{ fontFamily: "Times-Roman" }}>Order Link</Text>
                  <Text style={{ fontFamily: "VisualGeez" }}> / የማዘዢያ ሊንክ: </Text>
              </Text>
              <Link src={`https://www.abuhanifainstallation.com/estimate/${estimate.link}`} style={pdfStyles.footerLink}>https/www.abuhanifainstallation.com</Link>
            </View>
          </View>

          <View style={{ marginTop: 30 }}>
            <Text style={{fontSize:12, fontWeight:"bold", fontFamily:"Times-Roman", textAlign:"center"}}>
              Estimated By: Jemal Nurye Yimam
            </Text>
            <Text style={{fontSize:10, fontWeight:"bold", fontFamily:"Times-Roman", textAlign:"center"}}>
              Project Manager | Certified Electrician & Plumber
            </Text>
            <Image src={"/images/signature.jpg"} style={{width: 100, height: 50, alignSelf: "center", marginTop: 20}} />
          </View>

        </View>

        <View style={pdfStyles.bottomNote}>
          <Text style={{ fontFamily: "VisualGeez", fontSize: 7.5, color: "#0c152a88", textAlign: "center" }}>
            አቡሐኒፋ ኢንስታሌሽን ኢትዮጵያ — ለታማኝነና ለላቀ ጥራት ሁሌም ከፊት!
          </Text>
        </View>
      </Page>

      {/* PAGE 2+: LANDSCAPE MATERIALS & PRICING */}
      <Page size="A4" orientation="landscape" style={pdfStyles.landscapePage} wrap>
        <View>
          <View style={pdfStyles.brandHeaderBox}>
            <Image src="/images/logo.jpg" style={pdfStyles.logoSmall} />
            <Text style={{ fontFamily: "Times-Roman", fontSize: 11, fontWeight: "bold", color: "#0c152a", textAlign: "center" }}>
              <Text style={{ color: "#ec0800" }}>Abuhanifa</Text> <Text style={{ color: "#007fef" }}>Installation Ethiopia</Text> 
            </Text>
            <Text style={{ fontFamily: "VisualGeez", fontSize: 6, fontWeight: "bold", color: "#0c152a", marginTop: 2, textAlign: "center" }}>
              <Text style={{ color: "#ec0800" }}>አቡሐኒፋ</Text> <Text style={{ color: "#007fef" }}>ኢንስታሌሽን ኢትዮጵያ።</Text> 
            </Text>
          </View>

          <View style={pdfStyles.materialHeader}>
            <View>
              <Text style={{ fontFamily: "Times-Roman", fontSize: 6, color: "#007fef" }}>Material Estimate & Pricing Schedule</Text>

              {data.customerName && (
                <Text style={{ fontFamily: "Times-Roman", fontSize: 6, color: "#007fef", marginTop: 1 }}>
                  Customer: {data.customerName}
                </Text>
              )}
            </View>
            <View style={{ textAlign: "right" }}>
              <Text style={{ fontFamily: "Times-Roman", fontSize: 6, color: "#007fef" }}>Order #{data.id}</Text>
              {data.createdAt && (
                <Text style={{ fontFamily: "Times-Roman", fontSize: 5.5, color: "#007fef" }}>{formatDate(data.createdAt)}</Text>
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
            <View style={pdfStyles.colUnit}><Text style={pdfStyles.thText}>Unit</Text></View>
            <View style={pdfStyles.colQty}><Text style={[pdfStyles.thText, { textAlign: "center" }]}>Quantity</Text></View>
            <View style={pdfStyles.colPrice}><Text style={[pdfStyles.thText, { textAlign: "right" }]}>Price</Text></View>
            <View style={pdfStyles.colTotal}><Text style={[pdfStyles.thText, { textAlign: "right" }]}>Total</Text></View>
          </View>

          {items.map((item, index) => {
            const rawPrice = item.price || 0;
            const rawTotal = item.total || (Number(item.quantity) * Number(rawPrice)) || 0;
            
            const isPriceOne = Number(rawPrice) === 1;
            const displayPrice = isPriceOne ? "0" : formatPrice(rawPrice);
            const displayTotal = isPriceOne ? "0" : formatPrice(rawTotal);
            const displayQty = formatNumber(item.quantity);
            const displayBrand = getAllBrandsForCategory(item);
            const displayCategory = capitalizeFirstLetter(item.category);

            return (
              <View key={index} style={pdfStyles.tableRow} wrap={false}>
                <View style={pdfStyles.colNum}><Text style={pdfStyles.tdTextEnglish}>{index + 1}</Text></View>
                <View style={pdfStyles.colMaterial}>
                  <Text style={[pdfStyles.tdTextEnglish, { fontWeight: "bold", textTransform: "capitalize" }]}>{item.materialNameEnglish}</Text>
                  {item.materialNameAmharic && (
                    <Text style={pdfStyles.tdTextAmharic}>{item.materialNameAmharic}</Text>
                  )}
                </View>
                <View style={pdfStyles.colCategory}><Text style={pdfStyles.tdTextEnglish}>{displayCategory}</Text></View>
                <View style={pdfStyles.colType}><Text style={pdfStyles.tdTextEnglish}>{item.type || "-"}</Text></View>
                <View style={pdfStyles.colBrand}><Text style={pdfStyles.tdTextEnglish}>{displayBrand}</Text></View>
                <View style={pdfStyles.colDiameter}><Text style={pdfStyles.tdTextEnglish}>{item.diameter || "-"}</Text></View>
                <View style={pdfStyles.colSpec}>
                  <Text style={pdfStyles.tdTextEnglish}>{item.specification || "-"}</Text>
                </View>
                <View style={pdfStyles.colUnit}><Text style={pdfStyles.tdTextEnglish}>{item.unit || "-"}</Text></View>
                <View style={pdfStyles.colQty}><Text style={pdfStyles.tdTextEnglish}>{displayQty}</Text></View>
                <View style={pdfStyles.colPrice}><Text style={pdfStyles.tdTextEnglish}>{displayPrice}</Text></View>
                <View style={pdfStyles.colTotal}><Text style={pdfStyles.tdTextEnglish}>{displayTotal}</Text></View>
              </View>
            );
          })}
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