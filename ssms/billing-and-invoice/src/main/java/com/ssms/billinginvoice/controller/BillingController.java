
package com.ssms.billinginvoice.controller;

import com.ssms.billinginvoice.dto.BillDto;
import com.ssms.billinginvoice.entity.Bill;
import com.ssms.billinginvoice.service.BillingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @PostMapping("/orders/{orderId}")
    public BillDto generateBill(@PathVariable Long orderId) {
        return billingService.generateBill(orderId);
    }

    @GetMapping("/customers/{customerId}")
    public List<Bill> getBills(@PathVariable Long customerId) {
        return billingService.getBillsByCustomer(customerId);
    }

    @GetMapping("/invoices/{invoiceId}/customer")
    public com.ssms.billinginvoice.dto.CustomerDto getInvoiceCustomer(@PathVariable Long invoiceId) {
        return billingService.getInvoiceCustomer(invoiceId);
    }

    @GetMapping("/invoices/{invoiceId}/payments")
    public List<com.ssms.billinginvoice.dto.PaymentDto> getPayments(@PathVariable Long invoiceId) {
        return billingService.getPaymentsForInvoice(invoiceId);
    }

    @PostMapping("/invoices/{invoiceId}/payments")
    public com.ssms.billinginvoice.dto.PaymentDto addPayment(@PathVariable Long invoiceId,
            @RequestBody com.ssms.billinginvoice.dto.PaymentDto payment) {
        return billingService.recordPayment(invoiceId, payment);
    }

    // CRUD on invoices themselves
    @GetMapping("/invoices/{invoiceId}")
    public Bill getInvoice(@PathVariable Long invoiceId) {
        return billingService.getBill(invoiceId);
    }

    @PutMapping("/invoices/{invoiceId}")
    public Bill updateInvoice(@PathVariable Long invoiceId,
            @RequestBody Bill bill) {
        return billingService.updateBill(invoiceId, bill);
    }

    @DeleteMapping("/invoices/{invoiceId}")
    public void deleteInvoice(@PathVariable Long invoiceId) {
        billingService.deleteBill(invoiceId);
    }
}
