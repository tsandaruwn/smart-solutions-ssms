package com.ssms.inventorymanagement.service.impl;

import com.ssms.inventorymanagement.dto.request.InventoryRequest;
import com.ssms.inventorymanagement.dto.request.StockUpdateRequest;
import com.ssms.inventorymanagement.dto.response.InventoryResponse;
import com.ssms.inventorymanagement.dto.response.WarehouseResponse;
import com.ssms.inventorymanagement.entity.Inventory;
import com.ssms.inventorymanagement.entity.Warehouse;
import com.ssms.inventorymanagement.exception.BusinessException;
import com.ssms.inventorymanagement.exception.ResourceNotFoundException;
import com.ssms.inventorymanagement.repository.InventoryRepository;
import com.ssms.inventorymanagement.repository.WarehouseRepository;
import com.ssms.inventorymanagement.service.InventoryService;
import com.ssms.inventorymanagement.utility.constant.AppConstants;
import com.ssms.inventorymanagement.utility.constant.ResponseMessages;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final WarehouseRepository warehouseRepository;

    @Override
    @Transactional
    public InventoryResponse createInventory(InventoryRequest request) {

        log.info("Creating inventory record — productId={}, warehouseId={}",
                request.getProductId(), request.getWarehouseId());

        if (inventoryRepository.existsByProductIdAndWarehouse_WarehouseId(
                request.getProductId(), request.getWarehouseId())) {
            throw new BusinessException(ResponseMessages.INVENTORY_ALREADY_EXISTS);
        }

        Warehouse warehouse = findActiveWarehouseOrThrow(request.getWarehouseId());

        Inventory inventory = Inventory.builder()
                .productId(request.getProductId())
                .warehouse(warehouse)
                .quantityOnHand(request.getQuantityOnHand())
                .reorderLevel(request.getReorderLevel() != null
                        ? request.getReorderLevel() : AppConstants.DEFAULT_REORDER_LEVEL)
                .reorderQuantity(request.getReorderQuantity() != null
                        ? request.getReorderQuantity() : AppConstants.DEFAULT_REORDER_QUANTITY)
                .build();

        Inventory saved = inventoryRepository.save(inventory);
        checkAndFlagLowStock(saved);

        log.info("Inventory record created with ID: {}", saved.getInventoryId());
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        log.debug("Fetching all active inventory records");
        return inventoryRepository.findAllByIsDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryResponse getInventoryById(Long inventoryId) {
        log.debug("Fetching inventory record with ID: {}", inventoryId);
        return mapToResponse(findActiveOrThrow(inventoryId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getInventoryByProductId(Long productId) {
        log.debug("Fetching inventory for productId={}", productId);
        return inventoryRepository.findAllByProductIdAndIsDeletedFalse(productId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getInventoryByWarehouseId(Long warehouseId) {
        log.debug("Fetching inventory for warehouseId={}", warehouseId);
        return inventoryRepository.findAllByWarehouse_WarehouseIdAndIsDeletedFalse(warehouseId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InventoryResponse updateInventory(Long inventoryId, InventoryRequest request) {

        log.info("Updating inventory metadata for ID: {}", inventoryId);

        Inventory inventory = findActiveOrThrow(inventoryId);

        if (request.getReorderLevel() != null) {
            inventory.setReorderLevel(request.getReorderLevel());
        }
        if (request.getReorderQuantity() != null) {
            inventory.setReorderQuantity(request.getReorderQuantity());
        }
        if (request.getQuantityOnHand() != null) {
            inventory.setQuantityOnHand(request.getQuantityOnHand());
        }

        Inventory updated = inventoryRepository.save(inventory);
        checkAndFlagLowStock(updated);

        log.info("Inventory metadata updated: {}", inventoryId);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public InventoryResponse updateStock(Long inventoryId, StockUpdateRequest request) {

        log.info("Stock update — inventoryId={}, operation={}, qty={}",
                inventoryId, request.getOperation(), request.getQuantity());

        Inventory inventory = findActiveOrThrow(inventoryId);
        int quantity = request.getQuantity();
        String operation = request.getOperation().toUpperCase();

        switch (operation) {
            case AppConstants.STOCK_OP_INCREASE -> {
                inventory.setQuantityOnHand(inventory.getQuantityOnHand() + quantity);
                inventory.setLastRestockedAt(LocalDateTime.now());
                
                inventory.setLowStockAlertSent(Boolean.FALSE);
                log.debug("Stock increased by {} for inventoryId={}", quantity, inventoryId);
            }
            case AppConstants.STOCK_OP_DECREASE -> {
                if (inventory.getQuantityOnHand() < quantity) {
                    throw new BusinessException(ResponseMessages.INVENTORY_INSUFFICIENT_STOCK);
                }
                inventory.setQuantityOnHand(inventory.getQuantityOnHand() - quantity);
                log.debug("Stock decreased by {} for inventoryId={}", quantity, inventoryId);
            }
            case AppConstants.STOCK_OP_SET -> {
                inventory.setQuantityOnHand(quantity);
                log.debug("Stock set to {} for inventoryId={}", quantity, inventoryId);
            }
            default -> throw new BusinessException(
                    "Unknown stock operation: " + request.getOperation());
        }

        Inventory updated = inventoryRepository.save(inventory);
        checkAndFlagLowStock(updated);

        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getLowStockAlerts() {
        log.debug("Fetching all low-stock inventory records");
        return inventoryRepository.findAllLowStockItems()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getLowStockAlertsByWarehouse(Long warehouseId) {
        log.debug("Fetching low-stock records for warehouseId={}", warehouseId);
        return inventoryRepository.findLowStockItemsByWarehouse(warehouseId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteInventory(Long inventoryId) {
        log.info("Soft-deleting inventory record with ID: {}", inventoryId);
        Inventory inventory = findActiveOrThrow(inventoryId);
        inventory.setIsDeleted(Boolean.TRUE);
        inventoryRepository.save(inventory);
        log.info("Inventory record soft-deleted: {}", inventoryId);
    }

    private Inventory findActiveOrThrow(Long inventoryId) {
        return inventoryRepository.findByInventoryIdAndIsDeletedFalse(inventoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ResponseMessages.INVENTORY_NOT_FOUND + inventoryId));
    }

    private Warehouse findActiveWarehouseOrThrow(Long warehouseId) {
        return warehouseRepository.findByWarehouseIdAndIsActiveTrue(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ResponseMessages.WAREHOUSE_NOT_FOUND + warehouseId));
    }

    private void checkAndFlagLowStock(Inventory inventory) {
        if (inventory.isLowStock() && Boolean.FALSE.equals(inventory.getLowStockAlertSent())) {
            inventory.setLowStockAlertSent(Boolean.TRUE);
            inventoryRepository.save(inventory);
            log.warn("LOW STOCK ALERT — inventoryId={}, productId={}, qty={}, reorderLevel={}",
                    inventory.getInventoryId(),
                    inventory.getProductId(),
                    inventory.getQuantityOnHand(),
                    inventory.getReorderLevel());
        }
    }

    private InventoryResponse mapToResponse(Inventory inventory) {
        WarehouseResponse warehouseResponse = null;
        if (inventory.getWarehouse() != null) {
            Warehouse w = inventory.getWarehouse();
            warehouseResponse = WarehouseResponse.builder()
                    .warehouseId(w.getWarehouseId())
                    .name(w.getName())
                    .city(w.getCity())
                    .country(w.getCountry())
                    .isActive(w.getIsActive())
                    .build();
        }

        return InventoryResponse.builder()
                .inventoryId(inventory.getInventoryId())
                .productId(inventory.getProductId())
                .warehouse(warehouseResponse)
                .quantityOnHand(inventory.getQuantityOnHand())
                .reorderLevel(inventory.getReorderLevel())
                .reorderQuantity(inventory.getReorderQuantity())
                .lowStockAlertSent(inventory.getLowStockAlertSent())
                .lowStock(inventory.isLowStock())
                .lastRestockedAt(inventory.getLastRestockedAt())
                .updatedAt(inventory.getUpdatedAt())
                .build();
    }
}
