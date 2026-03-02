package com.ssms.billinginvoice.client;

import com.ssms.billinginvoice.dto.OrderDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for the order-management microservice.
 * Base URL is configured via order-service.url in application.yaml.
 */
@FeignClient(name = "order-management", url = "${order-service.url}")
public interface OrderClient {

    /**
     * GET /api/orders/{orderId}
     * Fetch a single order with all its line items.
     */
    @GetMapping("/api/orders/{orderId}")
    OrderDto getOrderById(@PathVariable("orderId") Long orderId);
}
