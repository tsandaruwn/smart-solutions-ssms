package com.ssms.inventorymanagement.service.impl;

import com.ssms.inventorymanagement.dto.request.InventoryRequest;
import com.ssms.inventorymanagement.dto.request.StockUpdateRequest;
import com.ssms.inventorymanagement.dto.response.InventoryResponse;
import com.ssms.inventorymanagement.entity.Inventory;
import com.ssms.inventorymanagement.entity.Warehouse;
import com.ssms.inventorymanagement.exception.BusinessException;
import com.ssms.inventorymanagement.exception.ResourceNotFoundException;
import com.ssms.inventorymanagement.repository.InventoryRepository;
import com.ssms.inventorymanagement.repository.WarehouseRepository;
import com.ssms.inventorymanagement.utility.constant.ResponseMessages;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceImplTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private WarehouseRepository warehouseRepository;

    @InjectMocks
    private InventoryServiceImpl inventoryService;

    private Warehouse warehouse;
    private Inventory inventory;
    private InventoryRequest inventoryRequest;

    @BeforeEach
    void setUp() {
        warehouse = Warehouse.builder()
                .warehouseId(1L)
                .name("Main Warehouse")
                .city("Manila")
                .country("Philippines")
                .isActive(true)
                .build();

        inventory = Inventory.builder()
                .inventoryId(1L)
                .productId(100L)
                .warehouse(warehouse)
                .quantityOnHand(50)
                .reorderLevel(10)
                .reorderQuantity(50)
                .lowStockAlertSent(false)
                .isDeleted(false)
                .updatedAt(LocalDateTime.now())
                .build();

        inventoryRequest = InventoryRequest.builder()
                .productId(100L)
                .warehouseId(1L)
                .quantityOnHand(50)
                .reorderLevel(10)
                .reorderQuantity(50)
                .build();
    }

    // ──────────────────────────────────────────────────────────────
    // createInventory
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("createInventory")
    class CreateInventory {

        @Test
        @DisplayName("should create inventory record successfully")
        void shouldCreateInventorySuccessfully() {
            when(inventoryRepository.existsByProductIdAndWarehouse_WarehouseId(100L, 1L))
                    .thenReturn(false);
            when(warehouseRepository.findByWarehouseIdAndIsActiveTrue(1L))
                    .thenReturn(Optional.of(warehouse));
            when(inventoryRepository.save(any(Inventory.class)))
                    .thenReturn(inventory);

            InventoryResponse result = inventoryService.createInventory(inventoryRequest);

            assertThat(result).isNotNull();
            assertThat(result.getInventoryId()).isEqualTo(1L);
            assertThat(result.getProductId()).isEqualTo(100L);
            assertThat(result.getQuantityOnHand()).isEqualTo(50);
            assertThat(result.getWarehouse()).isNotNull();
            assertThat(result.getWarehouse().getName()).isEqualTo("Main Warehouse");

            verify(inventoryRepository).existsByProductIdAndWarehouse_WarehouseId(100L, 1L);
            verify(warehouseRepository).findByWarehouseIdAndIsActiveTrue(1L);
            verify(inventoryRepository, atLeastOnce()).save(any(Inventory.class));
        }

        @Test
        @DisplayName("should throw BusinessException when duplicate exists")
        void shouldThrowWhenDuplicateExists() {
            when(inventoryRepository.existsByProductIdAndWarehouse_WarehouseId(100L, 1L))
                    .thenReturn(true);

            assertThatThrownBy(() -> inventoryService.createInventory(inventoryRequest))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage(ResponseMessages.INVENTORY_ALREADY_EXISTS);

            verify(inventoryRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when warehouse not found")
        void shouldThrowWhenWarehouseNotFound() {
            when(inventoryRepository.existsByProductIdAndWarehouse_WarehouseId(100L, 1L))
                    .thenReturn(false);
            when(warehouseRepository.findByWarehouseIdAndIsActiveTrue(1L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> inventoryService.createInventory(inventoryRequest))
                    .isInstanceOf(ResourceNotFoundException.class);

            verify(inventoryRepository, never()).save(any());
        }

        @Test
        @DisplayName("should use default reorder values when not specified")
        void shouldUseDefaultReorderValues() {
            InventoryRequest reqNoDefaults = InventoryRequest.builder()
                    .productId(200L)
                    .warehouseId(1L)
                    .quantityOnHand(30)
                    .build(); // reorderLevel and reorderQuantity null

            when(inventoryRepository.existsByProductIdAndWarehouse_WarehouseId(200L, 1L))
                    .thenReturn(false);
            when(warehouseRepository.findByWarehouseIdAndIsActiveTrue(1L))
                    .thenReturn(Optional.of(warehouse));

            Inventory savedInventory = Inventory.builder()
                    .inventoryId(2L)
                    .productId(200L)
                    .warehouse(warehouse)
                    .quantityOnHand(30)
                    .reorderLevel(10)  // default
                    .reorderQuantity(50) // default
                    .lowStockAlertSent(false)
                    .isDeleted(false)
                    .updatedAt(LocalDateTime.now())
                    .build();

            when(inventoryRepository.save(any(Inventory.class)))
                    .thenReturn(savedInventory);

            InventoryResponse result = inventoryService.createInventory(reqNoDefaults);

            assertThat(result.getReorderLevel()).isEqualTo(10);
            assertThat(result.getReorderQuantity()).isEqualTo(50);
        }
    }

    // ──────────────────────────────────────────────────────────────
    // getAllInventory
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getAllInventory")
    class GetAllInventory {

        @Test
        @DisplayName("should return all active inventory records")
        void shouldReturnAllRecords() {
            when(inventoryRepository.findAllByIsDeletedFalse())
                    .thenReturn(List.of(inventory));

            List<InventoryResponse> result = inventoryService.getAllInventory();

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getInventoryId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("should return empty list when no records exist")
        void shouldReturnEmptyList() {
            when(inventoryRepository.findAllByIsDeletedFalse())
                    .thenReturn(Collections.emptyList());

            List<InventoryResponse> result = inventoryService.getAllInventory();

            assertThat(result).isEmpty();
        }
    }

    // ──────────────────────────────────────────────────────────────
    // getInventoryById
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getInventoryById")
    class GetInventoryById {

        @Test
        @DisplayName("should return inventory when found")
        void shouldReturnInventory() {
            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(1L))
                    .thenReturn(Optional.of(inventory));

            InventoryResponse result = inventoryService.getInventoryById(1L);

            assertThat(result).isNotNull();
            assertThat(result.getInventoryId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(999L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> inventoryService.getInventoryById(999L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ──────────────────────────────────────────────────────────────
    // getInventoryByProductId / getInventoryByWarehouseId
    // ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("should return inventory by product ID")
    void shouldReturnInventoryByProductId() {
        when(inventoryRepository.findAllByProductIdAndIsDeletedFalse(100L))
                .thenReturn(List.of(inventory));

        List<InventoryResponse> result = inventoryService.getInventoryByProductId(100L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProductId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("should return inventory by warehouse ID")
    void shouldReturnInventoryByWarehouseId() {
        when(inventoryRepository.findAllByWarehouse_WarehouseIdAndIsDeletedFalse(1L))
                .thenReturn(List.of(inventory));

        List<InventoryResponse> result = inventoryService.getInventoryByWarehouseId(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getWarehouse().getWarehouseId()).isEqualTo(1L);
    }

    // ──────────────────────────────────────────────────────────────
    // updateInventory
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("updateInventory")
    class UpdateInventory {

        @Test
        @DisplayName("should update inventory metadata successfully")
        void shouldUpdateSuccessfully() {
            InventoryRequest updateReq = InventoryRequest.builder()
                    .productId(100L)
                    .warehouseId(1L)
                    .quantityOnHand(75)
                    .reorderLevel(20)
                    .reorderQuantity(100)
                    .build();

            Inventory updated = Inventory.builder()
                    .inventoryId(1L)
                    .productId(100L)
                    .warehouse(warehouse)
                    .quantityOnHand(75)
                    .reorderLevel(20)
                    .reorderQuantity(100)
                    .lowStockAlertSent(false)
                    .isDeleted(false)
                    .updatedAt(LocalDateTime.now())
                    .build();

            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(1L))
                    .thenReturn(Optional.of(inventory));
            when(inventoryRepository.save(any(Inventory.class)))
                    .thenReturn(updated);

            InventoryResponse result = inventoryService.updateInventory(1L, updateReq);

            assertThat(result.getQuantityOnHand()).isEqualTo(75);
            assertThat(result.getReorderLevel()).isEqualTo(20);
            assertThat(result.getReorderQuantity()).isEqualTo(100);
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException for non-existent record")
        void shouldThrowWhenNotFound() {
            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(999L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> inventoryService.updateInventory(999L, inventoryRequest))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ──────────────────────────────────────────────────────────────
    // updateStock
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("updateStock")
    class UpdateStock {

        @Test
        @DisplayName("should increase stock successfully")
        void shouldIncreaseStock() {
            StockUpdateRequest req = StockUpdateRequest.builder()
                    .quantity(20)
                    .operation("INCREASE")
                    .reason("Restocking")
                    .build();

            Inventory increased = Inventory.builder()
                    .inventoryId(1L)
                    .productId(100L)
                    .warehouse(warehouse)
                    .quantityOnHand(70) // 50 + 20
                    .reorderLevel(10)
                    .reorderQuantity(50)
                    .lowStockAlertSent(false)
                    .isDeleted(false)
                    .lastRestockedAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(1L))
                    .thenReturn(Optional.of(inventory));
            when(inventoryRepository.save(any(Inventory.class)))
                    .thenReturn(increased);

            InventoryResponse result = inventoryService.updateStock(1L, req);

            assertThat(result.getQuantityOnHand()).isEqualTo(70);
            verify(inventoryRepository, atLeastOnce()).save(any(Inventory.class));
        }

        @Test
        @DisplayName("should decrease stock successfully")
        void shouldDecreaseStock() {
            StockUpdateRequest req = StockUpdateRequest.builder()
                    .quantity(10)
                    .operation("DECREASE")
                    .build();

            Inventory decreased = Inventory.builder()
                    .inventoryId(1L)
                    .productId(100L)
                    .warehouse(warehouse)
                    .quantityOnHand(40) // 50 - 10
                    .reorderLevel(10)
                    .reorderQuantity(50)
                    .lowStockAlertSent(false)
                    .isDeleted(false)
                    .updatedAt(LocalDateTime.now())
                    .build();

            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(1L))
                    .thenReturn(Optional.of(inventory));
            when(inventoryRepository.save(any(Inventory.class)))
                    .thenReturn(decreased);

            InventoryResponse result = inventoryService.updateStock(1L, req);

            assertThat(result.getQuantityOnHand()).isEqualTo(40);
        }

        @Test
        @DisplayName("should throw BusinessException when decreasing more than available")
        void shouldThrowWhenInsufficientStock() {
            StockUpdateRequest req = StockUpdateRequest.builder()
                    .quantity(100)
                    .operation("DECREASE")
                    .build();

            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(1L))
                    .thenReturn(Optional.of(inventory)); // has 50

            assertThatThrownBy(() -> inventoryService.updateStock(1L, req))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage(ResponseMessages.INVENTORY_INSUFFICIENT_STOCK);
        }

        @Test
        @DisplayName("should set stock to exact value")
        void shouldSetStockExactly() {
            StockUpdateRequest req = StockUpdateRequest.builder()
                    .quantity(99)
                    .operation("SET")
                    .build();

            Inventory setTo = Inventory.builder()
                    .inventoryId(1L)
                    .productId(100L)
                    .warehouse(warehouse)
                    .quantityOnHand(99)
                    .reorderLevel(10)
                    .reorderQuantity(50)
                    .lowStockAlertSent(false)
                    .isDeleted(false)
                    .updatedAt(LocalDateTime.now())
                    .build();

            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(1L))
                    .thenReturn(Optional.of(inventory));
            when(inventoryRepository.save(any(Inventory.class)))
                    .thenReturn(setTo);

            InventoryResponse result = inventoryService.updateStock(1L, req);

            assertThat(result.getQuantityOnHand()).isEqualTo(99);
        }

        @Test
        @DisplayName("should throw BusinessException for invalid operation")
        void shouldThrowForInvalidOperation() {
            StockUpdateRequest req = StockUpdateRequest.builder()
                    .quantity(10)
                    .operation("INVALID")
                    .build();

            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(1L))
                    .thenReturn(Optional.of(inventory));

            assertThatThrownBy(() -> inventoryService.updateStock(1L, req))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("Unknown stock operation");
        }

        @Test
        @DisplayName("should flag low stock alert when stock falls to reorder level")
        void shouldFlagLowStockAlert() {
            // inventory has qty=50, reorderLevel=10
            // decrease by 42 → qty becomes 8 which is <= 10 (low stock)
            StockUpdateRequest req = StockUpdateRequest.builder()
                    .quantity(42)
                    .operation("DECREASE")
                    .build();

            Inventory lowStockItem = Inventory.builder()
                    .inventoryId(1L)
                    .productId(100L)
                    .warehouse(warehouse)
                    .quantityOnHand(8)
                    .reorderLevel(10)
                    .reorderQuantity(50)
                    .lowStockAlertSent(false) // not yet sent
                    .isDeleted(false)
                    .updatedAt(LocalDateTime.now())
                    .build();

            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(1L))
                    .thenReturn(Optional.of(inventory));
            when(inventoryRepository.save(any(Inventory.class)))
                    .thenReturn(lowStockItem);

            inventoryService.updateStock(1L, req);

            // save should be called for stock update + low stock flag
            verify(inventoryRepository, atLeast(2)).save(any(Inventory.class));
        }
    }

    // ──────────────────────────────────────────────────────────────
    // getLowStockAlerts
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getLowStockAlerts")
    class GetLowStockAlerts {

        @Test
        @DisplayName("should return low stock items")
        void shouldReturnLowStockItems() {
            Inventory lowStock = Inventory.builder()
                    .inventoryId(2L)
                    .productId(200L)
                    .warehouse(warehouse)
                    .quantityOnHand(5)
                    .reorderLevel(10)
                    .reorderQuantity(50)
                    .lowStockAlertSent(true)
                    .isDeleted(false)
                    .updatedAt(LocalDateTime.now())
                    .build();

            when(inventoryRepository.findAllLowStockItems())
                    .thenReturn(List.of(lowStock));

            List<InventoryResponse> result = inventoryService.getLowStockAlerts();

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getLowStock()).isTrue();
        }

        @Test
        @DisplayName("should return low stock items by warehouse")
        void shouldReturnLowStockByWarehouse() {
            when(inventoryRepository.findLowStockItemsByWarehouse(1L))
                    .thenReturn(Collections.emptyList());

            List<InventoryResponse> result = inventoryService.getLowStockAlertsByWarehouse(1L);

            assertThat(result).isEmpty();
        }
    }

    // ──────────────────────────────────────────────────────────────
    // deleteInventory
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("deleteInventory")
    class DeleteInventory {

        @Test
        @DisplayName("should soft-delete inventory record")
        void shouldSoftDelete() {
            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(1L))
                    .thenReturn(Optional.of(inventory));
            when(inventoryRepository.save(any(Inventory.class)))
                    .thenReturn(inventory);

            inventoryService.deleteInventory(1L);

            verify(inventoryRepository).save(argThat(inv ->
                    Boolean.TRUE.equals(inv.getIsDeleted())
            ));
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException for non-existent record")
        void shouldThrowWhenNotFound() {
            when(inventoryRepository.findByInventoryIdAndIsDeletedFalse(999L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> inventoryService.deleteInventory(999L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Entity: isLowStock
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("Inventory.isLowStock()")
    class IsLowStock {

        @Test
        @DisplayName("should return true when qty <= reorder level")
        void shouldReturnTrueWhenLow() {
            inventory.setQuantityOnHand(5);
            inventory.setReorderLevel(10);
            assertThat(inventory.isLowStock()).isTrue();
        }

        @Test
        @DisplayName("should return true when qty equals reorder level")
        void shouldReturnTrueWhenEqual() {
            inventory.setQuantityOnHand(10);
            inventory.setReorderLevel(10);
            assertThat(inventory.isLowStock()).isTrue();
        }

        @Test
        @DisplayName("should return false when qty > reorder level")
        void shouldReturnFalseWhenAbove() {
            inventory.setQuantityOnHand(50);
            inventory.setReorderLevel(10);
            assertThat(inventory.isLowStock()).isFalse();
        }
    }
}
