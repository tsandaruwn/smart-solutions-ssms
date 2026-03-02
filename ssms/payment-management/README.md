# Payment Management Microservice

Payment Management service for handling payment transactions, payment methods, refunds, and payment history.

## Features

✅ Record payment transactions  
✅ Track payments by invoice and customer  
✅ Support multiple payment methods (configurable)  
✅ Payment method registry with types (Card, Bank Transfer, Mobile Wallet, etc.)  
✅ Update payment status (Pending, Success, Failed)  
✅ Process refunds with reason tracking  
✅ Unique transaction references  
✅ Gateway response tracking  
✅ Full payment history per customer  
✅ Multiple transactions per invoice support (partial payments, retries, refunds)  
✅ Full CRUD operations for payments and payment methods  

---

## Database Schema

### PAYMENT (Transaction Record)
| Field | Type | Description |
|-------|------|-------------|
| payment_id (PK) | INT AUTO_INCREMENT | Primary key |
| transaction_reference (UN) | VARCHAR(100) | Unique transaction reference |
| invoice_id (FK) | INT | Reference to invoice |
| customer_id (FK) | INT | Reference to customer |
| payment_method_id (FK) | INT | Reference to payment method |
| amount | DECIMAL(12,2) | Payment amount |
| payment_date | TIMESTAMP | Transaction date and time |
| status | ENUM | Pending, Success, Failed |
| gateway_response | TEXT | Payment gateway response |
| refund_amount | DECIMAL(12,2) | Refund amount if applicable |
| refund_date | TIMESTAMP | Refund date if applicable |
| refund_reason | TEXT | Reason for refund |

### PAYMENT_METHOD (Method Registry)
| Field | Type | Description |
|-------|------|-------------|
| payment_method_id (PK) | INT | Primary key |
| method_name (UK) | VARCHAR(50) | Unique method name |
| type | ENUM | Card, Bank_Transfer, Mobile_Wallet, Cash, Online_Banking |
| description | VARCHAR(200) | Method description |
| is_active | BOOLEAN | Whether method is active (default: true) |

### Relationships
- **INVOICE** → **PAYMENT** (1:Many) - An invoice can be paid in multiple transactions
- **CUSTOMER** → **PAYMENT** (1:Many) - Full payment history retrieval per customer
- **PAYMENT_METHOD** → **PAYMENT** (1:Many) - Tracks which payment method was used per transaction

---

## Tech Stack

- **Java 21**
- **Spring Boot 4.0.2**
- **PostgreSQL**
- **JPA/Hibernate**
- **Maven**

---

## API Endpoints

### Payment Endpoints

#### 1. Create Payment
**POST** `/api/payments`

**Request Body:**
```json
{
  "transactionReference": "TXN-2026-12345",
  "invoiceId": 1,
  "customerId": 1,
  "amount": 150.00,
  "paymentMethodId": 1,
  "gatewayResponse": "Payment approved by gateway"
}
```

#### 2. Get All Payments
**GET** `/api/payments`

#### 3. Get Payment by ID
**GET** `/api/payments/{id}`

#### 4. Get Payment by Transaction Reference
**GET** `/api/payments/transaction/{transactionReference}`

#### 5. Get Payment History by Customer ID
**GET** `/api/payments/customer/{customerId}`

#### 6. Get Payments by Invoice ID
**GET** `/api/payments/invoice/{invoiceId}`

#### 7. Update Payment
**PUT** `/api/payments/{id}`

**Request Body:**
```json
{
  "transactionReference": "TXN-2026-12345-UPDATED",
  "invoiceId": 1,
  "customerId": 1,
  "amount": 150.00,
  "paymentMethodId": 2,
  "gatewayResponse": "Updated gateway response"
}
```

#### 8. Update Payment Status
**PATCH** `/api/payments/{id}/status?status=Success`

**Query Parameters:**
- `status`: Pending | Success | Failed

#### 9. Process Refund
**POST** `/api/payments/{id}/refund?refundReason=Customer request&refundAmount=150.00`

**Query Parameters:**
- `refundReason` (optional): Reason for refund
- `refundAmount` (optional): Refund amount (defaults to full payment amount)

#### 10. Delete Payment
**DELETE** `/api/payments/{id}`

---

### Payment Method Endpoints

#### 1. Create Payment Method
**POST** `/api/payment-methods`

**Request Body:**
```json
{
  "methodName": "Google Pay",
  "type": "Mobile_Wallet",
  "description": "Payment via Google Pay",
  "isActive": true
}
```

#### 2. Get All Payment Methods
**GET** `/api/payment-methods`

#### 3. Get Active Payment Methods
**GET** `/api/payment-methods/active`

#### 4. Get Payment Method by ID
**GET** `/api/payment-methods/{id}`

#### 5. Get Payment Method by Name
**GET** `/api/payment-methods/name/{methodName}`

#### 6. Update Payment Method
**PUT** `/api/payment-methods/{id}`

