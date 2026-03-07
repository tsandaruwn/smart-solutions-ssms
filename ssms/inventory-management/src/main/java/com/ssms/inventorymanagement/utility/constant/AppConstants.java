package com.ssms.inventorymanagement.utility.constant;

public final class AppConstants {

    public static final String API_BASE = "/api/v1";

    public static final String INVENTORY_PATH = API_BASE + "/inventory";

    public static final String WAREHOUSE_PATH = API_BASE + "/warehouses";

    public static final String STOCK_OPERATION_PATTERN = "^(INCREASE|DECREASE|SET)$";

    public static final String STOCK_OP_INCREASE = "INCREASE";
    public static final String STOCK_OP_DECREASE = "DECREASE";
    public static final String STOCK_OP_SET       = "SET";

    public static final int DEFAULT_REORDER_LEVEL    = 10;

    public static final int DEFAULT_REORDER_QUANTITY = 50;

    private AppConstants() {
        throw new UnsupportedOperationException("Utility class — do not instantiate");
    }
}
