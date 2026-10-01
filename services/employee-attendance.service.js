import { EmployeeRepository } from "@/repositories/employee.repository";
import { EmployeeAttendanceRepository } from "@/repositories/employee-attendance.repository";

const DAYS = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
];

const STATUSES = [
    "present",
    "absent",
    "rest",
];

function parseId(id) {
    const value = Number(id);

    if (!Number.isInteger(value) || value <= 0) {
        throw new Error("Invalid employee ID");
    }

    return value;
}

function parseDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error("Invalid date");
    }

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
        throw new Error("Invalid date");
    }

    return parsed;
}

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

function getSaturdayWeek(dateString) {
    const date = parseDate(dateString);

    const jsDay = date.getDay();
    // JS:
    // Sunday = 0
    // Monday = 1
    // ...
    // Saturday = 6

    const daysSinceSaturday =
        (jsDay + 1) % 7;

    const saturday = new Date(date);

    saturday.setDate(
        saturday.getDate() - daysSinceSaturday
    );

    const friday = new Date(saturday);

    friday.setDate(
        friday.getDate() + 6
    );

    return {
        startDate: formatDate(saturday),
        endDate: formatDate(friday),
    };
}

function getDays(startDate) {
    const start = parseDate(startDate);

    return DAYS.map((dayName, index) => {
        const date = new Date(start);

        date.setDate(
            date.getDate() + index
        );

        return {
            dayName,
            date: formatDate(date),
        };
    });
}

function getDayName(dateString) {
    const date = parseDate(dateString);

    return DAYS[
        (date.getDay() + 1) % 7
    ];
}

export const EmployeeAttendanceService = {
    async getWeek(date) {
        const { startDate, endDate } =
            getSaturdayWeek(date);

        const days = getDays(startDate);

        const rows =
            await EmployeeAttendanceRepository.getWeekAttendance(
                startDate,
                endDate
            );

        const employees =
            await EmployeeRepository.getEmployees();

        return {
            week: {
                startDate,
                endDate,
                days,
            },

            employees: employees.map((employee) => {
                const employeeRows = rows.filter(
                    (row) =>
                        Number(row.employeeId) ===
                        Number(employee.id)
                );

                const attendance = {};

                days.forEach((day) => {
                    const saved = employeeRows.find(
                        (row) =>
                            row.attendanceDate
                                ?.toISOString
                                ? row.attendanceDate
                                    .toISOString()
                                    .slice(0, 10) ===
                                day.date
                                : String(
                                    row.attendanceDate
                                ).slice(0, 10) ===
                                day.date
                    );

                    if (saved) {
                        attendance[day.date] =
                            saved.status;
                    } else if (
                        employee.defaultRestDay ===
                        day.dayName
                    ) {
                        attendance[day.date] = "rest";
                    } else {
                        attendance[day.date] = "absent";
                    }
                });

                return {
                    id: employee.id,
                    name: employee.name,
                    phone: employee.phone,
                    weeklyPayment:
                        employee.weeklyPayment,
                    defaultRestDay:
                        employee.defaultRestDay,
                    attendance,
                };
            }),
        };
    },

    async saveAttendance(data = {}) {
        const employeeId = parseId(
            data.employeeId
        );

        const employee =
            await EmployeeRepository.getEmployeeById(
                employeeId
            );

        if (!employee) {
            throw new Error("Employee not found");
        }

        const attendanceDate = String(
            data.attendanceDate || ""
        );

        parseDate(attendanceDate);

        const status = String(
            data.status || ""
        ).toLowerCase();

        if (!STATUSES.includes(status)) {
            throw new Error("Invalid attendance status");
        }

        return EmployeeAttendanceRepository.saveAttendance(
            employeeId,
            attendanceDate,
            status
        );
    },
};