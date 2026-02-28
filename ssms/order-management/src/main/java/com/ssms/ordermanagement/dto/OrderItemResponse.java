package com.ssms.ordermanagement.dto;

import com.ssms.ordermanagement.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Response DTO for OrderItem data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Integer orderItemId;
    private Integer productId;
    private Integer quantity;
    private BigDecimal unitPriceAtOrder;
    private BigDecimal discountPercent;
    private BigDecimal lineTotal;

    /**
     * Map an OrderItem entity to OrderItemResponse DTO.
     */
    public static OrderItemResponse fromEntity(OrderItem item) {
        return OrderItemResponse.builder()
                .orderItemId(item.getOrderItemId())
                .productId(item.getProductId())
                .quantity(item.getQuantity())
                .unitPriceAtOrder(item.getUnitPriceAtOrder())
                .discountPercent(item.getDiscountPercent())
                .lineTotal(item.getLineTotal() != null ? item.getLineTotal() : item.computeLineTotal())
                .build();
    }
}
