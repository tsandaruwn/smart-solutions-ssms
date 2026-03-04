package com.ssms.usermanagement.dto;

/**
 * DTO for Permission response
 */
public class PermissionResponseDTO {

    private Integer permissionId;
    private String permissionName;
    private String module;
    private String action;

    // Empty constructor
    public PermissionResponseDTO() {
    }

    // Constructor with all fields
    public PermissionResponseDTO(Integer permissionId, String permissionName, String module, String action) {
        this.permissionId = permissionId;
        this.permissionName = permissionName;
        this.module = module;
        this.action = action;
    }

    // Getters and Setters
    public Integer getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(Integer permissionId) {
        this.permissionId = permissionId;
    }

    public String getPermissionName() {
        return permissionName;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
