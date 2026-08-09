import {
  getMaterialService,
  updateMaterialService,
  deleteMaterialService,
} from "../../../services/material.service";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // ==========================================
    // SHOW ONE
    // ==========================================

    if (req.method === "GET") {
      const material = await getMaterialService(id);

      return res.status(200).json({
        success: true,
        data: material,
      });
    }

    // ==========================================
    // UPDATE
    // ==========================================

    if (req.method === "PUT") {
      const material = await updateMaterialService(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Material updated successfully",
        data: material,
      });
    }

    // ==========================================
    // DELETE
    // ==========================================

    if (req.method === "DELETE") {
      await deleteMaterialService(id);

      return res.status(200).json({
        success: true,
        message: "Material deleted successfully",
      });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);

    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    console.error(`Material ${id} API error:`, error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}