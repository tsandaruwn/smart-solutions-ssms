package com.ssms.inventorymanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a requested resource cannot be found in the database.
 *
 * <p>Maps to HTTP {@code 404 Not Found}.
 * The {@link GlobalExceptionHandler} intercepts this and returns a structured
 * {@link com.ssms.inventorymanagement.dto.ApiResponse} to the client.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Constructs the exception with a detail message.
     *
     * @param message human-readable description of which resource was not found
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs the exception with a detail message and an underlying cause.
     *
     * @param message human-readable description
     * @param cause   the underlying exception
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
