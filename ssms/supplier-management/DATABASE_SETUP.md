# Quick Setup Guide - Database Configuration

## Option 1: Create PostgreSQL Database (Recommended for Production)

### Step 1: Open PostgreSQL Command Line or pgAdmin

### Step 2: Create the Database
```sql
CREATE DATABASE ssms_supplier_db;
```

### Step 3: Verify Database Created
```sql
\l
-- or in pgAdmin, refresh the database list
```

### Step 4: Start the Application
```bash
mvn spring-boot:run
```

---

## Option 2: Use H2 In-Memory Database (Quick Testing)

If you don't want to set up PostgreSQL right now, use H2 database:

### Step 1: Update application.yaml
Replace the content in `src/main/resources/application.yaml` with:

```yaml
spring:
  application:
    name: supplier-management

  datasource:
    url: jdbc:h2:mem:supplierdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.H2Dialect
        format_sql: true

  h2:
    console:
      enabled: true
      path: /h2-console

server:
  port: 8085

logging:
  level:
    com.ssms.suppliermanagement: DEBUG
    org.springframework.web: INFO
    org.hibernate: INFO
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
```

### Step 2: Add H2 Dependency to pom.xml
Add this in the `<dependencies>` section:

```xml
<!-- H2 Database -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Step 3: Start the Application
```bash
mvn spring-boot:run
```

### Step 4: Access H2 Console (Optional)
- URL: http://localhost:8085/h2-console
- JDBC URL: `jdbc:h2:mem:supplierdb`
- Username: `sa`
- Password: (leave blank)

---

## Current PostgreSQL Configuration

Your current `application.yaml` points to:
- **Host**: localhost
- **Port**: 5432
- **Database**: ssms_supplier_db
- **Username**: postgres
- **Password**: admin123

**Make sure PostgreSQL is running and the database exists!**

---

## Verify PostgreSQL is Running

### Windows:
```powershell
# Check if PostgreSQL service is running
Get-Service postgresql*

# Or start PostgreSQL service
net start postgresql-x64-14
```

### Create Database via psql:
```bash
psql -U postgres
CREATE DATABASE ssms_supplier_db;
\q
```

---

## Next Steps After Database Setup

1. ✅ Create database
2. ✅ Start application: `mvn spring-boot:run`
3. ✅ Wait for message: "Started SupplierManagementApplication"
4. ✅ Test in Postman: `http://localhost:8085/api/v1/suppliers`
