package com.ssms.customerservice.service;

import com.ssms.customerservice.client.OrderServiceClient;
import com.ssms.customerservice.dto.CustomerRequestDto;
import com.ssms.customerservice.dto.CustomerResponseDto;
import com.ssms.customerservice.dto.CustomerUpdateDto;
import com.ssms.customerservice.entity.Customer;
import com.ssms.customerservice.exception.CustomerNotFoundException;
import com.ssms.customerservice.exception.EmailAlreadyExistsException;
import com.ssms.customerservice.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CustomerServiceImpl Unit Tests")
class CustomerServiceImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private OrderServiceClient orderServiceClient;

    @InjectMocks
    private CustomerServiceImpl customerService;

    private Customer sampleCustomer;
    private CustomerRequestDto sampleRequestDto;

    @BeforeEach
    void setUp() {
        sampleCustomer = Customer.builder()
                .customerId(1L)
                .email("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .phone("+1234567890")
                .addressLine1("123 Main St")
                .city("New York")
                .state("NY")
                .country("USA")
                .postalCode("10001")
                .dateOfBirth(LocalDate.of(1990, 5, 15))
                .registrationDate(LocalDateTime.now())
                .isDeleted(false)
                .build();

        sampleRequestDto = CustomerRequestDto.builder()
                .email("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .phone("+1234567890")
                .addressLine1("123 Main St")
                .city("New York")
                .state("NY")
                .country("USA")
                .postalCode("10001")
                .dateOfBirth(LocalDate.of(1990, 5, 15))
                .build();
    }

    // ── CREATE ───────────────────────────────────────────────────────────────
    @Nested
    @DisplayName("createCustomer")
    class CreateCustomer {

        @Test
        @DisplayName("should create customer successfully")
        void shouldCreateCustomerSuccessfully() {
            when(customerRepository.existsByEmail(anyString())).thenReturn(false);
            when(customerRepository.save(any(Customer.class))).thenReturn(sampleCustomer);

            CustomerResponseDto result = customerService.createCustomer(sampleRequestDto);

            assertThat(result).isNotNull();
            assertThat(result.getEmail()).isEqualTo("john.doe@example.com");
            assertThat(result.getFirstName()).isEqualTo("John");
            assertThat(result.getLastName()).isEqualTo("Doe");
            assertThat(result.getCustomerId()).isEqualTo(1L);

            verify(customerRepository).existsByEmail("john.doe@example.com");
            verify(customerRepository).save(any(Customer.class));
        }

        @Test
        @DisplayName("should throw EmailAlreadyExistsException when email is taken")
        void shouldThrowWhenEmailAlreadyExists() {
            when(customerRepository.existsByEmail(anyString())).thenReturn(true);

            assertThatThrownBy(() -> customerService.createCustomer(sampleRequestDto))
                    .isInstanceOf(EmailAlreadyExistsException.class)
                    .hasMessageContaining("john.doe@example.com");

            verify(customerRepository, never()).save(any());
        }
    }

    // ── READ ─────────────────────────────────────────────────────────────────
    @Nested
    @DisplayName("getCustomerById")
    class GetCustomerById {

        @Test
        @DisplayName("should return customer when found")
        void shouldReturnCustomerWhenFound() {
            when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));

            CustomerResponseDto result = customerService.getCustomerById(1L);

            assertThat(result.getCustomerId()).isEqualTo(1L);
            assertThat(result.getEmail()).isEqualTo("john.doe@example.com");
            verify(customerRepository).findById(1L);
        }

        @Test
        @DisplayName("should throw CustomerNotFoundException when not found")
        void shouldThrowWhenCustomerNotFound() {
            when(customerRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> customerService.getCustomerById(99L))
                    .isInstanceOf(CustomerNotFoundException.class)
                    .hasMessageContaining("99");
        }
    }

    @Nested
    @DisplayName("getCustomerByEmail")
    class GetCustomerByEmail {

        @Test
        @DisplayName("should return customer when email found")
        void shouldReturnCustomerByEmail() {
            when(customerRepository.findByEmail("john.doe@example.com"))
                    .thenReturn(Optional.of(sampleCustomer));

            CustomerResponseDto result = customerService.getCustomerByEmail("john.doe@example.com");

            assertThat(result.getEmail()).isEqualTo("john.doe@example.com");
        }

        @Test
        @DisplayName("should throw CustomerNotFoundException when email not found")
        void shouldThrowWhenEmailNotFound() {
            when(customerRepository.findByEmail(anyString())).thenReturn(Optional.empty());

            assertThatThrownBy(() -> customerService.getCustomerByEmail("unknown@example.com"))
                    .isInstanceOf(CustomerNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("getAllCustomers")
    class GetAllCustomers {

        @Test
        @DisplayName("should return paginated customers")
        void shouldReturnPaginatedCustomers() {
            Pageable pageable = PageRequest.of(0, 10);
            Page<Customer> page = new PageImpl<>(List.of(sampleCustomer));
            when(customerRepository.findAll(pageable)).thenReturn(page);

            Page<CustomerResponseDto> result = customerService.getAllCustomers(pageable);

            assertThat(result.getTotalElements()).isEqualTo(1);
            assertThat(result.getContent().get(0).getEmail()).isEqualTo("john.doe@example.com");
        }

        @Test
        @DisplayName("should return empty page when no customers")
        void shouldReturnEmptyPageWhenNoCustomers() {
            Pageable pageable = PageRequest.of(0, 10);
            when(customerRepository.findAll(pageable)).thenReturn(Page.empty());

            Page<CustomerResponseDto> result = customerService.getAllCustomers(pageable);

            assertThat(result).isEmpty();
        }
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────
    @Nested
    @DisplayName("updateCustomer")
    class UpdateCustomer {

        @Test
        @DisplayName("should update customer fields successfully")
        void shouldUpdateCustomerSuccessfully() {
            CustomerUpdateDto updateDto = CustomerUpdateDto.builder()
                    .firstName("Jane")
                    .city("Los Angeles")
                    .build();

            Customer updatedCustomer = Customer.builder()
                    .customerId(1L)
                    .email("john.doe@example.com")
                    .firstName("Jane")
                    .lastName("Doe")
                    .city("Los Angeles")
                    .registrationDate(LocalDateTime.now())
                    .isDeleted(false)
                    .build();

            when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));
            when(customerRepository.save(any(Customer.class))).thenReturn(updatedCustomer);

            CustomerResponseDto result = customerService.updateCustomer(1L, updateDto);

            assertThat(result.getFirstName()).isEqualTo("Jane");
            assertThat(result.getCity()).isEqualTo("Los Angeles");
            verify(customerRepository).save(any(Customer.class));
        }

        @Test
        @DisplayName("should throw EmailAlreadyExistsException when updating to existing email")
        void shouldThrowWhenUpdatingToExistingEmail() {
            CustomerUpdateDto updateDto = CustomerUpdateDto.builder()
                    .email("taken@example.com")
                    .build();

            when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));
            when(customerRepository.existsByEmail("taken@example.com")).thenReturn(true);

            assertThatThrownBy(() -> customerService.updateCustomer(1L, updateDto))
                    .isInstanceOf(EmailAlreadyExistsException.class);
        }

        @Test
        @DisplayName("should throw CustomerNotFoundException when customer not found")
        void shouldThrowWhenCustomerNotFoundOnUpdate() {
            when(customerRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> customerService.updateCustomer(99L, new CustomerUpdateDto()))
                    .isInstanceOf(CustomerNotFoundException.class);
        }
    }

    // ── DELETE ───────────────────────────────────────────────────────────────
    @Nested
    @DisplayName("deleteCustomer")
    class DeleteCustomer {

        @Test
        @DisplayName("should soft-delete customer successfully")
        void shouldSoftDeleteCustomer() {
            when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));
            when(customerRepository.save(any(Customer.class))).thenReturn(sampleCustomer);

            customerService.deleteCustomer(1L);

            assertThat(sampleCustomer.getIsDeleted()).isTrue();
            assertThat(sampleCustomer.getDeletedAt()).isNotNull();
            verify(customerRepository).save(sampleCustomer);
        }

        @Test
        @DisplayName("should throw CustomerNotFoundException when customer not found on delete")
        void shouldThrowWhenCustomerNotFoundOnDelete() {
            when(customerRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> customerService.deleteCustomer(99L))
                    .isInstanceOf(CustomerNotFoundException.class);

            verify(customerRepository, never()).save(any());
        }
    }

    // ── ORDER HISTORY ────────────────────────────────────────────────────────
    @Nested
    @DisplayName("getCustomerOrderHistory")
    class GetCustomerOrderHistory {

        @Test
        @DisplayName("should return orders when order service responds")
        void shouldReturnOrdersFromOrderService() {
            List<Map<String, Object>> orders = List.of(
                    Map.of("orderId", 101, "status", "DELIVERED"),
                    Map.of("orderId", 102, "status", "PENDING")
            );

            when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));
            when(orderServiceClient.getOrdersByCustomerId(1L)).thenReturn(orders);

            List<Map<String, Object>> result = customerService.getCustomerOrderHistory(1L);

            assertThat(result).hasSize(2);
            assertThat(result.get(0)).containsEntry("orderId", 101);
        }

        @Test
        @DisplayName("should return empty list when order service is unavailable")
        void shouldReturnEmptyListWhenOrderServiceUnavailable() {
            when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));
            when(orderServiceClient.getOrdersByCustomerId(1L))
                    .thenThrow(new RuntimeException("Service unavailable"));

            List<Map<String, Object>> result = customerService.getCustomerOrderHistory(1L);

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("should throw CustomerNotFoundException when customer not found")
        void shouldThrowWhenCustomerNotFoundForOrders() {
            when(customerRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> customerService.getCustomerOrderHistory(99L))
                    .isInstanceOf(CustomerNotFoundException.class);
        }
    }
}
