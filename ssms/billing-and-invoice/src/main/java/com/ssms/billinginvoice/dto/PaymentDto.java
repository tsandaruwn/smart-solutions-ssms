package com.ssms.billinginvoice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {
    private Long paymentId;
    private Long invoiceId;
    private BigDecimal amount;
    private String status; 
    private LocalDateTime timestamp;

    public Long getPaymentId() {
        return paymentId;
    }

    public Long getInvoiceId() {
        return invoiceId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }
}
