package com.ssms.inventorymanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssms.inventorymanagement.config.SecurityConfig;
import com.ssms.inventorymanagement.dto.request.WarehouseRequest;
import com.ssms.inventorymanagement.dto.response.WarehouseResponse;
import com.ssms.inventorymanagement.exception.BusinessException;
import com.ssms.inventorymanagement.exception.GlobalExceptionHandler;
import com.ssms.inventorymanagement.exception.ResourceNotFoundException;
import com.ssms.inventorymanagement.service.WarehouseService;
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

import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WarehouseController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class WarehouseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private WarehouseService warehouseService;

    private static final String BASE_PATH = AppConstants.WAREHOUSE_PATH;

    private WarehouseResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = WarehouseResponse.builder()
                .warehouseId(1L)
                .name("Main Warehouse")
                .address("123 Main St")
                .city("Manila")
                .country("Philippines")
                .contactPhone("+63-123-4567")
                .capacity(10000)
                .isActive(true)
                .build();
    }

    @Nested
    @DisplayName("POST /api/v1/warehouses")
    class CreateWarehouse {

        @Test
        @DisplayName("should return 201 when warehouse created successfully")
        void shouldReturn201() throws Exception {
            WarehouseRequest request = WarehouseRequest.builder()
                    .name("Main Warehouse")
                    .address("123 Main St")
                    .city("Manila")
                    .country("Philippines")
                    .contactPhone("+63-123-4567")
                    .capacity(10000)
                    .build();

            when(warehouseService.createWarehouse(any(WarehouseRequest.class)))
                    .thenReturn(sampleResponse);

            mockMvc.perform(post(BASE_PATH)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value(ResponseMessages.WAREHOUSE_CREATED))
                    .andExpect(jsonPath("$.data.warehouseId").value(1))
                    .andExpect(jsonPath("$.data.name").value("Main Warehouse"))
                    .andExpect(jsonPath("$.data.city").value("Manila"));
        }

        @Test
        @DisplayName("should return 400 when name is blank")
        void shouldReturn400ForBlankName() throws Exception {
            WarehouseRequest invalid = WarehouseRequest.builder()
                    .name("") 
                    .build();

            mockMvc.perform(post(BASE_PATH)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalid)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("should return 400 when name already exists")
        void shouldReturn400ForDuplicateName() throws Exception {
            WarehouseRequest request = WarehouseRequest.builder()
                    .name("Existing Warehouse")
                    .build();

            when(warehouseService.createWarehouse(any()))
                    .thenThrow(new BusinessException(
                            ResponseMessages.WAREHOUSE_NAME_EXISTS + "Existing Warehouse"));

            mockMvc.perform(post(BASE_PATH)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message", containsString(ResponseMessages.WAREHOUSE_NAME_EXISTS)));
        }

        @Test
        @DisplayName("should return 400 when name exceeds max length")
        void shouldReturn400ForLongName() throws Exception {
            WarehouseRequest invalid = WarehouseRequest.builder()
                    .name("A".repeat(101)) 
                    .build();

            mockMvc.perform(post(BASE_PATH)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalid)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    @Nested
    @DisplayName("GET /api/v1/warehouses")
    class GetAllWarehouses {

        @Test
        @DisplayName("should return 200 with warehouse list")
        void shouldReturn200WithList() throws Exception {
            when(warehouseService.getAllWarehouses())
                    .thenReturn(List.of(sampleResponse));

            mockMvc.perform(get(BASE_PATH))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data", hasSize(1)))
                    .andExpect(jsonPath("$.data[0].name").value("Main Warehouse"));
        }

        @Test
        @DisplayName("should return 200 with empty list")
        void shouldReturn200Empty() throws Exception {
            when(warehouseService.getAllWarehouses())
                    .thenReturn(Collections.emptyList());

            mockMvc.perform(get(BASE_PATH))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data", hasSize(0)));
        }
    }

    @Nested
    @DisplayName("GET /api/v1/warehouses/{id}")
    class GetWarehouseById {

        @Test
        @DisplayName("should return 200 with warehouse data")
        void shouldReturn200() throws Exception {
            when(warehouseService.getWarehouseById(1L))
                    .thenReturn(sampleResponse);

            mockMvc.perform(get(BASE_PATH + "/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.warehouseId").value(1))
                    .andExpect(jsonPath("$.data.name").value("Main Warehouse"))
                    .andExpect(jsonPath("$.data.capacity").value(10000));
        }

        @Test
        @DisplayName("should return 404 when warehouse not found")
        void shouldReturn404() throws Exception {
            when(warehouseService.getWarehouseById(999L))
                    .thenThrow(new ResourceNotFoundException(
                            ResponseMessages.WAREHOUSE_NOT_FOUND + 999));

            mockMvc.perform(get(BASE_PATH + "/999"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    @Nested
    @DisplayName("PUT /api/v1/warehouses/{id}")
    class UpdateWarehouse {

        @Test
        @DisplayName("should return 200 when updated successfully")
        void shouldReturn200() throws Exception {
            WarehouseRequest updateReq = WarehouseRequest.builder()
                    .name("Updated Warehouse")
                    .address("456 New St")
                    .city("Cebu")
                    .country("Philippines")
                    .capacity(15000)
                    .build();

            WarehouseResponse updated = WarehouseResponse.builder()
                    .warehouseId(1L)
                    .name("Updated Warehouse")
                    .address("456 New St")
                    .city("Cebu")
                    .country("Philippines")
                    .capacity(15000)
                    .isActive(true)
                    .build();

            when(warehouseService.updateWarehouse(eq(1L), any(WarehouseRequest.class)))
                    .thenReturn(updated);

            mockMvc.perform(put(BASE_PATH + "/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateReq)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.name").value("Updated Warehouse"))
                    .andExpect(jsonPath("$.data.city").value("Cebu"))
                    .andExpect(jsonPath("$.data.capacity").value(15000));
        }

        @Test
        @DisplayName("should return 404 when warehouse not found")
        void shouldReturn404() throws Exception {
            WarehouseRequest updateReq = WarehouseRequest.builder()
                    .name("Some Name")
                    .build();

            when(warehouseService.updateWarehouse(eq(999L), any()))
                    .thenThrow(new ResourceNotFoundException(
                            ResponseMessages.WAREHOUSE_NOT_FOUND + 999));

            mockMvc.perform(put(BASE_PATH + "/999")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateReq)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("should return 400 when new name is duplicate")
        void shouldReturn400ForDuplicateName() throws Exception {
            WarehouseRequest updateReq = WarehouseRequest.builder()
                    .name("Duplicate Name")
                    .build();

            when(warehouseService.updateWarehouse(eq(1L), any()))
                    .thenThrow(new BusinessException(
                            ResponseMessages.WAREHOUSE_NAME_EXISTS + "Duplicate Name"));

            mockMvc.perform(put(BASE_PATH + "/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateReq)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    @Nested
    @DisplayName("DELETE /api/v1/warehouses/{id}")
    class DeactivateWarehouse {

        @Test
        @DisplayName("should return 200 when deactivated successfully")
        void shouldReturn200() throws Exception {
            doNothing().when(warehouseService).deactivateWarehouse(1L);

            mockMvc.perform(delete(BASE_PATH + "/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value(ResponseMessages.WAREHOUSE_DEACTIVATED));
        }

        @Test
        @DisplayName("should return 404 when warehouse not found")
        void shouldReturn404() throws Exception {
            doThrow(new ResourceNotFoundException(
                    ResponseMessages.WAREHOUSE_NOT_FOUND + 999))
                    .when(warehouseService).deactivateWarehouse(999L);

            mockMvc.perform(delete(BASE_PATH + "/999"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }
}
