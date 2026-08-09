import {
  createMaterialService,
  getMaterialsService,
} from "../../../services/material.service";

export default async function handler(req, res) {
  try {
    // ==========================================
    // GET ALL
    // ==========================================

    if (req.method === "GET") {
      const materials = await getMaterialsService();

      return res.status(200).json({
        success: true,
        data: materials,
      });
    }

    // ==========================================
    // CREATE
    // ==========================================

    if (req.method === "POST") {
      const material = await createMaterialService(req.body);

      return res.status(201).json({
        success: true,
        message: "Material created successfully",
        data: material,
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);

    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    console.error("Materials API error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}