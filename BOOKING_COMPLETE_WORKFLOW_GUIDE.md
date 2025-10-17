# 📦 COMPLETE BOOKING WORKFLOW GUIDE

## Step-by-Step Process from Start to Finish

---

## 🎯 PART 1: LOGIN & ACCESS BOOKING

### Step 1️⃣: Login to System

```
URL: http://localhost:3000/
Username: admin (or cashier1)
Password: password123
```

### Step 2️⃣: Navigate to Booking Module

```
Sidebar Menu → Booking (Calendar icon) → Opens dropdown
```

**Available Options:**

- ✅ Add (Create new booking)
- ✅ Modify (Edit existing bookings)
- ✅ Update Rate (Change rates for multiple bookings)
- ✅ Check Booking List (View all bookings)
- ✅ No Booking Data (View unbilled bookings)
- ✅ Multiple Booking (Create many at once)
- ✅ Import From CashCounter
- ✅ Import From Limitless
- ✅ Import From Excel

---

## 📝 PART 2: CREATE A NEW BOOKING

### Option A: Single Booking (Add)

**URL:** `http://localhost:3000/booking/add`

#### Required Information:

```
Row 1:
├─ Consignment No*        → ABC001 (unique identifier)
├─ Customer ID*           → CUST001
├─ Receiver              → John Doe
├─ Address               → 123 Main St, City
├─ Booking Date*         → 2024-01-15
├─ Consignment Type      → Domestic (or International)
├─ Pincode*              → 400001
├─ Mode                  → AR (Air, Road, etc.)
├─ Act Wt (Actual Weight)→ 2.5 kg
├─ Char Wt (Charge Wt)*  → 3.0 kg
└─ Qty*                  → 1

Row 2:
├─ Type                  → D
├─ Amount                → 500
├─ Other Charges         → 50
├─ Reference             → REF123
└─ Dtdc Amt              → 0
```

#### Steps:

1. Fill all fields marked with \* (asterisk)
2. Optional: Import from text file (button available)
3. Click **"Save"** button
4. ✅ Booking created successfully!

#### API Call Behind the Scenes:

```javascript
POST /api/bookings
Body: {
  franchise_id: 1,
  consignment_number: "ABC001",
  customer_id: "CUST001",
  receiver: "John Doe",
  address: "123 Main St, City",
  booking_date: "2024-01-15",
  consignment_type: "Domestic",
  pincode: "400001",
  mode: "AR",
  act_wt: 2.5,
  char_wt: 3.0,
  qty: 1,
  type: "D",
  amount: 500,
  other_charges: 50,
  reference: "REF123",
  dtdc_amt: 0
}

Response:
{
  success: true,
  data: {
    id: 1,
    consignment_number: "ABC001",
    status: "Booked"
  }
}
```

---

## 🔍 PART 3: SEARCH & FILTER BOOKINGS

### Option A: Check Booking List (View All)

**URL:** `http://localhost:3000/booking/check-list`

#### How to Filter:

```
Step 1: Fill Filter Fields
├─ Customer ID    → Leave empty (optional) or enter CUST001
├─ From Date      → 2024-01-01 (optional)
└─ To Date        → 2024-01-31 (optional)

Step 2: Click "Show" Button
└─ Results display in table

Step 3: View Details
├─ See all 18 columns of data
├─ Click Action button for more options
├─ Export to Excel (for reports)
└─ Print (for documentation)
```

#### API Call Behind the Scenes:

```javascript
GET /api/bookings/filter?customer_id=CUST001&from_date=2024-01-01&to_date=2024-01-31
Authorization: Bearer {token}

Response:
{
  success: true,
  data: [
    {
      id: 1,
      consignment_number: "ABC001",
      customer_id: "CUST001",
      amount: 500,
      booking_date: "2024-01-15",
      total: 550,
      ...other fields
    },
    ...more bookings
  ]
}
```

#### Table Columns Displayed:

```
Sr.No | Action | Customer ID | Consignment # | Weight | Qty | Destination |
Pincode | Address | Type | Mode | Amount | Booking Date | Insurance |
Bill Amount | Percentage | Risk Surcharge | Other Charges
```

---

### Option B: Edit Booking (Modify)

**URL:** `http://localhost:3000/booking/modify`

#### How to Search & Edit:

```
Step 1: Fill Filter Fields
├─ Customer ID    → CUST001
├─ From Date      → 2024-01-01
└─ To Date        → 2024-01-31

Step 2: Click "Show" Button
└─ Matching bookings appear in table

Step 3: Click "Edit" Button on Any Row
├─ Modal opens with booking details
├─ Change any field you need
├─ Click "Update" to save
└─ ✅ Changes saved to database

Step 4: View Updated Total
└─ Total = Amount + Other Charges + Insurance + Risk Surcharge
```

