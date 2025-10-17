# 💳 Payment Module - Quick Start Guide

## 🚀 Quick Setup (3 Commands)

### 1. Start Backend Server

```powershell
Set-Location "c:\Users\admin\Desktop\FRbiling\backend"
node src/server.js
```

### 2. Start Frontend Server

```powershell
Set-Location "c:\Users\admin\Desktop\FRbiling\frontend"
npm run dev
```

### 3. Access Payment Module

Open browser: **http://localhost:3000/payments/gst**

---

## 📋 Module Overview

### 4 Pages Created:

| Page                      | Route               | Description                     |
| ------------------------- | ------------------- | ------------------------------- |
| **Add Payment (GST)**     | `/payments/gst`     | Manage GST invoice payments     |
| **Add Payment (Non-GST)** | `/payments/non-gst` | Manage non-GST invoice payments |
| **Payment Details**       | `/payments/track`   | Track payment history           |
| **Customer Credit**       | `/payments/credit`  | View customer credit info       |

---

## 🧪 Quick Test (5 Minutes)

### Test 1: Add Payment (GST) - 2 min

```
1. Navigate to: Payment > Add Payment (GST)
2. Check summary cards display amounts
3. Select "All" in Payment Status
4. Click "Show" button
5. ✅ Table loads with GST invoices
```

**Expected Result:**

- 4 summary cards with amounts
- Table with invoices where GST > 0
- "Add Payments" button on each row

---

### Test 2: Add Payment (Non-GST) - 1 min

```
1. Navigate to: Payment > Add Payment (Non-GST)
2. Select "Unpaid" in Payment Status
3. Click "Show" button
4. ✅ Table loads with non-GST invoices
```

**Expected Result:**

- Only invoices with GST% = 0
- Only unpaid invoices displayed
- GST Total column shows 0

---

### Test 3: Payment Track - 1 min

```
1. Navigate to: Payment > Payment Details
2. From Date: 2024-01-01
3. To Date: 2025-12-31
4. Click "Show" button
5. ✅ Payment transactions display
```

**Expected Result:**

- Payment list with Edit/Delete icons
- Net Total and Total at bottom
- Pagination controls visible

---

### Test 4: Customer Credit - 1 min

```
1. Navigate to: Payment > Customer Credit
2. Enter Customer Id: "Ramesh" (or any existing ID)
3. Click "Search" button
4. ✅ Total Credit and Balance display
```

**Expected Result:**

- Total Credit box (Blue)
- Balance box (Green)
- Tabs for different views

---

## 🗂️ Files Created

### Frontend (4 files):

```
frontend/src/pages/
├── AddPaymentGSTPage.jsx
├── AddPaymentNonGSTPage.jsx
├── PaymentTrackPage.jsx
└── CustomerCreditPage.jsx
```

### Backend (2 files updated):

```
backend/src/
├── controllers/paymentController.js  (4 methods added)
└── routes/paymentRoutes.js          (4 routes added)
```

### Navigation (2 files updated):

```
frontend/src/
├── components/navigation/Sidebar.jsx  (Payment group added)
└── pages/App.jsx                      (4 routes added)
```

---

## 🌐 API Endpoints

### New Endpoints (4):

#### 1. Invoice Summary

```
GET /api/payments/invoice-summary?gst=true
```

Returns: Paid, Unpaid, Total Sale, Partial Paid amounts

#### 2. Invoice List

```
GET /api/payments/invoice-list?gst=true&payment_status=All&page=1&limit=10
```

Returns: List of invoices with payment details

#### 3. Payment Track

```
GET /api/payments/track?from_date=2024-01-01&to_date=2025-12-31&page=1&limit=10
```

Returns: Payment transaction history

#### 4. Customer Credit

```
GET /api/payments/customer-credit?customer_id=Ramesh
```

Returns: Total credit and balance for customer

---

## 📊 Sidebar Menu

```
📦 Payment (CreditCard Icon - Collapsible)
   ├── Add Payment (GST)
   ├── Add Payment (Non-GST)
   ├── Payment Details
   └── Customer Credit
```

---

## 🔧 Configuration

### Backend (.env):

```env
NODE_ENV=development
PORT=5000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=Backend
MYSQL_DATABASE=frbilling
JWT_SECRET=change_me
JWT_EXPIRATION=1d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env):

```env
VITE_API_URL=http://localhost:5000
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Summary Cards Show ₹0.00

**Solution:**

```sql
-- Check if invoices exist
SELECT COUNT(*) FROM invoices WHERE franchise_id = 1;

-- If 0, create test invoices using Invoice module
```

---

### Issue 2: Table Shows "No records found"

**Solution:**

1. Check browser console (F12) for errors
2. Verify backend is running (port 5000)
3. Check token in localStorage: `localStorage.getItem('token')`
4. Try clicking "Show" button again

---

### Issue 3: 401 Unauthorized Error

**Solution:**

```javascript
// Re-login to get fresh token
1. Navigate to /login
2. Enter credentials
3. Login again
```

---

### Issue 4: Payment Track Returns Empty

**Solution:**

```sql
-- Check if payments exist
SELECT COUNT(*) FROM payments WHERE franchise_id = 1;

-- If 0, create test payment first
INSERT INTO payments (franchise_id, invoice_id, amount, payment_mode, payment_date)
VALUES (1, 1, 100, 'Cash', CURDATE());
```

---

## 📖 Page Features

### Add Payment (GST/Non-GST):

- ✅ 4 Summary cards (Paid, Unpaid, Total Sale, Partial)
- ✅ Payment status filter (All, Paid, Unpaid, Partial)
- ✅ Search by customer/invoice
- ✅ Pagination (10/25/50/100 per page)
- ✅ Table with 12 columns
- ✅ "Add Payments" button per row

