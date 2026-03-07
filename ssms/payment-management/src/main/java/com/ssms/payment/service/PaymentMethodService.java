package com.ssms.payment.service;

import com.ssms.payment.dto.PaymentMethodRequest;
import com.ssms.payment.dto.PaymentMethodResponse;
import com.ssms.payment.entity.PaymentMethod;
import com.ssms.payment.repository.PaymentMethodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentMethodService(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @Transactional
    public PaymentMethodResponse createPaymentMethod(PaymentMethodRequest request) {
        if (paymentMethodRepository.existsByMethodName(request.getMethodName())) {
            throw new RuntimeException("Payment method with name '" + request.getMethodName() + "' already exists");
        }

        PaymentMethod paymentMethod = new PaymentMethod(
                request.getMethodName(),
                request.getType(),
                request.getDescription(),
                request.getIsActive()
        );

        PaymentMethod savedPaymentMethod = paymentMethodRepository.save(paymentMethod);
        return mapToResponse(savedPaymentMethod);
    }

    public PaymentMethodResponse getPaymentMethodById(Long id) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found with id: " + id));
        return mapToResponse(paymentMethod);
    }

    public List<PaymentMethodResponse> getAllPaymentMethods() {
        return paymentMethodRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentMethodResponse> getActivePaymentMethods() {
        return paymentMethodRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PaymentMethodResponse getPaymentMethodByName(String methodName) {
        PaymentMethod paymentMethod = paymentMethodRepository.findByMethodName(methodName)
                .orElseThrow(() -> new RuntimeException("Payment method not found with name: " + methodName));
        return mapToResponse(paymentMethod);
    }

    @Transactional
    public PaymentMethodResponse updatePaymentMethod(Long id, PaymentMethodRequest request) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found with id: " + id));

        if (!paymentMethod.getMethodName().equals(request.getMethodName()) &&
                paymentMethodRepository.existsByMethodName(request.getMethodName())) {
            throw new RuntimeException("Payment method with name '" + request.getMethodName() + "' already exists");
        }

        paymentMethod.setMethodName(request.getMethodName());
        paymentMethod.setType(request.getType());
        paymentMethod.setDescription(request.getDescription());
        if (request.getIsActive() != null) {
            paymentMethod.setIsActive(request.getIsActive());
        }

        PaymentMethod updatedPaymentMethod = paymentMethodRepository.save(paymentMethod);
        return mapToResponse(updatedPaymentMethod);
    }

    @Transactional
    public PaymentMethodResponse togglePaymentMethodStatus(Long id) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found with id: " + id));

        paymentMethod.setIsActive(!paymentMethod.getIsActive());

        PaymentMethod updatedPaymentMethod = paymentMethodRepository.save(paymentMethod);
        return mapToResponse(updatedPaymentMethod);
    }

    @Transactional
    public void deletePaymentMethod(Long id) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found with id: " + id));
        paymentMethodRepository.delete(paymentMethod);
    }

    private PaymentMethodResponse mapToResponse(PaymentMethod paymentMethod) {
        return new PaymentMethodResponse(
                paymentMethod.getPaymentMethodId(),
                paymentMethod.getMethodName(),
                paymentMethod.getType(),
                paymentMethod.getDescription(),
                paymentMethod.getIsActive()
        );
    }
}
