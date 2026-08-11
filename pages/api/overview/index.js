// pages/api/overview/index.js

import { getOverview } from "@/services/overview.service";

import { requireAdmin } from "../../../lib/auth";

export default async function handler(request, response) {

      const auth = await requireAdmin(request);
    


    if (request.method !== "GET") {
        response.setHeader("Allow", ["GET"]);

        return response.status(405).json({
            success: false,
            error: "Method not allowed",
        });
    }
      
    if (!auth.authorized) {
        return res.status(auth.status).json({
          success: false,
          message: auth.message,
        });
      }


    try {
        const overview = await getOverview();

        return response.status(200).json({
            success: true,
            data: overview,
        });
    } catch (error) {
        console.error("Overview API error:", error);

        return response.status(500).json({
            success: false,
            error: "Failed to load overview",
        });
    }
}