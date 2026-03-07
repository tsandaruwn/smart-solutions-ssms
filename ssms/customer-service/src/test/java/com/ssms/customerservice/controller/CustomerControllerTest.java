package com.ssms.customerservice.controller;

import tools.jackson.databind.ObjectMapper;
import com.ssms.customerservice.dto.CustomerRequestDto;
import com.ssms.customerservice.dto.CustomerResponseDto;
import com.ssms.customerservice.dto.CustomerUpdateDto;
import com.ssms.customerservice.exception.CustomerNotFoundException;
import com.ssms.customerservice.exception.EmailAlreadyExistsException;
import com.ssms.customerservice.exception.GlobalExceptionHandler;
import com.ssms.customerservice.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {CustomerController.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("CustomerController Unit Tests")
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CustomerService customerService;

    private CustomerResponseDto sampleResponse;
    private CustomerRequestDto sampleRequest;

    @BeforeEach
    void setUp() {
        sampleResponse = CustomerResponseDto.builder()
                .customerId(1L)
                .email("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .phone("+1234567890")
                .city("New York")
                .country("USA")
                .registrationDate(LocalDateTime.now())
                .build();

        sampleRequest = CustomerRequestDto.builder()
                .email("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .phone("+1234567890")
                .city("New York")
                .country("USA")
                .build();
    }

    @Nested
    @DisplayName("POST /api/v1/customers")
    class CreateCustomer {

        @Test
        @DisplayName("should return 201 and created customer")
        void shouldReturn201WhenCreated() throws Exception {
            when(customerService.createCustomer(any(CustomerRequestDto.class)))
                    .thenReturn(sampleResponse);

            mockMvc.perform(post("/api/v1/customers")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(sampleRequest)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.customerId", is(1)))
                    .andExpect(jsonPath("$.data.email", is("john.doe@example.com")))
                    .andExpect(jsonPath("$.message", is("Customer created successfully")));
        }

        @Test
        @DisplayName("should return 409 when email already exists")
        void shouldReturn409WhenEmailExists() throws Exception {
            when(customerService.createCustomer(any(CustomerRequestDto.class)))
                    .thenThrow(new EmailAlreadyExistsException("john.doe@example.com"));

            mockMvc.perform(post("/api/v1/customers")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(sampleRequest)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.success", is(false)));
        }

        @Test
        @DisplayName("should return 400 when request body is invalid")
        void shouldReturn400WhenInvalidRequest() throws Exception {
            CustomerRequestDto invalid = CustomerRequestDto.builder()
                    .email("not-an-email")
                    .firstName("")
                    .lastName("")
                    .build();

            mockMvc.perform(post("/api/v1/customers")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalid)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success", is(false)));
        }
    }

    @Nested
    @DisplayName("GET /api/v1/customers/{id}")
    class GetCustomerById {

        @Test
        @DisplayName("should return 200 and customer")
        void shouldReturn200WhenFound() throws Exception {
            when(customerService.getCustomerById(1L)).thenReturn(sampleResponse);

            mockMvc.perform(get("/api/v1/customers/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.customerId", is(1)))
                    .andExpect(jsonPath("$.data.firstName", is("John")));
        }

        @Test
        @DisplayName("should return 404 when customer not found")
        void shouldReturn404WhenNotFound() throws Exception {
            when(customerService.getCustomerById(99L))
                    .thenThrow(new CustomerNotFoundException(99L));

            mockMvc.perform(get("/api/v1/customers/99"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success", is(false)));
        }
    }

    @Nested
    @DisplayName("GET /api/v1/customers/email/{email}")
    class GetCustomerByEmail {

        @Test
        @DisplayName("should return 200 and customer by email")
        void shouldReturn200ByEmail() throws Exception {
            when(customerService.getCustomerByEmail("john.doe@example.com"))
                    .thenReturn(sampleResponse);

            mockMvc.perform(get("/api/v1/customers/email/john.doe@example.com"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.email", is("john.doe@example.com")));
        }
    }

    @Nested
    @DisplayName("GET /api/v1/customers")
    class GetAllCustomers {

        @Test
        @DisplayName("should return 200 with paginated customers")
        void shouldReturnPaginatedCustomers() throws Exception {
            Page<CustomerResponseDto> page = new PageImpl<>(List.of(sampleResponse));
            when(customerService.getAllCustomers(any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/v1/customers")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }

        @Test
        @DisplayName("should call searchCustomers when search param provided")
        void shouldCallSearchWhenSearchParamProvided() throws Exception {
            Page<CustomerResponseDto> page = new PageImpl<>(List.of(sampleResponse));
            when(customerService.searchCustomers(eq("John"), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/v1/customers")
                            .param("search", "John"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content", hasSize(1)));

            verify(customerService).searchCustomers(eq("John"), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("PUT /api/v1/customers/{id}")
    class UpdateCustomer {

        @Test
        @DisplayName("should return 200 and updated customer")
        void shouldReturn200WhenUpdated() throws Exception {
            CustomerUpdateDto updateDto = CustomerUpdateDto.builder()
                    .firstName("Jane")
                    .city("Boston")
                    .build();

            CustomerResponseDto updated = CustomerResponseDto.builder()
                    .customerId(1L)
                    .email("john.doe@example.com")
                    .firstName("Jane")
                    .city("Boston")
                    .build();

            when(customerService.updateCustomer(eq(1L), any(CustomerUpdateDto.class)))
                    .thenReturn(updated);

            mockMvc.perform(put("/api/v1/customers/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateDto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.firstName", is("Jane")))
                    .andExpect(jsonPath("$.data.city", is("Boston")));
        }

        @Test
        @DisplayName("should return 404 when customer not found on update")
        void shouldReturn404WhenNotFoundOnUpdate() throws Exception {
            when(customerService.updateCustomer(eq(99L), any(CustomerUpdateDto.class)))
                    .thenThrow(new CustomerNotFoundException(99L));

            mockMvc.perform(put("/api/v1/customers/99")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new CustomerUpdateDto())))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("DELETE /api/v1/customers/{id}")
    class DeleteCustomer {

        @Test
        @DisplayName("should return 200 when deleted")
        void shouldReturn200WhenDeleted() throws Exception {
            doNothing().when(customerService).deleteCustomer(1L);

            mockMvc.perform(delete("/api/v1/customers/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.message", is("Customer deleted successfully")));
        }

        @Test
        @DisplayName("should return 404 when customer not found on delete")
        void shouldReturn404WhenNotFoundOnDelete() throws Exception {
            doThrow(new CustomerNotFoundException(99L)).when(customerService).deleteCustomer(99L);

            mockMvc.perform(delete("/api/v1/customers/99"))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("GET /api/v1/customers/{id}/orders")
    class GetOrderHistory {

        @Test
        @DisplayName("should return 200 with order history")
        void shouldReturnOrderHistory() throws Exception {
            List<Map<String, Object>> orders = List.of(
                    Map.of("orderId", 101, "status", "DELIVERED")
            );
            when(customerService.getCustomerOrderHistory(1L)).thenReturn(orders);

            mockMvc.perform(get("/api/v1/customers/1/orders"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(1)));
        }
    }
}
