package com.ssms.usermanagement.controller;

import com.ssms.usermanagement.dto.PermissionRequestDTO;
import com.ssms.usermanagement.dto.PermissionResponseDTO;
import com.ssms.usermanagement.entity.Permission;
import com.ssms.usermanagement.service.PermissionService;
import com.ssms.usermanagement.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PermissionResponseDTO>>> getAllPermissions() {
        List<PermissionResponseDTO> permissions = permissionService.getAllPermissions();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Permissions retrieved successfully", permissions)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PermissionResponseDTO>> getPermissionById(@PathVariable Integer id) {
        PermissionResponseDTO permission = permissionService.getPermissionById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Permission retrieved successfully", permission)
        );
    }

    @GetMapping("/module/{module}")
    public ResponseEntity<ApiResponse<List<PermissionResponseDTO>>> getPermissionsByModule(@PathVariable String module) {
        List<PermissionResponseDTO> permissions = permissionService.getPermissionsByModule(module);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Permissions retrieved successfully", permissions)
        );
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<ApiResponse<List<PermissionResponseDTO>>> getPermissionsByAction(@PathVariable Permission.Action action) {
        List<PermissionResponseDTO> permissions = permissionService.getPermissionsByAction(action);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Permissions retrieved successfully", permissions)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PermissionResponseDTO>> createPermission(@Valid @RequestBody PermissionRequestDTO requestDTO) {
        PermissionResponseDTO permission = permissionService.createPermission(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(true, "Permission created successfully", permission)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PermissionResponseDTO>> updatePermission(
            @PathVariable Integer id,
            @Valid @RequestBody PermissionRequestDTO requestDTO) {
        PermissionResponseDTO permission = permissionService.updatePermission(id, requestDTO);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Permission updated successfully", permission)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePermission(@PathVariable Integer id) {
        permissionService.deletePermission(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Permission deleted successfully", null)
        );
    }
}
