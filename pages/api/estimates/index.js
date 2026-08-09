import {
  createEstimateService,
  getEstimatesService, 
} from "../../../services/estimate.service";

export default async function handler(req, res) {
  try {
    // ==========================================
    // GET ALL ESTIMATES
    // ==========================================

    if (req.method === "GET") {
      const estimates = await getEstimatesService();

      return res.status(200).json({
        success: true,
        data: estimates,
      });
    }

    // ==========================================
    // CREATE ESTIMATE
    // ==========================================

    if (req.method === "POST") {
      const {
        customerName,
        customerPhone,
        projectTitle,
        projectDescription,
        items,
      } = req.body;

      const estimate =
        await createEstimateService({
          customerName,
          customerPhone,
          projectTitle,
          projectDescription,
          items,
        });

      return res.status(201).json({
        success: true,
        message: "Estimate created successfully",
        data: estimate,
      });
    }

    // ==========================================
    // METHOD NOT ALLOWED
    // ==========================================

    res.setHeader(
      "Allow",
      ["GET", "POST"]
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