package com.ssms.ordermanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "order_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Integer orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_id", nullable = false)
    private Integer productId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price_at_order", precision = 10, scale = 2)
    private BigDecimal unitPriceAtOrder;

    @Column(name = "discount_percent", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal discountPercent = BigDecimal.ZERO;

    @Column(name = "line_total", precision = 12, scale = 2, insertable = false, updatable = false)
    private BigDecimal lineTotal;

    public BigDecimal computeLineTotal() {
        if (unitPriceAtOrder == null || quantity == null) return BigDecimal.ZERO;
        BigDecimal gross = unitPriceAtOrder.multiply(BigDecimal.valueOf(quantity));
        if (discountPercent != null && discountPercent.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountFactor = BigDecimal.ONE.subtract(
                    discountPercent.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
            return gross.multiply(discountFactor).setScale(2, RoundingMode.HALF_UP);
        }
        return gross.setScale(2, RoundingMode.HALF_UP);
    }
}
