import {
  createMaterial,
  getMaterialById,
  getMaterials,
  updateMaterial,
  deleteMaterial,
} from "../repositories/material.repository";

// ==========================================
// VALIDATION
// ==========================================

function validateMaterial(data) {
  const requiredFields = [
    "installationStage",
    "category",
    "materialNameEnglish",
    "materialNameAmharic",
    "type",
    "brand",
    "diameter",
    "specification",
    "price",
  ];

  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      return `${field} is required`;
    }
  }

  const price = Number(data.price);

  if (Number.isNaN(price) || price < 0) {
    return "Price must be a valid positive number";
  }

  return null;
}

// ==========================================
// PREPARE MATERIAL
// ==========================================

function prepareMaterial(data) {
  return {
    installationStage: data.installationStage,
    category: data.category,
    materialNameEnglish: data.materialNameEnglish.trim(),
    materialNameAmharic: data.materialNameAmharic.trim(),
    type: data.type.trim(),
    brand: data.brand.trim(),
    diameter: data.diameter.trim(),
    specification: data.specification.trim(),
    price: Number(data.price),
  };
}

// ==========================================
// CREATE
// ==========================================

export async function createMaterialService(data) {
  const validationError = validateMaterial(data);

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const material = prepareMaterial(data);

  return await createMaterial(material);
}

// ==========================================
// SHOW ALL
// ==========================================

export async function getMaterialsService() {
  return await getMaterials();
}

// ==========================================
// SHOW ONE
// ==========================================

export async function getMaterialService(id) {
  if (!id) {
    const error = new Error("Material ID is required");
    error.statusCode = 400;
    throw error;
  }

  const material = await getMaterialById(id);

  if (!material) {
    const error = new Error("Material not found");
    error.statusCode = 404;
    throw error;
  }

  return material;
}

// ==========================================
// UPDATE
// ==========================================

export async function updateMaterialService(id, data) {
  if (!id) {
    const error = new Error("Material ID is required");
    error.statusCode = 400;
    throw error;
  }

  const validationError = validateMaterial(data);

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  // Make sure the material actually exists
  const existingMaterial = await getMaterialById(id);

  if (!existingMaterial) {
    const error = new Error("Material not found");
    error.statusCode = 404;
    throw error;
  }

  const material = prepareMaterial(data);

  await updateMaterial(id, material);

  // Return the updated material
  return await getMaterialById(id);
}

// ==========================================
// DELETE
// ==========================================

export async function deleteMaterialService(id) {
  if (!id) {
    const error = new Error("Material ID is required");
    error.statusCode = 400;
    throw error;
  }

  const existingMaterial = await getMaterialById(id);

  if (!existingMaterial) {
    const error = new Error("Material not found");
    error.statusCode = 404;
    throw error;
  }

  await deleteMaterial(id);

  return true;
}