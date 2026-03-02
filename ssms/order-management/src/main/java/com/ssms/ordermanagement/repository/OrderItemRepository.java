package com.ssms.ordermanagement.repository;

import com.ssms.ordermanagement.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrder_OrderId(Integer orderId);

    void deleteByOrder_OrderId(Integer orderId);
}
