package com.ssms.inventorymanagement.service;

import com.ssms.inventorymanagement.dto.request.WarehouseRequest;
import com.ssms.inventorymanagement.dto.response.WarehouseResponse;

import java.util.List;

public interface WarehouseService {

    WarehouseResponse createWarehouse(WarehouseRequest request);

    List<WarehouseResponse> getAllWarehouses();

    WarehouseResponse getWarehouseById(Long warehouseId);

    WarehouseResponse updateWarehouse(Long warehouseId, WarehouseRequest request);

    void deactivateWarehouse(Long warehouseId);
}
