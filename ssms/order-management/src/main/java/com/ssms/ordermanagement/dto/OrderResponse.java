package com.ssms.ordermanagement.dto;

import com.ssms.ordermanagement.entity.Order;
import com.ssms.ordermanagement.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Integer orderId;
    private String orderNumber;
    private Integer customerId;
    private Integer createdByUserId;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private String shippingAddress;
    private String shippingCity;
    private BigDecimal totalAmount;
    private String notes;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> items;

    public static OrderResponse fromEntity(Order order) {
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomerId())
                .createdByUserId(order.getCreatedByUserId())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .shippingCity(order.getShippingCity())
                .totalAmount(order.getTotalAmount())
                .notes(order.getNotes())
                .cancelledAt(order.getCancelledAt())
                .cancellationReason(order.getCancellationReason())
                .updatedAt(order.getUpdatedAt())
                .items(order.getItems() != null
                        ? order.getItems().stream()
                            .map(OrderItemResponse::fromEntity)
                            .collect(Collectors.toList())
                        : List.of())
                .build();
    }
}
