package com.ssms.billinginvoice.client;

import com.ssms.billinginvoice.dto.OrderDto;
import com.ssms.billinginvoice.dto.OrderItemDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class OrderClient {

       // MOCK DATA (replace with REST call later)
    public OrderDto getOrderById(Long orderId) {

        OrderItemDto item = new OrderItemDto();
        item = new OrderItemDto();
        // Simulating a smart switch order

        return new OrderDto() {
            public Long getOrderId() { return orderId; }
            public Long getUserId() { return 1L; }
            public List<OrderItemDto> getItems() {
                OrderItemDto switchItem = new OrderItemDto() {
                    public BigDecimal getPrice() {
                        return new BigDecimal("4500");
                    }
                    public int getQuantity() {
                        return 2;
                    }
                };
                return List.of(switchItem);
            }
        };
    }
}
    
