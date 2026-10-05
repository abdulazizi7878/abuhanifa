import crypto from "crypto";
import ContractRepository from "../repositories/contract.repository";

const ContractService = {
    generatePublicToken() {
        return crypto.randomBytes(32).toString("hex");
    },

    parseId(id) {
        const parsedId = Number(id);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            throw new Error("Invalid contract ID");
        }

        return parsedId;
    },

    validateStatus(status) {
        const allowedStatuses = ["draft", "published"];

        if (!allowedStatuses.includes(status)) {
            throw new Error("Invalid contract status");
        }

        return status;
    },

    async createContract(data) {
        if (!data.customerName?.trim()) {
            throw new Error("Customer name is required");
        }

        if (!data.contractDate) {
            throw new Error("Contract date is required");
        }

        if (!data.mainTitle?.trim()) {
            throw new Error("Main title is required");
        }

        return ContractRepository.createContract({
            ...data,
            customerName: data.customerName.trim(),
            customerPhone: data.customerPhone?.trim() || null,
            customerAddress: data.customerAddress?.trim() || null,
            mainTitle: data.mainTitle.trim(),
            publicToken: this.generatePublicToken(),
            status: "draft",
        });
    },

    async getContract(id) {
        const contractId = this.parseId(id);

        const contract = await ContractRepository.getContractById(
            contractId
        );

        if (!contract) {
            throw new Error("Contract not found");
        }

        return contract;
    },

    async getContracts(options = {}) {
        return ContractRepository.getContracts(options);
    },

    async updateContract(id, data) {
        const contractId = this.parseId(id);

        const existingContract =
            await ContractRepository.getContractById(contractId);

        if (!existingContract) {
            throw new Error("Contract not found");
        }

        if (!data.customerName?.trim()) {
            throw new Error("Customer name is required");
        }

        if (!data.contractDate) {
            throw new Error("Contract date is required");
        }

        if (!data.mainTitle?.trim()) {
            throw new Error("Main title is required");
        }

        return ContractRepository.updateContract(contractId, {
            ...data,
            customerName: data.customerName.trim(),
            customerPhone: data.customerPhone?.trim() || null,
            customerAddress: data.customerAddress?.trim() || null,
            mainTitle: data.mainTitle.trim(),
        });
    },

    async publishContract(id) {
        const contractId = this.parseId(id);

        const contract =
            await ContractRepository.getContractById(contractId);

        if (!contract) {
            throw new Error("Contract not found");
        }

        return ContractRepository.updateStatus(
            contractId,
            "published"
        );
    },

    async unpublishContract(id) {
        const contractId = this.parseId(id);

        const contract =
            await ContractRepository.getContractById(contractId);

        if (!contract) {
            throw new Error("Contract not found");
        }

        return ContractRepository.updateStatus(
            contractId,
            "draft"
        );
    },

    async updatePdf(id, pdfUrl, pdfPublicId) {
        const contractId = this.parseId(id);

        const contract =
            await ContractRepository.getContractById(contractId);

        if (!contract) {
            throw new Error("Contract not found");
        }

        if (!pdfUrl) {
            throw new Error("PDF URL is required");
        }

        return ContractRepository.updatePdf(
            contractId,
            pdfUrl,
            pdfPublicId || null
        );
    },

    async duplicateContract(id) {
        const contractId = this.parseId(id);

        const contract =
            await ContractRepository.getContractById(contractId);

        if (!contract) {
            throw new Error("Contract not found");
        }

        return ContractRepository.duplicateContract(
            contractId,
            this.generatePublicToken()
        );
    },

    async deleteContract(id) {
        const contractId = this.parseId(id);

        const contract =
            await ContractRepository.getContractById(contractId);

        if (!contract) {
            throw new Error("Contract not found");
        }

        return ContractRepository.deleteContract(contractId);
    },

    async getPublicContract(publicToken) {
        if (!publicToken?.trim()) {
            throw new Error("Public token is required");
        }

        const contract =
            await ContractRepository.getContractByPublicToken(
                publicToken.trim()
            );

        if (!contract) {
            throw new Error("Contract not found");
        }

        if (contract.status !== "published") {
            throw new Error("Contract is not published");
        }

        return contract;
    },
};

export default ContractService;