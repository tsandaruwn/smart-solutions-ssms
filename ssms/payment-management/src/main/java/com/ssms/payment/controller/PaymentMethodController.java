package com.ssms.payment.controller;

import com.ssms.payment.dto.PaymentMethodRequest;
import com.ssms.payment.dto.PaymentMethodResponse;
import com.ssms.payment.service.PaymentMethodService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @PostMapping
    public ResponseEntity<?> createPaymentMethod(@Valid @RequestBody PaymentMethodRequest request) {
        try {
            PaymentMethodResponse response = paymentMethodService.createPaymentMethod(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    private record ErrorResponse(String message) {}

    @GetMapping
    public ResponseEntity<List<PaymentMethodResponse>> getAllPaymentMethods() {
        List<PaymentMethodResponse> paymentMethods = paymentMethodService.getAllPaymentMethods();
        return ResponseEntity.ok(paymentMethods);
    }

    @GetMapping("/active")
    public ResponseEntity<List<PaymentMethodResponse>> getActivePaymentMethods() {
        List<PaymentMethodResponse> paymentMethods = paymentMethodService.getActivePaymentMethods();
        return ResponseEntity.ok(paymentMethods);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethodResponse> getPaymentMethodById(@PathVariable Long id) {
        PaymentMethodResponse response = paymentMethodService.getPaymentMethodById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/name/{methodName}")
    public ResponseEntity<PaymentMethodResponse> getPaymentMethodByName(@PathVariable String methodName) {
        PaymentMethodResponse response = paymentMethodService.getPaymentMethodByName(methodName);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentMethodResponse> updatePaymentMethod(
            @PathVariable Long id,
            @Valid @RequestBody PaymentMethodRequest request) {
        PaymentMethodResponse response = paymentMethodService.updatePaymentMethod(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<PaymentMethodResponse> togglePaymentMethodStatus(@PathVariable Long id) {
        PaymentMethodResponse response = paymentMethodService.togglePaymentMethodStatus(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(id);
        return ResponseEntity.noContent().build();
    }
}
