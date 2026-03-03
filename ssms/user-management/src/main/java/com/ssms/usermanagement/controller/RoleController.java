package com.ssms.usermanagement.controller;

import com.ssms.usermanagement.dto.RoleRequestDTO;
import com.ssms.usermanagement.dto.RoleResponseDTO;
import com.ssms.usermanagement.service.RoleService;
import com.ssms.usermanagement.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Role management
 */
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    /**
     * Get all roles
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponseDTO>>> getAllRoles() {
        List<RoleResponseDTO> roles = roleService.getAllRoles();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Roles retrieved successfully", roles)
        );
    }

    /**
     * Get role by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponseDTO>> getRoleById(@PathVariable Integer id) {
        RoleResponseDTO role = roleService.getRoleById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Role retrieved successfully", role)
        );
    }

    /**
     * Create new role
     */
    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponseDTO>> createRole(@Valid @RequestBody RoleRequestDTO requestDTO) {
        RoleResponseDTO role = roleService.createRole(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(true, "Role created successfully", role)
        );
    }

    /**
     * Update existing role
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponseDTO>> updateRole(
            @PathVariable Integer id,
            @Valid @RequestBody RoleRequestDTO requestDTO) {
        RoleResponseDTO role = roleService.updateRole(id, requestDTO);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Role updated successfully", role)
        );
    }

    /**
     * Delete role
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Integer id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Role deleted successfully", null)
        );
    }

    /**
     * Assign permission to role
     */
    @PostMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<ApiResponse<Void>> assignPermissionToRole(
            @PathVariable Integer roleId,
            @PathVariable Integer permissionId,
            @RequestParam(required = false) Integer grantedBy) {
        roleService.assignPermissionToRole(roleId, permissionId, grantedBy);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Permission assigned to role successfully", null)
        );
    }

    /**
     * Remove permission from role
     */
    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<ApiResponse<Void>> removePermissionFromRole(
            @PathVariable Integer roleId,
            @PathVariable Integer permissionId) {
        roleService.removePermissionFromRole(roleId, permissionId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Permission removed from role successfully", null)
        );
    }

    /**
     * Get all permissions for a role
     */
    @GetMapping("/{roleId}/permissions")
    public ResponseEntity<ApiResponse<List<String>>> getPermissionsForRole(@PathVariable Integer roleId) {
        List<String> permissions = roleService.getPermissionsForRole(roleId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Permissions retrieved successfully", permissions)
        );
    }
}
