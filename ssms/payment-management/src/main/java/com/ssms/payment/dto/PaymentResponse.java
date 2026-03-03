package com.ssms.payment.dto;

import com.ssms.payment.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {

    private Long paymentId;
    private String transactionReference;
    private Long invoiceId;
    private Long customerId;
    private Long paymentMethodId;
    private String paymentMethodName;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private PaymentStatus status;
    private String gatewayResponse;
    private BigDecimal refundAmount;
    private LocalDateTime refundDate;
    private String refundReason;

    public PaymentResponse() {}

    public PaymentResponse(Long paymentId, String transactionReference, Long invoiceId, 
                          Long customerId, Long paymentMethodId, String paymentMethodName,
                          BigDecimal amount, LocalDateTime paymentDate, PaymentStatus status, 
                          String gatewayResponse, BigDecimal refundAmount, 
                          LocalDateTime refundDate, String refundReason) {
        this.paymentId = paymentId;
        this.transactionReference = transactionReference;
        this.invoiceId = invoiceId;
        this.customerId = customerId;
        this.paymentMethodId = paymentMethodId;
        this.paymentMethodName = paymentMethodName;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.status = status;
        this.gatewayResponse = gatewayResponse;
        this.refundAmount = refundAmount;
        this.refundDate = refundDate;
        this.refundReason = refundReason;
    }

    // Getters and Setters
    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public Long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(Long paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public String getPaymentMethodName() {
        return paymentMethodName;
    }

    public void setPaymentMethodName(String paymentMethodName) {
        this.paymentMethodName = paymentMethodName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getGatewayResponse() {
        return gatewayResponse;
    }

    public void setGatewayResponse(String gatewayResponse) {
        this.gatewayResponse = gatewayResponse;
    }

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public LocalDateTime getRefundDate() {
        return refundDate;
    }

    public void setRefundDate(LocalDateTime refundDate) {
        this.refundDate = refundDate;
    }

    public String getRefundReason() {
        return refundReason;
    }

    public void setRefundReason(String refundReason) {
        this.refundReason = refundReason;
    }
}