#### Example Edit Scenario:

```
Before: Amount = 500, Insurance = 0, Total = 550
Action: Change Insurance to 100
After: Amount = 500, Insurance = 100, Total = 650
```

---

### Option C: Update Rate for Multiple

**URL:** `http://localhost:3000/booking/update-rate`

#### How to Bulk Update Rates:

```
Step 1: Fill Filter Fields
├─ Customer ID    → CUST001 (required)
├─ From Date      → 2024-01-01 (required)
└─ To Date        → 2024-01-31 (required)

Step 2: Click "Show" Button
└─ All bookings in date range appear

Step 3: Update Amounts in Table
├─ Edit Amount column for each booking
├─ Press Enter after each change
└─ Changes reflected in Total column

Step 4: Click "UpdateRate" Button
└─ All changes saved simultaneously
```

---

### Option D: Find Bookings Without Invoices

**URL:** `http://localhost:3000/booking/no-booking-data`

#### Use Case:

```
Find all bookings that haven't been billed yet
(Bookings without associated invoices)
```

#### How to Use:

```
Step 1: Fill Filter Fields
├─ From Date*     → 2024-01-01 (required)
└─ To Date*       → 2024-01-31 (required)

Step 2: Select Filter Option
├─ Dropdown to specify criteria
└─ Default selection available

Step 3: Click "Show" Button
└─ All unbilled bookings display

Step 4: Export to Excel (optional)
└─ Download for external use
```

#### API Call Behind the Scenes:

```javascript
GET /api/bookings/no-booking-list?from_date=2024-01-01&to_date=2024-01-31
Authorization: Bearer {token}

Response:
{
  success: true,
  data: [
    {
      consignment_number: "ABC001",
      weight: 3.0,
      pincode: "400001",
      mode: "AR",
      amount: 500,
      booking_date: "2024-01-15"
    },
    ...more bookings
  ]
}
```

---

## 📊 PART 4: CREATE MULTIPLE BOOKINGS

### Option: Multiple Booking (Bulk Create)

**URL:** `http://localhost:3000/booking/multiple`

#### When to Use:

```
✅ Need to create bookings ABC001, ABC002, ABC003, ... ABC100
✅ Sequential consignment numbers
✅ Same company/prefix
❌ Max 100 at once
```

#### How to Create:

```
Step 1: Enter Range
├─ Start Number      → 1
├─ End Number        → 100
└─ Total bookings    → 100

Step 2: Enter Company
├─ Company Name      → ABC (prefix)
└─ Result: ABC001, ABC002, ... ABC100

Step 3: Upload DTDC File (if needed)
└─ Optional TXT file for tracking

Step 4: Click "Submit"
└─ ✅ 100 bookings created instantly!
```

---

## 📥 PART 5: IMPORT BOOKINGS FROM EXTERNAL SOURCES

### Option A: Import From Excel

**URL:** `http://localhost:3000/booking/import-excel`

#### Format 1: Simple (Minimal Data)

```
Template Columns:
├─ Consignment No*    (required)
└─ Customer Id*       (required)

Example:
Consignment No  | Customer Id
ABC001          | CUST001
ABC002          | CUST002
```

#### Format 2: Extended (With Details)

```
Template Columns:
├─ Sr.No
├─ Consignment No*
├─ Customer Id*
├─ Chargeable Weight
├─ Insurance Amount
├─ FOV Amount
├─ FOV Percentage
└─ Other Charges

Example:
Sr.No | Consignment No | Customer Id | Char Wt | Insurance | FOV Amt | FOV % | Other Charges
1     | ABC001         | CUST001     | 3.0     | 100       | 500     | 2     | 50
```

#### Format 3: Complete (Full Data)

```
Template Columns:
├─ Sr.No
├─ Consignment No*
├─ Chargeable Weight*
├─ Mode*
├─ Company Address
├─ Quantity*
├─ Pincode*
├─ Booking Date*
├─ Weight Type
├─ Type*
├─ Customer Id*
├─ Other Charges
├─ Receiver
└─ Amount (Optional)

Example:
Sr.No | Consignment No | Char Wt | Mode | Address | Qty | Pincode | Booking Date | Type | Customer Id | Other Charges | Receiver | Amount
1     | ABC001         | 3.0     | AR   | City 1  | 1   | 400001  | 2024-01-15   | D    | CUST001     | 50            | John Doe | 500
```

#### Steps to Import:

