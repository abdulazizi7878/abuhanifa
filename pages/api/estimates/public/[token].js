import {
  getPublicEstimateService,
} from "../../../../services/estimate.service";

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Public token is required",
    });
  } 

  try {
    // ==========================================
    // GET PUBLIC ESTIMATE
    // ==========================================

    if (req.method === "GET") {
      const estimate =
        await getPublicEstimateService(token);

      /*
       * Return only information that is needed
       * by the homeowner.
       *
       * Do not expose the public token again.
       */

      const publicEstimate = {
        id: estimate.id,

        customerName:
          estimate.customerName,

        customerPhone:
          estimate.customerPhone,

        customerLocation:
          estimate.customerLocation,

        customerSpecificLocation:
          estimate.customerSpecificLocation,

        workType:
          estimate.workType,

        workStage:
          estimate.workStage,

        projectTitle:
          estimate.projectTitle,

        projectDescription:
          estimate.projectDescription,

        status:
          estimate.status,

        link:
          estimate.publicToken,

        grandTotal:
          estimate.grandTotal,

        createdAt:
          estimate.createdAt,

        items:
          (estimate.items || []).map(
            (item) => ({
              materialNameEnglish:
                item.materialNameEnglish,

              materialNameAmharic:
                item.materialNameAmharic,

              category:
                item.category,

              type:
                item.type,

              brand:
                item.brand,

              diameter:
                item.diameter,

              unit:
                item.unit,
                
              specification:
                item.specification,

              quantity:
                item.quantity,

              price:
                item.price,

              total:
                item.total,
            })
          ),
      };

      return res.status(200).json({
        success: true,
        data: publicEstimate,
      });
    }


    // ==========================================
    // METHOD NOT ALLOWED
    // ==========================================

    res.setHeader(
      "Allow",
      ["GET"]
    );

    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });

  } catch (error) {

    console.error(
      "Public Estimate API Error:",
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