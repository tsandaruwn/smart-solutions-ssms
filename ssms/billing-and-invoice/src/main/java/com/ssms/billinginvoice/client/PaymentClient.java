package com.ssms.billinginvoice.client;

import com.ssms.billinginvoice.dto.PaymentDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PaymentClient {

    // mock storage keyed by invoiceId
    private final Map<Long, List<PaymentDto>> payments = new HashMap<>();
    private long nextId = 1;

    public List<PaymentDto> getPaymentsByInvoiceId(Long invoiceId) {
        return payments.getOrDefault(invoiceId, List.of());
    }

    public PaymentDto createPayment(PaymentDto dto) {
        dto.setTimestamp(LocalDateTime.now());
        dto.setPaymentId(nextId++);
        dto.setStatus("SUCCESS");
        payments.computeIfAbsent(dto.getInvoiceId(), k -> new ArrayList<>()).add(dto);
        return dto;
    }

    public BigDecimal getTotalPaidForInvoice(Long invoiceId) {
        return getPaymentsByInvoiceId(invoiceId).stream()
                .map(PaymentDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}