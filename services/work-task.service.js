import { WorkTaskRepository } from "../repositories/work-task.repository";

export const WorkTaskService = {
    async createTask(data) {
        const name = String(data?.name || "").trim();
        const unit = data?.unit
            ? String(data.unit).trim()
            : null;

        const defaultPrice = Number(data?.defaultPrice);

        if (!name) {
            throw new Error("Task name is required");
        }

        if (!Number.isFinite(defaultPrice) || defaultPrice < 0) {
            throw new Error("Default price must be a valid non-negative number");
        }

        const exists = await WorkTaskRepository.taskNameExists(name);

        if (exists) {
            throw new Error("A task with this name already exists");
        }

        return WorkTaskRepository.createTask({
            name,
            unit,
            defaultPrice,
        });
    },

    async getTask(id) {
        const taskId = Number(id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            throw new Error("Invalid task ID");
        }

        const task = await WorkTaskRepository.getTaskById(taskId);

        if (!task) {
            throw new Error("Task not found");
        }

        return task;
    },

    async getTasks(options = {}) {
        const page = Math.max(
            1,
            Number.parseInt(options.page, 10) || 1
        );

        const limit = Math.min(
            100,
            Math.max(
                1,
                Number.parseInt(options.limit, 10) || 20
            )
        );

        const search = String(options.search || "").trim();

        return WorkTaskRepository.getTasks({
            page,
            limit,
            search,
        });
    },

    async updateTask(id, data) {
        const taskId = Number(id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            throw new Error("Invalid task ID");
        }

        const existing = await WorkTaskRepository.getTaskById(taskId);

        if (!existing) {
            throw new Error("Task not found");
        }

        const updateData = {};

        if (data.name !== undefined) {
            const name = String(data.name).trim();

            if (!name) {
                throw new Error("Task name cannot be empty");
            }

            const exists = await WorkTaskRepository.taskNameExists(
                name,
                taskId
            );

            if (exists) {
                throw new Error("A task with this name already exists");
            }

            updateData.name = name;
        }

        if (data.unit !== undefined) {
            updateData.unit = data.unit
                ? String(data.unit).trim()
                : null;
        }

        if (data.defaultPrice !== undefined) {
            const defaultPrice = Number(data.defaultPrice);

            if (
                !Number.isFinite(defaultPrice) ||
                defaultPrice < 0
            ) {
                throw new Error(
                    "Default price must be a valid non-negative number"
                );
            }

            updateData.defaultPrice = defaultPrice;
        }

        return WorkTaskRepository.updateTask(
            taskId,
            updateData
        );
    },

    async deleteTask(id) {
        const taskId = Number(id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            throw new Error("Invalid task ID");
        }

        const existing = await WorkTaskRepository.getTaskById(taskId);

        if (!existing) {
            throw new Error("Task not found");
        }

        await WorkTaskRepository.deleteTask(taskId);

        return {
            success: true,
            message: "Task deleted successfully",
        };
    },
};