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

@RestController
@RequestMapping(AppConstants.INVENTORY_PATH)
@RequiredArgsConstructor
@Tag(name = "Inventory Management", description = "Endpoints for tracking and managing product stock")
public class InventoryController {

    private final InventoryService inventoryService;

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

    @GetMapping
    @Operation(
            summary     = "Get all inventory records",
            description = "Returns all active (non-deleted) inventory records across all warehouses."
    )
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getAllInventory() {
        List<InventoryResponse> response = inventoryService.getAllInventory();
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_LIST_RETRIEVED, response);
    }

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

    @GetMapping("/alerts/low-stock")
    @Operation(
            summary     = "Get low-stock alerts",
            description = "Returns all inventory records where quantity_on_hand <= reorder_level."
    )
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getLowStockAlerts() {
        List<InventoryResponse> response = inventoryService.getLowStockAlerts();
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_LOW_STOCK, response);
    }

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