### Payment Track:

- ✅ Filter by customer ID, date range
- ✅ Edit/Delete payment actions
- ✅ Payment details (mode, remark, date, amount)
- ✅ Calculate balance per transaction
- ✅ Show Net Total and Total
- ✅ Pagination and search

### Customer Credit:

- ✅ Tabbed interface (4 tabs)
- ✅ Search by customer ID
- ✅ Display Total Credit (Blue box)
- ✅ Display Balance (Green box)
- ✅ Print functionality

---

## 🎯 Usage Examples

### Example 1: View All GST Payments

```javascript
// Navigate to Payment > Add Payment (GST)
// API Call: GET /api/payments/invoice-summary?gst=true
// Response:
{
  "success": true,
  "data": {
    "paid_amount": 0.00,
    "unpaid_amount": 38771.68,
    "total_sale": 38779.68,
    "partial_paid": 0.00
  }
}

// Click "Show" button
// API Call: GET /api/payments/invoice-list?gst=true&payment_status=All&page=1&limit=10
// Response: List of 10 invoices with GST
```

---

### Example 2: Track Payments by Date

```javascript
// Navigate to Payment > Payment Details
// Enter From Date: 2024-01-01
// Enter To Date: 2025-12-31
// Click "Show" button

// API Call: GET /api/payments/track?from_date=2024-01-01&to_date=2025-12-31&page=1&limit=10
// Response: Payment transactions with totals
```

---

### Example 3: Check Customer Credit

```javascript
// Navigate to Payment > Customer Credit
// Enter Customer Id: "Ramesh"
// Click "Search" button

// API Call: GET /api/payments/customer-credit?customer_id=Ramesh
// Response:
{
  "success": true,
  "data": {
    "total_credit": 100.00,
    "balance": 321.00
  }
}
```

---

## 🧩 Integration with Other Modules

### Invoice Module Integration:

- Payment pages use invoice data
- Invoice payment_status updated on payment
- Balance calculated from invoice net_amount

### Booking Module Integration:

- Payments can link to bookings (optional)
- Booking ID in payments table
- Future: Link bookings directly

---

## 📈 Database Queries

### Get Payment Summary:

```sql
SELECT
  COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN net_amount ELSE 0 END), 0) as paid_amount,
  COALESCE(SUM(CASE WHEN payment_status = 'pending' THEN net_amount ELSE 0 END), 0) as unpaid_amount,
  COALESCE(SUM(net_amount), 0) as total_sale,
  COALESCE(SUM(CASE WHEN payment_status = 'partial' THEN net_amount ELSE 0 END), 0) as partial_paid
FROM invoices
WHERE franchise_id = ? AND (gst_percent > 0 OR gst_total > 0);
```

### Get Invoice List with Payments:

```sql
SELECT
  i.*,
  COALESCE(SUM(p.amount), 0) as paid_amount,
  (i.net_amount - COALESCE(SUM(p.amount), 0)) as balance
FROM invoices i
LEFT JOIN payments p ON p.invoice_id = i.id
WHERE i.franchise_id = ?
GROUP BY i.id
ORDER BY i.invoice_date DESC
LIMIT 10 OFFSET 0;
```

### Get Payment Track:

```sql
SELECT
  p.*,
  i.invoice_number,
  i.invoice_date,
  i.customer_id,
  i.net_amount,
  (i.net_amount - COALESCE((SELECT SUM(amount) FROM payments WHERE invoice_id = i.id), 0)) as balance
FROM payments p
LEFT JOIN invoices i ON p.invoice_id = i.id
WHERE p.franchise_id = ?
  AND p.payment_date >= '2024-01-01'
  AND p.payment_date <= '2025-12-31'
ORDER BY p.payment_date DESC
LIMIT 10 OFFSET 0;
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access all 4 payment pages
- [ ] Summary cards display correctly
- [ ] Invoice list loads on "Show" click
- [ ] Payment track displays transactions
- [ ] Customer credit search works
- [ ] Pagination controls functional
- [ ] Edit/Delete icons work
- [ ] Search functionality works
- [ ] No console errors (F12)
- [ ] API responses correct (Network tab)

---

## 🎓 Next Steps

### 1. Add Payment Form:

Currently "Add Payments" button shows alert. Next:

- Create payment form modal/page
- Fields: Amount, Payment Mode, Date, Reference, Notes
- Submit to POST /api/payments endpoint
- Update invoice payment_status

### 2. Edit Payment Form:

Currently Edit icon shows alert. Next:

- Create edit modal/page
- Load payment data by ID
- Submit to PUT /api/payments/:id endpoint
- Refresh payment list

### 3. Print Functionality:

Currently Print tab opens print dialog. Next:

- Create printable credit report template
- Add company logo and details
- Format for A4 paper
- Add print button functionality

### 4. Export to Excel:

Add export functionality:

- Export payment track to Excel
- Export invoice list to Excel
- Use library like `xlsx` or `exceljs`

---

## 📚 Related Documentation

- **PAYMENT_MODULE_GUIDE.md** - Comprehensive technical guide
- **INVOICE_MODULE_GUIDE.md** - Invoice module documentation
- **BOOKING_MODULE_GUIDE.md** - Booking module documentation

---

## 🎉 Success!

You've successfully set up the **Payment Module** with 4 functional pages!

### Quick Access Links:

- Add Payment (GST): http://localhost:3000/payments/gst
- Add Payment (Non-GST): http://localhost:3000/payments/non-gst
- Payment Details: http://localhost:3000/payments/track
- Customer Credit: http://localhost:3000/payments/credit

**Happy Payment Management! 💳**

---

_Last Updated: 2025-01-16_
_Version: 1.0.0_
