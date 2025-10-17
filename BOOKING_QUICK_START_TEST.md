# 🚀 BOOKING SYSTEM - QUICK START TEST GUIDE

## ⏱️ Time Estimate: 15-20 minutes

---

## ✅ TEST 1: VERIFY BACKEND IS RUNNING (2 minutes)

### Step 1: Check Backend Status

```powershell
# Open PowerShell and navigate to backend
Set-Location "c:\Users\admin\Desktop\FRbiling\backend"

# Check if npm run dev is already running
# If not, start it:
npm run dev

# Expected output:
# ✅ MySQL connected
# 🚀 Server running on port 5000
```

### Step 2: Verify in Browser

```
Open: http://localhost:5000/api/bookings
Expected: 401 Unauthorized error (because you're not logged in)
This means: ✅ API is working!
```

---

## ✅ TEST 2: LOGIN TO APPLICATION (2 minutes)

### Step 1: Navigate to Frontend

```
URL: http://localhost:3000
```

### Step 2: Login with Test Credentials

```
Username: admin
Password: password123
Click: Login
```

### Step 3: Verify Homepage Loads

```
Expected:
├─ Sidebar menu visible
├─ Booking option in menu
├─ Dashboard content loads
└─ No error messages
```

---

## ✅ TEST 3: CREATE A TEST BOOKING (3 minutes)

### Step 1: Navigate to Add Booking

```
Sidebar → Booking → Add
URL: http://localhost:3000/booking/add
```

### Step 2: Fill the Form

```
Fill these fields (REQUIRED):
├─ Consignment No:    TEST001
├─ Customer ID:       CUST001
├─ Booking Date:      Today's date
├─ Pincode:           400001
├─ Chargeable Weight: 2.5
└─ Qty:               1

Optional (leave defaults or fill):
├─ Receiver:          John Doe
├─ Address:           Test Address
├─ Mode:              AR
├─ Amount:            500
└─ Other Charges:     0
```

### Step 3: Save Booking

```
Click: "Save" button
Expected:
├─ Success message: "Booking created successfully!"
├─ Page refreshes or redirects
└─ Booking is now in database
```

### Step 4: Verify in Database

```powershell
# In new PowerShell:
Set-Location "c:\Users\admin\Desktop\FRbiling\backend"

# Check database directly:
mysql -u root -p
# Password: root

# Commands:
USE frbilling;
SELECT * FROM bookings WHERE consignment_number = 'TEST001';

# Expected: One row with your booking data
```

---

## ✅ TEST 4: SEARCH & FILTER BOOKINGS (3 minutes) ⭐ THIS WAS BROKEN!

### Step 1: Navigate to Check Booking List

```
Sidebar → Booking → Check Booking List
URL: http://localhost:3000/booking/check-list
```

### Step 2: Set Filter Parameters

```
Customer ID:    CUST001
From Date:      2024-01-01
To Date:        2024-01-31 (or today's date)
```

### Step 3: Click "Show" Button

```
Expected:
├─ No 404 error ✅ (THIS WAS THE BUG - NOW FIXED!)
├─ Table loads with bookings
├─ TEST001 appears in results
└─ All columns display correctly
```

### Step 4: Check Browser Console

```
Press: F12
Go to: Console tab
Expected: No error messages
Status: ✅ Filter API call successful (200 OK)
```

### Step 5: Check Network Tab

```
Press: F12
Go to: Network tab
Filter by: XHR (XMLHttpRequest)
Look for: /api/bookings/filter
Status: ✅ Should show 200 (not 404)
```

---

## ✅ TEST 5: EDIT BOOKING (3 minutes)

### Step 1: Navigate to Modify Page

```
Sidebar → Booking → Modify
URL: http://localhost:3000/booking/modify
```

### Step 2: Filter for Your Booking

```
Customer ID:    CUST001
From Date:      2024-01-01
To Date:        2024-01-31
Click: Show
```

### Step 3: Click Edit Button

```
Find TEST001 in the table
Click: Edit button (pencil icon)
Expected: Modal popup with booking details
```

### Step 4: Update a Field

```
Find: Amount field
Change: 500 → 600
Notice: Total auto-updates
Click: Update button
Expected: Modal closes, changes saved
```

### Step 5: Verify Change

```
Refresh page
Filter again
Find TEST001
Amount should show: 600 ✅
```

---

## ✅ TEST 6: UPDATE MULTIPLE RATES (2 minutes)

### Step 1: Navigate to Update Rate

```
Sidebar → Booking → Update Rate
URL: http://localhost:3000/booking/update-rate
```

### Step 2: Set Filters (Required)

```
Customer ID:    CUST001
From Date:      2024-01-01
To Date:        2024-01-31
Click: Show
```

