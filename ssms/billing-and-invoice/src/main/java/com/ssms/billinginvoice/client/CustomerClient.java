package com.ssms.billinginvoice.client;

import com.ssms.billinginvoice.dto.CustomerApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer-service", url = "${customer.service.url}")
public interface CustomerClient {

    @GetMapping("/api/v1/customers/{id}")
    CustomerApiResponse getCustomerById(@PathVariable("id") Long id);
}