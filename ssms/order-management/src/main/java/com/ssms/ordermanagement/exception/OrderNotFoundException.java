package com.ssms.ordermanagement.exception;

public class OrderNotFoundException extends RuntimeException {

    public OrderNotFoundException(String message) {
        super(message);
    }

    public OrderNotFoundException(Integer orderId) {
        super("Order not found with id: " + orderId);
    }
}