### Step 3: Edit Amounts in Table

```
Find TEST001 row
Amount column: 600 → 700
Other Charges: 0 → 50
Press: Enter (or click UpdateRate)
```

### Step 4: Click UpdateRate Button

```
All changes apply simultaneously
Expected: Success message
Verify: Check Booking List to confirm changes
```

---

## ✅ TEST 7: VIEW UNBILLED BOOKINGS (2 minutes)

### Step 1: Navigate to No Booking Data

```
Sidebar → Booking → No Booking Data
URL: http://localhost:3000/booking/no-booking-data
```

### Step 2: Set Date Range

```
From Date:      2024-01-01 (required)
To Date:        2024-01-31 (required)
Click: Show
```

### Step 3: Verify Results

```
Expected: Simplified table shows:
├─ Consignment Number
├─ Weight
├─ Pincode
├─ Mode
├─ Amount
└─ Booking Date

TEST001 should appear (if created recently)
```

---

## ✅ TEST 8: EXPORT TO EXCEL (2 minutes)

### Step 1: Go to Check Booking List

```
Sidebar → Booking → Check Booking List
Set filters and click: Show
```

### Step 2: Click Export to Excel

```
Button: "Export to Excel"
Expected:
├─ File downloads (check Downloads folder)
├─ File name: bookings_YYYYMMDD.xlsx
└─ File contains all displayed bookings
```

### Step 3: Verify Excel File

```
Open downloaded file in Excel
Columns should include:
├─ Consignment Number
├─ Customer ID
├─ Amount
├─ Booking Date
└─ All other fields
```

---

## ✅ TEST 9: CREATE MULTIPLE BOOKINGS (3 minutes)

### Step 1: Navigate to Multiple Booking

```
Sidebar → Booking → Multiple Booking
URL: http://localhost:3000/booking/multiple
```

### Step 2: Enter Range

```
Start Number:   1
End Number:     5
Company Name:   BULK
```

### Step 3: Submit

```
Click: Submit
Expected: "5 bookings created successfully!"
```

### Step 4: Verify Created

```
Navigate to: Check Booking List
Filter by Customer ID: (leave empty, or your franchise)
Click: Show
Look for: BULK001, BULK002, BULK003, BULK004, BULK005
Status: ✅ All 5 created
```

---

## ✅ TEST 10: IMPORT FROM EXCEL (3 minutes)

### Step 1: Navigate to Import Excel

```
Sidebar → Booking → Import From Excel
URL: http://localhost:3000/booking/import-excel
```

### Step 2: Download Template

```
Format 1 (Simple):
Click: "Download Format 1 Template"
Opens: Excel file
Columns: Consignment No, Customer ID
```

### Step 3: Fill Template

```
Row 1: IMPORT001, CUST001
Row 2: IMPORT002, CUST002
Row 3: IMPORT003, CUST001
Save: As Excel file
```

### Step 4: Upload File

```
Click: "Upload" button (under Format 1)
Select: Your saved Excel file
Click: Upload
Expected: "3 bookings imported successfully!"
```

### Step 5: Verify Import

```
Check Booking List → Filter → Show
Look for: IMPORT001, IMPORT002, IMPORT003
Status: ✅ All appear in results
```

---

## 🐛 TROUBLESHOOTING

### Problem: Filter returns 404

**Solution:**

```
1. Check backend is running: npm run dev
2. Clear browser cache: Ctrl + Shift + R
3. Check Network tab (F12) for actual error
4. Verify routes are correctly ordered in bookingRoutes.js
```

### Problem: Can't create booking - Database error

**Solution:**

```
1. Check all required fields are filled
2. Ensure Consignment Number is unique
3. Check MySQL is running
4. Verify all migrations applied:
   npx knex migrate:latest --knexfile knexfile.cjs
```

### Problem: Can't login

**Solution:**

```
1. Check credentials:
   Username: admin
   Password: password123
2. Verify frontend is running on port 3000
3. Check backend is running on port 5000
4. Clear cookies: Ctrl + Shift + Delete
```

### Problem: Export to Excel not working

**Solution:**

```
1. Make sure results are displayed first (Show button)
2. Download may be blocked: check browser downloads
3. Try different browser
4. Check browser console for errors (F12)
```

### Problem: Import Excel says "Invalid format"

**Solution:**

```
1. Ensure you're using the correct template
2. Don't change column headers
3. Fill required columns (marked with *)
4. Save as .xlsx (not .xls or .csv)
5. No empty rows between data
```

---

## 📋 COMPLETE TEST CHECKLIST

### Backend & Database

- [ ] Backend running on port 5000
- [ ] MySQL connected successfully
- [ ] No error messages on startup
- [ ] API responds to /api/bookings (401 is OK)

