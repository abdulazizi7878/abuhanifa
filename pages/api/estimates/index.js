import {
  createEstimateService,
  getEstimatesService, 
} from "../../../services/estimate.service";

import { requireAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  const auth = await requireAdmin(req);

  if (!auth.authorized) {
    return res.status(auth.status).json({
      success: false,
      message: auth.message,
    });
  }

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
        workType,
        workStage,
        customerLocation,
        customerSpecificLocation,
        projectTitle,
        projectDescription,
        items,
      } = req.body;

      const estimate =
        await createEstimateService({
          customerName,
          customerPhone,
          workType,
          workStage,
          customerLocation,
          customerSpecificLocation,
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