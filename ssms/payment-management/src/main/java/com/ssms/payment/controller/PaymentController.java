package com.ssms.payment.controller;

import com.ssms.payment.dto.PaymentRequest;
import com.ssms.payment.dto.PaymentResponse;
import com.ssms.payment.entity.PaymentStatus;
import com.ssms.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Create a new payment
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all payments
    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        List<PaymentResponse> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    // Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        PaymentResponse response = paymentService.getPaymentById(id);
        return ResponseEntity.ok(response);
    }

    // Get payment by transaction reference
    @GetMapping("/transaction/{transactionReference}")
    public ResponseEntity<PaymentResponse> getPaymentByTransactionReference(@PathVariable String transactionReference) {
        PaymentResponse response = paymentService.getPaymentByTransactionReference(transactionReference);
        return ResponseEntity.ok(response);
    }

    // Get payment history by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByCustomerId(@PathVariable Long customerId) {
        List<PaymentResponse> payments = paymentService.getPaymentsByCustomerId(customerId);
        return ResponseEntity.ok(payments);
    }

    // Get payments by invoice ID
    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByInvoiceId(@PathVariable Long invoiceId) {
        List<PaymentResponse> payments = paymentService.getPaymentsByInvoiceId(invoiceId);
        return ResponseEntity.ok(payments);
    }

    // Update payment
    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.updatePayment(id, request);
        return ResponseEntity.ok(response);
    }

    // Update payment status (Pending, Success, Failed)
    @PatchMapping("/{id}/status")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam PaymentStatus status) {
        PaymentResponse response = paymentService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(response);
    }

    // Process refund
    @PostMapping("/{id}/refund")
    public ResponseEntity<PaymentResponse> processRefund(
            @PathVariable Long id,
            @RequestParam(required = false) String refundReason,
            @RequestParam(required = false) BigDecimal refundAmount) {
        PaymentResponse response = paymentService.processRefund(id, refundReason, refundAmount);
        return ResponseEntity.ok(response);
    }

    // Delete payment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
