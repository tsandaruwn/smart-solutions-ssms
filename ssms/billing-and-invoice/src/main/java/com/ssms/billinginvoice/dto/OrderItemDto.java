package com.ssms.billinginvoice.dto;

import java.math.BigDecimal;

public class OrderItemDto {

    private String productName;
    private BigDecimal price;
    private int quantity;

    public BigDecimal getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }
}