```
Step 1: Download Template
├─ Click "Download Format X Template" button
└─ Opens Excel file to fill

Step 2: Fill Data
├─ Add your bookings to template
├─ Save as Excel file
└─ Keep same format structure

Step 3: Upload File
├─ Click "Upload" button for chosen format
├─ Select your file
└─ System processes automatically

Step 4: Confirmation
└─ ✅ All bookings imported successfully!
```

---

### Option B: Import From CashCounter

**URL:** `http://localhost:3000/booking/import-cashcounter`

#### Use Case:

```
Integrate with CashCounter system
Automatically import CashCounter transactions as bookings
```

#### Steps:

```
Step 1: Fill Date Range
├─ From Date         → Select date
└─ To Date           → Select date

Step 2: Customer ID (Default: Cash_1)
├─ Pre-filled: "Cash_1"
├─ Change if needed
└─ Identifies cash transactions

Step 3: Click "Book" Button
└─ Imports all matching transactions
```

---

### Option C: Import From Limitless

**URL:** `http://localhost:3000/booking/import-limitless`

#### Supported Formats:

```
✅ Text File Upload
└─ TXT format with booking data

✅ Excel File Upload
└─ XLS/XLSX format with booking data
```

#### Steps:

```
Step 1: Upload Text File (or Skip)
├─ Click upload area
├─ Select TXT file
└─ Click upload button

Step 2: Upload Excel File (or Skip)
├─ Click upload area
├─ Select XLSX file
└─ Click upload button

Step 3: Process Files
└─ ✅ Both formats processed automatically
```

---

## 💾 PART 6: DATABASE OPERATIONS (BACKEND)

### Database Table: `bookings`

```sql
Field Structure:
├─ id (PK)                 → Auto-increment
├─ franchise_id (FK)       → Links to franchise
├─ consignment_number      → Unique per franchise
├─ booking_date            → Date of booking
├─ customer_id             → Customer identifier
├─ receiver                → Receiver name
├─ address                 → Delivery address
├─ pincode                 → ZIP code
├─ consignment_type        → Domestic/International
├─ mode                    → AR/Other
├─ act_wt                  → Actual weight
├─ char_wt                 → Chargeable weight
├─ qty                     → Quantity
├─ type                    → Type (D/other)
├─ amount                  → Base amount
├─ other_charges           → Additional charges
├─ reference               → Reference number
├─ dtdc_amt                → DTDC amount
├─ insurance               → Insurance cost
├─ percentage              → Percentage charge
├─ risk_surcharge          → Risk surcharge
├─ bill_amount             → Billing amount
├─ total                   → Total = Amount + Other Charges + Insurance + Risk Surcharge
├─ destination             → Destination city
├─ status                  → Current status (Booked/Invoiced/Delivered)
├─ remarks                 → Additional notes
├─ created_at              → Creation timestamp
└─ updated_at              → Last update timestamp
```

---

## 🔗 PART 7: API ENDPOINTS REFERENCE

### Base URL: `http://localhost:5000/api/bookings`

#### 1. Get All Bookings

```
GET /api/bookings
Query: ?page=1&limit=20&status=Booked&search=ABC001
Response: { bookings: [...], pagination: {...} }
```

#### 2. Get Single Booking

```
GET /api/bookings/1
Response: { success: true, data: { id: 1, ... } }
```

#### 3. Create Booking

```
POST /api/bookings
Body: { consignment_number, customer_id, amount, ... }
Response: { success: true, data: { id: 1, ... } }
```

#### 4. Update Booking

```
PUT /api/bookings/1
Body: { amount: 600, insurance: 50, ... }
Response: { success: true, data: { id: 1, ... } }
```

#### 5. Delete Booking (Soft Delete)

```
DELETE /api/bookings/1
Response: { success: true, message: "Booking deleted" }
```

#### 6. Filter Bookings ⭐ (MOST IMPORTANT)

```
GET /api/bookings/filter?customer_id=CUST001&from_date=2024-01-01&to_date=2024-01-31
Response: { success: true, data: [...] }
```

#### 7. Get Unbilled Bookings

```
GET /api/bookings/no-booking-list?from_date=2024-01-01&to_date=2024-01-31
Response: { success: true, data: [...] }
```

#### 8. Update Multiple Rates

```
POST /api/bookings/update-rate
Body: { bookings: [{ id: 1, amount: 600 }, ...] }
Response: { success: true, message: "Rates updated" }
```

#### 9. Create Multiple Bookings

```
POST /api/bookings/multiple
Body: { start_no: 1, end_no: 100, company: "ABC" }
Response: { success: true, count: 100 }
```

#### 10. Import Bookings

```
POST /api/bookings/import-excel
FormData: { file: <Excel file>, format: 1 }
Response: { success: true, count: 50 }
```

---

## 🎬 PART 8: COMPLETE WORKFLOW EXAMPLE

