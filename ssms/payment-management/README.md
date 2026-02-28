# Payment Management Microservice

Payment Management service for handling payment transactions, refunds, and payment history.

## Features

✅ Record payment transactions  
✅ Support multiple payment methods (Credit Card, Debit Card, Cash, Online Banking, Mobile Wallet)  
✅ Update payment status (Success, Failed, Refunded, Pending)  
✅ Process refunds  
✅ Maintain payment history  
✅ Full CRUD operations  

---

## Tech Stack

- **Java 21**
- **Spring Boot 4.0.2**
- **PostgreSQL**
- **JPA/Hibernate**
- **Maven**

---

## API Endpoints

### 1. Create Payment
**POST** `/api/payments`

**Request Body:**
```json
{
  "orderId": 1,
  "userId": 1,
  "amount": 150.00,
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "TXN123456",
  "paymentReference": "REF789",
  "remarks": "Payment for order #1"
}
```

### 2. Get All Payments
**GET** `/api/payments`

### 3. Get Payment by ID
**GET** `/api/payments/{id}`

### 4. Get Payment History by User ID
**GET** `/api/payments/user/{userId}`

### 5. Get Payments by Order ID
**GET** `/api/payments/order/{orderId}`

### 6. Update Payment
**PUT** `/api/payments/{id}`

**Request Body:**
```json
{
  "orderId": 1,
  "userId": 1,
  "amount": 150.00,
  "paymentMethod": "DEBIT_CARD",
  "transactionId": "TXN123456",
  "paymentReference": "REF789",
  "remarks": "Updated payment"
}
```

### 7. Update Payment Status
**PATCH** `/api/payments/{id}/status?status=SUCCESS`

**Query Parameters:**
- `status`: SUCCESS | FAILED | REFUNDED | PENDING

### 8. Process Refund
**POST** `/api/payments/{id}/refund?remarks=Customer request`

**Query Parameters:**
- `remarks` (optional): Reason for refund

### 9. Delete Payment
**DELETE** `/api/payments/{id}`

---

## Payment Methods

- `CREDIT_CARD`
- `DEBIT_CARD`
- `CASH`
- `ONLINE_BANKING`
- `MOBILE_WALLET`

---

## Payment Statuses

- `SUCCESS` - Payment completed successfully
- `FAILED` - Payment failed
- `REFUNDED` - Payment has been refunded
- `PENDING` - Payment is pending

---

## Database Configuration

Update `application.yaml` with your PostgreSQL credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/your_database
    username: your_username
    password: your_password
```

---

## Running the Service

```bash
cd ssms/payment-management
mvn spring-boot:run
```

The service will start on **port 8085**.

---

## Example Response

```json
{
  "id": 1,
  "orderId": 1,
  "userId": 1,
  "amount": 150.00,
  "paymentMethod": "CREDIT_CARD",
  "status": "SUCCESS",
  "transactionId": "TXN123456",
  "paymentReference": "REF789",
  "paymentDate": "2026-02-04T10:30:00",
  "refundDate": null,
  "remarks": "Payment for order #1"
}
```

---

## Project Structure

```
payment-management/
├── src/
│   ├── main/
│   │   ├── java/com/ssms/payment/
│   │   │   ├── controller/
│   │   │   │   └── PaymentController.java
│   │   │   ├── service/
│   │   │   │   └── PaymentService.java
│   │   │   ├── repository/
│   │   │   │   └── PaymentRepository.java
│   │   │   ├── entity/
│   │   │   │   ├── Payment.java
│   │   │   │   ├── PaymentMethod.java
│   │   │   │   └── PaymentStatus.java
│   │   │   ├── dto/
│   │   │   │   ├── PaymentRequest.java
│   │   │   │   └── PaymentResponse.java
│   │   │   └── PaymentManagementApplication.java
│   │   └── resources/
│   │       └── application.yaml
│   └── test/
├── pom.xml
└── README.md
```
