-- =====================================================
-- SMART SOLUTIONS SSMS — Sri Lankan Seed Data
-- Run: set PGPASSWORD=admin
--      psql -U postgres -f seed-data.sql
-- =====================================================

-- ====================================================
-- 1. USER MANAGEMENT  (ssms_user_management)
-- ====================================================
\c ssms_user_management

-- Roles (IDs will be 1-6)
INSERT INTO role (role_name, description, created_at) VALUES
('ADMIN',      'System administrator with full access',       NOW()),
('MANAGER',    'Branch and department manager',               NOW()),
('EMPLOYEE',   'Regular staff member',                        NOW()),
('CUSTOMER',   'Registered customer',                         NOW()),
('SUPPLIER',   'Product supplier partner',                    NOW()),
('TECHNICIAN', 'Smart-home installation technician',          NOW());

-- Permissions (IDs will be 1-10)
INSERT INTO permission (permission_name, module, action) VALUES
('USER_CREATE',    'user',    'CREATE'),
('USER_READ',      'user',    'READ'),
('USER_UPDATE',    'user',    'UPDATE'),
('USER_DELETE',    'user',    'DELETE'),
('ORDER_CREATE',   'order',   'CREATE'),
('ORDER_READ',     'order',   'READ'),
('PRODUCT_READ',   'product', 'READ'),
('PRODUCT_MANAGE', 'product', 'MANAGE'),
('REPORT_READ',    'report',  'READ'),
('SYSTEM_MANAGE',  'system',  'MANAGE');

-- Role-Permission mapping
INSERT INTO role_permission (role_id, permission_id, granted_at) VALUES
-- ADMIN  → all 10
(1,1,NOW()),(1,2,NOW()),(1,3,NOW()),(1,4,NOW()),(1,5,NOW()),
(1,6,NOW()),(1,7,NOW()),(1,8,NOW()),(1,9,NOW()),(1,10,NOW()),
-- MANAGER → 7
(2,2,NOW()),(2,3,NOW()),(2,5,NOW()),(2,6,NOW()),(2,7,NOW()),(2,8,NOW()),(2,9,NOW()),
-- EMPLOYEE → 4
(3,2,NOW()),(3,5,NOW()),(3,6,NOW()),(3,7,NOW()),
-- CUSTOMER → 2
(4,6,NOW()),(4,7,NOW()),
-- SUPPLIER → 1
(5,7,NOW()),
-- TECHNICIAN → 2
(6,6,NOW()),(6,7,NOW());

