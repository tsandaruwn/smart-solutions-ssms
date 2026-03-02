package com.ssms.inventorymanagement.service;

import com.ssms.inventorymanagement.dto.request.InventoryRequest;
import com.ssms.inventorymanagement.dto.request.StockUpdateRequest;
import com.ssms.inventorymanagement.dto.response.InventoryResponse;

import java.util.List;

/**
 * Service contract for inventory management operations.
 *
 * <p>Covers the five core requirements:
 * <ol>
 *   <li>Track stock quantities per product</li>
 *   <li>Update inventory on order placement</li>
 *   <li>Generate low-stock alerts</li>
 *   <li>Manage warehouse stock records</li>
 *   <li>Allow inventory record deletion (soft delete)</li>
 * </ol>
 */
public interface InventoryService {

    /**
     * Creates a new inventory record for a product in a warehouse.
     *
     * @param request the inventory data
     * @return the persisted record as a response DTO
     */
    InventoryResponse createInventory(InventoryRequest request);

    /**
     * Returns all non-deleted inventory records.
     *
     * @return list of active inventory response DTOs
     */
    List<InventoryResponse> getAllInventory();

    /**
     * Returns a single non-deleted inventory record by its primary key.
     *
     * @param inventoryId the primary key
     * @return the matched record as a response DTO
     */
    InventoryResponse getInventoryById(Long inventoryId);

    /**
     * Returns all inventory records for a given product across all warehouses.
     *
     * @param productId the cross-service product reference
     * @return list of matched records as response DTOs
     */
    List<InventoryResponse> getInventoryByProductId(Long productId);

    /**
     * Returns all inventory records inside a specific warehouse.
     *
     * @param warehouseId the warehouse ID
     * @return list of matched records as response DTOs
     */
    List<InventoryResponse> getInventoryByWarehouseId(Long warehouseId);

    /**
     * Updates the metadata (reorder level / reorder quantity) of an existing
     * inventory record. To adjust the actual stock count, use
     * {@link #updateStock(Long, StockUpdateRequest)}.
     *
     * @param inventoryId the ID of the record to update
     * @param request     the new values
     * @return the updated record as a response DTO
     */
    InventoryResponse updateInventory(Long inventoryId, InventoryRequest request);

    /**
     * Adjusts the stock quantity of an inventory record (increase, decrease,
     * or set to an absolute value). Triggered on order placement, restocking,
     * or physical-count corrections.
     *
     * @param inventoryId the ID of the record whose stock is being changed
     * @param request     contains the quantity delta and the operation type
     * @return the updated record as a response DTO
     */
    InventoryResponse updateStock(Long inventoryId, StockUpdateRequest request);

    /**
     * Returns all non-deleted inventory records whose stock is at or below
     * their configured reorder level (i.e. items that need restocking).
     *
     * @return list of low-stock records as response DTOs
     */
    List<InventoryResponse> getLowStockAlerts();

    /**
     * Returns all low-stock records inside a specific warehouse.
     *
     * @param warehouseId the warehouse ID to filter by
     * @return list of low-stock records in that warehouse
     */
    List<InventoryResponse> getLowStockAlertsByWarehouse(Long warehouseId);

    /**
     * Soft-deletes an inventory record by setting {@code is_deleted = true}.
     * Physical deletion is not supported to preserve audit history.
     *
     * @param inventoryId the primary key of the record to delete
     */
    void deleteInventory(Long inventoryId);
}

