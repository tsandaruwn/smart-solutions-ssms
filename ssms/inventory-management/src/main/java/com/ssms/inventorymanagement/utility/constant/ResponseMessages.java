package com.ssms.inventorymanagement.utility.constant;

public final class ResponseMessages {

    public static final String WAREHOUSE_CREATED          = "Warehouse created successfully";
    public static final String WAREHOUSE_RETRIEVED        = "Warehouse retrieved successfully";
    public static final String WAREHOUSES_RETRIEVED       = "Warehouses retrieved successfully";
    public static final String WAREHOUSE_UPDATED          = "Warehouse updated successfully";
    public static final String WAREHOUSE_DEACTIVATED      = "Warehouse deactivated successfully";
    public static final String WAREHOUSE_NOT_FOUND        = "Warehouse not found with ID: ";
    public static final String WAREHOUSE_NAME_EXISTS      = "A warehouse with this name already exists: ";
    public static final String WAREHOUSE_INACTIVE         = "Warehouse is not active with ID: ";

    public static final String INVENTORY_CREATED          = "Inventory record created successfully";
    public static final String INVENTORY_RETRIEVED        = "Inventory record retrieved successfully";
    public static final String INVENTORY_LIST_RETRIEVED   = "Inventory records retrieved successfully";
    public static final String INVENTORY_UPDATED          = "Inventory record updated successfully";
    public static final String INVENTORY_DELETED          = "Inventory record deleted successfully";
    public static final String INVENTORY_NOT_FOUND        = "Inventory record not found with ID: ";
    public static final String INVENTORY_STOCK_UPDATED    = "Stock quantity updated successfully";
    public static final String INVENTORY_LOW_STOCK        = "Low-stock items retrieved successfully";
    public static final String INVENTORY_ALREADY_EXISTS   = "An inventory record already exists for this product in the specified warehouse";
    public static final String INVENTORY_INSUFFICIENT_STOCK = "Insufficient stock: requested quantity exceeds available stock";

    public static final String VALIDATION_FAILED          = "Request validation failed";
    public static final String INTERNAL_SERVER_ERROR      = "An unexpected error occurred. Please try again later.";
    public static final String RESOURCE_NOT_FOUND         = "The requested resource was not found";

    private ResponseMessages() {
        throw new UnsupportedOperationException("Utility class — do not instantiate");
    }
}