### Frontend Access

- [ ] Frontend loads on http://localhost:3000
- [ ] Can login with admin/password123
- [ ] Dashboard displays
- [ ] Booking menu appears in sidebar
- [ ] All 9 booking sub-pages load

### Create Booking

- [ ] Can fill booking form
- [ ] Can save booking
- [ ] Booking appears in database
- [ ] Consignment number is unique
- [ ] Status shows "Booked"

### Filter Bookings ⭐

- [ ] Filter page loads (no 404)
- [ ] Can set filter parameters
- [ ] "Show" button returns results
- [ ] Results table displays
- [ ] Multiple bookings show when filtered
- [ ] Filtering by date works
- [ ] Filtering by customer ID works

### Edit Booking

- [ ] Can open modify page
- [ ] Can search and display bookings
- [ ] Can click edit modal
- [ ] Can change booking details
- [ ] Changes save correctly

### Update Rates

- [ ] Can open update rate page
- [ ] Date filters are required
- [ ] Can edit amounts in table
- [ ] UpdateRate button applies changes
- [ ] Changes persist

### Unbilled Bookings

- [ ] Page loads (no 404)
- [ ] Date filters work
- [ ] Results display correctly
- [ ] Can export to Excel

### Bulk Operations

- [ ] Can create multiple bookings (1-5)
- [ ] Sequential numbering works
- [ ] All bookings created

### Import from Excel

- [ ] Can download template
- [ ] Can fill and upload template
- [ ] Bookings import successfully
- [ ] Imported data appears in filter

---

## 🎉 SUCCESS CRITERIA

### ✅ MINIMUM SUCCESS

- [ ] Can login
- [ ] Can create 1 booking
- [ ] Can see booking in filter results
- [ ] No 404 errors on filter page

### ✅ FULL SUCCESS

- All items in "Complete Test Checklist" are checked
- Backend running without errors
- All 10 tests pass
- No console errors in browser (F12)
- Database has test bookings

### ✅ PRODUCTION READY

- All of FULL SUCCESS criteria met
- Export to Excel works
- Import from Excel works
- Bulk operations work
- Performance is acceptable

---

## 📞 QUICK COMMANDS

### Start Backend

```powershell
Set-Location "c:\Users\admin\Desktop\FRbiling\backend"
npm run dev
```

### Start Frontend

```powershell
Set-Location "c:\Users\admin\Desktop\FRbiling\frontend"
npm run dev
```

### Test Filter Endpoint Directly

```powershell
# Using curl:
curl -H "Authorization: Bearer <your_token>" `
  "http://localhost:5000/api/bookings/filter?customer_id=CUST001&from_date=2024-01-01&to_date=2024-01-31"

# Expected: 200 OK with bookings array
```

### Check Database

```powershell
mysql -u root -p
# Password: root

USE frbilling;
SELECT COUNT(*) FROM bookings;
SELECT * FROM bookings WHERE consignment_number = 'TEST001';
```

---

## 🎯 RECOMMENDED TEST ORDER

1. **Backend Status** → Verify server is running
2. **Login** → Can access system
3. **Create Booking** → Basic functionality
4. **Filter Bookings** → Main fix verification ⭐
5. **Edit Booking** → Update functionality
6. **Export Excel** → Reporting feature
7. **Import Excel** → Bulk import
8. **Multiple Booking** → Bulk create
9. **Other Features** → Nice to have

---

## ⏱️ TIME BREAKDOWN

| Test              | Time        | Priority    |
| ----------------- | ----------- | ----------- |
| Backend Check     | 2 min       | CRITICAL    |
| Login             | 2 min       | CRITICAL    |
| Create Booking    | 3 min       | CRITICAL    |
| Filter Bookings   | 3 min       | CRITICAL ⭐ |
| Edit Booking      | 3 min       | HIGH        |
| Update Rates      | 2 min       | MEDIUM      |
| Unbilled List     | 2 min       | MEDIUM      |
| Export Excel      | 2 min       | MEDIUM      |
| Multiple Bookings | 3 min       | MEDIUM      |
| Import Excel      | 3 min       | MEDIUM      |
| **TOTAL**         | **~25 min** |             |

---

## 🚀 YOU'RE READY TO TEST!

Everything should work now. If you encounter any issues:

1. **Filter returns 404?** → Backend not restarted
2. **Can't create booking?** → Database error (check migrations)
3. **Page doesn't load?** → Cache issue (Ctrl+Shift+R)
4. **Can't login?** → Check credentials/backend

**Next Steps:**

- [ ] Start backend: `npm run dev`
- [ ] Start frontend: `npm run dev`
- [ ] Go through tests 1-4 (critical path)
- [ ] Report any issues

**Good luck! 🎉**
