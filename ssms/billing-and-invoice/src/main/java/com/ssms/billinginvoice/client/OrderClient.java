package com.ssms.billinginvoice.client;

import com.ssms.billinginvoice.dto.OrderDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "order-management", url = "${order.service.url}")
public interface OrderClient {

    @GetMapping("/api/orders/{orderId}")
    OrderDto getOrderById(@PathVariable("orderId") Long orderId);
}
