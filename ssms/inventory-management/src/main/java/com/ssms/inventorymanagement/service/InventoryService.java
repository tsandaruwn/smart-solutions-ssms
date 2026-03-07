package com.ssms.inventorymanagement.service;

import com.ssms.inventorymanagement.dto.request.InventoryRequest;
import com.ssms.inventorymanagement.dto.request.StockUpdateRequest;
import com.ssms.inventorymanagement.dto.response.InventoryResponse;

import java.util.List;

public interface InventoryService {

    InventoryResponse createInventory(InventoryRequest request);

    List<InventoryResponse> getAllInventory();

    InventoryResponse getInventoryById(Long inventoryId);

    List<InventoryResponse> getInventoryByProductId(Long productId);

    List<InventoryResponse> getInventoryByWarehouseId(Long warehouseId);

    InventoryResponse updateInventory(Long inventoryId, InventoryRequest request);

    InventoryResponse updateStock(Long inventoryId, StockUpdateRequest request);

    List<InventoryResponse> getLowStockAlerts();

    List<InventoryResponse> getLowStockAlertsByWarehouse(Long warehouseId);

    void deleteInventory(Long inventoryId);
}
