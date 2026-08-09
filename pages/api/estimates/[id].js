import {
  getEstimateService,
  updateEstimateService,
  deleteEstimateService,
} from "../../../services/estimate.service";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Estimate ID is required",
    });
  }

  try {
    // ==========================================
    // GET ESTIMATE
    // ==========================================

    if (req.method === "GET") {
      const estimate =
        await getEstimateService(id);

      return res.status(200).json({
        success: true,
        data: estimate,
      });
    }


    // ==========================================
    // UPDATE ESTIMATE
    // ==========================================

    if (req.method === "PUT") {
      const estimate =
        await updateEstimateService(
          id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message: "Estimate updated successfully",
        data: estimate,
      });
    }


    // ==========================================
    // DELETE ESTIMATE
    // ==========================================

    if (req.method === "DELETE") {
      const result =
        await deleteEstimateService(id);

      return res.status(200).json({
        success: true,
        message: "Estimate deleted successfully",
        data: result,
      });
    }


    // ==========================================
    // METHOD NOT ALLOWED
    // ==========================================

    res.setHeader(
      "Allow",
      ["GET", "PUT", "DELETE"]
    );

    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });

  } catch (error) {
    console.error(
      "Estimate API Error:",
      error
    );

    return res.status(
      error.statusCode || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Something went wrong",
    });
  }
}