package com.ssms.billinginvoice.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Mirrors com.ssms.payment.dto.PaymentResponse / PaymentRequest.
 * Used as both the request body sent to payment-management and
 * the response deserialized back from it.
 */
@Data
public class PaymentDto {
    private Long paymentId;
    private String transactionReference;
    private Long invoiceId;
    private Long customerId;
    private Long paymentMethodId;
    private String paymentMethodName;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private String status; // SUCCESS, FAILED, PENDING, REFUNDED …
    private String gatewayResponse;
    private BigDecimal refundAmount;
    private LocalDateTime refundDate;
    private String refundReason;
}