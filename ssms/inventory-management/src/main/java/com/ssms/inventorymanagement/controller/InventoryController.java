package com.ssms.inventorymanagement.controller;

import com.ssms.inventorymanagement.dto.ApiResponse;
import com.ssms.inventorymanagement.dto.request.InventoryRequest;
import com.ssms.inventorymanagement.dto.request.StockUpdateRequest;
import com.ssms.inventorymanagement.dto.response.InventoryResponse;
import com.ssms.inventorymanagement.service.InventoryService;
import com.ssms.inventorymanagement.utility.ResponseUtil;
import com.ssms.inventorymanagement.utility.constant.AppConstants;
import com.ssms.inventorymanagement.utility.constant.ResponseMessages;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing inventory management endpoints.
 *
 * <p>Covers all five system requirements:
 * <ul>
 *   <li>Track stock quantities per product</li>
 *   <li>Update inventory on order placement ({@code DECREASE} operation)</li>
 *   <li>Generate low-stock alerts</li>
 *   <li>Manage warehouse stock records (full CRUD)</li>
 *   <li>Allow inventory record deletion (soft delete)</li>
 * </ul>
 *
 * <p>Base path: {@code /api/v1/inventory}
 */
@RestController
@RequestMapping(AppConstants.INVENTORY_PATH)
@RequiredArgsConstructor
@Tag(name = "Inventory Management", description = "Endpoints for tracking and managing product stock")
public class InventoryController {

    private final InventoryService inventoryService;