-- Users (IDs 1-10, password = Password@123  bcrypt hash)
INSERT INTO "user" (role_id, email, username, password_hash, first_name, last_name, phone, is_active, created_at) VALUES
(1, 'nimal@ssms.lk',        'nimal.perera',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nimal',     'Perera',         '+94 77 123 4567', true, NOW()),
(2, 'kamal@ssms.lk',        'kamal.fernando',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Kamal',     'Fernando',       '+94 71 234 5678', true, NOW()),
(3, 'sunita@ssms.lk',       'sunita.silva',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sunita',    'Silva',          '+94 76 345 6789', true, NOW()),
(3, 'tharushi@ssms.lk',     'tharushi.jayawardena', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Tharushi',  'Jayawardena',    '+94 70 456 7890', true, NOW()),
(3, 'rajitha@ssms.lk',      'rajitha.bandara',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Rajitha',   'Bandara',        '+94 72 567 8901', true, NOW()),
(4, 'amaya@gmail.com',      'amaya.dissanayake',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Amaya',     'Dissanayake',    '+94 77 678 9012', true, NOW()),
(4, 'dinesh@gmail.com',     'dinesh.kumarasinghe',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Dinesh',    'Kumarasinghe',   '+94 71 789 0123', true, NOW()),
(4, 'sachini@gmail.com',    'sachini.wijesinghe',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sachini',   'Wijesinghe',     '+94 76 890 1234', true, NOW()),
(5, 'roshan@smartech.lk',   'roshan.gunawardena',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Roshan',    'Gunawardena',    '+94 11 234 5678', true, NOW()),
(6, 'lakmal@ssms.lk',       'lakmal.rathnayake',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lakmal',    'Rathnayake',     '+94 77 901 2345', true, NOW());


-- ====================================================
-- 2. CUSTOMER SERVICE  (ssms_customer)
-- ====================================================
\c ssms_customer

-- Customers (IDs 1-5)
INSERT INTO customer (email, first_name, last_name, phone,
       address_line1, address_line2, city, state, country, postal_code,
       date_of_birth, registration_date, is_deleted) VALUES
('amaya@gmail.com',      'Amaya',     'Dissanayake',  '+94 77 678 9012',
 '45 Galle Road',       'Colombo 03',       'Colombo',    'Western',  'Sri Lanka', '00300',
 '1990-05-15', NOW(), false),
('dinesh@gmail.com',     'Dinesh',    'Kumarasinghe', '+94 71 789 0123',
 '12 Kandy Road',       'Peradeniya',       'Kandy',      'Central',  'Sri Lanka', '20400',
 '1988-11-22', NOW(), false),
('sachini@gmail.com',    'Sachini',   'Wijesinghe',   '+94 76 890 1234',
 '78 Matara Road',      'Galle Fort',       'Galle',      'Southern', 'Sri Lanka', '80000',
 '1995-03-10', NOW(), false),
('priyantha@yahoo.com',  'Priyantha', 'Weerasinghe',  '+94 70 112 3456',
 '23 Temple Street',    'Malabe',            'Colombo',    'Western',  'Sri Lanka', '10115',
 '1985-07-28', NOW(), false),
('nadeesha@gmail.com',   'Nadeesha',  'Gunathilake',  '+94 72 223 4567',
 '56 Beach Road',       'Negombo Town',      'Negombo',    'Western',  'Sri Lanka', '11500',
 '1992-01-18', NOW(), false);


-- ====================================================
-- 3. PRODUCT MANAGEMENT  (ssms_product)
-- ====================================================
\c ssms_product

-- Categories (IDs 1-5)
INSERT INTO category (category_name, description, created_at) VALUES
('Smart Lighting',        'Smart LED bulbs, light strips, and dimmer switches',             NOW()),
('Security Systems',      'Smart locks, CCTV cameras, and alarm systems',                   NOW()),
('Climate Control',       'Smart AC controllers, thermostats, and ceiling fans',             NOW()),
('Smart Speakers & Hubs', 'Voice assistants and home-automation hub controllers',            NOW()),
('Smart Sensors',         'Motion, smoke, water-leak, and door/window sensors',              NOW());

-- Products (IDs 1-10, supplier_id cross-refs supplier-management)
INSERT INTO product (sku, name, category_id, supplier_id, price, description, is_active, created_at) VALUES
('SL-001', 'Smart LED Bulb (RGB)',        1, 1,   2500.00, 'WiFi-enabled RGB smart bulb with voice control support',              true, NOW()),
('SL-002', 'Smart Light Strip 5m',        1, 1,   4500.00, '5-metre addressable LED light strip with app control',                true, NOW()),
('SS-001', 'Smart Door Lock Pro',         2, 2,  35000.00, 'Biometric smart door lock with fingerprint and PIN access',           true, NOW()),
('SS-002', 'CCTV Camera 4-Pack',          2, 2,  45000.00, '1080p wireless CCTV camera system with night vision',                 true, NOW()),
('SN-001', 'Motion Sensor',               5, 3,   3500.00, 'PIR motion sensor with 120-degree detection angle',                   true, NOW()),
('CC-001', 'Smart Air Conditioner 12000 BTU', 3, 1, 125000.00, 'Inverter split AC with WiFi smart control',                       true, NOW()),
('CC-002', 'Smart Thermostat',            3, 3,  18000.00, 'Programmable smart thermostat with learning capability',              true, NOW()),
('SH-001', 'Smart Speaker',               4, 2,  15000.00, 'Voice-controlled smart speaker with Sinhala language support',        true, NOW()),
('SH-002', 'Smart Hub Controller',        4, 3,  22000.00, 'Central smart-home hub supporting Zigbee and Z-Wave protocols',       true, NOW()),
('SN-002', 'Smoke Detector',              5, 1,   5500.00, 'Photoelectric smoke detector with mobile alerts',                     true, NOW());


-- ====================================================
-- 4. INVENTORY MANAGEMENT  (ssms_inventory)
-- ====================================================
\c ssms_inventory

-- Warehouses (IDs 1-3, manager_user_id cross-refs user-management)
INSERT INTO warehouse (name, address, city, country, manager_user_id, contact_phone, capacity, is_active) VALUES
('Colombo Main Warehouse',    '120 Baseline Road, Borella',    'Colombo', 'Sri Lanka', 2, '+94 11 567 8901', 5000, true),
('Kandy Distribution Centre', '45 Peradeniya Road',            'Kandy',   'Sri Lanka', 3, '+94 81 234 5678', 3000, true),
('Galle South Warehouse',     '89 Wakwella Road',              'Galle',   'Sri Lanka', 4, '+94 91 345 6789', 2000, true);

-- Inventory (product_id cross-refs product-management)
INSERT INTO inventory (product_id, warehouse_id, quantity_on_hand, reorder_level, reorder_quantity,
                       low_stock_alert_sent, updated_at, is_deleted) VALUES
( 1, 1, 250, 50, 200, false, NOW(), false),
( 2, 1, 150, 30, 100, false, NOW(), false),
( 3, 1,  45, 10,  30, false, NOW(), false),
( 4, 1,  30,  5,  20, false, NOW(), false),
( 5, 2, 180, 40, 150, false, NOW(), false),
( 6, 2,  20,  5,  15, false, NOW(), false),
( 7, 2,  60, 15,  50, false, NOW(), false),
( 8, 3,  80, 20,  60, false, NOW(), false),
( 9, 3,  40, 10,  30, false, NOW(), false),
(10, 3, 100, 25,  80, false, NOW(), false);


-- ====================================================
-- 5. ORDER MANAGEMENT  (ssms_order)
-- ====================================================
\c ssms_order

-- Orders (IDs 1-5)
INSERT INTO "order" (order_number, customer_id, created_by_user_id, order_date,
                     status, shipping_address, shipping_city, total_amount, notes) VALUES
('ORD-20250201-001', 1, 3, '2025-02-01 10:30:00', 'DELIVERED',
 '45 Galle Road, Colombo 03',       'Colombo',  39500.00, 'Smart-lighting package delivered successfully'),
('ORD-20250210-002', 2, 4, '2025-02-10 14:15:00', 'SHIPPED',
 '12 Kandy Road, Peradeniya',       'Kandy',    80000.00, 'Security package shipped via Lanka Logistics'),
('ORD-20250215-003', 3, 3, '2025-02-15 09:45:00', 'PENDING',
 '78 Matara Road, Galle Fort',      'Galle',    32500.00, 'Awaiting stock availability for sensors'),
('ORD-20250220-004', 4, 5, '2025-02-20 11:00:00', 'DELIVERED',
 '23 Temple Street, Malabe',        'Colombo', 143000.00, 'Premium customer — express delivery completed'),
('ORD-20250225-005', 5, 4, '2025-02-25 16:30:00', 'PENDING',
 '56 Beach Road, Negombo',          'Negombo',  37500.00, 'Customer requested weekend delivery');

-- Order Items (IDs 1-11, line_total is auto-computed by DB)
INSERT INTO order_item (order_id, product_id, quantity, unit_price_at_order, discount_percent) VALUES
-- Order 1  (total 39,500 LKR)
(1, 1, 5,  2500.00,  0.00),   -- 5× Smart LED Bulb        = 12,500
(1, 2, 3,  4500.00,  0.00),   -- 3× Light Strip            = 13,500
(1, 8, 1, 15000.00, 10.00),   -- 1× Smart Speaker (10% off)= 13,500
-- Order 2  (total 80,000 LKR)
(2, 3, 1, 35000.00,  0.00),   -- 1× Smart Door Lock        = 35,000
(2, 4, 1, 45000.00,  0.00),   -- 1× CCTV Camera 4-Pack     = 45,000
-- Order 3  (total 32,500 LKR)
(3, 5, 3,  3500.00,  0.00),   -- 3× Motion Sensor          = 10,500
(3, 9, 1, 22000.00,  0.00),   -- 1× Smart Hub Controller   = 22,000
-- Order 4  (total 143,000 LKR)
(4, 6, 1,125000.00,  0.00),   -- 1× Smart AC               = 125,000
(4, 7, 1, 18000.00,  0.00),   -- 1× Smart Thermostat       = 18,000
-- Order 5  (total 37,500 LKR)
(5, 8, 2, 15000.00,  5.00),   -- 2× Smart Speaker (5% off) = 28,500
(5,10, 2,  5500.00,  0.00);   -- 2× Smoke Detector         = 11,000


-- ====================================================
-- 6. BILLING & INVOICE  (ssms_billing)
-- ====================================================
\c ssms_billing

-- Bills (IDs 1-5, 8% tax)
INSERT INTO order_bill (order_id, customer_id, subtotal, tax, total_amount, status) VALUES
(1, 1,  39500.00,  3160.00,  42660.00, 'PAID'),
(2, 2,  80000.00,  6400.00,  86400.00, 'PAID'),
(3, 3,  32500.00,  2600.00,  35100.00, 'PENDING'),
(4, 4, 143000.00, 11440.00, 154440.00, 'PAID'),
(5, 5,  37500.00,  3000.00,  40500.00, 'PENDING');


-- ====================================================
-- 7. PAYMENT MANAGEMENT  (ssms_payment)
-- ====================================================
\c ssms_payment

-- Payment Methods (IDs 1-5)
INSERT INTO payment_method (method_name, type, description, is_active) VALUES
('Visa / MasterCard',   'Card',           'Credit or debit card payments',                          true),
('Bank Transfer',       'Bank_Transfer',  'Direct bank transfer (BOC, Peoples, Commercial, HNB)',   true),
('Dialog mCash',        'Mobile_Wallet',  'Dialog mCash mobile wallet',                             true),
('Cash on Delivery',    'Cash',           'Pay in cash at the time of delivery or installation',    true),
('Online Banking',      'Online_Banking', 'Internet banking via local Sri Lankan banks',             true);

-- Payments (only for PAID bills — orders 1, 2, 4)
INSERT INTO payment (transaction_reference, invoice_id, customer_id, payment_method_id,
                     amount, payment_date, status, gateway_response) VALUES
('TXN-20250202-001', 1, 1, 1,  42660.00, '2025-02-02 09:15:00', 'Success', '{"auth":"A12345","bank":"BOC"}'),
('TXN-20250211-002', 2, 2, 2,  86400.00, '2025-02-11 11:30:00', 'Success', '{"ref":"BT98765","bank":"HNB"}'),
('TXN-20250221-003', 4, 4, 5, 154440.00, '2025-02-21 14:00:00', 'Success', '{"ref":"OB55432","bank":"Commercial"}');


-- ====================================================
-- 8. DIGITAL MARKETING  (ssms_digital_marketing)
-- ====================================================
\c ssms_digital_marketing

-- Campaigns (IDs 1-4, created_by_user_id cross-refs user-management)
INSERT INTO campaign (created_by_user_id, name, type, description, target_audience,
                      start_date, end_date, budget, status, created_at) VALUES
(2, 'Sinhala & Tamil New Year Smart Home Sale', 'EMAIL',
 'Island-wide New Year sale on all smart-home products with up to 25% off',
 'Existing customers in Western and Central provinces',
 '2025-04-01', '2025-04-20', 250000.00, 'COMPLETED', NOW()),

(2, 'Monsoon Smart Home Protection Promo', 'SOCIAL_MEDIA',
 'Promote smart sensors and security systems for the monsoon season',
 'Homeowners in Colombo, Galle, and Matara districts',
 '2025-05-15', '2025-06-30', 180000.00, 'ACTIVE', NOW()),

(1, 'Colombo Smart Living Expo 2025', 'PPC',
 'Google Ads campaign driving traffic to our Colombo Smart Living Expo booth',
 'Tech-savvy professionals aged 25-45 in Colombo metro area',
 '2025-07-01', '2025-07-15', 350000.00, 'ACTIVE', NOW()),

(2, 'Year-End Clearance Sale', 'CONTENT',
 'Blog and social content promoting clearance deals on 2024 smart-home inventory',
 'All registered customers and newsletter subscribers',
 '2025-12-01', '2025-12-31', 120000.00, 'DRAFT', NOW());

-- Campaign Performance (for campaigns 1, 2, 3)
INSERT INTO campaign_performance (campaign_id, recorded_date,
       impressions, clicks, conversions, revenue_generated, cost_incurred) VALUES
-- Campaign 1  (completed)
(1, '2025-04-07',  45000, 3200, 180,  850000.00,  62000.00),
(1, '2025-04-14',  52000, 4100, 230, 1120000.00,  78000.00),
(1, '2025-04-20',  38000, 2800, 150,  720000.00,  55000.00),
-- Campaign 2  (active)
(2, '2025-05-22',  28000, 1900, 85,   420000.00,  35000.00),
(2, '2025-05-29',  32000, 2400, 110,  560000.00,  42000.00),
(2, '2025-06-05',  35000, 2700, 125,  630000.00,  48000.00),
-- Campaign 3  (active)
(3, '2025-07-03',  60000, 5200, 95,   480000.00,  85000.00),
(3, '2025-07-10',  72000, 6100, 140,  710000.00, 105000.00);


-- ====================================================
-- 9. SUPPLIER MANAGEMENT  (ssms_supplier)
-- ====================================================
\c ssms_supplier

-- Suppliers (IDs 1-3)
INSERT INTO supplier (email, company_name, contact_person, phone,
                      address, city, country,
                      contract_start_date, contract_end_date, is_active, created_at) VALUES
('info@lankasmarthome.lk',  'Lanka Smart Home Solutions',  'Roshan Gunawardena',
 '+94 11 234 5678', '78 Union Place, Colombo 02',       'Colombo', 'Sri Lanka',
 '2024-01-01', '2026-12-31', true, NOW()),

('sales@ceylontech.lk',    'CeylonTech Electronics',     'Mahinda Premadasa',
 '+94 11 345 6789', '23 Duplication Road, Colombo 04',  'Colombo', 'Sri Lanka',
 '2024-03-15', '2026-03-14', true, NOW()),

('contact@colauto.lk',     'Colombo Automation Pvt Ltd',  'Chamara Wickramasinghe',
 '+94 11 456 7890', '150 Orion City, Colombo 09',       'Colombo', 'Sri Lanka',
 '2024-06-01', '2026-05-31', true, NOW());

-- Supplier products (own table in supplier DB, IDs 1-9)
INSERT INTO products (product_name, description, unit_price, quantity_in_stock,
                      supplier_id, is_active, created_at) VALUES
-- Supplier 1 — Lanka Smart Home Solutions
('Smart LED Bulb (RGB)',           'WiFi RGB bulb, E27 base, 9W',                     2500.00,  500, 1, true, NOW()),
('Smart Light Strip 5m',           '5m addressable LED strip, IP65 rated',             4500.00,  300, 1, true, NOW()),
('Smart Air Conditioner 12000 BTU','12000 BTU inverter AC with WiFi module',        125000.00,   50, 1, true, NOW()),
-- Supplier 2 — CeylonTech Electronics
('Smart Door Lock Pro',            'Biometric lock — fingerprint, PIN, RFID',        35000.00,  100, 2, true, NOW()),
('CCTV Camera 4-Pack',             '1080p wireless, IR night-vision, IP66',          45000.00,   80, 2, true, NOW()),
('Smart Speaker',                  'Voice-controlled speaker with Sinhala support',  15000.00,  200, 2, true, NOW()),
-- Supplier 3 — Colombo Automation
('Motion Sensor',                  'PIR sensor, 120° angle, battery-powered',         3500.00,  400, 3, true, NOW()),
('Smart Thermostat',               'Learning thermostat, 7-day schedule',            18000.00,  120, 3, true, NOW()),
('Smart Hub Controller',           'Zigbee + Z-Wave bridge, supports 200 devices',   22000.00,   90, 3, true, NOW());


-- ====================================================
-- 10. INSTALLATION MANAGEMENT  (ssms_installation)
-- ====================================================
\c ssms_installation

-- Technicians (IDs 1-3, user_id cross-refs user-management)
INSERT INTO technicians (user_id, specialization, certification_number,
                         availability_status, phone, hired_date, is_active, created_at) VALUES
(10, 'Smart Lighting & Sensors',   'TECH-LK-2024-001', 'AVAILABLE', '+94 77 901 2345', '2024-02-01', true, NOW()),
( 5, 'Security & CCTV Systems',    'TECH-LK-2024-002', 'ON_JOB',    '+94 72 567 8901', '2024-03-15', true, NOW()),
( 3, 'Climate Control & HVAC IoT', 'TECH-LK-2024-003', 'AVAILABLE', '+94 76 345 6789', '2024-06-01', true, NOW());

-- Installations (IDs 1-4, cross-refs order, customer, technician, user)
INSERT INTO installations (job_reference, order_id, customer_id, technician_id,
                           scheduled_by_user_id, scheduled_date, completed_date,
                           installation_address, status, technician_notes,
                           is_deleted, created_at) VALUES
('INS-20250205-001', 1, 1, 1, 2, '2025-02-05 09:00:00', '2025-02-05 12:30:00',
 '45 Galle Road, Colombo 03', 'COMPLETED',
 'Installed 5 smart bulbs and 3 light strips. All connected to home WiFi successfully.',
 false, NOW()),

('INS-20250213-002', 2, 2, 2, 2, '2025-02-13 10:00:00', NULL,
 '12 Kandy Road, Peradeniya, Kandy', 'IN_PROGRESS',
 'Door lock installed. CCTV setup in progress — running cables.',
 false, NOW()),

('INS-20250218-003', 3, 3, 1, 3, '2025-02-18 14:00:00', NULL,
 '78 Matara Road, Galle Fort, Galle', 'SCHEDULED',
 NULL,
 false, NOW()),

('INS-20250223-004', 4, 4, 3, 2, '2025-02-23 09:30:00', '2025-02-23 16:00:00',
 '23 Temple Street, Malabe, Colombo', 'COMPLETED',
 'AC and thermostat installed and paired. Customer briefed on app controls.',
 false, NOW());


-- =====================================================
-- DONE — All 10 databases seeded with Sri Lankan data
-- =====================================================
