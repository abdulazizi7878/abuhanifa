import PaymentReceiverRepository from "../repositories/payment-receiver.repository";

const PaymentReceiverService = {
    parseId(id) {
        const parsedId = Number(id);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            throw new Error("Invalid payment receiver ID");
        }

        return parsedId;
    },

    validatePaymentStage(paymentStage) {
        const allowedStages = [
            "kabd",
            "first",
            "second",
            "third",
            "fourth",
            "fifth",
        ];

        if (!allowedStages.includes(paymentStage)) {
            throw new Error("Invalid payment stage");
        }

        return paymentStage;
    },

    validateAmount(amount, fieldName = "Amount") {
        const parsedAmount = Number(amount);

        if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
            throw new Error(`${fieldName} must be a valid positive amount`);
        }

        return parsedAmount;
    },

    validateDate(date) {
        if (!date) {
            throw new Error("Payment date is required");
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            throw new Error("Invalid payment date");
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");
        const hours = String(parsedDate.getHours()).padStart(2, "0");
        const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
        const seconds = String(parsedDate.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    validateTotalPrice(totalPrice) {
        const parsedPrice = Number(totalPrice);

        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            throw new Error("Total price must be a valid amount");
        }

        return parsedPrice;
    },

    validateRequiredJobData(data) {
        if (!data.customerName?.trim()) {
            throw new Error("Customer name is required");
        }

        if (!data.jobType?.trim()) {
            throw new Error("Job type is required");
        }
    },

    async createPaymentReceiver(data) {
        this.validateRequiredJobData(data);

        const totalPrice = this.validateTotalPrice(data.totalPrice);

        const payments = Array.isArray(data.payments)
            ? data.payments
            : [];

        const seenStages = new Set();

        for (const payment of payments) {
            const paymentStage = this.validatePaymentStage(
                payment.paymentStage
            );

            if (seenStages.has(paymentStage)) {
                throw new Error(
                    `Payment stage "${paymentStage}" can only be entered once`
                );
            }

            seenStages.add(paymentStage);

            this.validateAmount(
                payment.amount,
                `${paymentStage} payment`
            );

            this.validateDate(payment.paymentDate);

            if (Number(payment.amount) > totalPrice) {
                throw new Error(
                    `${paymentStage} payment cannot exceed the total job price`
                );
            }
        }

        const totalPaid = payments.reduce(
            (sum, payment) => sum + Number(payment.amount),
            0
        );

        if (totalPaid > totalPrice) {
            throw new Error(
                "Total paid cannot exceed the total job price"
            );
        }

        return PaymentReceiverRepository.createPaymentReceiver({
            ...data,
            customerName: data.customerName.trim(),
            customerPhone: data.customerPhone?.trim() || null,
            customerLocation:
                data.customerLocation?.trim() || null,
            jobType: data.jobType.trim(),
            contractLink: data.contractLink?.trim() || null,
            sitePhotoLink: data.sitePhotoLink?.trim() || null,
            sitePlanLink: data.sitePlanLink?.trim() || null,
            totalPrice,
            payments,
        });
    },

    async getPaymentReceiver(id) {
        const paymentReceiverId = this.parseId(id);

        const receiver =
            await PaymentReceiverRepository.getPaymentReceiverById(
                paymentReceiverId
            );

        if (!receiver) {
            throw new Error("Payment receiver record not found");
        }

        return receiver;
    },

    async getPaymentReceivers() {
        return PaymentReceiverRepository.getPaymentReceivers();
    },

    async updatePaymentReceiver(id, data) {
        const paymentReceiverId = this.parseId(id);

        const existing =
            await PaymentReceiverRepository.getPaymentReceiverById(
                paymentReceiverId
            );

        if (!existing) {
            throw new Error("Payment receiver record not found");
        }

        this.validateRequiredJobData(data);

        const totalPrice = this.validateTotalPrice(data.totalPrice);

        if (existing.totalPaid > totalPrice) {
            throw new Error(
                "Total price cannot be lower than the amount already paid"
            );
        }

        return PaymentReceiverRepository.updatePaymentReceiver(
            paymentReceiverId,
            {
                ...data,
                customerName: data.customerName.trim(),
                customerPhone: data.customerPhone?.trim() || null,
                customerLocation:
                    data.customerLocation?.trim() || null,
                jobType: data.jobType.trim(),
                contractLink: data.contractLink?.trim() || null,
                sitePhotoLink: data.sitePhotoLink?.trim() || null,
                sitePlanLink: data.sitePlanLink?.trim() || null,
                totalPrice,
            }
        );
    },

    async addPayment(id, data) {
        const paymentReceiverId = this.parseId(id);

        const receiver =
            await PaymentReceiverRepository.getPaymentReceiverById(
                paymentReceiverId
            );

        if (!receiver) {
            throw new Error("Payment receiver record not found");
        }

        const paymentStage = this.validatePaymentStage(
            data.paymentStage
        );

        const amount = this.validateAmount(data.amount);

        if (amount <= 0) {
            throw new Error("Payment amount must be greater than zero");
        }

        const paymentDate = this.validateDate(data.paymentDate);

        if (receiver.totalPaid + amount > receiver.totalPrice) {
            throw new Error(
                "Payment would exceed the total job price"
            );
        }

        return PaymentReceiverRepository.addPayment(
            paymentReceiverId,
            {
                paymentStage,
                amount,
                paymentDate,
                receiptLink: data.receiptLink?.trim() || null,
            }
        );
    },

    async updatePayment(paymentId, data) {
        const parsedPaymentId = this.parseId(paymentId);

        const amount = this.validateAmount(data.amount);

        if (amount <= 0) {
            throw new Error("Payment amount must be greater than zero");
        }

        const paymentDate = this.validateDate(data.paymentDate);

        return PaymentReceiverRepository.updatePayment(
            parsedPaymentId,
            {
                amount,
                paymentDate,
                receiptLink: data.receiptLink?.trim() || null,
            }
        );
    },

    async deletePayment(paymentId) {
        const parsedPaymentId = this.parseId(paymentId);

        const deleted =
            await PaymentReceiverRepository.deletePayment(
                parsedPaymentId
            );

        if (!deleted) {
            throw new Error("Payment not found");
        }

        return true;
    },

    async deletePaymentReceiver(id) {
        const paymentReceiverId = this.parseId(id);

        const existing =
            await PaymentReceiverRepository.getPaymentReceiverById(
                paymentReceiverId
            );

        if (!existing) {
            throw new Error("Payment receiver record not found");
        }

        return PaymentReceiverRepository.deletePaymentReceiver(
            paymentReceiverId
        );
    },
};

export default PaymentReceiverService;