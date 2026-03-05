package com.ssms.customerservice.controller;

import com.ssms.customerservice.dto.ApiResponse;
import com.ssms.customerservice.dto.CustomerRequestDto;
import com.ssms.customerservice.dto.CustomerResponseDto;
import com.ssms.customerservice.dto.CustomerUpdateDto;
import com.ssms.customerservice.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Slf4j
public class CustomerController {

    private final CustomerService customerService;

    /**
     * POST /api/v1/customers
     * Create a new customer
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponseDto>> createCustomer(
            @Valid @RequestBody CustomerRequestDto requestDto) {
        CustomerResponseDto created = customerService.createCustomer(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer created successfully", created));
    }

    /**
     * GET /api/v1/customers/{id}
     * Get customer by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponseDto>> getCustomerById(
            @PathVariable Long id) {
        CustomerResponseDto customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", customer));
    }

    /**
     * GET /api/v1/customers/email/{email}
     * Get customer by email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<CustomerResponseDto>> getCustomerByEmail(
            @PathVariable String email) {
        CustomerResponseDto customer = customerService.getCustomerByEmail(email);
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", customer));
    }

    /**
     * GET /api/v1/customers
     * Get all customers (paginated)
     * Optional: ?search=keyword to search by name or email
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CustomerResponseDto>>> getAllCustomers(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "customerId") String sortBy,
            @RequestParam(defaultValue = "asc")        String direction,
            @RequestParam(required = false)            String search) {

        Sort.Direction sortDir = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sortBy));

        Page<CustomerResponseDto> customers = (search != null && !search.isBlank())
                ? customerService.searchCustomers(search, pageable)
                : customerService.getAllCustomers(pageable);

        return ResponseEntity.ok(ApiResponse.success("Customers retrieved successfully", customers));
    }

    /**
     * PUT /api/v1/customers/{id}
     * Update customer information
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponseDto>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerUpdateDto updateDto) {
        CustomerResponseDto updated = customerService.updateCustomer(id, updateDto);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", updated));
    }

    /**
     * DELETE /api/v1/customers/{id}
     * Soft-delete a customer
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer deleted successfully"));
    }

    /**
     * GET /api/v1/customers/{id}/orders
     * Retrieve customer order history (via Order Service)
     */
    @GetMapping("/{id}/orders")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCustomerOrderHistory(
            @PathVariable Long id) {
        List<Map<String, Object>> orders = customerService.getCustomerOrderHistory(id);
        return ResponseEntity.ok(ApiResponse.success("Order history retrieved successfully", orders));
    }
}

