package com.ssms.inventorymanagement.utility;

import com.ssms.inventorymanagement.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Factory utility for building {@link ResponseEntity} wrappers around
 * {@link ApiResponse}.
 *
 * <p>All controller methods should delegate response construction to this
 * class so that the HTTP envelope is created in exactly one place.
 *
 * <pre>{@code
 * // Success example
 * return ResponseUtil.success(HttpStatus.OK, ResponseMessages.INVENTORY_RETRIEVED, data);
 *
 * // Error example
 * return ResponseUtil.error(HttpStatus.NOT_FOUND, ResponseMessages.INVENTORY_NOT_FOUND);
 * }</pre>
 */
public final class ResponseUtil {

    // ─────────────────────────────────────────────────────────────────────
    // Success helpers
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Builds a successful {@link ResponseEntity} with a payload.
     *
     * @param status  HTTP status code to send
     * @param message descriptive success message (from {@code ResponseMessages})
     * @param data    the response payload
     * @param <T>     type of the payload
     * @return a {@link ResponseEntity} wrapping a successful {@link ApiResponse}
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(
            HttpStatus status, String message, T data) {

        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();

        return ResponseEntity.status(status).body(response);
    }

    /**
     * Builds a successful {@link ResponseEntity} without a payload
     * (e.g. for 204 No Content or delete operations).
     *
     * @param status  HTTP status code to send
     * @param message descriptive success message
     * @return a {@link ResponseEntity} with success flag and no data field
     */
    public static ResponseEntity<ApiResponse<Void>> success(
            HttpStatus status, String message) {

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message(message)
                .build();

        return ResponseEntity.status(status).body(response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // Error helpers
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Builds an error {@link ResponseEntity} carrying a message but no data.
     *
     * @param status  HTTP status code to send
     * @param message error description (from {@code ResponseMessages})
     * @return a {@link ResponseEntity} wrapping a failed {@link ApiResponse}
     */
    public static ResponseEntity<ApiResponse<Void>> error(
            HttpStatus status, String message) {

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message(message)
                .build();

        return ResponseEntity.status(status).body(response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // Prevent instantiation
    // ─────────────────────────────────────────────────────────────────────

    private ResponseUtil() {
        throw new UnsupportedOperationException("Utility class — do not instantiate");
    }
}
