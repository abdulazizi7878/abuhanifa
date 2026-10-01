import { db } from "@/lib/db";

export const EmployeeAttendanceRepository = {
    async getWeekAttendance(startDate, endDate) {
        const [rows] = await db.execute(
            `
            SELECT
                e.id AS employeeId,
                e.name,
                e.phone,
                e.weekly_payment AS weeklyPayment,
                e.default_rest_day AS defaultRestDay,

                ea.attendance_date AS attendanceDate,
                ea.status

            FROM employees e

            LEFT JOIN employee_attendance ea
                ON ea.employee_id = e.id
                AND ea.attendance_date BETWEEN ? AND ?

            ORDER BY
                e.name ASC,
                ea.attendance_date ASC
            `,
            [startDate, endDate]
        );

        return rows.map((row) => ({
            ...row,
            weeklyPayment: Number(row.weeklyPayment || 0),
        }));
    },

    async saveAttendance(
        employeeId,
        attendanceDate,
        status
    ) {
        await db.execute(
            `
            INSERT INTO employee_attendance (
                employee_id,
                attendance_date,
                status
            )
            VALUES (?, ?, ?)

            ON DUPLICATE KEY UPDATE
                status = VALUES(status),
                updated_at = CURRENT_TIMESTAMP
            `,
            [
                employeeId,
                attendanceDate,
                status,
            ]
        );

        return this.getAttendance(
            employeeId,
            attendanceDate
        );
    },

    async getAttendance(
        employeeId,
        attendanceDate
    ) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                employee_id AS employeeId,
                attendance_date AS attendanceDate,
                status,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM employee_attendance
            WHERE employee_id = ?
              AND attendance_date = ?
            LIMIT 1
            `,
            [
                employeeId,
                attendanceDate,
            ]
        );

        return rows[0] || null;
    },
};