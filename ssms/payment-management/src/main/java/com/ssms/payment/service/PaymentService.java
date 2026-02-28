package com.ssms.payment.service;

import com.ssms.payment.dto.PaymentRequest;
import com.ssms.payment.dto.PaymentResponse;
import com.ssms.payment.entity.Payment;
import com.ssms.payment.entity.PaymentStatus;
import com.ssms.payment.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // Create a new payment transaction
    public PaymentResponse createPayment(PaymentRequest request) {
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setUserId(request.getUserId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionId(request.getTransactionId());
        payment.setPaymentReference(request.getPaymentReference());
        payment.setRemarks(request.getRemarks());
        payment.setStatus(PaymentStatus.PENDING);
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

    // Get payment history by user ID
    public List<PaymentResponse> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get payments by order ID
    public List<PaymentResponse> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update payment status (Success, Failed, Refunded)
    public PaymentResponse updatePaymentStatus(Long id, PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        
        payment.setStatus(status);
        
        Payment updatedPayment = paymentRepository.save(payment);
        return mapToResponse(updatedPayment);
    }

    // Process refund
    public PaymentResponse processRefund(Long id, String remarks) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new RuntimeException("Only successful payments can be refunded");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setRefundDate(LocalDateTime.now());
        payment.setRemarks(remarks);

        Payment refundedPayment = paymentRepository.save(payment);
        return mapToResponse(refundedPayment);
    }

    // Update payment
    public PaymentResponse updatePayment(Long id, PaymentRequest request) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionId(request.getTransactionId());
        payment.setPaymentReference(request.getPaymentReference());
        payment.setRemarks(request.getRemarks());

        Payment updatedPayment = paymentRepository.save(payment);
        return mapToResponse(updatedPayment);
    }

    // Delete payment
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        paymentRepository.delete(payment);
    }

    // Helper method to map Payment entity to PaymentResponse DTO
    private PaymentResponse mapToResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrderId(),
                payment.getUserId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getStatus(),
                payment.getTransactionId(),
                payment.getPaymentReference(),
                payment.getPaymentDate(),
                payment.getRefundDate(),
                payment.getRemarks()
        );
    }
}
