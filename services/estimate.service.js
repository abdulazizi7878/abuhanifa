// services/estimate.service.js

import crypto from "crypto";
import {db} from "../lib/db";

import {
  createEstimate,
  createEstimateItem,
  getEstimateById,
  getEstimateWithItems,
  getEstimateByPublicToken,
  updateEstimate,
  updateGrandTotal,
  deleteEstimate,
  getEstimateItems,
  updateEstimateItem,
  deleteEstimateItem,
  getEstimatesRepository
} from "../repositories/estimate.repository";

import { getMaterialById } from "../repositories/material.repository";



export async function getEstimatesService() {
  return await getEstimatesRepository();
}

// Generate a unique public token for the homeowner link
function generatePublicToken() {
  return crypto.randomBytes(32).toString("hex");
}


// Validate quantity
function validateQuantity(quantity) {
  const value = Number(quantity);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  return value;
}


// Calculate grand total
function calculateGrandTotal(items) {
  return items.reduce(
    (total, item) => total + Number(item.total),
    0
  );
}


// =====================================================
// CREATE ESTIMATE
// =====================================================

export async function createEstimateService(data) {
  const {
    customerName,
    customerPhone,
    projectTitle,
    projectDescription,
    items,
  } = data;


  if (!customerName || !customerName.trim()) {
    throw new Error("Customer name is required");
  }


  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("At least one material is required");
  }


  const connection = await db.getConnection();


  try {
    await connection.beginTransaction();


    const publicToken = generatePublicToken();


    // Create estimate
    const estimate = await createEstimate(
      connection,
      {
        customerName: customerName.trim(),
        customerPhone: customerPhone?.trim() || null,
        projectTitle: projectTitle?.trim() || null,
        projectDescription:
          projectDescription?.trim() || null,
        status: "draft",
        publicToken,
      }
    );


    const createdItems = [];


    // Create estimate items
    for (const item of items) {

      if (!item.materialId) {
        throw new Error(
          "Material ID is required for every item"
        );
      }


      const quantity = validateQuantity(
        item.quantity
      );


      // Get the real material from database
      const material = await getMaterialById(
        item.materialId
      );


      if (!material) {
        throw new Error(
          `Material with ID ${item.materialId} was not found`
        );
      }


      const price = Number(material.price);


      if (!Number.isFinite(price) || price < 0) {
        throw new Error(
          `Invalid price for material ID ${item.materialId}`
        );
      }


      // Calculate item total on the server
      const total = quantity * price;


      const createdItem =
        await createEstimateItem(
          connection,
          estimate.id,
          {
            materialId: item.materialId,
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


    // Calculate grand total
    const grandTotal =
      calculateGrandTotal(createdItems);


    // Save grand total
    await updateGrandTotal(
      connection,
      estimate.id,
      grandTotal
    );


    await connection.commit();


    return {
      id: estimate.id,

      customerName:
        customerName.trim(),

      customerPhone:
        customerPhone?.trim() || null,

      projectTitle:
        projectTitle?.trim() || null,

      projectDescription:
        projectDescription?.trim() || null,

      status: "draft",

      publicToken,

      grandTotal,

      items: createdItems,
    };

  } catch (error) {

    await connection.rollback();

    throw error;

  } finally {

    connection.release();

  }
}


// =====================================================
// GET ESTIMATE BY ID
// =====================================================

export async function getEstimateService(id) {

  if (!id) {
    throw new Error("Estimate ID is required");
  }


  const estimate =
    await getEstimateWithItems(id);


  if (!estimate) {

    const error =
      new Error("Estimate not found");

    error.statusCode = 404;

    throw error;
  }


  return estimate;
}


// =====================================================
// GET PUBLIC ESTIMATE
// =====================================================

export async function getPublicEstimateService(
  publicToken
) {

  if (!publicToken) {
    throw new Error("Public token is required");
  }


  const estimate =
    await getEstimateByPublicToken(
      publicToken
    );


  if (!estimate) {

    const error =
      new Error("Estimate not found");

    error.statusCode = 404;

    throw error;
  }


  return estimate;
}


// =====================================================
// UPDATE ESTIMATE
// =====================================================

export async function updateEstimateService(
  id,
  data
) {

  if (!id) {
    throw new Error("Estimate ID is required");
  }


  const existingEstimate =
    await getEstimateById(id);


  if (!existingEstimate) {

    const error =
      new Error("Estimate not found");

    error.statusCode = 404;

    throw error;
  }


  const {
    customerName,
    customerPhone,
    projectTitle,
    projectDescription,
    status,
  } = data;


  if (!customerName || !customerName.trim()) {
    throw new Error("Customer name is required");
  }


  await updateEstimate(
    id,
    {
      customerName:
        customerName.trim(),

      customerPhone:
        customerPhone?.trim() || null,

      projectTitle:
        projectTitle?.trim() || null,

      projectDescription:
        projectDescription?.trim() || null,

      status:
        status || existingEstimate.status,
    }
  );


  return await getEstimateWithItems(id);
}


// =====================================================
// DELETE ESTIMATE
// =====================================================

export async function deleteEstimateService(id) {

  if (!id) {
    throw new Error("Estimate ID is required");
  }


  const existingEstimate =
    await getEstimateById(id);


  if (!existingEstimate) {

    const error =
      new Error("Estimate not found");

    error.statusCode = 404;

    throw error;
  }


  const deleted =
    await deleteEstimate(id);


  if (!deleted) {
    throw new Error(
      "Failed to delete estimate"
    );
  }


  return {
    success: true,
    id,
  };
}


// =====================================================
// GET ESTIMATE ITEMS
// =====================================================

export async function getEstimateItemsService(
  estimateId
) {

  if (!estimateId) {
    throw new Error(
      "Estimate ID is required"
    );
  }


  const estimate =
    await getEstimateById(
      estimateId
    );


  if (!estimate) {

    const error =
      new Error("Estimate not found");

    error.statusCode = 404;

    throw error;
  }


  return await getEstimateItems(
    estimateId
  );
}


// =====================================================
// ADD ESTIMATE ITEM
// =====================================================

export async function addEstimateItemService(
  estimateId,
  data
) {

  if (!estimateId) {
    throw new Error(
      "Estimate ID is required"
    );
  }


  const estimate =
    await getEstimateById(
      estimateId
    );


  if (!estimate) {

    const error =
      new Error("Estimate not found");

    error.statusCode = 404;

    throw error;
  }


  if (!data.materialId) {
    throw new Error(
      "Material ID is required"
    );
  }


  const quantity =
    validateQuantity(
      data.quantity
    );


  // Get current material
  const material =
    await getMaterialById(
      data.materialId
    );


  if (!material) {

    const error =
      new Error("Material not found");

    error.statusCode = 404;

    throw error;
  }


  const price =
    Number(material.price);


  if (!Number.isFinite(price) || price < 0) {
    throw new Error(
      "Invalid material price"
    );
  }


  const total =
    quantity * price;


  const connection =
    await db.getConnection();


  try {

    await connection.beginTransaction();


    const item =
      await createEstimateItem(
        connection,
        estimateId,
        {
          materialId:
            data.materialId,

          quantity,

          price,

          total,
        }
      );


    // Get all items after adding
    const items =
      await getEstimateItems(
        estimateId
      );


    const grandTotal =
      calculateGrandTotal(items);


    await updateGrandTotal(
      connection,
      estimateId,
      grandTotal
    );


    await connection.commit();


    return {
      ...item,

      material,

      grandTotal,
    };

  } catch (error) {

    await connection.rollback();

    throw error;

  } finally {

    connection.release();

  }
}


// =====================================================
// UPDATE ESTIMATE ITEM
// =====================================================

export async function updateEstimateItemService(
  itemId,
  data
) {

  if (!itemId) {
    throw new Error(
      "Estimate item ID is required"
    );
  }


  const quantity =
    validateQuantity(
      data.quantity
    );


  const connection =
    await db.getConnection();


  try {

    await connection.beginTransaction();


    const [rows] =
      await connection.execute(
        `
          SELECT
            id,
            estimate_id AS estimateId,
            material_id AS materialId,
            price
          FROM estimate_items
          WHERE id = ?
          LIMIT 1
        `,
        [itemId]
      );


    if (!rows.length) {

      const error =
        new Error(
          "Estimate item not found"
        );

      error.statusCode = 404;

      throw error;
    }


    const item = rows[0];


    const price =
      Number(item.price);


    const total =
      quantity * price;


    await updateEstimateItem(
      itemId,
      {
        quantity,
        price,
        total,
      }
    );


    const items =
      await getEstimateItems(
        item.estimateId
      );


    const grandTotal =
      calculateGrandTotal(items);


    await updateGrandTotal(
      connection,
      item.estimateId,
      grandTotal
    );


    await connection.commit();


    return {
      id: itemId,

      estimateId:
        item.estimateId,

      materialId:
        item.materialId,

      quantity,

      price,

      total,

      grandTotal,
    };

  } catch (error) {

    await connection.rollback();

    throw error;

  } finally {

    connection.release();

  }
}


// =====================================================
// DELETE ESTIMATE ITEM
// =====================================================

export async function deleteEstimateItemService(
  itemId
) {

  if (!itemId) {
    throw new Error(
      "Estimate item ID is required"
    );
  }


  const connection =
    await db.getConnection();


  try {

    await connection.beginTransaction();


    const [rows] =
      await connection.execute(
        `
          SELECT
            id,
            estimate_id AS estimateId
          FROM estimate_items
          WHERE id = ?
          LIMIT 1
        `,
        [itemId]
      );


    if (!rows.length) {

      const error =
        new Error(
          "Estimate item not found"
        );

      error.statusCode = 404;

      throw error;
    }


    const estimateId =
      rows[0].estimateId;


    await deleteEstimateItem(
      itemId
    );


    const items =
      await getEstimateItems(
        estimateId
      );


    const grandTotal =
      calculateGrandTotal(items);


    await updateGrandTotal(
      connection,
      estimateId,
      grandTotal
    );


    await connection.commit();


    return {
      success: true,

      id: itemId,

      estimateId,

      grandTotal,
    };

  } catch (error) {

    await connection.rollback();

    throw error;

  } finally {

    connection.release();

  }
}