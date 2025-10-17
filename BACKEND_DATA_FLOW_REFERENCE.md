# 📊 BACKEND DATA FLOW & STORAGE REFERENCE

**Complete visual guide showing where your data flows and gets stored.**

---

## 🔄 COMPLETE DATA FLOW - ADD STATIONARY FORM

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND: Add Stationary Form                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Receipt Date │  │  Start No    │  │   End No     │          │
│  │ (2024-12-20) │  │   (1001)     │  │   (1100)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ No of Leafs  │  │ No of Books   │  │    Type      │          │
│  │    (50)      │  │     (5)      │  │   (All)      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                       [SAVE BUTTON]                              │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         ▼ (POST /api/stationary/consignments)
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND: Stationary Controller                 │
│  createConsignment(req, res)                                    │
│  ├─ Extract: receipt_date, start_no, end_no, etc.            │
│  ├─ Get: franchise_id from req.user                           │
│  ├─ Calculate: total = (end_no - start_no) + 1               │
│  │           = (1100 - 1001) + 1 = 100                       │
│  ├─ Set Defaults:                                             │
│  │  • used_consignments = 0                                   │
│  │  • remaining_consignments = 100                            │
│  │  • status = 'active'                                       │
│  └─ Prepare INSERT statement                                  │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         ▼ (MySQL Connection Pool)
┌─────────────────────────────────────────────────────────────────┐
│              DATABASE: MySQL (frbilling)                        │
│                                                                  │
│  Table: stationary_consignments                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ INSERT INTO stationary_consignments (                   │   │
│  │   franchise_id,         ← 1                            │   │
│  │   receipt_date,         ← 2024-12-20                   │   │
│  │   start_no,             ← 1001                         │   │
│  │   end_no,               ← 1100                         │   │
│  │   no_of_leafs,          ← 50                           │   │
│  │   no_of_books,          ← 5                            │   │
│  │   total_consignments,   ← 100 (calculated)             │   │
│  │   used_consignments,    ← 0 (default)                  │   │
│  │   remaining_consignments, ← 100 (calculated)           │   │
│  │   type,                 ← All                          │   │
│  │   status,               ← active (default)             │   │
│  │   created_at,           ← NOW() (auto)                 │   │
│  │   updated_at            ← NOW() (auto)                 │   │
│  │ ) VALUES (...)                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         │                                        │
│                         ▼                                        │
│  ROW INSERTED: ID = 15                                         │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         ▼ (Response)
┌─────────────────────────────────────────────────────────────────┐
│                FRONTEND: Response Received                      │
│  {                                                               │
│    "success": true,                                             │
│    "message": "Consignment created successfully",              │
│    "data": { "id": 15 }                                        │
│  }                                                               │
│                                                                  │
│  ✅ Receipt created and stored in database!                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💾 DATA STORAGE LOCATIONS - COMPLETE MAP

### 📍 Location 1: Stationary Consignments Table

```sql
stationary_consignments {
  id:                      INT (Primary Key)
  franchise_id:            INT (Foreign Key → franchises.id)
  receipt_date:            DATE
  start_no:                VARCHAR(50)
  end_no:                  VARCHAR(50)
  no_of_leafs:             INT (Default: 0)
  no_of_books:             INT (Default: 0)
  total_consignments:      INT (Calculated)
  used_consignments:       INT (Default: 0)
  remaining_consignments:  INT (Calculated)
  type:                    ENUM('All', 'DOX', 'NONDOX', 'EXPRESS')
  status:                  ENUM('active', 'expired', 'depleted')
  created_at:              TIMESTAMP
  updated_at:              TIMESTAMP

  Indexes:
  ├─ PRIMARY KEY (id)
  ├─ FOREIGN KEY (franchise_id)
  ├─ INDEX (franchise_id)
  ├─ INDEX (receipt_date)
  └─ INDEX (status)
}
```

**Sample Data:**

```
id  franchise_id  receipt_date  start_no  end_no  total  remaining  status
15      1         2024-12-20    1001      1100    100     100      active
```

