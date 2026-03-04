package com.ssms.customerservice.service;

import com.ssms.customerservice.dto.CustomerRequestDto;
import com.ssms.customerservice.dto.CustomerResponseDto;
import com.ssms.customerservice.dto.CustomerUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface CustomerService {

    CustomerResponseDto createCustomer(CustomerRequestDto requestDto);

    CustomerResponseDto getCustomerById(Long id);

    CustomerResponseDto getCustomerByEmail(String email);

    Page<CustomerResponseDto> getAllCustomers(Pageable pageable);

    Page<CustomerResponseDto> searchCustomers(String keyword, Pageable pageable);

    CustomerResponseDto updateCustomer(Long id, CustomerUpdateDto updateDto);

    void deleteCustomer(Long id);

    List<Map<String, Object>> getCustomerOrderHistory(Long customerId);
}