### Scenario: Process New Shipment from Customer ABC001

```
📅 Date: 2024-01-15
📦 Customer: CUST001 (ABC Company)
🎯 Goal: Create booking, invoice, and track payment
```

### Step-by-Step Process:

#### ✅ Step 1: Login

```
1. Go to http://localhost:3000
2. Username: admin
3. Password: password123
4. Click Login ✓
```

#### ✅ Step 2: Create Booking

```
1. Click Sidebar → Booking → Add
2. Fill Form:
   ├─ Consignment No: ABC001
   ├─ Customer ID: CUST001
   ├─ Receiver: John Doe
   ├─ Address: 123 Main St, Mumbai
   ├─ Booking Date: 2024-01-15
   ├─ Pincode: 400001
   ├─ Char Wt: 2.5 kg
   ├─ Qty: 1
   ├─ Mode: AR
   └─ Amount: 500
3. Click "Save" ✓
```

#### ✅ Step 3: Verify Booking Created

```
API Call: POST /api/bookings
Database: Booking inserted with status="Booked"
Tracking: Automatic entry created in tracking table
```

#### ✅ Step 4: View in Booking List

```
1. Click Booking → Check Booking List
2. Filter by Customer ID: CUST001
3. From Date: 2024-01-15
4. To Date: 2024-01-15
5. Click "Show" ✓
6. See ABC001 in results table
```

#### ✅ Step 5: Edit if Needed

```
1. Click Booking → Modify
2. Same filters as above
3. Click "Edit" on ABC001 row
4. Update Amount to 550
5. Click "Update" ✓
```

#### ✅ Step 6: Check Details

```
API Call: GET /api/bookings/1
Response:
{
  id: 1,
  consignment_number: "ABC001",
  customer_id: "CUST001",
  amount: 550,
  status: "Booked",
  booking_date: "2024-01-15",
  total: 550
}
```

---

## 🐛 TROUBLESHOOTING

### Issue: Filter returns 404

**Solution:**

```
✅ Backend must be running: npm run dev
✅ Routes must be in correct order (specific before generic)
✅ Endpoint: GET /api/bookings/filter (not /api/bookings/:id=filter)
```

### Issue: Can't create booking - Database error

**Solution:**

```
✅ Check all required fields are filled (marked with *)
✅ Consignment number must be unique
✅ Database migration #20 applied: receiver_pincode removed
```

### Issue: Bookings don't appear in filter

**Solution:**

```
✅ Check date range includes booking date
✅ Check customer_id matches exactly
✅ Ensure you're logged in (auth token valid)
✅ Clear browser cache: Ctrl + Shift + R
```

### Issue: Export to Excel not working

**Solution:**

```
✅ Bookings must exist in filter results first
✅ Click "Show" to generate results
✅ Then click "Export to Excel"
✅ Browser must allow downloads
```

---

## ✅ CHECKLIST: Confirm Everything Works

```
Frontend Access:
[ ] Can login successfully
[ ] Booking menu opens
[ ] All 9 sub-pages load

Booking Creation:
[ ] Can create single booking
[ ] Booking saves to database
[ ] Status shows as "Booked"

Booking Search:
[ ] Filter page loads
[ ] Can enter filter parameters
[ ] "Show" button displays results
[ ] Results table shows correct data

Booking Modification:
[ ] Can open modify page
[ ] Can search existing bookings
[ ] Can edit amount/charges
[ ] Changes save to database

API Endpoints:
[ ] GET /api/bookings → 200 OK
[ ] GET /api/bookings/filter → 200 OK ✅ (THIS WAS BROKEN, NOW FIXED)
[ ] POST /api/bookings → 201 Created
[ ] PUT /api/bookings/1 → 200 OK
```

---

## 📞 QUICK REFERENCE

| Task           | URL                        | Steps                                     |
| -------------- | -------------------------- | ----------------------------------------- |
| Create Booking | `/booking/add`             | Fill form → Save                          |
| View All       | `/booking/check-list`      | Filter → Show                             |
| Edit Booking   | `/booking/modify`          | Filter → Show → Edit → Update             |
| Update Rates   | `/booking/update-rate`     | Filter → Show → Edit Amounts → UpdateRate |
| Find Unbilled  | `/booking/no-booking-data` | Date range → Show                         |
| Bulk Create    | `/booking/multiple`        | Enter range → Submit                      |
| Import Excel   | `/booking/import-excel`    | Download → Fill → Upload                  |

---

**Status: ✅ ALL SYSTEMS OPERATIONAL**

- ✅ Database fixed (Migration #20 applied)
- ✅ Routes fixed (Specific routes before generic)
- ✅ API working
- ✅ Frontend pages accessible
- ✅ Full CRUD operations functional
