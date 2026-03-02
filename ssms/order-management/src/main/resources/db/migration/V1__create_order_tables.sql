-- =============================================================
-- V1 : Create Order Management tables
-- Matches ER Diagram 1.5 – ORDER + ORDER_ITEM
-- =============================================================

-- 1. Create the order_status type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
    END IF;
END
$$;

-- 2. ORDER table (Purchase Record)
CREATE TABLE IF NOT EXISTS "order" (
    order_id            SERIAL          PRIMARY KEY,
    order_number        VARCHAR(30)     NOT NULL UNIQUE,
    customer_id         INT,
    created_by_user_id  INT,
    order_date          TIMESTAMP       NOT NULL DEFAULT NOW(),
    status              VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    shipping_address    TEXT,
    shipping_city       VARCHAR(80),
    total_amount        DECIMAL(12, 2)  DEFAULT 0.00,
    notes               TEXT,
    cancelled_at        TIMESTAMP,
    cancellation_reason TEXT,
    updated_at          TIMESTAMP       DEFAULT NOW()
);

-- Index for fast customer history lookups
CREATE INDEX IF NOT EXISTS idx_order_customer_id
    ON "order" (customer_id);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_order_status
    ON "order" (status);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_order_order_date
    ON "order" (order_date DESC);

-- 3. ORDER_ITEM table (Line Item)
CREATE TABLE IF NOT EXISTS order_item (
    order_item_id       SERIAL          PRIMARY KEY,
    order_id            INT             NOT NULL
        REFERENCES "order" (order_id) ON DELETE CASCADE,
    product_id          INT             NOT NULL,
    quantity            INT             NOT NULL CHECK (quantity > 0),
    unit_price_at_order DECIMAL(10, 2)  NOT NULL,
    discount_percent    DECIMAL(5, 2)   NOT NULL DEFAULT 0.00
        CHECK (discount_percent >= 0 AND discount_percent <= 100),
    line_total          DECIMAL(12, 2)  GENERATED ALWAYS AS (
        ROUND(unit_price_at_order * quantity * (1 - discount_percent / 100), 2)
    ) STORED
);

-- Index for FK lookups
CREATE INDEX IF NOT EXISTS idx_order_item_order_id
    ON order_item (order_id);

-- Index for product lookups
CREATE INDEX IF NOT EXISTS idx_order_item_product_id
    ON order_item (product_id);

-- 4. Trigger to auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_order_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_updated_at ON "order";
CREATE TRIGGER trg_order_updated_at
    BEFORE UPDATE ON "order"
    FOR EACH ROW
    EXECUTE FUNCTION update_order_updated_at();
