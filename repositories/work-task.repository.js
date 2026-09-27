import { db } from "@/lib/db";

export const WorkTaskRepository = {
    async createTask({ name, unit, defaultPrice }) {
        const [result] = await db.execute(
            `
            INSERT INTO work_tasks (
                name,
                unit,
                default_price
            )
            VALUES (?, ?, ?)
            `,
            [name, unit || null, defaultPrice]
        );

        return this.getTaskById(result.insertId);
    },

    async getTaskById(id) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                name,
                unit,
                default_price AS defaultPrice,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM work_tasks
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return rows[0] || null;
    },

    async getTasks({
        page = 1,
        limit = 20,
        search = "",
    } = {}) {
        const offset = (page - 1) * limit;

        const conditions = [];
        const params = [];

        if (search?.trim()) {
            conditions.push(`name LIKE ?`);
            params.push(`%${search.trim()}%`);
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const [countRows] = await db.execute(
            `
        SELECT COUNT(*) AS total
        FROM work_tasks
        ${whereClause}
        `,
            params
        );

        const total = Number(countRows[0]?.total || 0);

        const [rows] = await db.execute(
            `
        SELECT
            id,
            name,
            unit,
            default_price AS defaultPrice,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM work_tasks
        ${whereClause}
        ORDER BY created_at DESC, id DESC
        LIMIT ${Number(limit)} OFFSET ${Number(offset)}
        `,
            params
        );

        return {
            data: rows.map((row) => ({
                ...row,
                defaultPrice: Number(row.defaultPrice || 0),
            })),

            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPreviousPage: page > 1,
            },
        };
    },

    async updateTask(id, { name, unit, defaultPrice }) {
        const fields = [];
        const params = [];

        if (name !== undefined) {
            fields.push(`name = ?`);
            params.push(name);
        }

        if (unit !== undefined) {
            fields.push(`unit = ?`);
            params.push(unit || null);
        }

        if (defaultPrice !== undefined) {
            fields.push(`default_price = ?`);
            params.push(defaultPrice);
        }

        if (!fields.length) {
            return this.getTaskById(id);
        }

        params.push(id);

        await db.execute(
            `
            UPDATE work_tasks
            SET ${fields.join(", ")}
            WHERE id = ?
            `,
            params
        );

        return this.getTaskById(id);
    },

    async deleteTask(id) {
        const [result] = await db.execute(
            `
            DELETE FROM work_tasks
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows > 0;
    },

    async taskNameExists(name, excludeId = null) {
        const params = [name];

        let query = `
            SELECT id
            FROM work_tasks
            WHERE LOWER(name) = LOWER(?)
        `;

        if (excludeId !== null) {
            query += ` AND id != ?`;
            params.push(excludeId);
        }

        query += ` LIMIT 1`;

        const [rows] = await db.execute(query, params);

        return rows.length > 0;
    },
};