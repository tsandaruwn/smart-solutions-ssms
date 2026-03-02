
package com.ssms.billinginvoice.service;

import com.ssms.billinginvoice.Calculator.PriceCalculator;
import com.ssms.billinginvoice.client.OrderClient;
import com.ssms.billinginvoice.client.CustomerClient;
import com.ssms.billinginvoice.client.PaymentClient;
import com.ssms.billinginvoice.dto.BillDto;
import com.ssms.billinginvoice.dto.OrderDto;
import com.ssms.billinginvoice.dto.CustomerDto;
import com.ssms.billinginvoice.dto.PaymentDto;
import com.ssms.billinginvoice.entity.Bill;
import com.ssms.billinginvoice.repository.BillRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BillingService {

    private final BillRepository billRepository;
    private final OrderClient orderClient;
    private final CustomerClient customerClient;
    private final PaymentClient paymentClient;
    private final PriceCalculator priceCalculator;

    public BillingService(BillRepository billRepository,
            OrderClient orderClient,
            CustomerClient customerClient,
            PaymentClient paymentClient,
            PriceCalculator priceCalculator) {
        this.billRepository = billRepository;
        this.orderClient = orderClient;
        this.customerClient = customerClient;
        this.paymentClient = paymentClient;
        this.priceCalculator = priceCalculator;
    }

    public BillDto generateBill(Long orderId) {

        // ensure only one invoice per order
        if (billRepository.findByOrderId(orderId) != null) {
            throw new IllegalStateException("Invoice already exists for order " + orderId);
        }

        OrderDto order = orderClient.getOrderById(orderId);
        CustomerDto customer = customerClient.getCustomerById(order.getUserId());

        BigDecimal subtotal = priceCalculator.calculateSubtotal(order);
        BigDecimal tax = priceCalculator.calculateTax(subtotal);
        BigDecimal total = subtotal.add(tax);

        Bill bill = new Bill();
        bill.setOrderId(orderId);
        bill.setCustomerId(customer.getCustomerId());
        bill.setSubtotal(subtotal);
        bill.setTax(tax);
        bill.setTotalAmount(total);

        Bill savedBill = billRepository.save(bill);

        return new BillDto(
                savedBill.getId(),
                customer.getCustomerId(),
                subtotal,
                tax,
                total,
                savedBill.getStatus());
    }

    public List<Bill> getBillsByCustomer(Long customerId) {
        return billRepository.findByCustomerId(customerId);
    }

    // ---------- basic CRUD on bills ----------
    public Bill getBill(Long invoiceId) {
        return billRepository.findById(invoiceId).orElseThrow();
    }

    public Bill updateBill(Long invoiceId, Bill updates) {
        Bill existing = getBill(invoiceId);
        // only allow select fields to change; ignore order/customer/created fields
        if (updates.getSubtotal() != null)
            existing.setSubtotal(updates.getSubtotal());
        if (updates.getTax() != null)
            existing.setTax(updates.getTax());
        if (updates.getTotalAmount() != null)
            existing.setTotalAmount(updates.getTotalAmount());
        if (updates.getStatus() != null)
            existing.setStatus(updates.getStatus());
        return billRepository.save(existing);
    }

    public void deleteBill(Long invoiceId) {
        billRepository.deleteById(invoiceId);
    }

    public CustomerDto getInvoiceCustomer(Long invoiceId) {
        Bill bill = billRepository.findById(invoiceId).orElseThrow();
        return customerClient.getCustomerById(bill.getCustomerId());
    }

    public List<PaymentDto> getPaymentsForInvoice(Long invoiceId) {
        return paymentClient.getPaymentsByInvoiceId(invoiceId);
    }

    public PaymentDto recordPayment(Long invoiceId, PaymentDto payment) {
        payment.setInvoiceId(invoiceId);
        PaymentDto recorded = paymentClient.createPayment(payment);
        // update status if fully paid
        Bill bill = billRepository.findById(invoiceId).orElseThrow();
        BigDecimal totalPaid = paymentClient.getTotalPaidForInvoice(invoiceId);
        if (totalPaid.compareTo(bill.getTotalAmount()) >= 0) {
            bill.setStatus("PAID");
            billRepository.save(bill);
        }
        return recorded;
    }
}