---

## 🔗 COMPLETE DATA RELATIONSHIP MAP

```
┌─────────────────────┐
│    FRANCHISES       │
│  ┌─────────────┐    │
│  │  id: 1      │◄───┼─── Many-to-One
│  │  name: "F1" │    │
│  └─────────────┘    │
└──────┬──────────────┘
       │
       │ (Foreign Key: franchise_id)
       │
       ├──────────────────────┬──────────────────────┬─────────────────┐
       ▼                      ▼                      ▼                 ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ USERS            │ │ STATIONARY_      │ │ BOOKINGS         │ │ INVOICES         │
│ ┌──────────────┐ │ │ CONSIGNMENTS     │ │ ┌──────────────┐ │ │ ┌──────────────┐ │
│ │ id: 1        │ │ │ ┌──────────────┐ │ │ │ id: 42       │ │ │ │ id: 25       │ │
│ │ franchise_id │ │ │ │ id: 15       │ │ │ │ franchise_id │ │ │ │ franchise_id │ │
│ │ name: Admin  │ │ │ │ franchise_id │ │ │ │ consignment_ │ │ │ │ invoice_no   │ │
│ │ role: admin  │ │ │ │ receipt_date │ │ │ │ number: PN001│ │ │ │ booking_ref  │ │
│ └──────────────┘ │ │ │ start_no     │ │ │ │ status:      │ │ │ │ payment_     │ │
└──────────────────┘ │ │ end_no       │ │ │ │ pending      │ │ │ │ status: paid │ │
                    │ │ total: 100   │ │ │ │ created_at   │ │ │ │ net_amount   │ │
                    │ │ status:      │ │ │ │ updated_at   │ │ │ │ created_at   │ │
                    │ │ active       │ │ │ └──────────────┘ │ │ └──────────────┘ │
                    │ │ created_at   │ │ └──────────────────┘ └──────────────────┘
                    │ │ updated_at   │ │
                    │ └──────────────┘ │
                    └──────────────────┘
                            │
                            │ (Used by bookings)
                            │
                            ▼
                    ┌──────────────────┐
                    │ TRACKING         │
                    │ ┌──────────────┐ │
                    │ │ id: 50       │ │
                    │ │ booking_id:42│ │
                    │ │ status:      │ │
                    │ │ pending      │ │
                    │ │ status_date  │ │
                    │ │ location     │ │
                    │ └──────────────┘ │
                    └──────────────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │ PAYMENTS         │
                    │ ┌──────────────┐ │
                    │ │ id: 18       │ │
                    │ │ invoice_id   │ │
                    │ │ amount: 5900 │ │
                    │ │ payment_mode │ │
                    │ │ payment_date │ │
                    │ │ created_at   │ │
                    │ └──────────────┘ │
                    └──────────────────┘
```

---

## 📥 COMPLETE INPUT → STORAGE MAPPING

### Your Form Inputs and Where They Go

