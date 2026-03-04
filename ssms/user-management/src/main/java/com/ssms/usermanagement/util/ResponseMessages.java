package com.ssms.usermanagement.util;

/**
 * Centralized response messages utility
 * Avoids hardcoded messages throughout the application
 */
public class ResponseMessages {

    // Success Messages
    public static final String USER_CREATED_SUCCESS = "User created successfully";
    public static final String USER_UPDATED_SUCCESS = "User updated successfully";
    public static final String USER_DELETED_SUCCESS = "User deleted successfully";
    public static final String USER_RETRIEVED_SUCCESS = "User retrieved successfully";
    public static final String USERS_RETRIEVED_SUCCESS = "Users retrieved successfully";

    // Error Messages
    public static final String USER_NOT_FOUND = "User not found with id: ";
    public static final String USERNAME_ALREADY_EXISTS = "Username already exists";
    public static final String EMAIL_ALREADY_EXISTS = "Email already exists";
    public static final String INVALID_USER_DATA = "Invalid user data provided";
    public static final String VALIDATION_ERROR = "Validation error";

    // General Messages
    public static final String INTERNAL_SERVER_ERROR = "Internal server error occurred";
    public static final String BAD_REQUEST = "Bad request";
    public static final String UNAUTHORIZED = "Unauthorized access";
    public static final String FORBIDDEN = "Access forbidden";

    private ResponseMessages() {
        // Private constructor to prevent instantiation
    }
}
