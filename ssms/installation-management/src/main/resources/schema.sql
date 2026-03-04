-- Technician table creation
CREATE TABLE IF NOT EXISTS technicians (
    technician_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    specialization VARCHAR(100) NOT NULL,
    certification_number VARCHAR(50) NOT NULL,
    availability_status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    phone VARCHAR(20),
    hired_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Installation table creation
CREATE TABLE IF NOT EXISTS installations (
    installation_id SERIAL PRIMARY KEY,
    job_reference VARCHAR(30) NOT NULL UNIQUE,
    order_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    technician_id INTEGER NOT NULL,
    scheduled_by_user_id INTEGER,
    scheduled_date TIMESTAMP NOT NULL,
    completed_date TIMESTAMP,
    installation_address TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    technician_notes TEXT,
    cancellation_reason TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_technician FOREIGN KEY (technician_id) REFERENCES technicians(technician_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_technician_user_id ON technicians(user_id);
CREATE INDEX IF NOT EXISTS idx_technician_specialization ON technicians(specialization);
CREATE INDEX IF NOT EXISTS idx_technician_availability_status ON technicians(availability_status);
CREATE INDEX IF NOT EXISTS idx_technician_is_active ON technicians(is_active);

CREATE INDEX IF NOT EXISTS idx_installation_job_reference ON installations(job_reference);
CREATE INDEX IF NOT EXISTS idx_installation_order_id ON installations(order_id);
CREATE INDEX IF NOT EXISTS idx_installation_customer_id ON installations(customer_id);
CREATE INDEX IF NOT EXISTS idx_installation_technician_id ON installations(technician_id);
CREATE INDEX IF NOT EXISTS idx_installation_scheduled_date ON installations(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_installation_status ON installations(status);
CREATE INDEX IF NOT EXISTS idx_installation_is_deleted ON installations(is_deleted);
