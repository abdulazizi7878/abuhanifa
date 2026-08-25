// services/estimate-duplicate.service.js

import crypto from "crypto";
import { db } from "../lib/db";

import {
  createEstimate,
  createEstimateItem,
  updateGrandTotal,
  getEstimateWithItems,
} from "../repositories/estimate.repository";

import { getMaterialById } from "../repositories/material.repository";


// =====================================================
// HELPERS
// =====================================================

// Generate a unique public token for the new estimate.
function generatePublicToken() {
  return crypto.randomBytes(32).toString("hex");
}


// Validate quantity.
function validateQuantity(quantity) {
  const value = Number(quantity);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  return value;
}


// Calculate grand total.
function calculateGrandTotal(items) {
  return items.reduce(
    (total, item) => total + Number(item.total || 0),
    0
  );
}


// =====================================================
// CREATE CLONE PROJECT TITLE
// =====================================================
//
// Example:
//
// Original:
// House Electrical Installation
//
// Copies:
//
// House Electrical Installation - Copy 1
// House Electrical Installation - Copy 2
// House Electrical Installation - Copy 3
//

function createCloneTitle(originalTitle, cloneNumber) {
  const baseTitle =
    originalTitle?.trim() || "Estimate";

  return `${baseTitle} - Copy ${cloneNumber}`;
}


// =====================================================
// DUPLICATE ESTIMATE SERVICE
// =====================================================

