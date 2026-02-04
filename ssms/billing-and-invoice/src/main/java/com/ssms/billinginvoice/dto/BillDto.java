package com.ssms.billinginvoice.dto;

import java.math.BigDecimal;

public class BillDto {

    private Long billId;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal totalAmount;
    private String status;

    public BillDto(Long billId, BigDecimal subtotal,
            BigDecimal tax, BigDecimal totalAmount,
            String status) {
        this.billId = billId;
        this.subtotal = subtotal;
        this.tax = tax;
        this.totalAmount = totalAmount;
        this.status = status;
    }

    public Long getBillId() {
        return billId;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }
}
