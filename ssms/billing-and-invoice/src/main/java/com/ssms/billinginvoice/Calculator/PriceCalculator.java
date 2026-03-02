package com.ssms.billinginvoice.Calculator;

import com.ssms.billinginvoice.dto.OrderDto;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class PriceCalculator {

    private static final BigDecimal TAX_RATE = new BigDecimal("0.10"); // 10%

    public BigDecimal calculateSubtotal(OrderDto order) {
        return order.getItems().stream()
                // use lineTotal (already has discount applied); fall back to unitPrice * qty
                .map(item -> item.getLineTotal() != null
                        ? item.getLineTotal()
                        : item.getUnitPriceAtOrder()
                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal calculateTax(BigDecimal subtotal) {
        return subtotal.multiply(TAX_RATE);
    }
}