    // ─────────────────────────────────────────────────────────────────────
    // POST /api/v1/inventory
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Creates a new inventory record.
     *
     * @param request validated inventory data
     * @return 201 Created with the persisted record
     */
    @PostMapping
    @Operation(
            summary     = "Create an inventory record",
            description = "Registers a product-warehouse stock entry. " +
                          "Each product can have at most one record per warehouse."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error or duplicate entry"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Warehouse not found")
    })
    public ResponseEntity<ApiResponse<InventoryResponse>> createInventory(
            @Valid @RequestBody InventoryRequest request) {

        InventoryResponse response = inventoryService.createInventory(request);
        return ResponseUtil.success(HttpStatus.CREATED, ResponseMessages.INVENTORY_CREATED, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // GET /api/v1/inventory
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Returns all non-deleted inventory records.
     *
     * @return 200 OK with the full inventory list
     */
    @GetMapping
    @Operation(
            summary     = "Get all inventory records",
            description = "Returns all active (non-deleted) inventory records across all warehouses."
    )
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getAllInventory() {
        List<InventoryResponse> response = inventoryService.getAllInventory();
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_LIST_RETRIEVED, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // GET /api/v1/inventory/{id}
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Returns a single inventory record by its primary key.
     *
     * @param id the inventory record ID
     * @return 200 OK or 404 if not found
     */
    @GetMapping("/{id}")
    @Operation(
            summary     = "Get an inventory record by ID",
            description = "Returns the non-deleted inventory record matching the given ID."
    )
    public ResponseEntity<ApiResponse<InventoryResponse>> getInventoryById(
            @Parameter(description = "Inventory record ID", required = true)
            @PathVariable Long id) {

        InventoryResponse response = inventoryService.getInventoryById(id);
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_RETRIEVED, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // GET /api/v1/inventory/product/{productId}
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Returns all inventory records for a given product across all warehouses.
     *
     * @param productId the product ID (cross-service reference)
     * @return 200 OK with matching records
     */
    @GetMapping("/product/{productId}")
    @Operation(
            summary     = "Get inventory by product",
            description = "Returns all warehouse stock entries for the given product ID."
    )
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getInventoryByProduct(
            @Parameter(description = "Product ID", required = true)
            @PathVariable Long productId) {

        List<InventoryResponse> response = inventoryService.getInventoryByProductId(productId);
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_LIST_RETRIEVED, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // GET /api/v1/inventory/warehouse/{warehouseId}
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Returns all inventory records inside a specific warehouse.
     *
     * @param warehouseId the warehouse ID
     * @return 200 OK with matching records
     */
    @GetMapping("/warehouse/{warehouseId}")
    @Operation(
            summary     = "Get inventory by warehouse",
            description = "Returns all stock entries for the given warehouse."
    )
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getInventoryByWarehouse(
            @Parameter(description = "Warehouse ID", required = true)
            @PathVariable Long warehouseId) {

        List<InventoryResponse> response = inventoryService.getInventoryByWarehouseId(warehouseId);
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_LIST_RETRIEVED, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // PUT /api/v1/inventory/{id}
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Updates the reorder thresholds and metadata of an inventory record.
     * Use {@code PATCH /{id}/stock} to adjust the physical quantity.
     *
     * @param id      inventory record ID
     * @param request updated values
     * @return 200 OK with the updated record
     */
    @PutMapping("/{id}")
    @Operation(
            summary     = "Update inventory record metadata",
            description = "Updates reorder level and reorder quantity. To change the stock count, " +
                          "use the stock-update endpoint."
    )
    public ResponseEntity<ApiResponse<InventoryResponse>> updateInventory(
            @Parameter(description = "Inventory record ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody InventoryRequest request) {

        InventoryResponse response = inventoryService.updateInventory(id, request);
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_UPDATED, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // PATCH /api/v1/inventory/{id}/stock
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Adjusts the stock quantity of an existing inventory record.
     *
     * <p>Supported operations:
     * <ul>
     *   <li>{@code INCREASE} — triggered by a restock / delivery</li>
     *   <li>{@code DECREASE} — triggered by an order placement</li>
     *   <li>{@code SET}      — direct override from a physical count</li>
     * </ul>
     *
     * @param id      inventory record ID
     * @param request contains the quantity and operation type
     * @return 200 OK with the updated record
     */
    @PatchMapping("/{id}/stock")
    @Operation(
            summary     = "Update stock quantity",
            description = "Increases, decreases, or directly sets the quantity on hand. " +
                          "Used when an order is placed (DECREASE) or stock is delivered (INCREASE)."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Stock updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Insufficient stock or invalid operation"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Inventory record not found")
    })
    public ResponseEntity<ApiResponse<InventoryResponse>> updateStock(
            @Parameter(description = "Inventory record ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody StockUpdateRequest request) {

        InventoryResponse response = inventoryService.updateStock(id, request);
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_STOCK_UPDATED, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // GET /api/v1/inventory/alerts/low-stock
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Returns all inventory records that are at or below their reorder level.
     *
     * @return 200 OK with the list of low-stock items
     */
    @GetMapping("/alerts/low-stock")
    @Operation(
            summary     = "Get low-stock alerts",
            description = "Returns all inventory records where quantity_on_hand <= reorder_level."
    )
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getLowStockAlerts() {
        List<InventoryResponse> response = inventoryService.getLowStockAlerts();
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_LOW_STOCK, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // GET /api/v1/inventory/alerts/low-stock/warehouse/{warehouseId}
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Returns low-stock items filtered by warehouse.
     *
     * @param warehouseId the warehouse to filter by
     * @return 200 OK with matching low-stock records
     */
    @GetMapping("/alerts/low-stock/warehouse/{warehouseId}")
    @Operation(
            summary     = "Get low-stock alerts by warehouse",
            description = "Returns low-stock records scoped to the given warehouse."
    )
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getLowStockAlertsByWarehouse(
            @Parameter(description = "Warehouse ID", required = true)
            @PathVariable Long warehouseId) {

        List<InventoryResponse> response = inventoryService.getLowStockAlertsByWarehouse(warehouseId);
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_LOW_STOCK, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // DELETE /api/v1/inventory/{id}
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Soft-deletes an inventory record (sets is_deleted = true).
     *
     * @param id the inventory record ID
     * @return 200 OK with confirmation
     */
    @DeleteMapping("/{id}")
    @Operation(
            summary     = "Delete an inventory record",
            description = "Marks the inventory record as deleted. The row is retained for historical purposes."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteInventory(
            @Parameter(description = "Inventory record ID", required = true)
            @PathVariable Long id) {

        inventoryService.deleteInventory(id);
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_DELETED);
    }
}

