package com.ssms.digitalmarketing.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicatePerformanceEntryException extends RuntimeException {
    public DuplicatePerformanceEntryException(String message) {
        super(message);
    }
}
