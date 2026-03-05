package com.ssms.inventorymanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssms.inventorymanagement.config.SecurityConfig;
import com.ssms.inventorymanagement.dto.request.InventoryRequest;
import com.ssms.inventorymanagement.dto.request.StockUpdateRequest;
import com.ssms.inventorymanagement.dto.response.InventoryResponse;
import com.ssms.inventorymanagement.dto.response.WarehouseResponse;
import com.ssms.inventorymanagement.exception.BusinessException;
import com.ssms.inventorymanagement.exception.GlobalExceptionHandler;
import com.ssms.inventorymanagement.exception.ResourceNotFoundException;
import com.ssms.inventorymanagement.service.InventoryService;
import com.ssms.inventorymanagement.utility.constant.AppConstants;
import com.ssms.inventorymanagement.utility.constant.ResponseMessages;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InventoryController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class InventoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private InventoryService inventoryService;

    private static final String BASE_PATH = AppConstants.INVENTORY_PATH;

    private InventoryResponse sampleResponse;
    private WarehouseResponse sampleWarehouse;

    @BeforeEach
    void setUp() {
        sampleWarehouse = WarehouseResponse.builder()
                .warehouseId(1L)
                .name("Main Warehouse")
                .city("Manila")
                .country("Philippines")
                .isActive(true)
                .build();

        sampleResponse = InventoryResponse.builder()
                .inventoryId(1L)
                .productId(100L)
                .warehouse(sampleWarehouse)
                .quantityOnHand(50)
                .reorderLevel(10)
                .reorderQuantity(50)
                .lowStockAlertSent(false)
                .lowStock(false)
                .updatedAt(LocalDateTime.now())
                .build();
    }

    // ──────────────────────────────────────────────────────────────
    // POST /api/v1/inventory
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("POST " + "/api/v1/inventory")
    class CreateInventory {

        @Test
        @DisplayName("should return 201 when inventory created successfully")
        void shouldReturn201() throws Exception {
            InventoryRequest request = InventoryRequest.builder()
                    .productId(100L)
                    .warehouseId(1L)
                    .quantityOnHand(50)
                    .reorderLevel(10)
                    .reorderQuantity(50)
                    .build();

            when(inventoryService.createInventory(any(InventoryRequest.class)))
                    .thenReturn(sampleResponse);

            mockMvc.perform(post(BASE_PATH)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value(ResponseMessages.INVENTORY_CREATED))
                    .andExpect(jsonPath("$.data.inventoryId").value(1))
                    .andExpect(jsonPath("$.data.productId").value(100))
                    .andExpect(jsonPath("$.data.quantityOnHand").value(50));
        }

        @Test
        @DisplayName("should return 400 for validation errors")
        void shouldReturn400ForValidationErrors() throws Exception {
            InventoryRequest invalid = InventoryRequest.builder()
                    .productId(null) // required
                    .warehouseId(null)
                    .quantityOnHand(null)
                    .build();

            mockMvc.perform(post(BASE_PATH)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalid)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("should return 400 when duplicate record exists")
        void shouldReturn400ForDuplicate() throws Exception {
            InventoryRequest request = InventoryRequest.builder()
                    .productId(100L)
                    .warehouseId(1L)
                    .quantityOnHand(50)
                    .build();

            when(inventoryService.createInventory(any()))
                    .thenThrow(new BusinessException(ResponseMessages.INVENTORY_ALREADY_EXISTS));

            mockMvc.perform(post(BASE_PATH)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value(ResponseMessages.INVENTORY_ALREADY_EXISTS));
        }
    }

    // ──────────────────────────────────────────────────────────────
    // GET /api/v1/inventory
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("GET " + "/api/v1/inventory")
    class GetAllInventory {

        @Test
        @DisplayName("should return 200 with inventory list")
        void shouldReturn200WithList() throws Exception {
            when(inventoryService.getAllInventory())
                    .thenReturn(List.of(sampleResponse));

            mockMvc.perform(get(BASE_PATH))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data", hasSize(1)))
                    .andExpect(jsonPath("$.data[0].inventoryId").value(1));
        }

        @Test
        @DisplayName("should return 200 with empty list")
        void shouldReturn200WithEmptyList() throws Exception {
            when(inventoryService.getAllInventory())
                    .thenReturn(Collections.emptyList());

            mockMvc.perform(get(BASE_PATH))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data", hasSize(0)));
        }
    }

    // ──────────────────────────────────────────────────────────────
    // GET /api/v1/inventory/{id}
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("GET " + "/api/v1/inventory/{id}")
    class GetInventoryById {

        @Test
        @DisplayName("should return 200 with inventory record")
        void shouldReturn200() throws Exception {
            when(inventoryService.getInventoryById(1L))
                    .thenReturn(sampleResponse);

            mockMvc.perform(get(BASE_PATH + "/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.inventoryId").value(1))
                    .andExpect(jsonPath("$.data.warehouse.name").value("Main Warehouse"));
        }

        @Test
        @DisplayName("should return 404 when not found")
        void shouldReturn404() throws Exception {
            when(inventoryService.getInventoryById(999L))
                    .thenThrow(new ResourceNotFoundException(
                            ResponseMessages.INVENTORY_NOT_FOUND + 999));

            mockMvc.perform(get(BASE_PATH + "/999"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    // ──────────────────────────────────────────────────────────────
    // GET /api/v1/inventory/product/{productId}
    // ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/v1/inventory/product/{productId} should return 200")
    void shouldReturnInventoryByProduct() throws Exception {
        when(inventoryService.getInventoryByProductId(100L))
                .thenReturn(List.of(sampleResponse));

        mockMvc.perform(get(BASE_PATH + "/product/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].productId").value(100));
    }

    // ──────────────────────────────────────────────────────────────
    // GET /api/v1/inventory/warehouse/{warehouseId}
    // ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/v1/inventory/warehouse/{warehouseId} should return 200")
    void shouldReturnInventoryByWarehouse() throws Exception {
        when(inventoryService.getInventoryByWarehouseId(1L))
                .thenReturn(List.of(sampleResponse));

        mockMvc.perform(get(BASE_PATH + "/warehouse/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)));
    }

    // ──────────────────────────────────────────────────────────────
    // PUT /api/v1/inventory/{id}
    // ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("PUT /api/v1/inventory/{id} should return 200 when updated")
    void shouldReturn200OnUpdate() throws Exception {
        InventoryRequest updateReq = InventoryRequest.builder()
                .productId(100L)
                .warehouseId(1L)
                .quantityOnHand(75)
                .reorderLevel(20)
                .reorderQuantity(100)
                .build();

        InventoryResponse updated = InventoryResponse.builder()
                .inventoryId(1L)
                .productId(100L)
                .warehouse(sampleWarehouse)
                .quantityOnHand(75)
                .reorderLevel(20)
                .reorderQuantity(100)
                .lowStock(false)
                .lowStockAlertSent(false)
                .updatedAt(LocalDateTime.now())
                .build();

        when(inventoryService.updateInventory(eq(1L), any(InventoryRequest.class)))
                .thenReturn(updated);

        mockMvc.perform(put(BASE_PATH + "/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.quantityOnHand").value(75))
                .andExpect(jsonPath("$.data.reorderLevel").value(20));
    }

    // ──────────────────────────────────────────────────────────────
    // PATCH /api/v1/inventory/{id}/stock
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("PATCH " + "/api/v1/inventory/{id}/stock")
    class UpdateStock {

        @Test
        @DisplayName("should return 200 on successful stock update")
        void shouldReturn200() throws Exception {
            StockUpdateRequest req = StockUpdateRequest.builder()
                    .quantity(20)
                    .operation("INCREASE")
                    .reason("Restocking")
                    .build();

            InventoryResponse updated = InventoryResponse.builder()
                    .inventoryId(1L)
                    .productId(100L)
                    .warehouse(sampleWarehouse)
                    .quantityOnHand(70)
                    .reorderLevel(10)
                    .reorderQuantity(50)
                    .lowStock(false)
                    .lowStockAlertSent(false)
                    .updatedAt(LocalDateTime.now())
                    .build();

            when(inventoryService.updateStock(eq(1L), any(StockUpdateRequest.class)))
                    .thenReturn(updated);

            mockMvc.perform(patch(BASE_PATH + "/1/stock")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.quantityOnHand").value(70));
        }

        @Test
        @DisplayName("should return 400 when insufficient stock")
        void shouldReturn400InsufficientStock() throws Exception {
            StockUpdateRequest req = StockUpdateRequest.builder()
                    .quantity(100)
                    .operation("DECREASE")
                    .build();

            when(inventoryService.updateStock(eq(1L), any(StockUpdateRequest.class)))
                    .thenThrow(new BusinessException(ResponseMessages.INVENTORY_INSUFFICIENT_STOCK));

            mockMvc.perform(patch(BASE_PATH + "/1/stock")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value(ResponseMessages.INVENTORY_INSUFFICIENT_STOCK));
        }

        @Test
        @DisplayName("should return 400 for invalid stock request body")
        void shouldReturn400ForInvalidRequest() throws Exception {
            StockUpdateRequest invalid = StockUpdateRequest.builder()
                    .quantity(null) // required
                    .operation(null) // required
                    .build();

            mockMvc.perform(patch(BASE_PATH + "/1/stock")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalid)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    // ──────────────────────────────────────────────────────────────
    // GET /api/v1/inventory/alerts/low-stock
    // ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/v1/inventory/alerts/low-stock should return 200")
    void shouldReturnLowStockAlerts() throws Exception {
        InventoryResponse lowStockItem = InventoryResponse.builder()
                .inventoryId(2L)
                .productId(200L)
                .warehouse(sampleWarehouse)
                .quantityOnHand(5)
                .reorderLevel(10)
                .lowStock(true)
                .lowStockAlertSent(true)
                .build();

        when(inventoryService.getLowStockAlerts())
                .thenReturn(List.of(lowStockItem));

        mockMvc.perform(get(BASE_PATH + "/alerts/low-stock"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].lowStock").value(true));
    }

    // ──────────────────────────────────────────────────────────────
    // GET /api/v1/inventory/alerts/low-stock/warehouse/{warehouseId}
    // ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/v1/inventory/alerts/low-stock/warehouse/{id} should return 200")
    void shouldReturnLowStockByWarehouse() throws Exception {
        when(inventoryService.getLowStockAlertsByWarehouse(1L))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get(BASE_PATH + "/alerts/low-stock/warehouse/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    // ──────────────────────────────────────────────────────────────
    // DELETE /api/v1/inventory/{id}
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("DELETE " + "/api/v1/inventory/{id}")
    class DeleteInventory {

        @Test
        @DisplayName("should return 200 when deleted successfully")
        void shouldReturn200() throws Exception {
            doNothing().when(inventoryService).deleteInventory(1L);

            mockMvc.perform(delete(BASE_PATH + "/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value(ResponseMessages.INVENTORY_DELETED));
        }

        @Test
        @DisplayName("should return 404 when record not found")
        void shouldReturn404() throws Exception {
            doThrow(new ResourceNotFoundException(
                    ResponseMessages.INVENTORY_NOT_FOUND + 999))
                    .when(inventoryService).deleteInventory(999L);

            mockMvc.perform(delete(BASE_PATH + "/999"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }
}
