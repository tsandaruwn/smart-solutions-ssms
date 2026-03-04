# Smart Solutions Management System (SSMS)

SSMS is a **microservices-based management system** designed for a Smart Solutions Pvt Ltd.  
It handles core business operations such as users, products, orders, inventory, payments, billing, installations, suppliers, and digital marketing.

The system is built with **modern, scalable architecture** using Spring Boot microservices and a Next.js frontend.

---

## 🧩 Project Architecture

- **Frontend:** Next.js  
- **Backend:** Spring Boot (Microservices)  
- **Database:** PostgreSQL  
- **Java Version:** JDK 21  
- **Configuration:** YAML (`application.yml`)  
- **Build Tool:** Maven  

---

## 🏗️ Backend – Spring Boot Microservices

Each feature is developed as an **independent microservice** with its own structure and configuration.

### Microservices Included

- User Management  
- Customer Service  
- Product Management  
- Inventory Management  
- Order Management  
- Payment Management  
- Billing & Invoice  
- Installation Management  
- Supplier Management  
- Digital Marketing  

Each microservice follows a layered architecture:

---

## 📂 Project Folder Structure

ssms/
│
├─ user-management/
├─ customer-service/
├─ product-management/
├─ inventory-management/
├─ order-management/
├─ payment-management/
├─ billing-and-invoice/
├─ installation-management/
├─ supplier-management/
└─ digital-marketing/


Each service contains:
- `controller` – REST APIs  
- `service` – Business logic  
- `repository` – Database access  
- `entity` – JPA entities  
- `application.yml` – Service configuration  

---

## 🎨 Frontend – Next.js

- Built using **Next.js**
- Communicates with backend microservices via REST APIs
- Handles UI, routing, authentication, and client-side logic

---

## 🗄️ Database

- **PostgreSQL**
- Each microservice can have:
  - Its own schema, or
  - A shared database with separate tables (based on configuration)

---

## ⚙️ Requirements

Make sure you have the following installed:

- **JDK 21**
- **Maven**
- **PostgreSQL**
- **Node.js (for Next.js frontend)**

---

## ▶️ Running the Backend Services

1. Configure PostgreSQL credentials in each `application.yml`
2. Navigate to a microservice directory
3. Run:

```bash
mvn spring-boot:run


