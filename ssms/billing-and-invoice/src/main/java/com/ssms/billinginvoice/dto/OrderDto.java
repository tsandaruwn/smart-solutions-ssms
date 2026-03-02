package com.ssms.billinginvoice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Mirrors the OrderResponse shape returned by the order-management service
 * at GET /api/orders/{orderId}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {

    private Integer orderId;
    private String orderNumber;
    private Integer customerId; // replaces the old userId field
    private Integer createdByUserId;
    private LocalDateTime orderDate;
    private String status;
    private String shippingAddress;
    private String shippingCity;
    private BigDecimal totalAmount;
    private String notes;
    private List<OrderItemDto> items;
}
