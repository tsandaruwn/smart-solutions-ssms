package com.ssms.ordermanagement.controller;

import com.ssms.ordermanagement.dto.*;
import com.ssms.ordermanagement.entity.OrderStatus;
import com.ssms.ordermanagement.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for Order Management API.
 * Uses H2 in-memory database (see src/test/resources/application.yaml).
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

    private CreateOrderRequest createRequest;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();

        OrderItemRequest itemReq = OrderItemRequest.builder()
                .productId(101)
                .quantity(2)
                .unitPriceAtOrder(new BigDecimal("149.99"))
                .discountPercent(BigDecimal.ZERO)
                .build();

        createRequest = CreateOrderRequest.builder()
                .customerId(1)
                .createdByUserId(1)
                .shippingAddress("123 Main St, City, State 12345")
                .shippingCity("Colombo")
                .notes("Integration test order")
                .items(List.of(itemReq))
                .build();
    }

    @Test
    void testPlaceOrder_Success() {
        ResponseEntity<Map<String, Object>> response = orderController.placeOrder(createRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).containsKey("orderNumber");
        assertThat(orderRepository.count()).isEqualTo(1);
    }

    @Test
    void testGetAllOrders() {
        orderController.placeOrder(createRequest);

        ResponseEntity<List<OrderResponse>> response = orderController.getAllOrders();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
    }

    @Test
    void testGetOrderHistory() {
        orderController.placeOrder(createRequest);

        ResponseEntity<List<OrderResponse>> response = orderController.getOrderHistory(1);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).getCustomerId()).isEqualTo(1);
    }

    @Test
    void testUpdateOrderStatus_ToShipped() {
        orderController.placeOrder(createRequest);
        Integer orderId = orderRepository.findAll().get(0).getOrderId();

        ResponseEntity<Map<String, Object>> response = orderController.updateOrderStatus(
                orderId, new UpdateOrderStatusRequest(OrderStatus.SHIPPED));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void testCancelOrder() {
        orderController.placeOrder(createRequest);
        Integer orderId = orderRepository.findAll().get(0).getOrderId();

        ResponseEntity<Map<String, Object>> response = orderController.cancelOrder(
                orderId, new CancelOrderRequest("Customer request"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void testGetOrdersByStatus() {
        orderController.placeOrder(createRequest);

        ResponseEntity<List<OrderResponse>> response =
                orderController.getOrdersByStatus(OrderStatus.PENDING);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
    }

    @Test
    void testHealthCheck() {
        ResponseEntity<?> response = orderController.healthCheck();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
