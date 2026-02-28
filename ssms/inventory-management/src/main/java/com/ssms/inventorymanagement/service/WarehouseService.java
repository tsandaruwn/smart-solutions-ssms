package com.ssms.inventorymanagement.service;

import com.ssms.inventorymanagement.dto.request.WarehouseRequest;
import com.ssms.inventorymanagement.dto.response.WarehouseResponse;

import java.util.List;

/**
 * Service contract for warehouse management operations.
 *
 * <p>All methods work with DTOs; the implementing class is responsible for
 * mapping between DTOs and JPA entities.
 */
public interface WarehouseService {

    /**
     * Creates a new warehouse from the supplied request.
     *
     * @param request the warehouse data
     * @return the persisted warehouse as a response DTO
     */
    WarehouseResponse createWarehouse(WarehouseRequest request);

    /**
     * Retrieves all active warehouses.
     *
     * @return list of active warehouse response DTOs
     */
    List<WarehouseResponse> getAllWarehouses();

    /**
     * Retrieves a single active warehouse by its ID.
     *
     * @param warehouseId the primary key of the warehouse
     * @return the matched warehouse as a response DTO
     */
    WarehouseResponse getWarehouseById(Long warehouseId);

    /**
     * Updates an existing warehouse with the supplied data.
     *
     * @param warehouseId the ID of the warehouse to update
     * @param request     the new values
     * @return the updated warehouse as a response DTO
     */
    WarehouseResponse updateWarehouse(Long warehouseId, WarehouseRequest request);

    /**
     * Soft-deactivates a warehouse by setting {@code is_active = false}.
     * Physical deletion is not supported to preserve audit history.
     *
     * @param warehouseId the ID of the warehouse to deactivate
     */
    void deactivateWarehouse(Long warehouseId);
}
