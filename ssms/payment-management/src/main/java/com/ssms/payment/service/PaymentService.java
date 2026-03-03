package com.ssms.payment.service;

import com.ssms.payment.dto.PaymentRequest;
import com.ssms.payment.dto.PaymentResponse;
import com.ssms.payment.entity.Payment;
import com.ssms.payment.entity.PaymentMethod;
import com.ssms.payment.entity.PaymentStatus;
import com.ssms.payment.repository.PaymentMethodRepository;
import com.ssms.payment.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentService(PaymentRepository paymentRepository, 
                         PaymentMethodRepository paymentMethodRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    // Create a new payment transaction
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        // Validate payment method exists
        PaymentMethod paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                .orElseThrow(() -> new RuntimeException("Payment method not found with id: " + request.getPaymentMethodId()));

        if (!paymentMethod.getIsActive()) {
            throw new RuntimeException("Payment method is not active");
        }

        Payment payment = new Payment();
        payment.setTransactionReference(request.getTransactionReference());
        payment.setInvoiceId(request.getInvoiceId());
        payment.setCustomerId(request.getCustomerId());
        payment.setPaymentMethod(paymentMethod);
        payment.setAmount(request.getAmount());
        payment.setGatewayResponse(request.getGatewayResponse());
        payment.setStatus(PaymentStatus.Pending);
        payment.setPaymentDate(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }

    // Get payment by ID
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return mapToResponse(payment);
    }

    // Get all payments
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get payment history by customer ID
    public List<PaymentResponse> getPaymentsByCustomerId(Long customerId) {
        return paymentRepository.findByCustomerId(customerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get payments by invoice ID
    public List<PaymentResponse> getPaymentsByInvoiceId(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get payment by transaction reference
    public PaymentResponse getPaymentByTransactionReference(String transactionReference) {
        Payment payment = paymentRepository.findByTransactionReference(transactionReference)
                .orElseThrow(() -> new RuntimeException("Payment not found with transaction reference: " + transactionReference));
        return mapToResponse(payment);
    }

    // Update payment status (Pending, Success, Failed)
    @Transactional
    public PaymentResponse updatePaymentStatus(Long id, PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        
        payment.setStatus(status);
        
        Payment updatedPayment = paymentRepository.save(payment);
        return mapToResponse(updatedPayment);
    }

    // Process refund
    @Transactional
    public PaymentResponse processRefund(Long id, String refundReason, java.math.BigDecimal refundAmount) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        if (payment.getStatus() != PaymentStatus.Success) {
            throw new RuntimeException("Only successful payments can be refunded");
        }

        if (refundAmount != null && refundAmount.compareTo(payment.getAmount()) > 0) {
            throw new RuntimeException("Refund amount cannot exceed payment amount");
        }

        payment.setRefundAmount(refundAmount != null ? refundAmount : payment.getAmount());
        payment.setRefundDate(LocalDateTime.now());
        payment.setRefundReason(refundReason);
        payment.setStatus(PaymentStatus.Failed); // Or keep as Success and track via refund fields

        Payment refundedPayment = paymentRepository.save(payment);
        return mapToResponse(refundedPayment);
    }

    // Update payment
    @Transactional
    public PaymentResponse updatePayment(Long id, PaymentRequest request) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        // Validate payment method exists
        if (request.getPaymentMethodId() != null) {
            PaymentMethod paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                    .orElseThrow(() -> new RuntimeException("Payment method not found with id: " + request.getPaymentMethodId()));
            payment.setPaymentMethod(paymentMethod);
        }

        if (request.getAmount() != null) {
            payment.setAmount(request.getAmount());
        }
        if (request.getTransactionReference() != null) {
            payment.setTransactionReference(request.getTransactionReference());
        }
        if (request.getGatewayResponse() != null) {
            payment.setGatewayResponse(request.getGatewayResponse());
        }

        Payment updatedPayment = paymentRepository.save(payment);
        return mapToResponse(updatedPayment);
    }

    // Delete payment
    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        paymentRepository.delete(payment);
    }

    // Helper method to map Payment entity to PaymentResponse DTO
    private PaymentResponse mapToResponse(Payment payment) {
        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getTransactionReference(),
                payment.getInvoiceId(),
                payment.getCustomerId(),
                payment.getPaymentMethod() != null ? payment.getPaymentMethod().getPaymentMethodId() : null,
                payment.getPaymentMethod() != null ? payment.getPaymentMethod().getMethodName() : null,
                payment.getAmount(),
                payment.getPaymentDate(),
                payment.getStatus(),
                payment.getGatewayResponse(),
                payment.getRefundAmount(),
                payment.getRefundDate(),
                payment.getRefundReason()
        );
    }
}
