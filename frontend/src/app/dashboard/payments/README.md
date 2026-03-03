# Payment Management Frontend

Frontend interface for the Payment Management microservice.

## Features

✅ **Payment Processing** - Create and process payments with multiple payment methods  
✅ **Payment History** - View all payments with filtering by status  
✅ **Payment Details** - View comprehensive payment information  
✅ **Status Management** - Update payment status (Pending, Success, Failed)  
✅ **Refund Processing** - Process full or partial refunds with reason tracking  
✅ **Payment Methods** - Manage available payment methods  
✅ **Search & Filter** - Search by transaction reference, customer, invoice  
✅ **Real-time Stats** - Dashboard with payment statistics  

---

## Pages Structure

### `/dashboard/payments`
Main payment list page with:
- All payments table
- Status filtering (All, Pending, Success, Failed)
- Search by ID, transaction reference, or payment method
- Quick actions: View, Approve, Reject, Refund, Delete
- Summary cards showing payment statistics

### `/dashboard/payments/process`
Process new payment page with:
- Auto-generated transaction reference
- Invoice ID and Customer ID input
- Payment amount input
- Payment method selection
- Gateway response field (optional)

### `/dashboard/payments/[id]`
Payment details page showing:
- Full payment information
- Transaction reference
- Invoice and customer links
- Payment method details
- Gateway response
- Refund information (if refunded)
- Status update actions

### `/dashboard/payments/[id]/refund`
Refund processing page with:
- Payment summary
- Refund amount input (with validation)
- Refund reason textarea
- Safety confirmation before processing

### `/dashboard/payments/methods`
Payment methods management page with:
- All payment methods table
- Add/Edit payment method form
- Toggle active status
- Delete payment methods
- Method statistics

---

## API Integration

The frontend connects to the backend via Next.js rewrites:

```typescript
// /api/payments/* → http://localhost:8086/api/payments/*
// /api/payment-methods/* → http://localhost:8086/api/payment-methods/*
```

### Payment API (`paymentApi`)
- `create(payment)` - Create new payment
- `getAll()` - Get all payments
- `getById(id)` - Get payment by ID
- `getByTransactionReference(ref)` - Get payment by transaction ref
- `getByCustomerId(customerId)` - Get customer payment history
- `getByInvoiceId(invoiceId)` - Get invoice payments
- `update(id, payment)` - Update payment
- `updateStatus(id, status)` - Update payment status
- `processRefund(id, reason?, amount?)` - Process refund
- `delete(id)` - Delete payment

### Payment Method API (`paymentMethodApi`)
- `create(method)` - Create new payment method
- `getAll()` - Get all payment methods
- `getActive()` - Get only active payment methods
- `getById(id)` - Get payment method by ID
- `getByName(name)` - Get payment method by name
- `update(id, method)` - Update payment method
- `toggleStatus(id)` - Toggle active/inactive status
- `delete(id)` - Delete payment method

---

## Types

### PaymentStatus
```typescript
type PaymentStatus = "Pending" | "Success" | "Failed";
```

### PaymentMethodType
```typescript
type PaymentMethodType = 
  | "Card" 
  | "Bank_Transfer" 
  | "Mobile_Wallet" 
  | "Cash" 
  | "Online_Banking";
```

### PaymentResponse
```typescript
interface PaymentResponse {
  paymentId: number;
  transactionReference: string;
  invoiceId: number;
  customerId: number;
  paymentMethodId: number;
  paymentMethodName: string;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
  gatewayResponse: string | null;
  refundAmount: number | null;
  refundDate: string | null;
  refundReason: string | null;
}
```

### PaymentMethodResponse
```typescript
interface PaymentMethodResponse {
  paymentMethodId: number;
  methodName: string;
  type: PaymentMethodType;
  description: string | null;
  isActive: boolean;
}
```

---

## Setup

1. **Start the backend**:
   ```bash
   cd ssms/payment-management
   mvn spring-boot:run
   ```
   Backend runs on: http://localhost:8086

2. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: http://localhost:3000

3. **Access the payment dashboard**:
   http://localhost:3000/dashboard/payments

---

## Workflow Examples

### Processing a Payment
1. Go to `/dashboard/payments`
2. Click "Process Payment"
3. Enter invoice ID and customer ID
4. Enter payment amount
5. Select payment method
6. (Optional) Add gateway response
7. Click "Process Payment"
8. Payment is created with "Pending" status
9. Approve or reject from list or details page

### Issuing a Refund
1. Find a successful payment in the list
2. Click "Refund" action
3. Review payment details
4. Enter refund amount (defaults to full amount)
5. Enter refund reason
6. Click "Process Refund"
7. Refund is recorded in payment record

### Managing Payment Methods
1. Go to `/dashboard/payments/methods`
2. Click "Add Payment Method"
3. Enter method name and select type
4. Add description (optional)
5. Enable/disable as needed
6. Used payment methods appear in dropdowns

---

## Color Coding

- **Green**: Success status, active methods
- **Yellow**: Pending status
- **Red**: Failed status, delete actions
- **Orange**: Refund-related actions
- **Blue**: Primary actions, links
- **Gray**: Inactive, secondary actions

---

## Notes

- Transaction references are auto-generated but can be customized
- Refunds can only be processed on successful payments
- Payment methods must be active to appear in the process payment form
- The payment-management service runs on port **8086**
- All monetary values use 2 decimal precision
