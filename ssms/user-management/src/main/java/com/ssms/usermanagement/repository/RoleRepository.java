package com.ssms.usermanagement.repository;

import com.ssms.usermanagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    
    Optional<Role> findByRoleName(Role.RoleName roleName);
    
    boolean existsByRoleName(Role.RoleName roleName);
}
