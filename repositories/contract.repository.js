// repositories/contract.repository.js

import { db } from "@/lib/db";

const ContractRepository = {
    async createContract(data) {
        const [result] = await db.execute(
            `
            INSERT INTO contracts (
                public_token,
                customer_name,
                customer_phone,
                customer_address,
                contract_date,
                main_title,
                subtitle_1,
                content_1,
                subtitle_2,
                content_2,
                subtitle_3,
                content_3,
                subtitle_4,
                content_4,
                subtitle_5,
                content_5,
                subtitle_6,
                content_6,
                subtitle_7,
                content_7,
                subtitle_7_1,
                content_7_1,
                subtitle_7_2,
                content_7_2,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                data.publicToken,
                data.customerName,
                data.customerPhone || null,
                data.customerAddress || null,
                data.contractDate,
                data.mainTitle,

                data.subtitle1 || null,
                data.content1 || null,

                data.subtitle2 || null,
                data.content2 || null,

                data.subtitle3 || null,
                data.content3 || null,

                data.subtitle4 || null,
                data.content4 || null,

                data.subtitle5 || null,
                data.content5 || null,

                data.subtitle6 || null,
                data.content6 || null,

                data.subtitle7 || null,
                data.content7 || null,

                data.subtitle71 || null,
                data.content71 || null,
                data.subtitle72 || null,
                data.content72 || null,

                data.status || "draft",
            ]
        );

        return this.getContractById(result.insertId);
    },

    async getContractById(id) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                public_token AS publicToken,

                customer_name AS customerName,
                customer_phone AS customerPhone,
                customer_address AS customerAddress,

                contract_date AS contractDate,
                main_title AS mainTitle,

                subtitle_1 AS subtitle1,
                content_1 AS content1,

                subtitle_2 AS subtitle2,
                content_2 AS content2,

                subtitle_3 AS subtitle3,
                content_3 AS content3,

                subtitle_4 AS subtitle4,
                content_4 AS content4,

                subtitle_5 AS subtitle5,
                content_5 AS content5,

                subtitle_6 AS subtitle6,
                content_6 AS content6,

                subtitle_7 AS subtitle7,
                content_7 AS content7,

                subtitle_7_1 AS subtitle71,
                content_7_1 AS content71,

                subtitle_7_2 AS subtitle72,
                content_7_2 AS content72,

                status,

                pdf_url AS pdfUrl,
                pdf_public_id AS pdfPublicId,

                created_at AS createdAt,
                updated_at AS updatedAt

            FROM contracts
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return rows[0] || null;
    },

    async getContractByPublicToken(publicToken) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                public_token AS publicToken,

                customer_name AS customerName,
                customer_phone AS customerPhone,
                customer_address AS customerAddress,

                contract_date AS contractDate,
                main_title AS mainTitle,

                subtitle_1 AS subtitle1,
                content_1 AS content1,

                subtitle_2 AS subtitle2,
                content_2 AS content2,

                subtitle_3 AS subtitle3,
                content_3 AS content3,

                subtitle_4 AS subtitle4,
                content_4 AS content4,

                subtitle_5 AS subtitle5,
                content_5 AS content5,

                subtitle_6 AS subtitle6,
                content_6 AS content6,

                subtitle_7 AS subtitle7,
                content_7 AS content7,

                subtitle_7_1 AS subtitle71,
                content_7_1 AS content71,

                subtitle_7_2 AS subtitle72,
                content_7_2 AS content72,

                status,

                pdf_url AS pdfUrl,
                pdf_public_id AS pdfPublicId,

                created_at AS createdAt,
                updated_at AS updatedAt

            FROM contracts
            WHERE public_token = ?
            LIMIT 1
            `,
            [publicToken]
        );

        return rows[0] || null;
    },

    async getContracts({
        page = 1,
        limit = 20,
        search = "",
        status = "",
    } = {}) {
        const offset = (page - 1) * limit;

        const conditions = [];
        const params = [];

        if (search?.trim()) {
            conditions.push(`
                (
                    customer_name LIKE ?
                    OR customer_phone LIKE ?
                    OR main_title LIKE ?
                )
            `);

            const searchValue = `%${search.trim()}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue
            );
        }

        if (status?.trim()) {
            conditions.push(`status = ?`);
            params.push(status.trim());
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const [countRows] = await db.execute(
            `
            SELECT COUNT(*) AS total
            FROM contracts
            ${whereClause}
            `,
            params
        );

        const total = Number(countRows[0]?.total || 0);

        const [rows] = await db.execute(
            `
            SELECT
                id,
                public_token AS publicToken,

                customer_name AS customerName,
                customer_phone AS customerPhone,

                contract_date AS contractDate,
                main_title AS mainTitle,

                status,

                pdf_url AS pdfUrl,

                created_at AS createdAt,
                updated_at AS updatedAt

            FROM contracts
            ${whereClause}
            ORDER BY created_at DESC, id DESC
            LIMIT ${Number(limit)} OFFSET ${Number(offset)}
            `,
            params
        );

        return {
            data: rows,
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

    async updateContract(id, data) {
        const [result] = await db.execute(
            `
            UPDATE contracts
            SET
                customer_name = ?,
                customer_phone = ?,
                customer_address = ?,
                contract_date = ?,
                main_title = ?,

                subtitle_1 = ?,
                content_1 = ?,

                subtitle_2 = ?,
                content_2 = ?,

                subtitle_3 = ?,
                content_3 = ?,

                subtitle_4 = ?,
                content_4 = ?,

                subtitle_5 = ?,
                content_5 = ?,

                subtitle_6 = ?,
                content_6 = ?,

                subtitle_7 = ?,
                content_7 = ?,

                subtitle_7_1 = ?,
                content_7_1 = ?,

                subtitle_7_2 = ?,
                content_7_2 = ?

            WHERE id = ?
            `,
            [
                data.customerName,
                data.customerPhone || null,
                data.customerAddress || null,
                data.contractDate,
                data.mainTitle,

                data.subtitle1 || null,
                data.content1 || null,

                data.subtitle2 || null,
                data.content2 || null,

                data.subtitle3 || null,
                data.content3 || null,

                data.subtitle4 || null,
                data.content4 || null,

                data.subtitle5 || null,
                data.content5 || null,

                data.subtitle6 || null,
                data.content6 || null,

                data.subtitle7 || null,
                data.content7 || null,

                data.subtitle71 || null,
                data.content71 || null,
                data.subtitle72 || null,
                data.content72 || null,
                id,
            ]
        );

        return result.affectedRows > 0
            ? this.getContractById(id)
            : null;
    },

    async updateStatus(id, status) {
        const [result] = await db.execute(
            `
            UPDATE contracts
            SET status = ?
            WHERE id = ?
            `,
            [status, id]
        );

        return result.affectedRows > 0
            ? this.getContractById(id)
            : null;
    },

    async updatePdf(id, pdfUrl, pdfPublicId) {
        const [result] = await db.execute(
            `
            UPDATE contracts
            SET
                pdf_url = ?,
                pdf_public_id = ?
            WHERE id = ?
            `,
            [pdfUrl, pdfPublicId, id]
        );

        return result.affectedRows > 0
            ? this.getContractById(id)
            : null;
    },

    async duplicateContract(id, publicToken) {
        const [result] = await db.execute(
            `
            INSERT INTO contracts (
                public_token,
                customer_name,
                customer_phone,
                customer_address,
                contract_date,
                main_title,

                subtitle_1,
                content_1,
                subtitle_2,
                content_2,
                subtitle_3,
                content_3,
                subtitle_4,
                content_4,
                subtitle_5,
                content_5,
                subtitle_6,
                content_6,
                subtitle_7,
                content_7,
                subtitle_7_1,
                content_7_1,
                subtitle_7_2,
                content_7_2,

                status
            )
            SELECT
                ?,
                customer_name,
                customer_phone,
                customer_address,
                contract_date,
                main_title,

                subtitle_1,
                content_1,
                subtitle_2,
                content_2,
                subtitle_3,
                content_3,
                subtitle_4,
                content_4,
                subtitle_5,
                content_5,
                subtitle_6,
                content_6,
                subtitle_7,
                content_7,
                subtitle_7_1,
                content_7_1,
                subtitle_7_2,
                content_7_2,

                'draft'

            FROM contracts
            WHERE id = ?
            `,
            [publicToken, id]
        );

        return result.affectedRows > 0
            ? this.getContractById(result.insertId)
            : null;
    },

    async deleteContract(id) {
        const [result] = await db.execute(
            `
            DELETE FROM contracts
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows > 0;
    },
};

export default ContractRepository;