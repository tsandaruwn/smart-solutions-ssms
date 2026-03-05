package com.ssms.customerservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(
    name = "order-service",
    url = "${services.order-service.url:http://localhost:8084}"
)
public interface OrderServiceClient {

    @GetMapping("/api/v1/orders/customer/{customerId}")
    List<Map<String, Object>> getOrdersByCustomerId(@PathVariable("customerId") Long customerId);
}
