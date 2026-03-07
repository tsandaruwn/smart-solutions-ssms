package com.ssms.inventorymanagement.utility;

import com.ssms.inventorymanagement.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class ResponseUtil {

    public static <T> ResponseEntity<ApiResponse<T>> success(
            HttpStatus status, String message, T data) {

        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();

        return ResponseEntity.status(status).body(response);
    }

    public static ResponseEntity<ApiResponse<Void>> success(
            HttpStatus status, String message) {

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message(message)
                .build();

        return ResponseEntity.status(status).body(response);
    }

    public static ResponseEntity<ApiResponse<Void>> error(
            HttpStatus status, String message) {

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message(message)
                .build();

        return ResponseEntity.status(status).body(response);
    }

    private ResponseUtil() {
        throw new UnsupportedOperationException("Utility class — do not instantiate");
    }
}
