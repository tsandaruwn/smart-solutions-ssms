package com.ssms.billinginvoice.client;

import com.ssms.billinginvoice.dto.CustomerDto;
import org.springframework.stereotype.Component;

@Component
public class CustomerClient {

    // temporary mock; replace with real REST/Feign call to customer-service
    public CustomerDto getCustomerById(Long customerId) {
        return new CustomerDto() {
            public Long getCustomerId() {
                return customerId;
            }

            public String getName() {
                return "Mock Customer";
            }

            public String getEmail() {
                return "customer@example.com";
            }
        };
    }
}