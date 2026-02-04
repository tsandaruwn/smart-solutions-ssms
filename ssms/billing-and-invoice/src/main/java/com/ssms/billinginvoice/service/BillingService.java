
package com.ssms.billinginvoice.service;

import com.ssms.billinginvoice.Calculator.PriceCalculator;
import com.ssms.billinginvoice.client.OrderClient;
import com.ssms.billinginvoice.dto.BillDto;
import com.ssms.billinginvoice.dto.OrderDto;
import com.ssms.billinginvoice.entity.Bill;
import com.ssms.billinginvoice.repository.BillRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BillingService {

    private final BillRepository billRepository;
    private final OrderClient orderClient;
    private final PriceCalculator priceCalculator;

    public BillingService(BillRepository billRepository,
            OrderClient orderClient,
            PriceCalculator priceCalculator) {
        this.billRepository = billRepository;
        this.orderClient = orderClient;
        this.priceCalculator = priceCalculator;
    }

    public BillDto generateBill(Long orderId) {

        OrderDto order = orderClient.getOrderById(orderId);

        BigDecimal subtotal = priceCalculator.calculateSubtotal(order);
        BigDecimal tax = priceCalculator.calculateTax(subtotal);
        BigDecimal total = subtotal.add(tax);

        Bill bill = new Bill();
        bill.setOrderId(orderId);
        bill.setUserId(order.getUserId());
        bill.setSubtotal(subtotal);
        bill.setTax(tax);
        bill.setTotalAmount(total);

        Bill savedBill = billRepository.save(bill);

        return new BillDto(
                savedBill.getId(),
                subtotal,
                tax,
                total,
                savedBill.getStatus());
    }

    public List<Bill> getBillsByUser(Long userId) {
        return billRepository.findByUserId(userId);
    }
}
