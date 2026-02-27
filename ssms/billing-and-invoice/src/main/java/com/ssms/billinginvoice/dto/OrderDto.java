package com.ssms.billinginvoice.dto;

import java.util.List;

public class OrderDto {

    private Long orderId;
    private Long userId;
    private List<OrderItemDto> items;

    public Long getOrderId() {
        return orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }
}
