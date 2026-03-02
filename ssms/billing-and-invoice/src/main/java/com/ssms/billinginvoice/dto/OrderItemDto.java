package com.ssms.billinginvoice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

/**
 * Mirrors the OrderItemResponse shape returned by the order-management service.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {

    private Integer orderItemId;
    private Integer productId;
    private Integer quantity;
    private BigDecimal unitPriceAtOrder;
    private BigDecimal discountPercent;
    private BigDecimal lineTotal; // pre-computed by order service (discount applied)
}