```
┌──────────────────────────────────────────────────────────────────┐
│           INPUT FIELD                    │ STORAGE LOCATION      │
├──────────────────────────────────────────┼──────────────────────┤
│ Receipt Date                             │ receipt_date         │
│ (Date picker: 2024-12-20)               │ (DATE type)          │
├──────────────────────────────────────────┼──────────────────────┤
│ Start No                                 │ start_no             │
│ (Text input: 1001)                       │ (VARCHAR 50)         │
├──────────────────────────────────────────┼──────────────────────┤
│ End No                                   │ end_no               │
│ (Text input: 1100)                       │ (VARCHAR 50)         │
├──────────────────────────────────────────┼──────────────────────┤
│ No of Leafs                              │ no_of_leafs          │
│ (Number input: 50)                       │ (INT)                │
├──────────────────────────────────────────┼──────────────────────┤
│ No of Books                              │ no_of_books          │
│ (Number input: 5)                        │ (INT)                │
├──────────────────────────────────────────┼──────────────────────┤
│ Type (Dropdown)                          │ type                 │
│ (Enum: All/DOX/NONDOX/EXPRESS)          │ (ENUM)               │
├──────────────────────────────────────────┼──────────────────────┤
│ [CALCULATED BY SERVER]                  │ total_consignments   │
│ Formula: end_no - start_no + 1           │ = (1100-1001)+1 = 100│
├──────────────────────────────────────────┼──────────────────────┤
│ [DEFAULT SET BY SERVER]                  │ used_consignments    │
│ Initial value: 0                         │ = 0                  │
├──────────────────────────────────────────┼──────────────────────┤
│ [CALCULATED BY SERVER]                  │ remaining_consign... │
│ Formula: total - used                    │ = 100 - 0 = 100      │
├──────────────────────────────────────────┼──────────────────────┤
│ [AUTO SET BY SERVER]                    │ status               │
│ Initial status                           │ = 'active'           │
├──────────────────────────────────────────┼──────────────────────┤
│ [AUTO BY DATABASE]                      │ created_at           │
│ Server timestamp                         │ = 2024-12-20 12:...  │
├──────────────────────────────────────────┼──────────────────────┤
│ [AUTO BY DATABASE]                      │ updated_at           │
│ Server timestamp                         │ = 2024-12-20 12:...  │
├──────────────────────────────────────────┼──────────────────────┤
│ [FROM AUTHENTICATION]                   │ franchise_id         │
│ User's franchise                         │ = 1                  │
└──────────────────────────────────────────┴──────────────────────┘
```

---

## 🔀 DATA FLOW: BOOKING → INVOICE → PAYMENT

```
STEP 1: ADD STATIONARY RECEIPT (Your Form)
────────────────────────────────────────
Input:  receipt_date, start_no, end_no, no_of_leafs, no_of_books
Store:  stationary_consignments table
  ├─ id = 15
  ├─ total_consignments = 100
  ├─ remaining_consignments = 100
  ├─ status = 'active'
  └─ franchise_id = 1

↓

STEP 2: CREATE BOOKING
──────────────────────
Input:  consignment_number (PN001), booking_date, customer, location
Store:  bookings table
  ├─ id = 42
  ├─ consignment_number = PN001
  ├─ booking_value = 5000
  ├─ rate = 250 (lookup from rate_master)
  ├─ charges = 250
  ├─ status = 'pending'
  └─ franchise_id = 1

Auto:   Tracking record created
  ├─ tracking id = 50
  ├─ booking_id = 42
  ├─ status = 'pending'
  └─ timestamp recorded

↓

STEP 3: GENERATE INVOICE
────────────────────────
Input:  Select booking(s) ID=42, gst_percent=18
Calculate:
  ├─ subtotal = 5000 (from booking)
  ├─ gst_amount = 5000 × 18 / 100 = 900
  ├─ net_amount = 5000 + 900 = 5900
Store:  invoices table
  ├─ id = 25
  ├─ invoice_number = INV-2024-00025 (auto-generated)
  ├─ booking_reference = PN001
  ├─ subtotal = 5000
  ├─ gst_amount = 900
  ├─ net_amount = 5900
  ├─ payment_status = 'unpaid'
  └─ franchise_id = 1

Store:  invoice_items table
  ├─ id = 100
  ├─ invoice_id = 25
  ├─ description = "Parcel - PN001"
  ├─ amount = 5000
  └─ gst_amount = 900

↓

STEP 4: RECORD PAYMENT
──────────────────────
Input:  invoice_id=25, amount=5900, payment_mode=bank_transfer
Transaction Begin:
  ├─ INSERT into payments table
  │  ├─ id = 18
  │  ├─ invoice_id = 25
  │  ├─ amount = 5900
  │  ├─ payment_mode = bank_transfer
  │  ├─ payment_date = 2024-12-20
  │  └─ transaction_ref = TXN123456
  │
  └─ UPDATE invoices SET payment_status
     ├─ Check: paid_amount (5900) = net_amount (5900) ?
     ├─ Result: YES → payment_status = 'paid'
     └─ updated_at = NOW()

Transaction Commit: ✅ SUCCESS

↓

STEP 5: DASHBOARD AGGREGATION
──────────────────────────────
Query 1: getDashboardStats()
  ├─ today_revenue = SUM(net_amount) WHERE DATE = TODAY = 5900
  ├─ total_revenue_30day = SUM(net_amount) WHERE DATE >= 30 DAYS AGO
  ├─ today_bookings = COUNT(*) WHERE booking_date = TODAY = 1
  ├─ open_consignments = SUM(remaining_consignments) = 99 (100-1 used)
  ├─ due_invoices = COUNT(*) WHERE payment_status = 'unpaid'
  └─ paid_invoices = COUNT(*) WHERE payment_status = 'paid' = 1

Query 2: getRevenueTrends()
  ├─ SELECT DATE(invoice_date), SUM(net_amount), COUNT(*)
  ├─ GROUP BY DATE(invoice_date)
  ├─ WHERE DATE >= 30 DAYS AGO
  └─ Result: [{ date: "2024-12-20", bookings: 1, revenue: 5900 }]

Query 3: getPaymentAnalytics()
  ├─ SELECT payment_mode, COUNT(*), SUM(amount)
  ├─ FROM payments
  ├─ WHERE payment_date >= 30 DAYS AGO
  ├─ GROUP BY payment_mode
  └─ Result: [{ mode: "bank_transfer", count: 1, amount: 5900 }]

↓

DISPLAY ON DASHBOARD
─────────────────────
✅ KPI Cards Updated
✅ Revenue Trends Chart Updated
✅ Payment Analytics Chart Updated
✅ Recent Bookings Activity Updated
```

