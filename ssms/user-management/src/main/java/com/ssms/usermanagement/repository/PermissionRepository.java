package com.ssms.usermanagement.repository;

import com.ssms.usermanagement.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {
    
    Optional<Permission> findByPermissionName(String permissionName);
    
    List<Permission> findByModule(String module);
    
    List<Permission> findByAction(Permission.Action action);
    
    boolean existsByPermissionName(String permissionName);
}
