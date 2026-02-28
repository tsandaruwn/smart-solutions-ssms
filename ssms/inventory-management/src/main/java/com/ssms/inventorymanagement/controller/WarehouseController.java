package com.ssms.inventorymanagement.controller;

import com.ssms.inventorymanagement.dto.ApiResponse;
import com.ssms.inventorymanagement.dto.request.WarehouseRequest;
import com.ssms.inventorymanagement.dto.response.WarehouseResponse;
import com.ssms.inventorymanagement.service.WarehouseService;
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
 * REST controller exposing CRUD endpoints for {@code Warehouse} resources.
 *
 * <p>Base path: {@code /api/v1/warehouses}
 */
@RestController
@RequestMapping(AppConstants.WAREHOUSE_PATH)
@RequiredArgsConstructor
@Tag(name = "Warehouse Management", description = "Endpoints for managing warehouse locations")
public class WarehouseController {

    private final WarehouseService warehouseService;

    // ─────────────────────────────────────────────────────────────────────
    // POST /api/v1/warehouses
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Creates a new warehouse.
     *
     * @param request validated warehouse data from the request body
     * @return 201 Created with the persisted warehouse
     */
    @PostMapping
    @Operation(
            summary     = "Create a new warehouse",
            description = "Registers a new storage location. The warehouse name must be unique."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Warehouse created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error or duplicate name"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<WarehouseResponse>> createWarehouse(
            @Valid @RequestBody WarehouseRequest request) {

        WarehouseResponse response = warehouseService.createWarehouse(request);
        return ResponseUtil.success(HttpStatus.CREATED, ResponseMessages.WAREHOUSE_CREATED, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // GET /api/v1/warehouses
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Retrieves all active warehouses.
     *
     * @return 200 OK with a list of active warehouses
     */
    @GetMapping
    @Operation(
            summary     = "Get all active warehouses",
            description = "Returns a list of all warehouses with is_active = true."
    )
    public ResponseEntity<ApiResponse<List<WarehouseResponse>>> getAllWarehouses() {
        List<WarehouseResponse> response = warehouseService.getAllWarehouses();
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.WAREHOUSES_RETRIEVED, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // GET /api/v1/warehouses/{id}
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Retrieves a single warehouse by its ID.
     *
     * @param id the warehouse primary key
     * @return 200 OK with the warehouse, or 404 if not found
     */
    @GetMapping("/{id}")
    @Operation(
            summary     = "Get a warehouse by ID",
            description = "Returns the active warehouse matching the given ID."
    )
    public ResponseEntity<ApiResponse<WarehouseResponse>> getWarehouseById(
            @Parameter(description = "Warehouse ID", required = true)
            @PathVariable Long id) {

        WarehouseResponse response = warehouseService.getWarehouseById(id);
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.WAREHOUSE_RETRIEVED, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // PUT /api/v1/warehouses/{id}
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Updates an existing warehouse.
     *
     * @param id      the warehouse primary key
     * @param request validated replacement data
     * @return 200 OK with the updated warehouse
     */
    @PutMapping("/{id}")
    @Operation(
            summary     = "Update a warehouse",
            description = "Replaces the warehouse data for the given ID."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Warehouse updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Warehouse not found")
    })
    public ResponseEntity<ApiResponse<WarehouseResponse>> updateWarehouse(
            @Parameter(description = "Warehouse ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody WarehouseRequest request) {

        WarehouseResponse response = warehouseService.updateWarehouse(id, request);
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.WAREHOUSE_UPDATED, response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // DELETE /api/v1/warehouses/{id}
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Soft-deactivates a warehouse (sets is_active = false).
     *
     * @param id the warehouse primary key
     * @return 200 OK with confirmation message
     */
    @DeleteMapping("/{id}")
    @Operation(
            summary     = "Deactivate a warehouse",
            description = "Marks the warehouse as inactive. The record is retained for audit purposes."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Warehouse deactivated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Warehouse not found")
    })
    public ResponseEntity<ApiResponse<Void>> deactivateWarehouse(
            @Parameter(description = "Warehouse ID", required = true)
            @PathVariable Long id) {

        warehouseService.deactivateWarehouse(id);
        return ResponseUtil.success(HttpStatus.OK, ResponseMessages.WAREHOUSE_DEACTIVATED);
    }
}
