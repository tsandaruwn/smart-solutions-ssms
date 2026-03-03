package com.ssms.usermanagement.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Role response
 */
public class RoleResponseDTO {

    private Integer roleId;
    private String roleName;
    private String description;
    private LocalDateTime createdAt;
    private List<String> permissions;

    // Empty constructor
    public RoleResponseDTO() {
    }

    // Constructor with all fields
    public RoleResponseDTO(Integer roleId, String roleName, String description, LocalDateTime createdAt, List<String> permissions) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.description = description;
        this.createdAt = createdAt;
        this.permissions = permissions;
    }

    // Getters and Setters
    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
}
