package com.ssms.usermanagement.dto;

import com.ssms.usermanagement.entity.Permission.Action;
import jakarta.validation.constraints.NotBlank;

public class PermissionRequestDTO {

    @NotBlank(message = "Permission name is required")
    private String permissionName;

    private String module;

    private Action action;

    public PermissionRequestDTO() {
    }

    public PermissionRequestDTO(String permissionName, String module, Action action) {
        this.permissionName = permissionName;
        this.module = module;
        this.action = action;
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

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }
}
