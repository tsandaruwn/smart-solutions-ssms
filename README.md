# Product Management Microservice

Product management system for smart home products. Built with Spring Boot backend and Next.js frontend.

## Features

- Add new smart home products
- Store product details (name, category, price, description)
- Update product details
- Remove discontinued products
- List all available products

## Tech Stack

- Frontend: Next.js 14 with TypeScript
- Backend: Spring Boot 3.2.0 (Java 21)
- Database: PostgreSQL
- Build Tool: Maven

## Setup

### Prerequisites

- JDK 21
- Maven 3.6+
- PostgreSQL 12+
- Node.js 18+

### Database

Create database:
```sql
CREATE DATABASE productdb;
```

Update credentials in `backend/src/main/resources/application.yml` if needed.

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/available` - Get available products only
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `PATCH /api/products/{id}/discontinue` - Mark as discontinued

## Project Structure

```
Product-Management/
├── backend/
│   ├── src/main/java/com/productmanagement/
│   │   ├── ProductManagementApplication.java
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   └── exception/
│   └── pom.xml
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── package.json
└── README.md
```
