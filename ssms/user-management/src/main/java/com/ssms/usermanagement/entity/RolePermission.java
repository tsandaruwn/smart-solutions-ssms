package com.ssms.usermanagement.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "role_permission")
public class RolePermission {
    
    @EmbeddedId
    private RolePermissionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roleId")
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("permissionId")
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;

    @Column(name = "granted_at", nullable = false, updatable = false)
    private LocalDateTime grantedAt;

    @Column(name = "granted_by")
    private Integer grantedBy; 

    public RolePermission() {
    }

    public RolePermission(Role role, Permission permission) {
        this.role = role;
        this.permission = permission;
        this.id = new RolePermissionId(role.getRoleId(), permission.getPermissionId());
    }

    public RolePermission(Role role, Permission permission, Integer grantedBy) {
        this.role = role;
        this.permission = permission;
        this.id = new RolePermissionId(role.getRoleId(), permission.getPermissionId());
        this.grantedBy = grantedBy;
    }

    @PrePersist
    protected void onCreate() {
        this.grantedAt = LocalDateTime.now();
    }

    public RolePermissionId getId() {
        return id;
    }

    public void setId(RolePermissionId id) {
        this.id = id;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }

    public LocalDateTime getGrantedAt() {
        return grantedAt;
    }

    public void setGrantedAt(LocalDateTime grantedAt) {
        this.grantedAt = grantedAt;
    }

    public Integer getGrantedBy() {
        return grantedBy;
    }

    public void setGrantedBy(Integer grantedBy) {
        this.grantedBy = grantedBy;
    }

    @Embeddable
    public static class RolePermissionId implements Serializable {
        
        @Column(name = "role_id")
        private Integer roleId;

        @Column(name = "permission_id")
        private Integer permissionId;

        public RolePermissionId() {
        }

        public RolePermissionId(Integer roleId, Integer permissionId) {
            this.roleId = roleId;
            this.permissionId = permissionId;
        }

        public Integer getRoleId() {
            return roleId;
        }

        public void setRoleId(Integer roleId) {
            this.roleId = roleId;
        }

        public Integer getPermissionId() {
            return permissionId;
        }

        public void setPermissionId(Integer permissionId) {
            this.permissionId = permissionId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RolePermissionId that = (RolePermissionId) o;
            return Objects.equals(roleId, that.roleId) && 
                   Objects.equals(permissionId, that.permissionId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(roleId, permissionId);
        }
    }
}
