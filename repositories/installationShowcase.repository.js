import { db } from "@/lib/db";

// file: repositories/installationShowcase.repository.js
export async function CreateInstallationShowcase(
    image,
    publicId,
    resourceType = "image"
) {
    const [result] = await db.query(
        `
        INSERT INTO installation_showcase (
            image,
            public_id,
            resource_type
        )
        VALUES (?, ?, ?)
        `,
        [image, publicId, resourceType]
    );

    return {
        id: result.insertId,
        image,
        public_id: publicId,
        resource_type: resourceType,
    };
}

export async function GetInstallationShowcases() {
    const [rows] = await db.query(
        `
        SELECT
            id,
            image,
            public_id,
            resource_type,
            created_at
        FROM installation_showcase
        ORDER BY created_at DESC, id DESC
        `
    );

    return rows;
}

export async function GetInstallationShowcaseById(id) {
    const [rows] = await db.query(
        `
        SELECT
            id,
            image,
            public_id,
            resource_type,
            created_at
        FROM installation_showcase
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];
}

export async function DeleteInstallationShowcase(id) {
    const [result] = await db.query(
        `
        DELETE FROM installation_showcase
        WHERE id = ?
        `,
        [id]
    );

    return result;
}