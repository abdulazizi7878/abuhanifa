import { db } from "@/lib/db";

const PaymentReceiverRepository = {
    async createPaymentReceiver(data) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                `
                INSERT INTO payment_receivers (
                    customer_name,
                    customer_phone,
                    customer_location,
                    job_type,
                    contract_link,
                    site_photo_link,
                    site_plan_link,
                    total_price
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    data.customerName,
                    data.customerPhone || null,
                    data.customerLocation || null,
                    data.jobType,
                    data.contractLink || null,
                    data.sitePhotoLink || null,
                    data.sitePlanLink || null,
                    data.totalPrice,
                ]
            );

            const paymentReceiverId = result.insertId;

            if (Array.isArray(data.payments)) {
                for (const payment of data.payments) {
                    await connection.execute(
                        `
                        INSERT INTO payment_receiver_payments (
                            payment_receiver_id,
                            payment_stage,
                            amount,
                            payment_date,
                            receipt_link
                        )
                        VALUES (?, ?, ?, ?, ?)
                        `,
                        [
                            paymentReceiverId,
                            payment.paymentStage,
                            payment.amount,
                            payment.paymentDate,
                            payment.receiptLink || null,
                        ]
                    );
                }
            }

            await connection.commit();

            return this.getPaymentReceiverById(paymentReceiverId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async getPaymentReceiverById(id) {
        const [receiverRows] = await db.execute(
            `
            SELECT
                id,
                customer_name AS customerName,
                customer_phone AS customerPhone,
                customer_location AS customerLocation,
                job_type AS jobType,
                contract_link AS contractLink,
                site_photo_link AS sitePhotoLink,
                site_plan_link AS sitePlanLink,
                total_price AS totalPrice,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM payment_receivers
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (!receiverRows[0]) {
            return null;
        }

        const [paymentRows] = await db.execute(
            `
            SELECT
                id,
                payment_receiver_id AS paymentReceiverId,
                payment_stage AS paymentStage,
                amount,
                payment_date AS paymentDate,
                receipt_link AS receiptLink,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM payment_receiver_payments
            WHERE payment_receiver_id = ?
            ORDER BY FIELD(
                payment_stage,
                'kabd',
                'first',
                'second',
                'third',
                'fourth',
                'fifth'
            )
            `,
            [id]
        );

        const receiver = receiverRows[0];

        const totalPaid = paymentRows.reduce(
            (sum, payment) => sum + Number(payment.amount),
            0
        );

        const totalPrice = Number(receiver.totalPrice);

        return {
            ...receiver,
            totalPrice,
            payments: paymentRows.map((payment) => ({
                ...payment,
                amount: Number(payment.amount),
            })),
            totalPaid,
            remaining: totalPrice - totalPaid,
        };
    },

    async getPaymentReceivers() {
        const [rows] = await db.execute(
            `
            SELECT
                pr.id,
                pr.customer_name AS customerName,
                pr.customer_phone AS customerPhone,
                pr.customer_location AS customerLocation,
                pr.job_type AS jobType,
                pr.contract_link AS contractLink,
                pr.site_photo_link AS sitePhotoLink,
                pr.site_plan_link AS sitePlanLink,
                pr.total_price AS totalPrice,
                pr.created_at AS createdAt,
                pr.updated_at AS updatedAt,

                COALESCE(
                    (
                        SELECT SUM(p.amount)
                        FROM payment_receiver_payments p
                        WHERE p.payment_receiver_id = pr.id
                    ),
                    0
                ) AS totalPaid

            FROM payment_receivers pr
            ORDER BY pr.created_at DESC, pr.id DESC
            `
        );

        return rows.map((row) => {
            const totalPrice = Number(row.totalPrice);
            const totalPaid = Number(row.totalPaid);

            return {
                ...row,
                totalPrice,
                totalPaid,
                remaining: totalPrice - totalPaid,
            };
        });
    },

    async addPayment(paymentReceiverId, payment) {
        const [result] = await db.execute(
            `
            INSERT INTO payment_receiver_payments (
                payment_receiver_id,
                payment_stage,
                amount,
                payment_date,
                receipt_link
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                paymentReceiverId,
                payment.paymentStage,
                payment.amount,
                payment.paymentDate,
                payment.receiptLink || null,
            ]
        );

        return result.insertId
            ? this.getPaymentReceiverById(paymentReceiverId)
            : null;
    },

    async updatePayment(paymentId, payment) {
        const [result] = await db.execute(
            `
            UPDATE payment_receiver_payments
            SET
                amount = ?,
                payment_date = ?,
                receipt_link = ?
            WHERE id = ?
            `,
            [
                payment.amount,
                payment.paymentDate,
                payment.receiptLink || null,
                paymentId,
            ]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        const [rows] = await db.execute(
            `
            SELECT
                id,
                payment_receiver_id AS paymentReceiverId,
                payment_stage AS paymentStage,
                amount,
                payment_date AS paymentDate,
                receipt_link AS receiptLink,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM payment_receiver_payments
            WHERE id = ?
            LIMIT 1
            `,
            [paymentId]
        );

        return rows[0] || null;
    },

    async deletePayment(paymentId) {
        const [result] = await db.execute(
            `
            DELETE FROM payment_receiver_payments
            WHERE id = ?
            `,
            [paymentId]
        );

        return result.affectedRows > 0;
    },

    async updatePaymentReceiver(id, data) {
        const [result] = await db.execute(
            `
            UPDATE payment_receivers
            SET
                customer_name = ?,
                customer_phone = ?,
                customer_location = ?,
                job_type = ?,
                contract_link = ?,
                site_photo_link = ?,
                site_plan_link = ?,
                total_price = ?
            WHERE id = ?
            `,
            [
                data.customerName,
                data.customerPhone || null,
                data.customerLocation || null,
                data.jobType,
                data.contractLink || null,
                data.sitePhotoLink || null,
                data.sitePlanLink || null,
                data.totalPrice,
                id,
            ]
        );

        return result.affectedRows > 0
            ? this.getPaymentReceiverById(id)
            : null;
    },

    async deletePaymentReceiver(id) {
        const [result] = await db.execute(
            `
            DELETE FROM payment_receivers
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows > 0;
    },
};

export default PaymentReceiverRepository;