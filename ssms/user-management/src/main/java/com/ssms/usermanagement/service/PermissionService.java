package com.ssms.usermanagement.service;

import com.ssms.usermanagement.dto.PermissionRequestDTO;
import com.ssms.usermanagement.dto.PermissionResponseDTO;
import com.ssms.usermanagement.entity.Permission;
import com.ssms.usermanagement.exception.DuplicateResourceException;
import com.ssms.usermanagement.exception.ResourceNotFoundException;
import com.ssms.usermanagement.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Permission management
 */
@Service
@Transactional
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    /**
     * Get all permissions
     */
    public List<PermissionResponseDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get permission by ID
     */
    public PermissionResponseDTO getPermissionById(Integer id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        return toResponseDTO(permission);
    }

    /**
     * Get permissions by module
     */
    public List<PermissionResponseDTO> getPermissionsByModule(String module) {
        return permissionRepository.findByModule(module).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get permissions by action
     */
    public List<PermissionResponseDTO> getPermissionsByAction(Permission.Action action) {
        return permissionRepository.findByAction(action).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create new permission
     */
    public PermissionResponseDTO createPermission(PermissionRequestDTO requestDTO) {
        // Check for duplicate permission name
        if (permissionRepository.existsByPermissionName(requestDTO.getPermissionName())) {
            throw new DuplicateResourceException("Permission already exists with name: " + requestDTO.getPermissionName());
        }

        Permission permission = new Permission();
        permission.setPermissionName(requestDTO.getPermissionName());
        permission.setModule(requestDTO.getModule());
        permission.setAction(requestDTO.getAction());

        Permission savedPermission = permissionRepository.save(permission);
        return toResponseDTO(savedPermission);
    }

    /**
     * Update existing permission
     */
    public PermissionResponseDTO updatePermission(Integer id, PermissionRequestDTO requestDTO) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));

        // Check for duplicate permission name if updating
        if (requestDTO.getPermissionName() != null && !requestDTO.getPermissionName().equals(permission.getPermissionName())) {
            if (permissionRepository.existsByPermissionName(requestDTO.getPermissionName())) {
                throw new DuplicateResourceException("Permission already exists with name: " + requestDTO.getPermissionName());
            }
            permission.setPermissionName(requestDTO.getPermissionName());
        }

        if (requestDTO.getModule() != null) {
            permission.setModule(requestDTO.getModule());
        }

        if (requestDTO.getAction() != null) {
            permission.setAction(requestDTO.getAction());
        }

        Permission updatedPermission = permissionRepository.save(permission);
        return toResponseDTO(updatedPermission);
    }

    /**
     * Delete permission by ID
     */
    public void deletePermission(Integer id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        permissionRepository.delete(permission);
    }

    /**
     * Convert Permission entity to PermissionResponseDTO
     */
    private PermissionResponseDTO toResponseDTO(Permission permission) {
        return new PermissionResponseDTO(
                permission.getPermissionId(),
                permission.getPermissionName(),
                permission.getModule(),
                permission.getAction() != null ? permission.getAction().toString() : null
        );
    }
}
