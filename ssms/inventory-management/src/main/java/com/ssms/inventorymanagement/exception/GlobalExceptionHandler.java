package com.ssms.inventorymanagement.exception;

import com.ssms.inventorymanagement.dto.ApiResponse;
import com.ssms.inventorymanagement.utility.constant.ResponseMessages;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Centralised exception handler for the Inventory Management microservice.
 *
 * <p>Every unhandled exception bubbles up to this class before being
 * serialised into a consistent {@link ApiResponse} JSON body.
 * This prevents stack traces from leaking into the response and ensures
 * every error follows the same envelope structure.
 *
 * <p>Handled exception types:
 * <ul>
 *   <li>{@link ResourceNotFoundException}   → 404 Not Found</li>
 *   <li>{@link BusinessException}           → 400 Bad Request</li>
 *   <li>{@link MethodArgumentNotValidException} → 400 with field-level details</li>
 *   <li>{@link Exception}                   → 500 Internal Server Error (catch-all)</li>
 * </ul>
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // ─────────────────────────────────────────────────────────────────────
    // 404 – Resource not found
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Handles {@link ResourceNotFoundException} and returns a 404 response.
     *
     * @param ex the exception thrown by the service layer
     * @return a 404 {@link ApiResponse} carrying the not-found message
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(
            ResourceNotFoundException ex) {

        log.warn("Resource not found: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // 400 – Business rule violation
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Handles {@link BusinessException} and returns a 400 response.
     *
     * @param ex the exception thrown by the service layer
     * @return a 400 {@link ApiResponse} carrying the business error message
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(
            BusinessException ex) {

        log.warn("Business rule violation: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // 400 – Bean Validation failures
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Handles Jakarta Bean Validation failures from {@code @Valid} on request
     * bodies and returns a 400 response that includes per-field error details.
     *
     * @param ex the validation exception populated by Spring MVC
     * @return a 400 {@link ApiResponse} with a map of field → error message
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        log.warn("Validation failed: {}", fieldErrors);

        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .success(false)
                .message(ResponseMessages.VALIDATION_FAILED)
                .data(fieldErrors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // ─────────────────────────────────────────────────────────────────────
    // 500 – Catch-all for unexpected exceptions
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Catch-all handler that prevents raw exception details from being
     * exposed to the client.
     *
     * @param ex any unhandled exception
     * @return a 500 {@link ApiResponse} with a generic error message
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {

        log.error("Unexpected error occurred: {}", ex.getMessage(), ex);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message(ResponseMessages.INTERNAL_SERVER_ERROR)
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
