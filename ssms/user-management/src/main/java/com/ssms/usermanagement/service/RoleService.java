package com.ssms.usermanagement.service;

import com.ssms.usermanagement.dto.RoleRequestDTO;
import com.ssms.usermanagement.dto.RoleResponseDTO;
import com.ssms.usermanagement.entity.Role;
import com.ssms.usermanagement.entity.RolePermission;
import com.ssms.usermanagement.entity.Permission;
import com.ssms.usermanagement.exception.DuplicateResourceException;
import com.ssms.usermanagement.exception.ResourceNotFoundException;
import com.ssms.usermanagement.repository.RoleRepository;
import com.ssms.usermanagement.repository.RolePermissionRepository;
import com.ssms.usermanagement.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Role management
 */
@Service
@Transactional
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    /**
     * Get all roles
     */
    public List<RoleResponseDTO> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get role by ID
     */
    public RoleResponseDTO getRoleById(Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        return toResponseDTO(role);
    }

    /**
     * Create new role
     */
    public RoleResponseDTO createRole(RoleRequestDTO requestDTO) {
        // Check for duplicate role name
        if (roleRepository.existsByRoleName(requestDTO.getRoleName())) {
            throw new DuplicateResourceException("Role already exists with name: " + requestDTO.getRoleName());
        }

        Role role = new Role();
        role.setRoleName(requestDTO.getRoleName());
        role.setDescription(requestDTO.getDescription());

        Role savedRole = roleRepository.save(role);
        return toResponseDTO(savedRole);
    }

    /**
     * Update existing role
     */
    public RoleResponseDTO updateRole(Integer id, RoleRequestDTO requestDTO) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));

        // Check for duplicate role name if updating
        if (requestDTO.getRoleName() != null && !requestDTO.getRoleName().equals(role.getRoleName())) {
            if (roleRepository.existsByRoleName(requestDTO.getRoleName())) {
                throw new DuplicateResourceException("Role already exists with name: " + requestDTO.getRoleName());
            }
            role.setRoleName(requestDTO.getRoleName());
        }

        if (requestDTO.getDescription() != null) {
            role.setDescription(requestDTO.getDescription());
        }

        Role updatedRole = roleRepository.save(role);
        return toResponseDTO(updatedRole);
    }

    /**
     * Delete role by ID
     */
    public void deleteRole(Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        roleRepository.delete(role);
    }

    /**
     * Assign permission to role
     */
    public void assignPermissionToRole(Integer roleId, Integer permissionId, Integer grantedBy) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));

        RolePermission rolePermission = new RolePermission(role, permission, grantedBy);
        rolePermissionRepository.save(rolePermission);
    }

    /**
     * Remove permission from role
     */
    public void removePermissionFromRole(Integer roleId, Integer permissionId) {
        rolePermissionRepository.deleteByRoleRoleIdAndPermissionPermissionId(roleId, permissionId);
    }

    /**
     * Get all permissions for a role
     */
    public List<String> getPermissionsForRole(Integer roleId) {
        List<RolePermission> rolePermissions = rolePermissionRepository.findByRoleId(roleId);
        return rolePermissions.stream()
                .map(rp -> rp.getPermission().getPermissionName())
                .collect(Collectors.toList());
    }

    /**
     * Convert Role entity to RoleResponseDTO
     */
    private RoleResponseDTO toResponseDTO(Role role) {
        List<String> permissions = role.getRolePermissions().stream()
                .map(rp -> rp.getPermission().getPermissionName())
                .collect(Collectors.toList());

        return new RoleResponseDTO(
                role.getRoleId(),
                role.getRoleName().toString(),
                role.getDescription(),
                role.getCreatedAt(),
                permissions
        );
    }
}
