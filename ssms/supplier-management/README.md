# Supplier Management Microservice

A comprehensive supplier management system built with Spring Boot 3.2.3, providing RESTful APIs for managing suppliers and their products.

## Features

- ✅ **Complete CRUD Operations** for Suppliers and Products
- ✅ **DTO Pattern** for clean request/response handling
- ✅ **Soft Delete** functionality for data preservation
- ✅ **Global Exception Handling** with custom error responses
- ✅ **Input Validation** with Jakarta Validation
- ✅ **Relationship Management** (One-to-Many: Supplier → Products)
- ✅ **Search & Filter** capabilities
- ✅ **Security Configuration** with Spring Security
- ✅ **CORS Configuration** for cross-origin requests
- ✅ **Comprehensive Logging**

## Technology Stack

- **Java**: 21
- **Spring Boot**: 3.2.3
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Security**: Spring Security
- **Validation**: Jakarta Validation

## Project Structure

```
supplier-management/
├── src/
│   ├── main/
│   │   ├── java/com/ssms/suppliermanagement/
│   │   │   ├── config/              # Configuration classes
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/          # REST Controllers
│   │   │   │   ├── SupplierController.java
│   │   │   │   └── ProductController.java
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── SupplierRequestDTO.java
│   │   │   │   ├── SupplierResponseDTO.java
│   │   │   │   ├── ProductRequestDTO.java
│   │   │   │   ├── ProductResponseDTO.java
│   │   │   │   └── ApiResponse.java
│   │   │   ├── entity/              # JPA Entities
│   │   │   │   ├── Supplier.java
│   │   │   │   └── Product.java
│   │   │   ├── exception/           # Exception Handling
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── DuplicateResourceException.java
│   │   │   │   ├── InvalidOperationException.java
│   │   │   │   ├── ErrorResponse.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   ├── repository/          # Spring Data JPA Repositories
│   │   │   │   ├── SupplierRepository.java
│   │   │   │   └── ProductRepository.java
│   │   │   ├── service/             # Business Logic Layer
│   │   │   │   ├── SupplierService.java
│   │   │   │   └── ProductService.java
│   │   │   ├── util/                # Utility Classes
│   │   │   │   ├── SupplierMapper.java
│   │   │   │   └── ProductMapper.java
│   │   │   └── SupplierManagementApplication.java
│   │   └── resources/
│   │       └── application.yaml     # Application Configuration
│   └── test/                        # Test Classes
├── API_DOCUMENTATION.md             # Complete API Documentation
├── DATABASE_SCHEMA.md               # Database Schema & ER Diagram
├── pom.xml                          # Maven Configuration
└── README.md                        # This file
```

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- PostgreSQL 12+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## Database Setup

1. Install PostgreSQL if not already installed
2. Create a database:
```sql
CREATE DATABASE ssms_supplier_db;
```

3. Update database credentials in `src/main/resources/application.yaml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ssms_supplier_db
    username: postgres
    password: admin123
```

## Installation & Running

### 1. Clone the repository
```bash
cd supplier-management
```

### 2. Build the project
```bash
mvn clean install
```

### 3. Run the application
```bash
mvn spring-boot:run
```

Or run using the compiled JAR:
```bash
java -jar target/supplier-management.jar
```

The application will start on `http://localhost:8085`

## API Endpoints

### Supplier Endpoints
- `GET /api/v1/suppliers` - Get all suppliers
- `GET /api/v1/suppliers/active` - Get active suppliers
- `GET /api/v1/suppliers/{id}` - Get supplier by ID
- `POST /api/v1/suppliers` - Create new supplier
- `PUT /api/v1/suppliers/{id}` - Update supplier
- `DELETE /api/v1/suppliers/{id}` - Soft delete supplier
- `DELETE /api/v1/suppliers/{id}/hard` - Permanently delete supplier
- `GET /api/v1/suppliers/{id}/products` - Get supplier's products
- `GET /api/v1/suppliers/{id}/products/active` - Get supplier's active products
- `GET /api/v1/suppliers/search?companyName={name}` - Search suppliers
- `GET /api/v1/suppliers/city/{city}` - Get suppliers by city
- `GET /api/v1/suppliers/country/{country}` - Get suppliers by country
- `PATCH /api/v1/suppliers/{id}/activate` - Activate supplier
- `PATCH /api/v1/suppliers/{id}/deactivate` - Deactivate supplier

