package com.ssms.usermanagement.repository;

import com.ssms.usermanagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Role entity
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    
    /**
     * Find role by role name
     */
    Optional<Role> findByRoleName(Role.RoleName roleName);
    
    /**
     * Check if role exists by role name
     */
    boolean existsByRoleName(Role.RoleName roleName);
}
