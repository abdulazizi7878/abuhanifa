import { EmployeeRepository } from "@/repositories/employee.repository";

const REST_DAYS = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
];

function parseId(id) {
    const value = Number(id);

    if (!Number.isInteger(value) || value <= 0) {
        throw new Error("Invalid employee ID");
    }

    return value;
}

function parseMoney(value) {
    const number = Number(value);

    if (!Number.isFinite(number) || number < 0) {
        throw new Error("Weekly payment must be a valid non-negative number");
    }

    return number;
}

function validateRestDay(day) {
    if (!REST_DAYS.includes(day)) {
        throw new Error("Invalid rest day");
    }

    return day;
}

export const EmployeeService = {
    async createEmployee(data = {}) {
        const name = String(data.name || "").trim();
        const phone = String(data.phone || "").trim();

        if (!name) {
            throw new Error("Employee name is required");
        }

        if (!phone) {
            throw new Error("Phone number is required");
        }

        const weeklyPayment = parseMoney(
            data.weeklyPayment
        );

        const defaultRestDay = validateRestDay(
            data.defaultRestDay
        );

        return EmployeeRepository.createEmployee({
            name,
            phone,
            weeklyPayment,
            defaultRestDay,
        });
    },

    async getEmployee(id) {
        const employeeId = parseId(id);

        const employee =
            await EmployeeRepository.getEmployeeById(
                employeeId
            );

        if (!employee) {
            throw new Error("Employee not found");
        }

        return employee;
    },

    async getEmployees() {
        return EmployeeRepository.getEmployees();
    },

    async updateEmployee(id, data = {}) {
        const employeeId = parseId(id);

        await this.getEmployee(employeeId);

        const updates = {};

        if (data.name !== undefined) {
            const name = String(data.name).trim();

            if (!name) {
                throw new Error("Employee name is required");
            }

            updates.name = name;
        }

        if (data.phone !== undefined) {
            const phone = String(data.phone).trim();

            if (!phone) {
                throw new Error("Phone number is required");
            }

            updates.phone = phone;
        }

        if (data.weeklyPayment !== undefined) {
            updates.weeklyPayment =
                parseMoney(data.weeklyPayment);
        }

        if (data.defaultRestDay !== undefined) {
            updates.defaultRestDay =
                validateRestDay(data.defaultRestDay);
        }

        return EmployeeRepository.updateEmployee(
            employeeId,
            updates
        );
    },

    async deleteEmployee(id) {
        const employeeId = parseId(id);

        await this.getEmployee(employeeId);

        return EmployeeRepository.deleteEmployee(
            employeeId
        );
    },
};