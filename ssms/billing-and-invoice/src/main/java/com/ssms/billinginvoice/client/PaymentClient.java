package com.ssms.billinginvoice.client;

import com.ssms.billinginvoice.dto.PaymentDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "payment-management", url = "${payment-service.url}")
public interface PaymentClient {

    @PostMapping("/api/payments")
    PaymentDto createPayment(@RequestBody PaymentDto dto);

    @GetMapping("/api/payments/invoice/{invoiceId}")
    List<PaymentDto> getPaymentsByInvoiceId(@PathVariable("invoiceId") Long invoiceId);
}