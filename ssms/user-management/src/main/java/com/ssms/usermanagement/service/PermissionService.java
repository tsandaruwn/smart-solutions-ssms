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

@Service
@Transactional
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    public List<PermissionResponseDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public PermissionResponseDTO getPermissionById(Integer id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        return toResponseDTO(permission);
    }

    public List<PermissionResponseDTO> getPermissionsByModule(String module) {
        return permissionRepository.findByModule(module).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<PermissionResponseDTO> getPermissionsByAction(Permission.Action action) {
        return permissionRepository.findByAction(action).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public PermissionResponseDTO createPermission(PermissionRequestDTO requestDTO) {
        
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

    public PermissionResponseDTO updatePermission(Integer id, PermissionRequestDTO requestDTO) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));

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

    public void deletePermission(Integer id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        permissionRepository.delete(permission);
    }

    private PermissionResponseDTO toResponseDTO(Permission permission) {
        return new PermissionResponseDTO(
                permission.getPermissionId(),
                permission.getPermissionName(),
                permission.getModule(),
                permission.getAction() != null ? permission.getAction().toString() : null
        );
    }
}
