package com.ssms.inventorymanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a business rule or domain constraint is violated, but no
 * specific HTTP semantic (like Not Found) fits better.
 *
 * <p>Examples:
 * <ul>
 *   <li>Attempting to decrease stock below zero</li>
 *   <li>Creating a duplicate inventory record for the same product+warehouse</li>
 *   <li>Deactivating a warehouse that still has active inventory</li>
 * </ul>
 *
 * <p>Maps to HTTP {@code 400 Bad Request}.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BusinessException extends RuntimeException {

    /**
     * Constructs the exception with a user-readable business rule violation message.
     *
     * @param message description of the violated rule
     */
    public BusinessException(String message) {
        super(message);
    }

    /**
     * Constructs the exception with a message and the underlying cause.
     *
     * @param message description of the violated rule
     * @param cause   the underlying exception
     */
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
