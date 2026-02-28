package com.ssms.payment.repository;

import com.ssms.payment.entity.Payment;
import com.ssms.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserId(Long userId);
    
    List<Payment> findByOrderId(Long orderId);
    
    List<Payment> findByStatus(PaymentStatus status);
    
    List<Payment> findByUserIdAndStatus(Long userId, PaymentStatus status);
}
