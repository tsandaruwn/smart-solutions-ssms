package com.ssms.payment.repository;

import com.ssms.payment.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    
    Optional<PaymentMethod> findByMethodName(String methodName);
    
    List<PaymentMethod> findByIsActiveTrue();
    
    boolean existsByMethodName(String methodName);
}
