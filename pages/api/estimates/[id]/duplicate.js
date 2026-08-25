import { duplicateEstimateService } from "../../../../services/estimate-duplicate.service";
import { requireAdmin } from "../../../../lib/auth";


export default async function handler(req, res) {

    const auth = await requireAdmin(req);

    if (!auth.authorized) {
    return res.status(auth.status).json({
        success: false,
        message: auth.message,
    });
    }
  // -------------------------------------------------
  // Only POST is allowed
  // -------------------------------------------------

  
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    });
  }


  // -------------------------------------------------
  // Get estimate ID from URL
  //
  // /api/estimates/25/duplicate
  //                    ↑
  //                   id
  // -------------------------------------------------

  const { id } = req.query;


  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Estimate ID is required",
    });
  }


  try {
    // -------------------------------------------------
    // Duplicate estimate
    // -------------------------------------------------

    const duplicatedEstimate =
      await duplicateEstimateService(id);


    // -------------------------------------------------
    // Success
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Estimate duplicated successfully",
      estimate: duplicatedEstimate,
    });

  } catch (error) {
    console.error(
      "Duplicate estimate error:",
      error
    );


    // -------------------------------------------------
    // Known errors
    // -------------------------------------------------

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }


    // -------------------------------------------------
    // Unexpected error
    // -------------------------------------------------

    return res.status(500).json({
      success: false,
      message: "Failed to duplicate estimate",
    });
  }
}