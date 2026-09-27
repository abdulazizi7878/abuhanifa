import { WorkEstimationRepository } from "../repositories/work-estimation.repository";
import { WorkTaskRepository } from "../repositories/work-task.repository";

function parseId(id, fieldName = "ID") {
    const value = Number(id);

    if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`Invalid ${fieldName}`);
    }

    return value;
}

function parseMoney(value, fieldName) {
    const number = Number(value);

    if (!Number.isFinite(number) || number < 0) {
        throw new Error(
            `${fieldName} must be a valid non-negative number`
        );
    }

    return number;
}

function parseQuantity(value) {
    const quantity = Number(value);

    if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error(
            "Quantity must be greater than zero"
        );
    }

    return quantity;
}

export const WorkEstimationService = {
    async createEstimation(data) {
        const projectName = String(
            data?.projectName || ""
        ).trim();

        const description = data?.description
            ? String(data.description).trim()
            : null;

        if (!projectName) {
            throw new Error("Project name is required");
        }

        const id =
            await WorkEstimationRepository.createEstimation({
                projectName,
                description,
            });

        return WorkEstimationRepository.getFullEstimation(id);
    },

    async getEstimation(id) {
        const estimationId = parseId(
            id,
            "estimation ID"
        );

        const estimation =
            await WorkEstimationRepository.getFullEstimation(
                estimationId
            );

        if (!estimation) {
            throw new Error("Estimation not found");
        }

        return estimation;
    },

    async getEstimations(options = {}) {
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

        const search = String(
            options.search || ""
        ).trim();

        return WorkEstimationRepository.getEstimations({
            page,
            limit,
            search,
        });
    },

    async updateEstimation(id, data) {
        const estimationId = parseId(
            id,
            "estimation ID"
        );

        const existing =
            await WorkEstimationRepository.getEstimationById(
                estimationId
            );

        if (!existing) {
            throw new Error("Estimation not found");
        }

        const updateData = {};

        if (data.projectName !== undefined) {
            const projectName =
                String(data.projectName).trim();

            if (!projectName) {
                throw new Error(
                    "Project name cannot be empty"
                );
            }

            updateData.projectName = projectName;
        }

        if (data.description !== undefined) {
            updateData.description =
                data.description
                    ? String(data.description).trim()
                    : null;
        }

        await WorkEstimationRepository.updateEstimation(
            estimationId,
            updateData
        );

        return WorkEstimationRepository.getFullEstimation(
            estimationId
        );
    },

    async deleteEstimation(id) {
        const estimationId = parseId(
            id,
            "estimation ID"
        );

        const existing =
            await WorkEstimationRepository.getEstimationById(
                estimationId
            );

        if (!existing) {
            throw new Error("Estimation not found");
        }

        await WorkEstimationRepository.deleteEstimation(
            estimationId
        );

        return {
            success: true,
            message: "Estimation deleted successfully",
        };
    },

    async addTask(estimationId, data) {
        const id = parseId(
            estimationId,
            "estimation ID"
        );

        const estimation =
            await WorkEstimationRepository.getEstimationById(
                id
            );

        if (!estimation) {
            throw new Error("Estimation not found");
        }

        const taskName = String(
            data?.taskName || ""
        ).trim();

        if (!taskName) {
            throw new Error("Task name is required");
        }

        const unit = data?.unit
            ? String(data.unit).trim()
            : null;

        const singlePrice = parseMoney(
            data?.singlePrice,
            "Single price"
        );

        const quantity = parseQuantity(
            data?.quantity
        );

        const totalPrice =
            singlePrice * quantity;

        const taskId =
            await WorkEstimationRepository.addEstimationTask(
                id,
                {
                    taskName,
                    unit,
                    singlePrice,
                    quantity,
                    totalPrice,
                }
            );

        return WorkEstimationRepository.getEstimationTaskById(
            taskId
        );
    },

    async addTaskFromLibrary(
        estimationId,
        taskId,
        quantity = 1
    ) {
        const estimationIdValue = parseId(
            estimationId,
            "estimation ID"
        );

        const libraryTaskId = parseId(
            taskId,
            "task ID"
        );

        const estimation =
            await WorkEstimationRepository.getEstimationById(
                estimationIdValue
            );

        if (!estimation) {
            throw new Error("Estimation not found");
        }

        const task =
            await WorkTaskRepository.getTaskById(
                libraryTaskId
            );

        if (!task) {
            throw new Error("Task not found");
        }

        const validQuantity =
            parseQuantity(quantity);

        const singlePrice =
            Number(task.defaultPrice);

        const totalPrice =
            singlePrice * validQuantity;

        const newTaskId =
            await WorkEstimationRepository.addEstimationTask(
                estimationIdValue,
                {
                    taskName: task.name,
                    unit: task.unit,
                    singlePrice,
                    quantity: validQuantity,
                    totalPrice,
                }
            );

        return WorkEstimationRepository.getEstimationTaskById(
            newTaskId
        );
    },

    async updateTask(taskId, data) {
        const id = parseId(
            taskId,
            "estimation task ID"
        );

        const existing =
            await WorkEstimationRepository.getEstimationTaskById(
                id
            );

        if (!existing) {
            throw new Error(
                "Estimation task not found"
            );
        }

        const updateData = {};

        const taskName =
            data.taskName !== undefined
                ? String(data.taskName).trim()
                : existing.taskName;

        if (!taskName) {
            throw new Error("Task name cannot be empty");
        }

        const unit =
            data.unit !== undefined
                ? (
                    data.unit
                        ? String(data.unit).trim()
                        : null
                )
                : existing.unit;

        const singlePrice =
            data.singlePrice !== undefined
                ? parseMoney(
                    data.singlePrice,
                    "Single price"
                )
                : Number(existing.singlePrice);

        const quantity =
            data.quantity !== undefined
                ? parseQuantity(data.quantity)
                : Number(existing.quantity);

        updateData.taskName = taskName;
        updateData.unit = unit;
        updateData.singlePrice = singlePrice;
        updateData.quantity = quantity;

        // Always recalculate.
        updateData.totalPrice =
            singlePrice * quantity;

        await WorkEstimationRepository.updateEstimationTask(
            id,
            updateData
        );

        return WorkEstimationRepository.getEstimationTaskById(
            id
        );
    },

    async deleteTask(taskId) {
        const id = parseId(
            taskId,
            "estimation task ID"
        );

        const existing =
            await WorkEstimationRepository.getEstimationTaskById(
                id
            );

        if (!existing) {
            throw new Error(
                "Estimation task not found"
            );
        }

        await WorkEstimationRepository.deleteEstimationTask(
            id
        );

        return {
            success: true,
            message: "Estimation task deleted successfully",
        };
    },

    async addCoworker(estimationId, name) {
        const id = parseId(
            estimationId,
            "estimation ID"
        );

        const estimation =
            await WorkEstimationRepository.getEstimationById(
                id
            );

        if (!estimation) {
            throw new Error("Estimation not found");
        }

        const coworkerName = String(
            name || ""
        ).trim();

        if (!coworkerName) {
            throw new Error(
                "Coworker name is required"
            );
        }

        const coworkerId =
            await WorkEstimationRepository.addCoworker(
                id,
                coworkerName
            );

        return WorkEstimationRepository.getCoworkerById(
            coworkerId
        );
    },

    async updateCoworker(coworkerId, name) {
        const id = parseId(
            coworkerId,
            "coworker ID"
        );

        const existing =
            await WorkEstimationRepository.getCoworkerById(
                id
            );

        if (!existing) {
            throw new Error("Coworker not found");
        }

        const coworkerName =
            String(name || "").trim();

        if (!coworkerName) {
            throw new Error(
                "Coworker name is required"
            );
        }

        return WorkEstimationRepository.updateCoworker(
            id,
            coworkerName
        );
    },

    async deleteCoworker(coworkerId) {
        const id = parseId(
            coworkerId,
            "coworker ID"
        );

        const existing =
            await WorkEstimationRepository.getCoworkerById(
                id
            );

        if (!existing) {
            throw new Error("Coworker not found");
        }

        await WorkEstimationRepository.deleteCoworker(
            id
        );

        return {
            success: true,
            message: "Coworker deleted successfully",
        };
    },

    async duplicateEstimation(id) {
        const estimationId = parseId(
            id,
            "estimation ID"
        );

        const existing =
            await WorkEstimationRepository.getEstimationById(
                estimationId
            );

        if (!existing) {
            throw new Error("Estimation not found");
        }

        const newId =
            await WorkEstimationRepository.duplicateEstimation(
                estimationId
            );

        return WorkEstimationRepository.getFullEstimation(
            newId
        );
    },
};