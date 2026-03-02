-- ============================================================
-- V1: Create warehouse table
-- ============================================================

CREATE TABLE IF NOT EXISTS warehouse (
    warehouse_id   SERIAL          PRIMARY KEY,
    name           VARCHAR(100)    NOT NULL,
    address        TEXT,
    city           VARCHAR(80),
    country        VARCHAR(80),
    manager_user_id INT,                         -- FK to USER service (cross-service reference)
    contact_phone  VARCHAR(20),
    capacity       INT,
    is_active      BOOLEAN         NOT NULL DEFAULT TRUE
);

-- Index for quick lookup by city / country
CREATE INDEX IF NOT EXISTS idx_warehouse_city    ON warehouse (city);
CREATE INDEX IF NOT EXISTS idx_warehouse_country ON warehouse (country);
CREATE INDEX IF NOT EXISTS idx_warehouse_active  ON warehouse (is_active);
