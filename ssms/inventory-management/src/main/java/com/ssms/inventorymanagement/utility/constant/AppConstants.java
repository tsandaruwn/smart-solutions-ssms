package com.ssms.inventorymanagement.utility.constant;

/**
 * Application-wide constants for the Inventory Management microservice.
 *
 * <p>Usage of constants ensures that magic strings and numbers have a single
 * authoritative definition. All fields are {@code public static final}.
 */
public final class AppConstants {

    // ─────────────────────────────────────────────────────────────────────
    // API path prefixes
    // ─────────────────────────────────────────────────────────────────────

    /** Root API path prefix. */
    public static final String API_BASE = "/api/v1";

    /** Inventory resource path. */
    public static final String INVENTORY_PATH = API_BASE + "/inventory";

    /** Warehouse resource path. */
    public static final String WAREHOUSE_PATH = API_BASE + "/warehouses";

    // ─────────────────────────────────────────────────────────────────────
    // Stock operation
    // ─────────────────────────────────────────────────────────────────────

    /** Regex pattern for allowed stock operation types (used in @Pattern). */
    public static final String STOCK_OPERATION_PATTERN = "^(INCREASE|DECREASE|SET)$";

    public static final String STOCK_OP_INCREASE = "INCREASE";
    public static final String STOCK_OP_DECREASE = "DECREASE";
    public static final String STOCK_OP_SET       = "SET";

    // ─────────────────────────────────────────────────────────────────────
    // Defaults
    // ─────────────────────────────────────────────────────────────────────

    /** Default reorder level applied when none is specified in the request. */
    public static final int DEFAULT_REORDER_LEVEL    = 10;

    /** Default reorder quantity applied when none is specified in the request. */
    public static final int DEFAULT_REORDER_QUANTITY = 50;

    // ─────────────────────────────────────────────────────────────────────
    // Prevent instantiation
    // ─────────────────────────────────────────────────────────────────────

    private AppConstants() {
        throw new UnsupportedOperationException("Utility class — do not instantiate");
    }
}
