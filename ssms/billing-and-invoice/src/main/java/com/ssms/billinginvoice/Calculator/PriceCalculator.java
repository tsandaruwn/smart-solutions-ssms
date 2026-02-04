package com.ssms.billinginvoice.Calculator;

import com.ssms.billinginvoice.dto.OrderDto;
import com.ssms.billinginvoice.dto.OrderItemDto;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class PriceCalculator {
    
 private static final BigDecimal TAX_RATE = new BigDecimal("0.10"); // 10%

    public BigDecimal calculateSubtotal(OrderDto order) {
        return order.getItems().stream()
                .map(item ->
                        item.getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal calculateTax(BigDecimal subtotal) {
        return subtotal.multiply(TAX_RATE);
    }
}
