import { db } from "@/lib/db";

export const WorkEstimationRepository = {
    async createEstimation(
        { projectName, description },
        connection = db
    ) {
        const [result] = await connection.execute(
            `
            INSERT INTO work_estimations (
                project_name,
                description
            )
            VALUES (?, ?)
            `,
            [
                projectName,
                description || null,
            ]
        );

        return result.insertId;
    },

    async getEstimationById(id) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                project_name AS projectName,
                description,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM work_estimations
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return rows[0] || null;
    },

    async getEstimations({
        page = 1,
        limit = 20,
        search = "",
    } = {}) {
        const offset = (page - 1) * limit;

        const conditions = [];
        const params = [];

        if (search?.trim()) {
            conditions.push(`project_name LIKE ?`);
            params.push(`%${search.trim()}%`);
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const [countRows] = await db.execute(
            `
        SELECT COUNT(*) AS total
        FROM work_estimations
        ${whereClause}
        `,
            params
        );

        const total = Number(countRows[0]?.total || 0);

        const [rows] = await db.execute(
            `
        SELECT
            we.id,
            we.project_name AS projectName,
            we.description,
            we.created_at AS createdAt,
            we.updated_at AS updatedAt,

            COALESCE(
                (
                    SELECT SUM(wet.total_price)
                    FROM work_estimation_tasks wet
                    WHERE wet.estimation_id = we.id
                ),
                0
            ) AS grandTotal,

            (
                SELECT COUNT(*)
                FROM work_estimation_tasks wet
                WHERE wet.estimation_id = we.id
            ) AS taskCount,

            (
                SELECT COUNT(*)
                FROM work_estimation_coworkers wec
                WHERE wec.estimation_id = we.id
            ) AS coworkerCount

        FROM work_estimations we

        ${whereClause}

        ORDER BY
            we.created_at DESC,
            we.id DESC

        LIMIT ${Number(limit)} OFFSET ${Number(offset)}
        `,
            params
        );

        return {
            data: rows.map((row) => ({
                ...row,
                grandTotal: Number(row.grandTotal || 0),
                taskCount: Number(row.taskCount || 0),
                coworkerCount: Number(row.coworkerCount || 0),
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
    async updateEstimation(
        id,
        { projectName, description }
    ) {
        const fields = [];
        const params = [];

        if (projectName !== undefined) {
            fields.push(`project_name = ?`);
            params.push(projectName);
        }

        if (description !== undefined) {
            fields.push(`description = ?`);
            params.push(description || null);
        }

        if (!fields.length) {
            return this.getEstimationById(id);
        }

        params.push(id);

        await db.execute(
            `
            UPDATE work_estimations
            SET ${fields.join(", ")}
            WHERE id = ?
            `,
            params
        );

        return this.getEstimationById(id);
    },

    async deleteEstimation(id) {
        const [result] = await db.execute(
            `
            DELETE FROM work_estimations
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows > 0;
    },

    async getEstimationTasks(estimationId) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                estimation_id AS estimationId,
                task_name AS taskName,
                unit,
                single_price AS singlePrice,
                quantity,
                total_price AS totalPrice,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM work_estimation_tasks
            WHERE estimation_id = ?
            ORDER BY id ASC
            `,
            [estimationId]
        );

        return rows.map((row) => ({
            ...row,
            singlePrice: Number(row.singlePrice),
            quantity: Number(row.quantity),
            totalPrice: Number(row.totalPrice),
        }));
    },

    async getEstimationTaskById(id) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                estimation_id AS estimationId,
                task_name AS taskName,
                unit,
                single_price AS singlePrice,
                quantity,
                total_price AS totalPrice,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM work_estimation_tasks
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (!rows[0]) return null;

        return {
            ...rows[0],
            singlePrice: Number(rows[0].singlePrice),
            quantity: Number(rows[0].quantity),
            totalPrice: Number(rows[0].totalPrice),
        };
    },

    async addEstimationTask(
        estimationId,
        {
            taskName,
            unit,
            singlePrice,
            quantity,
            totalPrice,
        },
        connection = db
    ) {
        const [result] = await connection.execute(
            `
            INSERT INTO work_estimation_tasks (
                estimation_id,
                task_name,
                unit,
                single_price,
                quantity,
                total_price
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                estimationId,
                taskName,
                unit || null,
                singlePrice,
                quantity,
                totalPrice,
            ]
        );

        return result.insertId;
    },

    async updateEstimationTask(
        id,
        {
            taskName,
            unit,
            singlePrice,
            quantity,
            totalPrice,
        }
    ) {
        const fields = [];
        const params = [];

        if (taskName !== undefined) {
            fields.push(`task_name = ?`);
            params.push(taskName);
        }

        if (unit !== undefined) {
            fields.push(`unit = ?`);
            params.push(unit || null);
        }

        if (singlePrice !== undefined) {
            fields.push(`single_price = ?`);
            params.push(singlePrice);
        }

        if (quantity !== undefined) {
            fields.push(`quantity = ?`);
            params.push(quantity);
        }

        if (totalPrice !== undefined) {
            fields.push(`total_price = ?`);
            params.push(totalPrice);
        }

        if (!fields.length) {
            return this.getEstimationTaskById(id);
        }

        params.push(id);

        await db.execute(
            `
            UPDATE work_estimation_tasks
            SET ${fields.join(", ")}
            WHERE id = ?
            `,
            params
        );

        return this.getEstimationTaskById(id);
    },

    async deleteEstimationTask(id) {
        const [result] = await db.execute(
            `
            DELETE FROM work_estimation_tasks
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows > 0;
    },

    async getCoworkers(estimationId) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                estimation_id AS estimationId,
                coworker_name AS coworkerName,
                created_at AS createdAt
            FROM work_estimation_coworkers
            WHERE estimation_id = ?
            ORDER BY id ASC
            `,
            [estimationId]
        );

        return rows;
    },

    async getCoworkerById(id) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                estimation_id AS estimationId,
                coworker_name AS coworkerName,
                created_at AS createdAt
            FROM work_estimation_coworkers
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return rows[0] || null;
    },

    async addCoworker(
        estimationId,
        coworkerName,
        connection = db
    ) {
        const [result] = await connection.execute(
            `
            INSERT INTO work_estimation_coworkers (
                estimation_id,
                coworker_name
            )
            VALUES (?, ?)
            `,
            [
                estimationId,
                coworkerName,
            ]
        );

        return result.insertId;
    },

    async updateCoworker(id, coworkerName) {
        await db.execute(
            `
            UPDATE work_estimation_coworkers
            SET coworker_name = ?
            WHERE id = ?
            `,
            [
                coworkerName,
                id,
            ]
        );

        return this.getCoworkerById(id);
    },

    async deleteCoworker(id) {
        const [result] = await db.execute(
            `
            DELETE FROM work_estimation_coworkers
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows > 0;
    },

    async getFullEstimation(id) {
        const estimation = await this.getEstimationById(id);

        if (!estimation) {
            return null;
        }

        const [tasks, coworkers] = await Promise.all([
            this.getEstimationTasks(id),
            this.getCoworkers(id),
        ]);

        const grandTotal = tasks.reduce(
            (sum, task) => sum + Number(task.totalPrice),
            0
        );

        return {
            ...estimation,
            tasks,
            coworkers,
            grandTotal,
        };
    },

    async duplicateEstimation(sourceId) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [estimationRows] = await connection.execute(
                `
                SELECT
                    project_name,
                    description
                FROM work_estimations
                WHERE id = ?
                LIMIT 1
                `,
                [sourceId]
            );

            if (!estimationRows[0]) {
                throw new Error("Estimation not found");
            }

            const source = estimationRows[0];

            const [estimationResult] = await connection.execute(
                `
                INSERT INTO work_estimations (
                    project_name,
                    description
                )
                VALUES (?, ?)
                `,
                [
                    `${source.project_name} - Copy`,
                    source.description,
                ]
            );

            const newEstimationId =
                estimationResult.insertId;

            await connection.execute(
                `
                INSERT INTO work_estimation_tasks (
                    estimation_id,
                    task_name,
                    unit,
                    single_price,
                    quantity,
                    total_price
                )
                SELECT
                    ?,
                    task_name,
                    unit,
                    single_price,
                    quantity,
                    total_price
                FROM work_estimation_tasks
                WHERE estimation_id = ?
                `,
                [
                    newEstimationId,
                    sourceId,
                ]
            );

            await connection.execute(
                `
                INSERT INTO work_estimation_coworkers (
                    estimation_id,
                    coworker_name
                )
                SELECT
                    ?,
                    coworker_name
                FROM work_estimation_coworkers
                WHERE estimation_id = ?
                `,
                [
                    newEstimationId,
                    sourceId,
                ]
            );

            await connection.commit();

            return newEstimationId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
};