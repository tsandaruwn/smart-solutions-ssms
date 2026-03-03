package com.ssms.usermanagement.dto;

import com.ssms.usermanagement.entity.Role.RoleName;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for Role creation/update requests
 */
public class RoleRequestDTO {

    @NotNull(message = "Role name is required")
    private RoleName roleName;

    private String description;

    // Empty constructor
    public RoleRequestDTO() {
    }

    // Constructor with all fields
    public RoleRequestDTO(RoleName roleName, String description) {
        this.roleName = roleName;
        this.description = description;
    }

    // Getters and Setters
    public RoleName getRoleName() {
        return roleName;
    }

    public void setRoleName(RoleName roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
