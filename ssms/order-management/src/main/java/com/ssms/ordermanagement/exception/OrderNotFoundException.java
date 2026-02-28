package com.ssms.ordermanagement.exception;

/**
 * Thrown when an order is not found.
 */
public class OrderNotFoundException extends RuntimeException {

    public OrderNotFoundException(String message) {
        super(message);
    }

    public OrderNotFoundException(Integer orderId) {
        super("Order not found with id: " + orderId);
    }
}
