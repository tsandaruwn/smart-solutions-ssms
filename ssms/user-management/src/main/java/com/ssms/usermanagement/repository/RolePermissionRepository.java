package com.ssms.usermanagement.repository;

import com.ssms.usermanagement.entity.RolePermission;
import com.ssms.usermanagement.entity.RolePermission.RolePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermissionId> {
    
    @Query("SELECT rp FROM RolePermission rp WHERE rp.role.roleId = :roleId")
    List<RolePermission> findByRoleId(@Param("roleId") Integer roleId);
    
    @Query("SELECT rp FROM RolePermission rp WHERE rp.permission.permissionId = :permissionId")
    List<RolePermission> findByPermissionId(@Param("permissionId") Integer permissionId);
    
    void deleteByRoleRoleId(Integer roleId);
    
    void deleteByRoleRoleIdAndPermissionPermissionId(Integer roleId, Integer permissionId);
}
