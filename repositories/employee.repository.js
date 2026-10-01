import { db } from "@/lib/db";

export const EmployeeRepository = {
    async createEmployee({
        name,
        phone,
        weeklyPayment,
        defaultRestDay,
    }) {
        const [result] = await db.execute(
            `
            INSERT INTO employees (
                name,
                phone,
                weekly_payment,
                default_rest_day
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                name,
                phone,
                weeklyPayment,
                defaultRestDay,
            ]
        );

        return this.getEmployeeById(result.insertId);
    },

    async getEmployeeById(id) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                name,
                phone,
                weekly_payment AS weeklyPayment,
                default_rest_day AS defaultRestDay,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM employees
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return rows[0] || null;
    },

    async getEmployees() {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                name,
                phone,
                weekly_payment AS weeklyPayment,
                default_rest_day AS defaultRestDay,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM employees
            ORDER BY name ASC, id ASC
            `
        );

        return rows.map((row) => ({
            ...row,
            weeklyPayment: Number(row.weeklyPayment || 0),
        }));
    },

    async updateEmployee(
        id,
        {
            name,
            phone,
            weeklyPayment,
            defaultRestDay,
        }
    ) {
        const fields = [];
        const params = [];

        if (name !== undefined) {
            fields.push(`name = ?`);
            params.push(name);
        }

        if (phone !== undefined) {
            fields.push(`phone = ?`);
            params.push(phone);
        }

        if (weeklyPayment !== undefined) {
            fields.push(`weekly_payment = ?`);
            params.push(weeklyPayment);
        }

        if (defaultRestDay !== undefined) {
            fields.push(`default_rest_day = ?`);
            params.push(defaultRestDay);
        }

        if (!fields.length) {
            return this.getEmployeeById(id);
        }

        params.push(id);

        await db.execute(
            `
            UPDATE employees
            SET ${fields.join(", ")}
            WHERE id = ?
            `,
            params
        );

        return this.getEmployeeById(id);
    },

    async deleteEmployee(id) {
        const [result] = await db.execute(
            `
            DELETE FROM employees
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows > 0;
    },
};