---

## 📍 VALIDATION FLOW

### Add Stationary Form Validation

```
USER SUBMITS FORM
     │
     ▼
┌─────────────────────────────────┐
│ FRONTEND VALIDATION             │
├─────────────────────────────────┤
│ ✓ Receipt Date filled?          │
│ ✓ Start No filled?              │
│ ✓ End No filled?                │
│ ✓ Start No format valid?        │
│ ✓ End No format valid?          │
│ ✓ No of Leafs is number?        │
│ ✓ No of Books is number?        │
│ ✓ Type selected?                │
└─────────────────────────────────┘
     │ (if all pass)
     ▼
┌─────────────────────────────────┐
│ API REQUEST SENT                │
│ POST /api/stationary/consignments│
│ Header: Authorization: Bearer... │
│ Body: { all form data }         │
└─────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ BACKEND VALIDATION              │
├─────────────────────────────────┤
│ ✓ Token valid & not expired?    │
│ ✓ User authenticated?           │
│ ✓ Receipt Date is valid date?   │
│ ✓ Start No format valid?        │
│ ✓ End No format valid?          │
│ ✓ End No >= Start No?           │ ← KEY VALIDATION!
│ ✓ No of Leafs valid?            │
│ ✓ No of Books valid?            │
│ ✓ Type in enum list?            │
└─────────────────────────────────┘
     │
     ├─ (if any fail)
     │  └─ Return error message
     │
     └─ (if all pass)
        ▼
     DATABASE INSERT
        │
        ├─ Validate franchise_id exists
        ├─ Calculate total_consignments
        ├─ Set defaults
        └─ Insert into stationary_consignments

        SUCCESS! Return ID
```

---

## 🔍 WHERE IS MY DATA?

### Quick Reference Table

