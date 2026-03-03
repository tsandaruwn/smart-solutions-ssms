-- User Management RBAC Schema Initialization

-- Create Role table
CREATE TABLE IF NOT EXISTS role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_role_name (role_name)
);

-- Create Permission table
CREATE TABLE IF NOT EXISTS permission (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(50),
    action VARCHAR(20),
    INDEX idx_permission_name (permission_name),
    INDEX idx_module (module)
);

-- Create User table
CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(80),
    last_name VARCHAR(80),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE RESTRICT,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role_id (role_id)
);

-- Create RolePermission junction table
CREATE TABLE IF NOT EXISTS role_permission (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    granted_by INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permission(permission_id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES user(user_id) ON DELETE SET NULL,
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
);

-- Insert default roles
INSERT INTO role (role_name, description) VALUES
('ADMIN', 'System administrator with full access'),
('MANAGER', 'Manager with extended permissions'),
('EMPLOYEE', 'Regular employee with standard access'),
('CUSTOMER', 'Customer with limited access'),
('SUPPLIER', 'Supplier with vendor-specific access'),
('TECHNICIAN', 'Technical staff with maintenance access');

-- Insert default permissions for User Management module
INSERT INTO permission (permission_name, module, action) VALUES
('USER_CREATE', 'USER_MANAGEMENT', 'CREATE'),
('USER_READ', 'USER_MANAGEMENT', 'READ'),
('USER_UPDATE', 'USER_MANAGEMENT', 'UPDATE'),
('USER_DELETE', 'USER_MANAGEMENT', 'DELETE'),
('USER_MANAGE', 'USER_MANAGEMENT', 'MANAGE');

-- Insert default permissions for Role Management module
INSERT INTO permission (permission_name, module, action) VALUES
('ROLE_CREATE', 'ROLE_MANAGEMENT', 'CREATE'),
('ROLE_READ', 'ROLE_MANAGEMENT', 'READ'),
('ROLE_UPDATE', 'ROLE_MANAGEMENT', 'UPDATE'),
('ROLE_DELETE', 'ROLE_MANAGEMENT', 'DELETE'),
('ROLE_MANAGE', 'ROLE_MANAGEMENT', 'MANAGE');

-- Insert default permissions for Permission Management module
INSERT INTO permission (permission_name, module, action) VALUES
('PERMISSION_CREATE', 'PERMISSION_MANAGEMENT', 'CREATE'),
('PERMISSION_READ', 'PERMISSION_MANAGEMENT', 'READ'),
('PERMISSION_UPDATE', 'PERMISSION_MANAGEMENT', 'UPDATE'),
('PERMISSION_DELETE', 'PERMISSION_MANAGEMENT', 'DELETE'),
('PERMISSION_MANAGE', 'PERMISSION_MANAGEMENT', 'MANAGE');

-- Assign permissions to ADMIN role (full access)
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM role r
CROSS JOIN permission p
WHERE r.role_name = 'ADMIN';

-- Assign permissions to MANAGER role (manage users, read roles)
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM role r, permission p
WHERE r.role_name = 'MANAGER'
AND p.permission_name IN ('USER_CREATE', 'USER_READ', 'USER_UPDATE', 'ROLE_READ', 'PERMISSION_READ');

-- Assign permissions to EMPLOYEE role (read only)
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM role r, permission p
WHERE r.role_name = 'EMPLOYEE'
AND p.permission_name IN ('USER_READ', 'ROLE_READ', 'PERMISSION_READ');

-- Assign permissions to CUSTOMER role (read own profile)
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM role r, permission p
WHERE r.role_name = 'CUSTOMER'
AND p.permission_name = 'USER_READ';

-- Assign permissions to SUPPLIER role (read and update own profile)
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM role r, permission p
WHERE r.role_name = 'SUPPLIER'
AND p.permission_name IN ('USER_READ', 'USER_UPDATE');

-- Assign permissions to TECHNICIAN role (read all, update users)
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM role r, permission p
WHERE r.role_name = 'TECHNICIAN'
AND p.permission_name IN ('USER_READ', 'USER_UPDATE', 'ROLE_READ', 'PERMISSION_READ');

-- Create a default admin user (password: admin123 - should be changed in production)
-- Note: In production, this password should be properly hashed using BCrypt
INSERT INTO user (role_id, email, username, password_hash, first_name, last_name, is_active)
SELECT r.role_id, 'admin@ssms.com', 'admin', 'admin123', 'System', 'Administrator', TRUE
FROM role r
WHERE r.role_name = 'ADMIN';

COMMIT;
