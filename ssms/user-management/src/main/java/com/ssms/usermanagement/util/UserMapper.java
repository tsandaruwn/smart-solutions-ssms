package com.ssms.usermanagement.util;

import com.ssms.usermanagement.dto.UserResponseDTO;
import com.ssms.usermanagement.entity.User;

/**
 * Mapper utility to convert between Entity and DTO
 * Keeps conversion logic centralized and clean
 */
public class UserMapper {

    private UserMapper() {
        // Private constructor to prevent instantiation
    }

    /**
     * Convert User entity to UserResponseDTO
     * Does not expose sensitive information like password
     */
    public static UserResponseDTO toResponseDTO(User user) {
        if (user == null) {
            return null;
        }
        
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        
        if (user.getRole() != null) {
            dto.setRoleId(user.getRole().getRoleId());
            dto.setRoleName(user.getRole().getRoleName().toString());
        }
        
        dto.setIsActive(user.getIsActive());
        dto.setLastLogin(user.getLastLogin());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setDeletedAt(user.getDeletedAt());
        
        return dto;
    }
}
