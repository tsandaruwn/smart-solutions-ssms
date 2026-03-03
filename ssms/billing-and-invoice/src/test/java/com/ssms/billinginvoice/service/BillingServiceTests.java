package com.ssms.billinginvoice.service;

import com.ssms.billinginvoice.dto.BillDto;
import com.ssms.billinginvoice.entity.Bill;
import com.ssms.billinginvoice.repository.BillRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class BillingServiceTests {

    @Autowired
    private BillingService billingService;

    @Autowired
    private BillRepository billRepository;

    @Test
    void fullCrudFlow() {
        // generate invoice for an order
        BillDto created = billingService.generateBill(123L);
        assertNotNull(created);
        Long id = created.getBillId();
        assertNotNull(id);

        // read it back
        Bill fetched = billingService.getBill(id);
        assertEquals(created.getTotalAmount(), fetched.getTotalAmount());

        // update status
        fetched.setStatus("PAID");
        Bill updated = billingService.updateBill(id, fetched);
        assertEquals("PAID", updated.getStatus());

        // delete
        billingService.deleteBill(id);
        assertFalse(billRepository.findById(id).isPresent());
    }
}
