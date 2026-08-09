import { db } from "../lib/db";

// ===============================
// CREATE
// ===============================

export async function createMaterial(material) {
  const query = `
    INSERT INTO materials (
      installation_stage,
      category,
      material_name_english,
      material_name_amharic,
      type,
      brand,
      diameter,
      specification,
      price
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    material.installationStage,
    material.category,
    material.materialNameEnglish,
    material.materialNameAmharic,
    material.type,
    material.brand,
    material.diameter,
    material.specification,
    material.price,
  ];

  const [result] = await db.execute(query, values);

  return {
    id: result.insertId,
    ...material,
  };
}

// ===============================
// SHOW ONE
// ===============================

export async function getMaterialById(id) {
  const query = `
    SELECT
      id,
      installation_stage AS installationStage,
      category,
      material_name_english AS materialNameEnglish,
      material_name_amharic AS materialNameAmharic,
      type,
      brand,
      diameter,
      specification,
      price,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM materials
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(query, [id]);

  return rows[0] || null;
}

// ===============================
// SHOW ALL
// ===============================

export async function getMaterials() {
  const query = `
    SELECT
      id,
      installation_stage AS installationStage,
      category,
      material_name_english AS materialNameEnglish,
      material_name_amharic AS materialNameAmharic,
      type,
      brand,
      diameter,
      specification,
      price,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM materials
    ORDER BY id DESC
  `;

  const [rows] = await db.execute(query);

  return rows;
}

// ===============================
// UPDATE
// ===============================

export async function updateMaterial(id, material) {
  const query = `
    UPDATE materials
    SET
      installation_stage = ?,
      category = ?,
      material_name_english = ?,
      material_name_amharic = ?,
      type = ?,
      brand = ?,
      diameter = ?,
      specification = ?,
      price = ?
    WHERE id = ?
  `;

  const values = [
    material.installationStage,
    material.category,
    material.materialNameEnglish,
    material.materialNameAmharic,
    material.type,
    material.brand,
    material.diameter,
    material.specification,
    material.price,
    id,
  ];

  const [result] = await db.execute(query, values);

  return result.affectedRows > 0;
}

// ===============================
// DELETE
// ===============================

export async function deleteMaterial(id) {
  const query = `
    DELETE FROM materials
    WHERE id = ?
  `;

  const [result] = await db.execute(query, [id]);

  return result.affectedRows > 0;
}