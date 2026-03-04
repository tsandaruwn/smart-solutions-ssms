package com.ssms.customerservice.repository;

import com.ssms.customerservice.entity.Customer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@DisplayName("CustomerRepository Integration Tests")
class CustomerRepositoryTest {

    @Autowired
    private CustomerRepository customerRepository;

    private Customer customer1;

    @BeforeEach
    void setUp() {
        customerRepository.deleteAll();

        customer1 = customerRepository.save(Customer.builder()
                .email("alice@example.com")
                .firstName("Alice")
                .lastName("Smith")
                .phone("+1111111111")
                .city("New York")
                .country("USA")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .registrationDate(LocalDateTime.now())
                .isDeleted(false)
                .build());
    }

    // ── findByEmail ───────────────────────────────────────────────────────────
    @Nested
    @DisplayName("findByEmail")
    class FindByEmail {

        @Test
        @DisplayName("should find customer by email")
        void shouldFindCustomerByEmail() {
            Optional<Customer> found = customerRepository.findByEmail("alice@example.com");

            assertThat(found).isPresent();
            assertThat(found.get().getFirstName()).isEqualTo("Alice");
        }

        @Test
        @DisplayName("should return empty when email not found")
        void shouldReturnEmptyForUnknownEmail() {
            Optional<Customer> found = customerRepository.findByEmail("unknown@example.com");

            assertThat(found).isEmpty();
        }

        @Test
        @DisplayName("should not find soft-deleted customer by email")
        void shouldNotFindSoftDeletedCustomer() {
            customer1.setIsDeleted(true);
            customer1.setDeletedAt(LocalDateTime.now());
            customerRepository.save(customer1);

            Optional<Customer> found = customerRepository.findByEmail("alice@example.com");

            assertThat(found).isEmpty();
        }
    }

    // ── existsByEmail ─────────────────────────────────────────────────────────
    @Nested
    @DisplayName("existsByEmail")
    class ExistsByEmail {

        @Test
        @DisplayName("should return true when email exists")
        void shouldReturnTrueWhenEmailExists() {
            assertThat(customerRepository.existsByEmail("alice@example.com")).isTrue();
        }

        @Test
        @DisplayName("should return false when email does not exist")
        void shouldReturnFalseWhenEmailNotExists() {
            assertThat(customerRepository.existsByEmail("nobody@example.com")).isFalse();
        }
    }

    // ── findAll (with soft-delete filter) ────────────────────────────────────
    @Nested
    @DisplayName("findAll with @SQLRestriction")
    class FindAll {

        @Test
        @DisplayName("should return only active customers")
        void shouldReturnOnlyActiveCustomers() {
            Page<Customer> page = customerRepository.findAll(PageRequest.of(0, 10));
            assertThat(page.getTotalElements()).isEqualTo(2);
        }

        @Test
        @DisplayName("should exclude soft-deleted customers from findAll")
        void shouldExcludeSoftDeletedFromFindAll() {
            customer1.setIsDeleted(true);
            customer1.setDeletedAt(LocalDateTime.now());
            customerRepository.save(customer1);

            Page<Customer> page = customerRepository.findAll(PageRequest.of(0, 10));

            assertThat(page.getTotalElements()).isEqualTo(1);
            assertThat(page.getContent().get(0).getEmail()).isEqualTo("bob@example.com");
        }
    }

    // ── searchCustomers ───────────────────────────────────────────────────────
    @Nested
    @DisplayName("searchCustomers")
    class SearchCustomers {

        @Test
        @DisplayName("should find customer by first name keyword")
        void shouldFindByFirstName() {
            Page<Customer> result = customerRepository.searchCustomers("alice", PageRequest.of(0, 10));

            assertThat(result.getTotalElements()).isEqualTo(1);
            assertThat(result.getContent().get(0).getFirstName()).isEqualTo("Alice");
        }

        @Test
        @DisplayName("should find customer by email keyword")
        void shouldFindByEmailKeyword() {
            Page<Customer> result = customerRepository.searchCustomers("bob@", PageRequest.of(0, 10));

            assertThat(result.getTotalElements()).isEqualTo(1);
            assertThat(result.getContent().get(0).getEmail()).isEqualTo("bob@example.com");
        }

        @Test
        @DisplayName("should return all matching customers")
        void shouldReturnAllMatchingCustomers() {
            Page<Customer> result = customerRepository.searchCustomers("example", PageRequest.of(0, 10));

            assertThat(result.getTotalElements()).isEqualTo(2);
        }

        @Test
        @DisplayName("should return empty when no match")
        void shouldReturnEmptyWhenNoMatch() {
            Page<Customer> result = customerRepository.searchCustomers("xyz_nonexistent", PageRequest.of(0, 10));

            assertThat(result.getTotalElements()).isEqualTo(0);
        }
    }

    // ── save / persist ────────────────────────────────────────────────────────
    @Nested
    @DisplayName("save customer")
    class SaveCustomer {

        @Test
        @DisplayName("should persist and auto-assign ID")
        void shouldPersistCustomer() {
            Customer newCustomer = Customer.builder()
                    .email("carol@example.com")
                    .firstName("Carol")
                    .lastName("Williams")
                    .registrationDate(LocalDateTime.now())
                    .isDeleted(false)
                    .build();

            Customer saved = customerRepository.save(newCustomer);

            assertThat(saved.getCustomerId()).isNotNull();
            assertThat(saved.getEmail()).isEqualTo("carol@example.com");
        }
    }
}
