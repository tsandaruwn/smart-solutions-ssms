package com.ssms.ordermanagement.controller;

import com.ssms.ordermanagement.entity.Order;
import com.ssms.ordermanagement.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for Order Management API
 * Tests the complete flow from controller to database
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class OrderControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderController orderController;

    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();

        List<Order.OrderItem> items = new ArrayList<>();
        Order.OrderItem item = new Order.OrderItem();
        item.setProductId(101L);
        item.setProductName("Smart Thermostat");
        item.setProductCategory("Climate Control");
        item.setQuantity(2);
        item.setUnitPrice(new BigDecimal("149.99"));
        item.setSubtotal(new BigDecimal("299.98"));
        items.add(item);

        sampleOrder = new Order();
        sampleOrder.setCustomerId(1L);
        sampleOrder.setCustomerName("John Doe");
        sampleOrder.setCustomerEmail("john@example.com");
        sampleOrder.setShippingAddress("123 Main St, City, State 12345");
        sampleOrder.setItems(items);
        sampleOrder.setTotalAmount(new BigDecimal("299.98"));
        sampleOrder.setNotes("Test order");
    }

    @Test
    @Transactional
    void testPlaceOrder_Success() {
        ResponseEntity<?> response = orderController.placeOrder(sampleOrder);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(orderRepository.count()).isEqualTo(1);
    }

    @Test
    @Transactional
    void testGetAllOrders() {
        orderController.placeOrder(sampleOrder);

        ResponseEntity<List<Order>> response = orderController.getAllOrders();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
    }

    @Test
    @Transactional
    void testGetOrderHistory() {
        orderController.placeOrder(sampleOrder);

        ResponseEntity<List<Order>> response = orderController.getOrderHistory(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).getCustomerId()).isEqualTo(1L);
    }

    @Test
    @Transactional
    void testUpdateOrderDetails() {
        ResponseEntity<?> createResponse = orderController.placeOrder(sampleOrder);
        
        List<Order> orders = orderRepository.findAll();
        String orderId = orders.get(0).getOrderId();

        Order updateData = new Order();
        updateData.setCustomerName("Jane Smith");
        updateData.setShippingAddress("456 New Address");

        ResponseEntity<?> updateResponse = orderController.updateOrderDetails(orderId, updateData);

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        
        Order updated = orderRepository.findByOrderId(orderId).orElse(null);
        assertThat(updated).isNotNull();
        assertThat(updated.getCustomerName()).isEqualTo("Jane Smith");
    }

    @Test
    @Transactional
    void testUpdateOrderStatus_ToShipped() {
        orderController.placeOrder(sampleOrder);
        
        List<Order> orders = orderRepository.findAll();
        String orderId = orders.get(0).getOrderId();

        ResponseEntity<?> response = orderController.updateOrderStatus(orderId, Order.OrderStatus.SHIPPED);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        
        Order updated = orderRepository.findByOrderId(orderId).orElse(null);
        assertThat(updated).isNotNull();
        assertThat(updated.getStatus()).isEqualTo(Order.OrderStatus.SHIPPED);
        assertThat(updated.getShippedDate()).isNotNull();
    }

    @Test
    @Transactional
    void testCancelOrder() {
        orderController.placeOrder(sampleOrder);
        
        List<Order> orders = orderRepository.findAll();
        String orderId = orders.get(0).getOrderId();

        ResponseEntity<?> response = orderController.cancelOrder(orderId, "Customer request");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        
        Order cancelled = orderRepository.findByOrderId(orderId).orElse(null);
        assertThat(cancelled).isNotNull();
        assertThat(cancelled.getStatus()).isEqualTo(Order.OrderStatus.CANCELLED);
        assertThat(cancelled.getCancellationReason()).isEqualTo("Customer request");
    }

    @Test
    @Transactional
    void testGetOrdersByStatus() {
        orderController.placeOrder(sampleOrder);

        ResponseEntity<List<Order>> response = orderController.getOrdersByStatus(Order.OrderStatus.PENDING);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).getStatus()).isEqualTo(Order.OrderStatus.PENDING);
    }

    @Test
    void testHealthCheck() {
        ResponseEntity<?> response = orderController.healthCheck();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
