-- ============================================================
-- V2: Create inventory table
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory (
    inventory_id         SERIAL          PRIMARY KEY,
    product_id           INT             NOT NULL,               -- cross-service FK → PRODUCT
    warehouse_id         INT             NOT NULL REFERENCES warehouse (warehouse_id) ON DELETE RESTRICT,
    quantity_on_hand     INT             NOT NULL DEFAULT 0,
    reorder_level        INT             NOT NULL DEFAULT 10,
    reorder_quantity     INT             NOT NULL DEFAULT 50,
    low_stock_alert_sent BOOLEAN         NOT NULL DEFAULT FALSE,
    last_restocked_at    TIMESTAMP,
    updated_at           TIMESTAMP       NOT NULL DEFAULT NOW(),
    is_deleted           BOOLEAN         NOT NULL DEFAULT FALSE,

    -- A product can exist only once per warehouse
    CONSTRAINT uq_inventory_product_warehouse UNIQUE (product_id, warehouse_id),

    -- Quantity must be non-negative
    CONSTRAINT chk_quantity_non_negative CHECK (quantity_on_hand >= 0),
    CONSTRAINT chk_reorder_level_positive CHECK (reorder_level  >= 0)
);

-- Indexes for frequent query patterns
CREATE INDEX IF NOT EXISTS idx_inventory_product_id   ON inventory (product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_id ON inventory (warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock    ON inventory (quantity_on_hand, reorder_level) WHERE is_deleted = FALSE;
