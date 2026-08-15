"use client";

import React from "react";
import * as XLSX from "xlsx";

const CATEGORY_BRANDS = {
  plumbing: "Aquapa/Lesso/RAK/Teflo",
  sanitary: "Era/Lesso/Teflo",
  electrical: "Rhino/Euro/UF/BMET",
};

export default function ExcelExport({ estimate }) {
  const handleExport = () => {
    const data = estimate?.data || estimate || {};
    const items = data.items || [];

    // Helper logic for brands matching the PDF implementation
    const getAllBrandsForCategory = (item) => {
      const cat = item.category?.toLowerCase();
      const b = item.brand;
      if (b === "N/A" || b === "ANY" || b === "n/a" || b === "Any") {
        return b;
      }
      return CATEGORY_BRANDS[cat] || b || "-";
    };

    // 1. Header Information (Metadata)
    const headerInfo = [
      ["Abuhanifa Installation Ethiopia"],
      ["Customer Name:", data.customerName || data.clientName || "N/A"],
      ["Order Number:", data.id || data.orderNumber || "N/A"],
      ["Date:", data.date || new Date().toISOString().split("T")[0]],
      [], // Empty row for spacing
    ];

    // 2. Table Headers
    const tableHeaders = [
      "S.No",
      "Material",
      "Category",
      "Type",
      "Brand",
      "Diameter",
      "Unit",
      "Specification",
      "Quantity",
      "Price",
      "Total",
    ];

    // 3. Map Items Data
    const itemRows = items.map((item, index) => {
      const brand = getAllBrandsForCategory(item);

      const rowNum = headerInfo.length + 2 + index; // Excel row index calculation (1-based)
      // Columns: S.No(A), Material(B), Category(C), Type(D), Brand(E), Diameter(F), Unit(G), Spec(H), Qty(I), Price(J), Total(K)
      const totalFormula = `=I${rowNum}*J${rowNum}`;

      return [
        index + 1,
        item.materialNameEnglish || item.name || "",
        item.category || "",
        item.type || "",
        brand,
        item.diameter || "",
        item.unit || "",
        item.specification || "",
        Number(item.quantity) || 0,
        "", // Price left empty for manual entry
        { t: "n", f: totalFormula }, // Excel formula for Total
      ];
    });

    // 4. Grand Total Row
    const startRow = headerInfo.length + 2;
    const endRow = startRow + items.length - 1;
    const grandTotalRowIndex = endRow + 1;
    const grandTotalFormula = items.length > 0 ? `=SUM(K${startRow}:K${endRow})` : "=0";

    const grandTotalRow = [
      "",
      "Grand Total",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      { t: "n", f: grandTotalFormula },
    ];

    // Combine all rows into a single worksheet array
    const wsData = [...headerInfo, tableHeaders, ...itemRows, grandTotalRow];

    // Create Worksheet and Workbook
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    // Column widths tuning
    worksheet["!cols"] = [
      { wch: 6 },  // S.No
      { wch: 25 }, // Material
      { wch: 15 }, // Category
      { wch: 15 }, // Type
      { wch: 20 }, // Brand
      { wch: 12 }, // Diameter
      { wch: 8 },  // Unit
      { wch: 25 }, // Specification
      { wch: 10 }, // Quantity
      { wch: 12 }, // Price
      { wch: 15 }, // Total
    ];

    // Freeze header row so it stays visible when scrolling
    worksheet["!freeze"] = { xSplit: 0, ySplit: headerInfo.length + 1 };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estimate");

    // Generate filename and trigger download
    const filename = `abuhanifainstallation-complete-${data.id || "document"}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors"
    >
      <span>📊 Export to Excel</span>
    </button>
  );
}