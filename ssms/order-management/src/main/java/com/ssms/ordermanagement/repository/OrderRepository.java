package com.ssms.ordermanagement.repository;

import com.ssms.ordermanagement.entity.Order;
import com.ssms.ordermanagement.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByCustomerIdOrderByOrderDateDesc(Integer customerId);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT o FROM Order o WHERE o.customerId = :customerId AND o.status = :status ORDER BY o.orderDate DESC")
    List<Order> findByCustomerIdAndStatus(@Param("customerId") Integer customerId,
                                          @Param("status") OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.orderDate >= :date ORDER BY o.orderDate DESC")
    List<Order> findRecentOrders(@Param("date") LocalDateTime date);

    boolean existsByOrderNumber(String orderNumber);

    @Query("SELECT COALESCE(MAX(o.orderId), 0) FROM Order o")
    Integer findMaxOrderId();
}