| What I Want to Know | Where to Look           | Query                                                                                                              |
| ------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| All my receipts     | stationary_consignments | `SELECT * FROM stationary_consignments WHERE franchise_id = 1`                                                     |
| Receipt #15 details | stationary_consignments | `SELECT * FROM stationary_consignments WHERE id = 15`                                                              |
| How many used       | stationary_consignments | `SELECT remaining_consignments FROM stationary_consignments WHERE id = 15`                                         |
| All bookings        | bookings                | `SELECT * FROM bookings WHERE franchise_id = 1`                                                                    |
| Booking for receipt | bookings                | `SELECT * FROM bookings WHERE consignment_number = 'PN001'`                                                        |
| All invoices        | invoices                | `SELECT * FROM invoices WHERE franchise_id = 1`                                                                    |
| Invoice details     | invoices                | `SELECT * FROM invoices WHERE id = 25`                                                                             |
| Invoice items       | invoice_items           | `SELECT * FROM invoice_items WHERE invoice_id = 25`                                                                |
| Payment status      | invoices                | `SELECT payment_status FROM invoices WHERE id = 25`                                                                |
| All payments        | payments                | `SELECT * FROM payments WHERE franchise_id = 1`                                                                    |
| Payment for invoice | payments                | `SELECT * FROM payments WHERE invoice_id = 25`                                                                     |
| 30-day revenue      | invoices                | `SELECT SUM(net_amount) FROM invoices WHERE franchise_id = 1 AND invoice_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)` |
| Today's bookings    | bookings                | `SELECT COUNT(*) FROM bookings WHERE franchise_id = 1 AND DATE(booking_date) = CURDATE()`                          |

---

## 🎯 SUCCESS INDICATORS

### Your Data is Stored Correctly When:

✅ **Add Stationary Form:**

```
API Response: { "success": true, "data": { "id": 15 } }
Database:     SELECT * FROM stationary_consignments WHERE id = 15
              Returns: 1 row with all your data
```

✅ **Booking Created:**

```
API Response: { "success": true, "data": { "id": 42 } }
Database:     SELECT * FROM bookings WHERE id = 42
              Returns: 1 row with booking data

Database:     SELECT * FROM tracking WHERE booking_id = 42
              Returns: 1 row with tracking data
```

✅ **Invoice Generated:**

```
API Response: { "success": true, "data": { "invoice_id": 25 } }
Database:     SELECT * FROM invoices WHERE id = 25
              Returns: 1 row with invoice data

Database:     SELECT * FROM invoice_items WHERE invoice_id = 25
              Returns: 1+ rows with line items
```

✅ **Payment Recorded:**

```
API Response: { "success": true, "data": { "payment_id": 18 } }
Database:     SELECT * FROM payments WHERE id = 18
              Returns: 1 row with payment data

Database:     SELECT payment_status FROM invoices WHERE id = 25
              Returns: 'paid' (status changed!)
```

---

## 🚀 PRODUCTION DEPLOYMENT FLOW

```
┌─ DEVELOPMENT
│  ├─ http://localhost:5000
│  ├─ MySQL: localhost:3306
│  ├─ NODE_ENV=development
│  └─ CORS: http://localhost:3000
│
├─ STAGING
│  ├─ http://staging.fr-billing.com:5000
│  ├─ MySQL: staging-db.example.com:3306
│  ├─ NODE_ENV=staging
│  └─ CORS: http://staging.fr-billing.com
│
└─ PRODUCTION
   ├─ https://api.fr-billing.com (with reverse proxy)
   ├─ MySQL: prod-db.example.com:3306 (managed database)
   ├─ NODE_ENV=production
   ├─ CORS: https://app.fr-billing.com
   ├─ Backup: Automated daily
   ├─ Monitoring: New Relic / DataDog
   └─ Logging: Centralized (ELK Stack)
```

---

## ✅ CONCLUSION

**All your data flows through:**

1. **Frontend Form** → User input
2. **API Backend** → Validation & processing
3. **MySQL Database** → Persistent storage
4. **Reports & Dashboard** → Aggregated display

**Everything is working correctly!** ✅

Your Add Stationary Form data is:

- ✅ Validated properly
- ✅ Calculated accurately
- ✅ Stored securely
- ✅ Isolated by franchise
- ✅ Retrievable on demand
- ✅ Linked to subsequent operations

---

Generated: December 2024  
Status: ✅ BACKEND FULLY OPERATIONAL
