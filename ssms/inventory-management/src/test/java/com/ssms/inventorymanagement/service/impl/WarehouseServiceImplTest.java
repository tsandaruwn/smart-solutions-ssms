package com.ssms.inventorymanagement.service.impl;

import com.ssms.inventorymanagement.dto.request.WarehouseRequest;
import com.ssms.inventorymanagement.dto.response.WarehouseResponse;
import com.ssms.inventorymanagement.entity.Warehouse;
import com.ssms.inventorymanagement.exception.BusinessException;
import com.ssms.inventorymanagement.exception.ResourceNotFoundException;
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

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WarehouseServiceImplTest {

    @Mock
    private WarehouseRepository warehouseRepository;

    @InjectMocks
    private WarehouseServiceImpl warehouseService;

    private Warehouse warehouse;
    private WarehouseRequest warehouseRequest;

    @BeforeEach
    void setUp() {
        warehouse = Warehouse.builder()
                .warehouseId(1L)
                .name("Main Warehouse")
                .address("123 Main St")
                .city("Manila")
                .country("Philippines")
                .contactPhone("+63-123-4567")
                .capacity(10000)
                .isActive(true)
                .build();

        warehouseRequest = WarehouseRequest.builder()
                .name("Main Warehouse")
                .address("123 Main St")
                .city("Manila")
                .country("Philippines")
                .contactPhone("+63-123-4567")
                .capacity(10000)
                .build();
    }

    // ──────────────────────────────────────────────────────────────
    // createWarehouse
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("createWarehouse")
    class CreateWarehouse {

        @Test
        @DisplayName("should create warehouse successfully")
        void shouldCreateSuccessfully() {
            when(warehouseRepository.existsByName("Main Warehouse")).thenReturn(false);
            when(warehouseRepository.save(any(Warehouse.class))).thenReturn(warehouse);

            WarehouseResponse result = warehouseService.createWarehouse(warehouseRequest);

            assertThat(result).isNotNull();
            assertThat(result.getWarehouseId()).isEqualTo(1L);
            assertThat(result.getName()).isEqualTo("Main Warehouse");
            assertThat(result.getCity()).isEqualTo("Manila");
            assertThat(result.getCountry()).isEqualTo("Philippines");
            assertThat(result.getIsActive()).isTrue();

            verify(warehouseRepository).existsByName("Main Warehouse");
            verify(warehouseRepository).save(any(Warehouse.class));
        }

        @Test
        @DisplayName("should throw BusinessException when name already exists")
        void shouldThrowWhenNameExists() {
            when(warehouseRepository.existsByName("Main Warehouse")).thenReturn(true);

            assertThatThrownBy(() -> warehouseService.createWarehouse(warehouseRequest))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining(ResponseMessages.WAREHOUSE_NAME_EXISTS);

            verify(warehouseRepository, never()).save(any());
        }

        @Test
        @DisplayName("should default isActive to true when not specified")
        void shouldDefaultIsActiveToTrue() {
            WarehouseRequest reqNoActive = WarehouseRequest.builder()
                    .name("New Warehouse")
                    .build();

            Warehouse savedWarehouse = Warehouse.builder()
                    .warehouseId(2L)
                    .name("New Warehouse")
                    .isActive(true)
                    .build();

            when(warehouseRepository.existsByName("New Warehouse")).thenReturn(false);
            when(warehouseRepository.save(any(Warehouse.class))).thenReturn(savedWarehouse);

            WarehouseResponse result = warehouseService.createWarehouse(reqNoActive);

            assertThat(result.getIsActive()).isTrue();
        }
    }

    // ──────────────────────────────────────────────────────────────
    // getAllWarehouses
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getAllWarehouses")
    class GetAllWarehouses {

        @Test
        @DisplayName("should return all active warehouses")
        void shouldReturnAllActive() {
            Warehouse w2 = Warehouse.builder()
                    .warehouseId(2L)
                    .name("Secondary Warehouse")
                    .city("Cebu")
                    .isActive(true)
                    .build();

            when(warehouseRepository.findAllByIsActiveTrue())
                    .thenReturn(List.of(warehouse, w2));

            List<WarehouseResponse> result = warehouseService.getAllWarehouses();

            assertThat(result).hasSize(2);
            assertThat(result.get(0).getName()).isEqualTo("Main Warehouse");
            assertThat(result.get(1).getName()).isEqualTo("Secondary Warehouse");
        }

        @Test
        @DisplayName("should return empty list when no active warehouses")
        void shouldReturnEmptyList() {
            when(warehouseRepository.findAllByIsActiveTrue())
                    .thenReturn(Collections.emptyList());

            List<WarehouseResponse> result = warehouseService.getAllWarehouses();

            assertThat(result).isEmpty();
        }
    }

    // ──────────────────────────────────────────────────────────────
    // getWarehouseById
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getWarehouseById")
    class GetWarehouseById {

        @Test
        @DisplayName("should return warehouse when found")
        void shouldReturnWarehouse() {
            when(warehouseRepository.findByWarehouseIdAndIsActiveTrue(1L))
                    .thenReturn(Optional.of(warehouse));

            WarehouseResponse result = warehouseService.getWarehouseById(1L);

            assertThat(result).isNotNull();
            assertThat(result.getWarehouseId()).isEqualTo(1L);
            assertThat(result.getName()).isEqualTo("Main Warehouse");
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            when(warehouseRepository.findByWarehouseIdAndIsActiveTrue(999L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> warehouseService.getWarehouseById(999L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ──────────────────────────────────────────────────────────────
    // updateWarehouse
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("updateWarehouse")
    class UpdateWarehouse {

        @Test
        @DisplayName("should update warehouse successfully with same name")
        void shouldUpdateWithSameName() {
            WarehouseRequest updateReq = WarehouseRequest.builder()
                    .name("Main Warehouse") // same name
                    .address("456 Updated St")
                    .city("Quezon City")
                    .country("Philippines")
                    .capacity(15000)
                    .build();

            Warehouse updated = Warehouse.builder()
                    .warehouseId(1L)
                    .name("Main Warehouse")
                    .address("456 Updated St")
                    .city("Quezon City")
                    .country("Philippines")
                    .capacity(15000)
                    .isActive(true)
                    .build();

            when(warehouseRepository.findByWarehouseIdAndIsActiveTrue(1L))
                    .thenReturn(Optional.of(warehouse));
            when(warehouseRepository.save(any(Warehouse.class)))
                    .thenReturn(updated);

            WarehouseResponse result = warehouseService.updateWarehouse(1L, updateReq);

            assertThat(result.getAddress()).isEqualTo("456 Updated St");
            assertThat(result.getCity()).isEqualTo("Quezon City");
            assertThat(result.getCapacity()).isEqualTo(15000);
            // existsByName should NOT be checked when name doesn't change
            verify(warehouseRepository, never()).existsByName(any());
        }

        @Test
        @DisplayName("should update warehouse with new unique name")
        void shouldUpdateWithNewName() {
            WarehouseRequest updateReq = WarehouseRequest.builder()
                    .name("Renamed Warehouse")
                    .address("456 Updated St")
                    .city("Manila")
                    .country("Philippines")
                    .build();

            Warehouse updated = Warehouse.builder()
                    .warehouseId(1L)
                    .name("Renamed Warehouse")
                    .address("456 Updated St")
                    .city("Manila")
                    .country("Philippines")
                    .isActive(true)
                    .build();

            when(warehouseRepository.findByWarehouseIdAndIsActiveTrue(1L))
                    .thenReturn(Optional.of(warehouse));
            when(warehouseRepository.existsByName("Renamed Warehouse"))
                    .thenReturn(false);
            when(warehouseRepository.save(any(Warehouse.class)))
                    .thenReturn(updated);

            WarehouseResponse result = warehouseService.updateWarehouse(1L, updateReq);

            assertThat(result.getName()).isEqualTo("Renamed Warehouse");
        }

        @Test
        @DisplayName("should throw BusinessException when new name is duplicate")
        void shouldThrowWhenNewNameIsDuplicate() {
            WarehouseRequest updateReq = WarehouseRequest.builder()
                    .name("Existing Other Warehouse")
                    .build();

            when(warehouseRepository.findByWarehouseIdAndIsActiveTrue(1L))
                    .thenReturn(Optional.of(warehouse));
            when(warehouseRepository.existsByName("Existing Other Warehouse"))
                    .thenReturn(true);

            assertThatThrownBy(() -> warehouseService.updateWarehouse(1L, updateReq))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining(ResponseMessages.WAREHOUSE_NAME_EXISTS);

            verify(warehouseRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when warehouse not found")
        void shouldThrowWhenNotFound() {
            when(warehouseRepository.findByWarehouseIdAndIsActiveTrue(999L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> warehouseService.updateWarehouse(999L, warehouseRequest))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ──────────────────────────────────────────────────────────────
    // deactivateWarehouse
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("deactivateWarehouse")
    class DeactivateWarehouse {

        @Test
        @DisplayName("should deactivate warehouse successfully")
        void shouldDeactivateSuccessfully() {
            when(warehouseRepository.findByWarehouseIdAndIsActiveTrue(1L))
                    .thenReturn(Optional.of(warehouse));
            when(warehouseRepository.save(any(Warehouse.class)))
                    .thenReturn(warehouse);

            warehouseService.deactivateWarehouse(1L);

            verify(warehouseRepository).save(argThat(w ->
                    Boolean.FALSE.equals(w.getIsActive())
            ));
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            when(warehouseRepository.findByWarehouseIdAndIsActiveTrue(999L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> warehouseService.deactivateWarehouse(999L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }
}
