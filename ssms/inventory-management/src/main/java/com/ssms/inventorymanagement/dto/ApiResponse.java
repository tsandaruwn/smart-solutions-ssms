package com.ssms.inventorymanagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Generic envelope for all API responses in the Inventory Management service.
 *
 * <p>Every HTTP response body wraps the actual payload in this structure,
 * providing a consistent shape for consumers:
 *
 * <pre>{@code
 * {
 *   "success": true,
 *   "message": "Inventory retrieved successfully",
 *   "data": { ... },
 *   "timestamp": "2026-02-28T10:00:00"
 * }
 * }</pre>
 *
 * <p>{@code data} is omitted from the JSON when {@code null} (e.g. for 204 or
 * error-only responses) thanks to {@link JsonInclude}.
 *
 * @param <T> the type of the wrapped payload
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    /** Whether the request was processed successfully. */
    private Boolean success;

    /** Human-readable message describing the outcome. Sourced from {@code ResponseMessages}. */
    private String message;

    /** The actual response payload. {@code null} for error or no-content responses. */
    private T data;

    /** Server-side timestamp when the response was generated. */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
