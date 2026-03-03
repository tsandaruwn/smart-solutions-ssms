-- Insert default roles
INSERT INTO role (role_name, description, created_at) VALUES
('ADMIN', 'System administrator with full access', CURRENT_TIMESTAMP),
('MANAGER', 'Manager with extended permissions', CURRENT_TIMESTAMP),
('EMPLOYEE', 'Regular employee with standard access', CURRENT_TIMESTAMP),
('CUSTOMER', 'Customer with limited access', CURRENT_TIMESTAMP),
('SUPPLIER', 'Supplier with vendor-specific access', CURRENT_TIMESTAMP),
('TECHNICIAN', 'Technical staff with maintenance access', CURRENT_TIMESTAMP);

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
