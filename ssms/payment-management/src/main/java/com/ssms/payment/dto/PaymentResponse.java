package com.ssms.payment.dto;

import com.ssms.payment.entity.PaymentMethod;
import com.ssms.payment.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {

    private Long id;
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionId;
    private String paymentReference;
    private LocalDateTime paymentDate;
    private LocalDateTime refundDate;
    private String remarks;

    public PaymentResponse() {}

    public PaymentResponse(Long id, Long orderId, Long userId, BigDecimal amount, 
                          PaymentMethod paymentMethod, PaymentStatus status, 
                          String transactionId, String paymentReference, 
                          LocalDateTime paymentDate, LocalDateTime refundDate, String remarks) {
        this.id = id;
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.transactionId = transactionId;
        this.paymentReference = paymentReference;
        this.paymentDate = paymentDate;
        this.refundDate = refundDate;
        this.remarks = remarks;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public LocalDateTime getRefundDate() {
        return refundDate;
    }

    public void setRefundDate(LocalDateTime refundDate) {
        this.refundDate = refundDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
