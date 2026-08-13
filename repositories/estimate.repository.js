// repositories/estimate.repository.js

import { db } from "../lib/db";

/**
 * Create a new estimate.
 */
export async function createEstimate(connection, estimateData) {
  const {
    customerName,
    customerPhone,
    workType,
    workStage,
    customerLocation,
    customerSpecificLocation,
    projectTitle,
    projectDescription,
    status = "draft",
    publicToken,
  } = estimateData;

  const [result] = await connection.execute(
    `
      INSERT INTO estimates (
        customer_name,
        customer_phone,
        customer_location,
        customer_specific_location,
        work_type,
        work_stage,
        project_title,
        project_description,
        status,
        public_token
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      customerName,
      customerPhone || null,
      customerLocation || null,
      customerSpecificLocation || null,
      workType || null,
      workStage || null,
      projectTitle || null,
      projectDescription || null,
      status,
      publicToken,
    ]
  );

  return {
    id: result.insertId,
    ...estimateData,
  };
}

/**
 * Get an estimate by ID.
 */
export async function getEstimateById(id) {
  const [rows] = await db.execute(
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
        project_description AS projectDescription,
        status,
        grand_total AS grandTotal,
        public_token AS publicToken,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM estimates
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

/**
 * Get an estimate with all of its items.
 */
export async function getEstimateWithItems(id) {
  const [estimateRows] = await db.execute(
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
        project_description AS projectDescription,
        status,
        grand_total AS grandTotal,
        public_token AS publicToken,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM estimates
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  if (!estimateRows.length) {
    return null;
  }

  const [itemRows] = await db.execute(
    `
      SELECT
        ei.id,
        ei.estimate_id AS estimateId,
        ei.material_id AS materialId,
        ei.quantity,
        ei.price,
        ei.total,

        m.material_name_english AS materialNameEnglish,
        m.material_name_amharic AS materialNameAmharic,
        m.type,
        m.brand,
        m.diameter,
        m.unit,
        m.specification,
        m.category

      FROM estimate_items ei

      INNER JOIN materials m
        ON m.id = ei.material_id

      WHERE ei.estimate_id = ?

      ORDER BY ei.id ASC
    `,
    [id]
  );

  return {
    ...estimateRows[0],
    items: itemRows,
  };
}

/**
 * Get an estimate using its public token.
 * This is used for the homeowner's public link.
 */
export async function getEstimateByPublicToken(publicToken) {
  const [estimateRows] = await db.execute(
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
        project_description AS projectDescription,
        status,
        grand_total AS grandTotal,
        public_token AS publicToken,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM estimates
      WHERE public_token = ?
      LIMIT 1
    `,
    [publicToken]
  );

  if (!estimateRows.length) {
    return null;
  }

  const [itemRows] = await db.execute(
    `
      SELECT
        ei.id,
        ei.material_id AS materialId,
        ei.quantity,
        ei.price,
        ei.total,

        m.material_name_english AS materialNameEnglish,
        m.material_name_amharic AS materialNameAmharic,
        m.type,
        m.brand,
        m.diameter,
        m.unit,
        m.specification,
        m.category

      FROM estimate_items ei

      INNER JOIN materials m
        ON m.id = ei.material_id

      WHERE ei.estimate_id = ?

      ORDER BY ei.id ASC
    `,
    [estimateRows[0].id]
  );

  return {
    ...estimateRows[0],
    items: itemRows,
  };
}

/**
 * Update estimate information.
 */
export async function updateEstimate(id, estimateData) {
  const {
    customerName,
    customerPhone,
    customerLocation,
    customerSpecificLocation,
    workType,
    workStage,
    projectTitle,
    projectDescription,
    status,
  } = estimateData;

  const [result] = await db.execute(
    `
      UPDATE estimates
      SET
        customer_name = ?,
        customer_phone = ?,
        customer_location = ?,
        customer_specific_location = ?,
        work_type = ?,
        work_stage = ?,
        project_title = ?,
        project_description = ?,
        status = ?
      WHERE id = ?
    `,
    [
      customerName,
      customerPhone || null,
      customerLocation || null,
      customerSpecificLocation || null,
      workType || null,
      workStage || null,
      projectTitle || null,
      projectDescription || null,
      status,
      id,
    ]
  );

  return result.affectedRows > 0;
}

/**
 * Update only the grand total.
 */
export async function updateGrandTotal(connection, estimateId, grandTotal) {
  const [result] = await connection.execute(
    `
      UPDATE estimates
      SET grand_total = ?
      WHERE id = ?
    `,
    [grandTotal, estimateId]
  );

  return result.affectedRows > 0;
}

/**
 * Delete an estimate.
 *
 * estimate_items are automatically deleted because
 * the database uses ON DELETE CASCADE.
 */
export async function deleteEstimate(id) {
  const [result] = await db.execute(
    `
      DELETE FROM estimates
      WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
}

/**
 * Add an item to an estimate.
 */
export async function createEstimateItem(
  connection,
  estimateId,
  itemData
) {
  const {
    materialId,
    quantity,
    price,
    total,
  } = itemData;

  const [result] = await connection.execute(
    `
      INSERT INTO estimate_items (
        estimate_id,
        material_id,
        quantity,
        price,
        total
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      estimateId,
      materialId,
      quantity,
      price,
      total,
    ]
  );

  return {
    id: result.insertId,
    estimateId,
    materialId,
    quantity,
    price,
    total,
  };
}

/**
 * Update an estimate item.
 */
export async function updateEstimateItem(id, itemData) {
  const {
    quantity,
    price,
    total,
  } = itemData;

  const [result] = await db.execute(
    `
      UPDATE estimate_items
      SET
        quantity = ?,
        price = ?,
        total = ?
      WHERE id = ?
    `,
    [
      quantity,
      price,
      total,
      id,
    ]
  );

  return result.affectedRows > 0;
}

/**
 * Delete an estimate item.
 */
export async function deleteEstimateItem(id) {
  const [result] = await db.execute(
    `
      DELETE FROM estimate_items
      WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
}

/**
 * Get all items belonging to an estimate.
 */
export async function getEstimateItems(estimateId) {
  const [rows] = await db.execute(
    `
      SELECT
        ei.id,
        ei.estimate_id AS estimateId,
        ei.material_id AS materialId,
        ei.quantity,
        ei.price,
        ei.total,

        m.material_name_english AS materialNameEnglish,
        m.material_name_amharic AS materialNameAmharic,
        m.type,
        m.brand,
        m.diameter,
        m.unit,
        m.specification,
        m.category

      FROM estimate_items ei

      INNER JOIN materials m
        ON m.id = ei.material_id

      WHERE ei.estimate_id = ?

      ORDER BY ei.id ASC
    `,
    [estimateId]
  );

  return rows;
}

export async function getEstimatesRepository() {
  const [rows] = await db.query(`
    SELECT
      e.id,
      e.customer_name AS customerName,
      e.customer_phone AS customerPhone,
      e.project_title AS projectTitle,
      e.project_description AS projectDescription,
      e.status,
      e.grand_total AS grandTotal,
      e.public_token AS publicToken,
      e.created_at AS createdAt,
      e.updated_at AS updatedAt
    FROM estimates e
    ORDER BY e.created_at DESC
  `);

  return rows;
}