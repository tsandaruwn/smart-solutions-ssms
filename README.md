# Product Management Microservice

A full-stack application for managing smart home products with a Spring Boot backend and Next.js frontend.

## Features

- ✅ Add new smart home products
- ✅ Store product details (name, category, price, description)
- ✅ Update product details
- ✅ Remove discontinued products
- ✅ List all available products

## Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Spring Boot 3.2.0 (Java 21)
- **Database**: PostgreSQL
- **Build Tool**: Maven
- **Configuration**: YAML (application.yml)

## Prerequisites

Make sure you have the following installed:

- **JDK 21**
- **Maven 3.6+**
- **PostgreSQL 12+**
- **Node.js 18+** (for Next.js frontend)

## Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE productdb;
```

2. Update database credentials in `backend/src/main/resources/application.yml` if needed:
   - Default username: `postgres`
   - Default password: `postgres`
   - Default database: `productdb`

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/available` - Get only available (non-discontinued) products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/{id}` - Update a product
- `DELETE /api/products/{id}` - Delete a product permanently
- `PATCH /api/products/{id}/discontinue` - Mark a product as discontinued

### Product JSON Format

```json
{
  "name": "Smart Light Bulb",
  "category": "Smart Lighting",
  "price": 29.99,
  "description": "WiFi-enabled smart light bulb with color control"
}
```

## Project Structure

```
Product-Management/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/productmanagement/
│   │   │   │   ├── ProductManagementApplication.java
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── model/
│   │   │   │   ├── dto/
│   │   │   │   └── exception/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── schema.sql
│   └── pom.xml
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
└── README.md
```

## Usage

1. Start PostgreSQL database
2. Start the Spring Boot backend (port 8080)
3. Start the Next.js frontend (port 3000)
4. Open `http://localhost:3000` in your browser
5. Use the UI to add, edit, delete, or discontinue products

## Development Notes

- The backend uses JPA/Hibernate for database operations
- The database schema is auto-created on first run (ddl-auto: update)
- CORS is enabled for `http://localhost:3000`
- The frontend uses Axios for API calls
- All forms include validation on both frontend and backend

