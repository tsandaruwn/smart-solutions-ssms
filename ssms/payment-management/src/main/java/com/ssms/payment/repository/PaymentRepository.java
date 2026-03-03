package com.ssms.payment.repository;

import com.ssms.payment.entity.Payment;
import com.ssms.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByCustomerId(Long customerId);
    
    List<Payment> findByInvoiceId(Long invoiceId);
    
    List<Payment> findByStatus(PaymentStatus status);
    
    List<Payment> findByCustomerIdAndStatus(Long customerId, PaymentStatus status);
    
    Optional<Payment> findByTransactionReference(String transactionReference);
    
    boolean existsByTransactionReference(String transactionReference);
}
