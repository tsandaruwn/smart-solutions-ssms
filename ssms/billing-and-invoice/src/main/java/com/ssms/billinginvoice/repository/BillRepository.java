package com.ssms.billinginvoice.repository;

import com.ssms.billinginvoice.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findByCustomerId(Long customerId);

    // convenience lookup used when enforcing one-invoice-per-order
    Bill findByOrderId(Long orderId);
}
