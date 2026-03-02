package com.ssms.ordermanagement.exception;

/**
 * Thrown when an invalid order state transition is attempted.
 */
public class InvalidOrderStateException extends RuntimeException {

    public InvalidOrderStateException(String message) {
        super(message);
    }
}
