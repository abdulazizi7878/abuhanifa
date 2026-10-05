CREATE TABLE payment_receivers (
    id INT NOT NULL AUTO_INCREMENT,

    customer_name VARCHAR(250) NOT NULL,
    customer_phone VARCHAR(50) NULL,
    customer_location VARCHAR(500) NULL,

    job_type VARCHAR(250) NOT NULL,

    contract_link VARCHAR(1000) NULL,
    site_photo_link VARCHAR(1000) NULL,
    site_plan_link VARCHAR(1000) NULL,

    total_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    INDEX idx_payment_receivers_customer_name (customer_name),
    INDEX idx_payment_receivers_customer_phone (customer_phone),
    INDEX idx_payment_receivers_job_type (job_type),
    INDEX idx_payment_receivers_created_at (created_at)
);

CREATE TABLE payment_receiver_payments (
    id INT NOT NULL AUTO_INCREMENT,

    payment_receiver_id INT NOT NULL,

    payment_stage ENUM(
        'kabd',
        'first',
        'second',
        'third',
        'fourth',
        'fifth'
    ) NOT NULL,

    amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,

    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    receipt_link VARCHAR(1000) NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_payment_receiver_stage (
        payment_receiver_id,
        payment_stage
    ),

    INDEX idx_payment_receiver_payments_receiver (
        payment_receiver_id
    ),

    INDEX idx_payment_receiver_payments_date (
        payment_date
    ),

    CONSTRAINT fk_payment_receiver_payments_receiver
        FOREIGN KEY (payment_receiver_id)
        REFERENCES payment_receivers(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);