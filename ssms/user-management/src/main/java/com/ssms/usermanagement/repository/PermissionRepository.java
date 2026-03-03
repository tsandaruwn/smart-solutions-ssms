package com.ssms.usermanagement.repository;

import com.ssms.usermanagement.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

/**
 * Repository interface for Permission entity
 */
@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {
    
    /**
     * Find permission by permission name
     */
    Optional<Permission> findByPermissionName(String permissionName);
    
    /**
     * Find permissions by module
     */
    List<Permission> findByModule(String module);
    
    /**
     * Find permissions by action
     */
    List<Permission> findByAction(Permission.Action action);
    
    /**
     * Check if permission exists by permission name
     */
    boolean existsByPermissionName(String permissionName);
}