**Request Body:**
```json
{
  "methodName": "Google Pay",
  "type": "Mobile_Wallet",
  "description": "Updated description",
  "isActive": true
}
```

#### 7. Toggle Payment Method Status
**PATCH** `/api/payment-methods/{id}/toggle-status`

#### 8. Delete Payment Method
**DELETE** `/api/payment-methods/{id}`

---

## Enumerations

### Payment Method Types
- `Card` - Credit/Debit cards
- `Bank_Transfer` - Direct bank transfers
- `Mobile_Wallet` - Mobile wallet apps (PayPal, Google Pay, etc.)
- `Cash` - Cash payments
- `Online_Banking` - Online banking portals

### Payment Statuses
- `Pending` - Payment is pending
- `Success` - Payment completed successfully
- `Failed` - Payment failed

---

## Default Payment Methods

The following payment methods are automatically initialized on first startup:

1. **Credit Card** (Card) - Payment via credit card (Visa, MasterCard, etc.)
2. **Debit Card** (Card) - Payment via debit card
3. **Bank Transfer** (Bank_Transfer) - Direct bank transfer / Wire transfer
4. **Mobile Wallet** (Mobile_Wallet) - Payment via mobile wallet apps
5. **Cash** (Cash) - Cash on delivery or in-person payment
6. **Online Banking** (Online_Banking) - Payment via online banking portal

---

## Database Configuration

Update `application.yaml` with your PostgreSQL credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ssms_payment
    username: postgres
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

## Example Responses

### Payment Response
```json
{
  "paymentId": 1,
  "transactionReference": "TXN-2026-12345",
  "invoiceId": 1,
  "customerId": 1,
  "paymentMethodId": 1,
  "paymentMethodName": "Credit Card",
  "amount": 150.00,
  "paymentDate": "2026-03-02T10:30:00",
  "status": "Success",
  "gatewayResponse": "Payment approved by gateway",
  "refundAmount": null,
  "refundDate": null,
  "refundReason": null
}
```

### Payment Method Response
```json
{
  "paymentMethodId": 1,
  "methodName": "Credit Card",
  "type": "Card",
  "description": "Payment via credit card (Visa, MasterCard, etc.)",
  "isActive": true
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
│   │   │   │   ├── PaymentController.java
│   │   │   │   └── PaymentMethodController.java
│   │   │   ├── service/
│   │   │   │   ├── PaymentService.java
│   │   │   │   └── PaymentMethodService.java
│   │   │   ├── repository/
│   │   │   │   ├── PaymentRepository.java
│   │   │   │   └── PaymentMethodRepository.java
│   │   │   ├── entity/
│   │   │   │   ├── Payment.java
│   │   │   │   ├── PaymentMethod.java
│   │   │   │   ├── PaymentMethodType.java
│   │   │   │   └── PaymentStatus.java
│   │   │   ├── dto/
│   │   │   │   ├── PaymentRequest.java
│   │   │   │   ├── PaymentResponse.java
│   │   │   │   ├── PaymentMethodRequest.java
│   │   │   │   └── PaymentMethodResponse.java
│   │   │   ├── config/
│   │   │   │   └── DataInitializer.java
│   │   │   └── PaymentManagementApplication.java
│   │   └── resources/
│   │       └── application.yaml
│   └── test/
├── pom.xml
└── README.md
```

---

## Key Features & Design Decisions

### 1. Transaction Reference Uniqueness
Each payment has a unique `transaction_reference` to ensure transaction traceability across the system.

### 2. Multiple Payments per Invoice
Supports scenarios like:
- Partial payments
- Payment retries after failures
- Refund transactions

### 3. Customer Payment History
Can retrieve full payment history independently of invoice lookup, useful for:
- Customer analytics
- Payment pattern analysis
- Dispute resolution

### 4. Flexible Payment Methods
Payment methods are managed as a separate entity (not hardcoded enum), allowing:
- Dynamic addition of new payment methods
- Enable/disable payment methods without code changes
- Detailed method configuration (type, description, active status)

### 5. Refund Tracking
Comprehensive refund support with:
- Partial or full refund amounts
- Refund date tracking
- Refund reason documentation
- Gateway response preservation

---

## Business Rules

1. **Payment Creation**: Requires valid invoice_id, customer_id, and active payment_method_id
2. **Refunds**: Only successful payments can be refunded
3. **Refund Amount**: Cannot exceed original payment amount
4. **Payment Method Activation**: Only active payment methods can be used for new payments
5. **Transaction Reference**: Must be unique across all payments

---

## Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal, etc.)
- [ ] Scheduled payment support
- [ ] Payment plan/installment tracking
- [ ] Payment notifications (email/SMS)
- [ ] Payment analytics and reporting
- [ ] Multi-currency support
- [ ] Payment dispute management
- [ ] Fraud detection integration

---

## Support

For issues or questions, please contact the development team.

**Service Port**: 8085  
**Database**: PostgreSQL  
**Last Updated**: March 2, 2026
