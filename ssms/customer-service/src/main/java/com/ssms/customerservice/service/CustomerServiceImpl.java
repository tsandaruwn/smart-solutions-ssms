package com.ssms.customerservice.service;

import com.ssms.customerservice.client.OrderServiceClient;
import com.ssms.customerservice.dto.CustomerRequestDto;
import com.ssms.customerservice.dto.CustomerResponseDto;
import com.ssms.customerservice.dto.CustomerUpdateDto;
import com.ssms.customerservice.entity.Customer;
import com.ssms.customerservice.exception.CustomerNotFoundException;
import com.ssms.customerservice.exception.EmailAlreadyExistsException;
import com.ssms.customerservice.repository.CustomerRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderServiceClient orderServiceClient;

    @Override
    public CustomerResponseDto createCustomer(CustomerRequestDto requestDto) {
        log.info("Creating customer with email: {}", requestDto.getEmail());

        if (customerRepository.existsByEmail(requestDto.getEmail())) {
            throw new EmailAlreadyExistsException(requestDto.getEmail());
        }

        Customer customer = Customer.builder()
                .email(requestDto.getEmail())
                .firstName(requestDto.getFirstName())
                .lastName(requestDto.getLastName())
                .phone(requestDto.getPhone())
                .addressLine1(requestDto.getAddressLine1())
                .addressLine2(requestDto.getAddressLine2())
                .city(requestDto.getCity())
                .state(requestDto.getState())
                .country(requestDto.getCountry())
                .postalCode(requestDto.getPostalCode())
                .dateOfBirth(requestDto.getDateOfBirth())
                .isDeleted(false)
                .build();

        Customer saved = customerRepository.save(customer);
        log.info("Customer created with id: {}", saved.getCustomerId());
        return mapToResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDto getCustomerById(Long id) {
        log.info("Fetching customer by id: {}", id);
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
        return mapToResponseDto(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDto getCustomerByEmail(String email) {
        log.info("Fetching customer by email: {}", email);
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new CustomerNotFoundException(
                        "Customer not found with email: " + email));
        return mapToResponseDto(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponseDto> getAllCustomers(Pageable pageable) {
        log.info("Fetching all customers - page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());
        return customerRepository.findAll(pageable).map(this::mapToResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponseDto> searchCustomers(String keyword, Pageable pageable) {
        log.info("Searching customers with keyword: {}", keyword);
        return customerRepository.searchCustomers(keyword, pageable).map(this::mapToResponseDto);
    }

    @Override
    public CustomerResponseDto updateCustomer(Long id, CustomerUpdateDto updateDto) {
        log.info("Updating customer with id: {}", id);
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));

        if (updateDto.getEmail() != null && !updateDto.getEmail().equals(customer.getEmail())) {
            if (customerRepository.existsByEmail(updateDto.getEmail())) {
                throw new EmailAlreadyExistsException(updateDto.getEmail());
            }
            customer.setEmail(updateDto.getEmail());
        }

        if (updateDto.getFirstName() != null)  customer.setFirstName(updateDto.getFirstName());
        if (updateDto.getLastName() != null)   customer.setLastName(updateDto.getLastName());
        if (updateDto.getPhone() != null)      customer.setPhone(updateDto.getPhone());
        if (updateDto.getAddressLine1() != null) customer.setAddressLine1(updateDto.getAddressLine1());
        if (updateDto.getAddressLine2() != null) customer.setAddressLine2(updateDto.getAddressLine2());
        if (updateDto.getCity() != null)       customer.setCity(updateDto.getCity());
        if (updateDto.getState() != null)      customer.setState(updateDto.getState());
        if (updateDto.getCountry() != null)    customer.setCountry(updateDto.getCountry());
        if (updateDto.getPostalCode() != null) customer.setPostalCode(updateDto.getPostalCode());
        if (updateDto.getDateOfBirth() != null) customer.setDateOfBirth(updateDto.getDateOfBirth());

        Customer updated = customerRepository.save(customer);
        log.info("Customer updated with id: {}", updated.getCustomerId());
        return mapToResponseDto(updated);
    }

    @Override
    public void deleteCustomer(Long id) {
        log.info("Soft-deleting customer with id: {}", id);
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));

        customer.setIsDeleted(true);
        customer.setDeletedAt(LocalDateTime.now());
        customerRepository.save(customer);
        log.info("Customer soft-deleted with id: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getCustomerOrderHistory(Long customerId) {
        log.info("Fetching order history for customer id: {}", customerId);

        customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException(customerId));

        try {
            return orderServiceClient.getOrdersByCustomerId(customerId);
        } catch (FeignException e) {
            log.warn("Order service unavailable for customer {}: {}", customerId, e.getMessage());
            return Collections.emptyList();
        } catch (Exception e) {
            log.warn("Unable to fetch orders for customer {}: {}", customerId, e.getMessage());
            return Collections.emptyList();
        }
    }

    private CustomerResponseDto mapToResponseDto(Customer customer) {
        return CustomerResponseDto.builder()
                .customerId(customer.getCustomerId())
                .email(customer.getEmail())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .phone(customer.getPhone())
                .addressLine1(customer.getAddressLine1())
                .addressLine2(customer.getAddressLine2())
                .city(customer.getCity())
                .state(customer.getState())
                .country(customer.getCountry())
                .postalCode(customer.getPostalCode())
                .dateOfBirth(customer.getDateOfBirth())
                .registrationDate(customer.getRegistrationDate())
                .build();
    }
}
