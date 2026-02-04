
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

    @GetMapping("/users/{userId}")
    public List<Bill> getBills(@PathVariable Long userId) {
        return billingService.getBillsByUser(userId);
    }
}