### Product Endpoints
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/active` - Get active products
- `GET /api/v1/products/{id}` - Get product by ID
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Soft delete product
- `GET /api/v1/products/search?name={name}` - Search products

For detailed API documentation with request/response examples, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## Testing the API

You can test the API using:
- **Postman** (recommended)
- **cURL**
- **Thunder Client** (VS Code extension)
- **Swagger UI** (if configured)

### Example cURL Commands

#### Create Supplier
```bash
curl -X POST http://localhost:8085/api/v1/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "email": "supplier@example.com",
    "companyName": "ABC Corporation",
    "contactPerson": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA",
    "contractStartDate": "2024-01-01",
    "contractEndDate": "2025-12-31",
    "isActive": true
  }'
```

#### Get All Suppliers
```bash
curl -X GET http://localhost:8085/api/v1/suppliers
```

#### Create Product
```bash
curl -X POST http://localhost:8085/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Product A",
    "description": "High-quality product",
    "unitPrice": 99.99,
    "quantityInStock": 100,
    "supplierId": 1,
    "isActive": true
  }'
```

## Database Schema

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for the complete database schema and ER diagram.

## Architecture & Design Patterns

### Layered Architecture
1. **Controller Layer**: Handles HTTP requests/responses, input validation
2. **Service Layer**: Contains business logic and transaction management
3. **Repository Layer**: Data access using Spring Data JPA
4. **Entity Layer**: JPA entities representing database tables

### Design Patterns Used
- **DTO Pattern**: Separation of API contracts from domain entities
- **Repository Pattern**: Data access abstraction
- **Service Pattern**: Business logic encapsulation
- **Mapper Pattern**: Entity-DTO conversion
- **Exception Handler Pattern**: Centralized exception handling

## Key Features Explained

### 1. Soft Delete
- Records are not physically deleted
- `deleted_at` timestamp is set when deleted
- Uses Hibernate `@SQLDelete` and `@Where` annotations
- Preserves data for audit trails

### 2. DTO Pattern
- Clean separation between API and domain layers
- Request DTOs for input validation
- Response DTOs for controlled data exposure
- Prevents over-posting and under-posting

### 3. Exception Handling
- Custom exceptions for specific scenarios
- Global exception handler with `@RestControllerAdvice`
- Consistent error response format
- Validation error details included

### 4. Validation
- Jakarta Validation annotations
- Email format validation
- Required field validation
- Size constraints
- Custom business rule validation

## Configuration

### Security
The application uses Spring Security with permitAll() configuration for testing. For production:
1. Implement JWT or OAuth2 authentication
2. Configure role-based access control
3. Update SecurityConfig.java

### CORS
CORS is configured to allow all origins. For production:
1. Update CorsConfig.java
2. Specify allowed origins
3. Configure allowed methods and headers

## Logging

Logs are configured in `application.yaml`:
- Application logs: DEBUG level
- Spring framework: INFO level
- Hibernate: INFO level

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is part of the SSMS (Smart Solutions Management System) and is proprietary.

## Contact

For questions or support, contact the development team.

---

## Requirements Fulfilled

✅ **Store supplier details** - Full CRUD operations for suppliers
✅ **Link suppliers to products** - One-to-Many relationship implemented
✅ **Allow supplier updates** - PUT endpoint with validation
✅ **Allow supplier removal** - Soft and hard delete options
✅ **Retrieve supplier product lists** - Dedicated endpoint for supplier products

---

**Version:** 1.0.0  
**Last Updated:** March 4, 2026  
**Spring Boot Version:** 3.2.3  
**Java Version:** 21