export async function duplicateEstimateService(estimateId) {
  // ---------------------------------------------------
  // Validate estimate ID
  // ---------------------------------------------------

  if (!estimateId) {
    throw new Error("Estimate ID is required");
  }


  // ---------------------------------------------------
  // Get database connection
  // ---------------------------------------------------

  const connection =
    await db.getConnection();


  try {

    // -------------------------------------------------
    // Start transaction
    // -------------------------------------------------

    await connection.beginTransaction();


    // =================================================
    // 1. GET ORIGINAL ESTIMATE
    // =================================================

    const [estimateRows] =
      await connection.execute(
        `
          SELECT
            id,
            customer_name AS customerName,
            customer_phone AS customerPhone,
            customer_location AS customerLocation,
            customer_specific_location AS customerSpecificLocation,
            work_type AS workType,
            work_stage AS workStage,
            project_title AS projectTitle,
            project_description AS projectDescription
          FROM estimates
          WHERE id = ?
          LIMIT 1
        `,
        [estimateId]
      );


    if (!estimateRows.length) {

      const error =
        new Error("Estimate not found");

      error.statusCode = 404;

      throw error;
    }


    const originalEstimate =
      estimateRows[0];


    // =================================================
    // 2. GET ORIGINAL ESTIMATE ITEMS
    // =================================================

    const [originalItems] =
      await connection.execute(
        `
          SELECT
            id,
            material_id AS materialId,
            quantity
          FROM estimate_items
          WHERE estimate_id = ?
          ORDER BY id ASC
        `,
        [estimateId]
      );


    // An estimate without materials should never exist,
    // but we protect the duplication operation anyway.

    if (!originalItems.length) {
      throw new Error(
        "Cannot duplicate an estimate without materials"
      );
    }


    // =================================================
    // 3. DETERMINE COPY NUMBER
    // =================================================

    const baseTitle =
      originalEstimate.projectTitle?.trim() ||
      "Estimate";


    const clonePrefix =
      `${baseTitle} - Copy `;


    // Find existing project titles that begin
    // with the same base title.

    const [cloneRows] =
      await connection.execute(
        `
          SELECT
            project_title AS projectTitle
          FROM estimates
          WHERE project_title LIKE ?
        `,
        [`${clonePrefix}%`]
      );


    let cloneNumber = 1;


    const cloneNumbers = [];


    for (const row of cloneRows) {

      const title =
        row.projectTitle || "";


      const match =
        title.match(
          /- Copy (\d+)$/
        );


      if (match) {

        cloneNumbers.push(
          Number(match[1])
        );

      }
    }


    if (cloneNumbers.length > 0) {

      cloneNumber =
        Math.max(
          ...cloneNumbers
        ) + 1;
    }


    const cloneProjectTitle =
      createCloneTitle(
        baseTitle,
        cloneNumber
      );


    // =================================================
    // 4. GENERATE NEW PUBLIC TOKEN
    // =================================================

    const publicToken =
      generatePublicToken();


    // =================================================
    // 5. CREATE NEW ESTIMATE
    // =================================================

    const duplicatedEstimate =
      await createEstimate(
        connection,
        {
          // Copy customer information
          customerName:
            originalEstimate.customerName,

          customerPhone:
            originalEstimate.customerPhone,

          customerLocation:
            originalEstimate.customerLocation,

          customerSpecificLocation:
            originalEstimate.customerSpecificLocation,


          // Copy project configuration
          workType:
            originalEstimate.workType,

          workStage:
            originalEstimate.workStage,


          // Use the new copy title
          projectTitle:
            cloneProjectTitle,


          // Copy description
          projectDescription:
            originalEstimate.projectDescription,


          // Every duplicate starts as a draft
          status: "draft",


          // New public token
          publicToken,
        }
      );


    // =================================================
    // 6. DUPLICATE MATERIAL ITEMS
    // =================================================

    const createdItems = [];


    for (const originalItem of originalItems) {

      // -----------------------------------------------
      // Validate material ID
      // -----------------------------------------------

      if (!originalItem.materialId) {

        throw new Error(
          `Material ID is missing for estimate item ${originalItem.id}`
        );
      }


      // -----------------------------------------------
      // Validate quantity
      // -----------------------------------------------

      const quantity =
        validateQuantity(
          originalItem.quantity
        );


      // -----------------------------------------------
      // Get CURRENT material
      // -----------------------------------------------
      //
      // We intentionally fetch the material again.
      //
      // Example:
      //
      // Original price = 100 ETB
      // Current price  = 120 ETB
      //
      // Duplicate uses = 120 ETB
      //
      // -----------------------------------------------

      const material =
        await getMaterialById(
          originalItem.materialId
        );


      if (!material) {

        const error =
          new Error(
            `Material with ID ${originalItem.materialId} was not found`
          );

        error.statusCode = 404;

        throw error;
      }


      // -----------------------------------------------
      // Validate current price
      // -----------------------------------------------

      const price =
        Number(material.price);


      if (
        !Number.isFinite(price) ||
        price < 0
      ) {

        throw new Error(
          `Invalid price for material ID ${originalItem.materialId}`
        );
      }


      // -----------------------------------------------
      // Calculate item total
      // -----------------------------------------------

      const total =
        quantity * price;


      // -----------------------------------------------
      // Create NEW estimate item
      // -----------------------------------------------

      const createdItem =
        await createEstimateItem(
          connection,
          duplicatedEstimate.id,
          {
            materialId:
              originalItem.materialId,

            quantity,

            price,

            total,
          }
        );


      createdItems.push({
        ...createdItem,
        material,
      });
    }


    // =================================================
    // 7. CALCULATE GRAND TOTAL
    // =================================================

    const grandTotal =
      calculateGrandTotal(
        createdItems
      );


    // =================================================
    // 8. SAVE GRAND TOTAL
    // =================================================

    await updateGrandTotal(
      connection,
      duplicatedEstimate.id,
      grandTotal
    );


    // =================================================
    // 9. COMMIT TRANSACTION
    // =================================================

    await connection.commit();


    // =================================================
    // 10. GET COMPLETE NEW ESTIMATE
    // =================================================

    const newEstimate =
      await getEstimateWithItems(
        duplicatedEstimate.id
      );


    // =================================================
    // 11. RETURN RESULT
    // =================================================

    return {
      ...newEstimate,

      grandTotal,

      publicToken,

      items: createdItems,
    };


  } catch (error) {

    // -------------------------------------------------
    // Rollback everything if something fails
    // -------------------------------------------------

    await connection.rollback();

    throw error;


  } finally {

    // -------------------------------------------------
    // Always release connection
    // -------------------------------------------------

    connection.release();

  }
}