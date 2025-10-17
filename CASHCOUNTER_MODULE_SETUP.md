# CashCounter Booking Module - Setup & Testing Guide

## 🚀 Quick Setup (3 Commands)

### If Backend NOT Running

```powershell
# Terminal 1: Start Backend
Set-Location "c:\Users\admin\Desktop\FRbiling\backend"
npm start
```

### Start Frontend

```powershell
# Terminal 2: Start Frontend
Set-Location "c:\Users\admin\Desktop\FRbiling\frontend"
npm run dev
```

### Access Application

```
http://localhost:3000
```

**Backend API**: `http://localhost:5000`

---

## ✅ Post-Setup Verification (2 Minutes)

### Step 1: Check Backend (30 seconds)

```powershell
# Check if backend is running
curl http://localhost:5000/api/health
```

**Expected Response**:

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-01-10T..."
}
```

### Step 2: Check Frontend (30 seconds)

1. Open: `http://localhost:3000`
2. Login with credentials
3. Verify dashboard loads

### Step 3: Check Sidebar Navigation (1 minute)

1. Open sidebar (left side)
2. Scroll to **"CashCounter Menu"** section
3. Click on **"Booking"** group
4. Verify 3 submenu items appear:
   - ✅ Print
   - ✅ Print Bulk Receipt
   - ✅ Delete Cash Consignment

### Step 4: Test Page Access (30 seconds)

Click each submenu item and verify pages load:

1. **Print** → PrintReceiptPage (large form)
2. **Print Bulk Receipt** → PrintBulkCashReceiptPage (2 input fields)
3. **Delete Cash Consignment** → DeleteCashConsignmentPage (1 input field + warning)

---

## 🧪 Complete Testing Guide (10 Minutes)

### Test 1: Create Basic Cash Booking (3 minutes)

**Objective**: Create a complete booking with all required fields

**Steps**:

1. Navigate to: **CashCounter Menu → Booking → Print**
2. Fill form:

```
Top Section:
- Consignment No: TEST001
- Date: [Today's date]
- Destination: Mumbai

Sender Details:
- Ph No: 9876543210
- Sender: John Doe
- Address: 123 Main Street, Building A
- City: Delhi
- State: Delhi
- Pincode: 110001

Recipient Details:
- Ph No: 9876543211
- Recipient: Jane Smith
- Address: 456 Park Avenue, Floor 5
- City: Mumbai
- State: Maharashtra
- Pincode: 400001

Shipment Type:
- Type: Dox (radio button)
- Sub-type: Non Dox (radio button)
- Weight: 2.5

Charges:
- Amount: 500
- Total Amount: 500

Payment Mode:
- Select: Cash (radio button)
- Paid Amount: 500
```

3. Click **"Save"** button
4. Wait for response

**Expected Result**:

- ✅ Alert: "Booking created successfully!"
- ✅ Form clears automatically
- ✅ Console shows: 200 status code

**Troubleshooting**:

- ❌ Error "Failed to create": Check consignment number is unique
- ❌ Error "Required fields": Verify sender/receiver name, phone, pincode filled

---

### Test 2: Volumetric Weight Auto-Calculation (2 minutes)

**Objective**: Verify automatic calculation of volumetric weight

**Steps**:

1. Navigate to: **Print Receipt** page
2. Scroll to **Shipment Type** section
3. Enter dimensions:
   ```
   L: 30
   B: 20
   H: 10
   Divide By: 3000 (should already be filled)
   ```
4. Observe **V.Wt** field

**Expected Result**:

- ✅ V.Wt automatically shows: **2.00**
- ✅ Calculation: (30 × 20 × 10) / 3000 = 6000 / 3000 = 2.00

**Test Variations**:

```
Test A: L=50, B=40, H=30, Divide=5000 → V.Wt = 12.00
Test B: L=100, B=50, H=20, Divide=3000 → V.Wt = 33.33
Test C: L=10, B=10, H=10, Divide=1000 → V.Wt = 1.00
```

**Troubleshooting**:

- ❌ V.Wt not updating: Ensure all fields (L, B, H, Divide By) have numeric values
- ❌ Wrong calculation: Clear fields and re-enter

---

### Test 3: Balance Amount Auto-Calculation (1 minute)

**Objective**: Verify automatic calculation of balance amount

**Steps**:

1. Scroll to **Charges** section
2. Enter:
   ```
   Total Amount: 1000
   ```
3. Scroll to **Mode Of Payment** section
4. Enter:
   ```
   Paid Amount: 750
   ```
5. Observe **Balance Amount** field

**Expected Result**:

- ✅ Balance Amount automatically shows: **250.00**
- ✅ Calculation: 1000 - 750 = 250

**Test Variations**:

```
Test A: Total=500, Paid=500 → Balance=0.00
Test B: Total=1500, Paid=1000 → Balance=500.00
Test C: Total=999.99, Paid=500 → Balance=499.99
```

**Troubleshooting**:

- ❌ Balance not updating: Enter numeric values only (no commas)
- ❌ Negative balance: This is allowed (overpayment scenario)

---

### Test 4: Service Selection with Color Coding (1 minute)

**Objective**: Verify service checkboxes and color display

**Steps**:

1. Scroll to **Services** section
2. Click checkboxes for:
   - **DTDC Plus** (should be RED background)
   - **DTDC Blue** (should be BLUE background)
   - **PTP 10.30 AM** (should be PURPLE background)
3. Observe colors

**Expected Result**:

- ✅ DTDC Plus: Red background, white text
- ✅ DTDC Blue: Blue background, white text
- ✅ PTP services: Purple background, white text
- ✅ Basic services: Grey background

**Service Color Reference**:

```
Red:    DTDC Plus
Blue:   DTDC Blue
Green:  DTDC Green
Purple: PTP 10.30 AM, PTP 12.00 PM, PTP 2.00 PM, Sunday PTP
Grey:   Lite, Non Dox Air, Non Dox Surface
Pink:   Other
```

---

### Test 5: Save and Print Functionality (1 minute)

**Objective**: Test save with print dialog

**Steps**:

1. Fill required booking fields (use Test 1 data)
2. Change Consignment No to: **TEST_PRINT_001**
3. Click **"Save and Print"** button
4. Observe results

**Expected Result**:

- ✅ Alert: "Booking created successfully! Opening print dialog..."
- ✅ Browser print dialog opens
- ✅ Form clears after successful save

**Troubleshooting**:

- ❌ Print dialog blocked: Allow pop-ups for localhost in browser settings
- ❌ Print dialog not opening: Use Ctrl+P (Windows) or Cmd+P (Mac) manually

---

### Test 6: Bulk Print - Create Multiple Bookings (2 minutes)

**Objective**: Create multiple sequential bookings for bulk testing

**Steps**:

1. Create Booking 1:

   ```
   Consignment No: BULK001
   Sender: John Doe, 9876543210
   Receiver: Jane Smith, 9876543211
   Amount: 500
   Click Save
   ```

2. Create Booking 2:

   ```
   Consignment No: BULK002
   Sender: John Doe, 9876543210
   Receiver: Jane Smith, 9876543211
   Amount: 600
   Click Save
   ```

3. Create Booking 3:
   ```
   Consignment No: BULK003
   Sender: John Doe, 9876543210
   Receiver: Jane Smith, 9876543211
   Amount: 700
   Click Save
   ```

**Expected Result**:

- ✅ All 3 bookings created successfully
- ✅ No errors
- ✅ Ready for bulk print test

---

### Test 7: Print Bulk Cash Receipt (1 minute)

**Objective**: Fetch and print multiple bookings by range

**Prerequisites**: Test 6 completed (BULK001, BULK002, BULK003 exist)

**Steps**:

1. Navigate to: **CashCounter Menu → Booking → Print Bulk Receipt**
2. Enter:
   ```
   From Consignment No: BULK001
   To Consignment No: BULK003
   ```
3. Click **"Download"** button
4. Observe response

**Expected Result**:

- ✅ Alert: "Found 3 bookings. Opening print dialog..."
- ✅ Print dialog opens (in real implementation)
- ✅ No errors in console

**Test Variations**:

```
Test A: From=BULK001, To=BULK001 → 1 booking
Test B: From=BULK001, To=BULK002 → 2 bookings
Test C: From=BULK999, To=BULK999 → 0 bookings (empty range)
```

**Troubleshooting**:

- ❌ "Found 0 bookings": Verify consignment numbers exist
- ❌ Missing fields error: Both From and To are required
- ❌ Wrong franchise: Login with correct franchise account

---

### Test 8: Delete Unbilled Consignment (1 minute)

**Objective**: Successfully delete a cash booking

**Prerequisites**: Create a test booking (use TEST001 or BULK001)

**Steps**:

1. Navigate to: **CashCounter Menu → Booking → Delete Cash Consignment**
2. Enter:
   ```
   Consignment No: TEST001
   ```
3. Click **"Delete"** button
4. Confirmation dialog appears: **"Are you sure you want to delete consignment TEST001? This action cannot be undone."**
5. Click **"OK"** to confirm
6. Observe result

**Expected Result**:

- ✅ Alert: "Consignment deleted successfully!"
- ✅ Consignment No field clears
- ✅ Booking removed from database

**Verification**:

- Try to delete same consignment again
- Should show: "Booking not found"

---

### Test 9: Prevent Deletion of Billed Consignment (2 minutes)

**Objective**: Verify system prevents deletion of invoiced bookings

**Prerequisites**:

1. Create a booking (e.g., BILLED001)
2. Create an invoice that includes BILLED001

**Steps**:

1. Create booking **BILLED001**
2. Go to **Invoices → Generate Invoice**
3. Create invoice including consignment **BILLED001**
4. Return to **Delete Cash Consignment** page
5. Enter:
   ```
   Consignment No: BILLED001
   ```
6. Click **"Delete"** button
7. Confirm deletion

**Expected Result**:

- ✅ Alert: **"Cannot delete booking. This consignment has already been invoiced."**
- ✅ Booking is NOT deleted
- ✅ Database remains unchanged

**Explanation**:
This is a **safety feature** to prevent accidental deletion of billed consignments. Once a consignment is invoiced, it cannot be deleted to maintain financial integrity.

---

## 📊 Test Summary Checklist

After completing all tests, verify:

**Page Functionality**:

- [ ] Print Receipt page loads correctly
- [ ] Print Bulk Receipt page loads correctly
- [ ] Delete Consignment page loads correctly

**Form Features**:

- [ ] Can create basic booking
- [ ] Volumetric weight calculates automatically
- [ ] Balance amount calculates automatically
- [ ] Service selection works with correct colors
- [ ] Save and Print opens print dialog
- [ ] Clear button resets form

**Bulk Operations**:

- [ ] Can fetch bookings by range
- [ ] Shows correct count of bookings
- [ ] Handles empty ranges gracefully

**Deletion**:

- [ ] Can delete unbilled consignments
- [ ] Cannot delete billed consignments
- [ ] Shows appropriate error messages
- [ ] Requires confirmation before deletion

**Data Validation**:

- [ ] Duplicate consignment numbers rejected
- [ ] Required fields validated
- [ ] Numeric fields accept only numbers
- [ ] Date fields show date picker

**API Communication**:

- [ ] All endpoints respond with 200 status
- [ ] JWT authentication working
- [ ] Error messages display correctly
- [ ] Loading states show during API calls

---

## 🔧 Configuration

### Backend Configuration (`backend/.env`)

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

### Frontend Configuration

Default Vite dev server: `http://localhost:3000`

API Base URL (in pages): `http://localhost:5000/api`

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Port Already in Use

**Symptoms**:

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions**:

```powershell
# Option A: Kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Option B: Change port in backend/.env
PORT=5001
```

---

### Issue 2: Cannot Connect to Database

**Symptoms**:

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solutions**:

1. Check MySQL is running:

   ```powershell
   # Windows
   Get-Service MySQL*

   # Start MySQL if stopped
   Start-Service MySQL80
   ```

2. Verify credentials in `backend/.env`:

   ```
   MYSQL_USER=root
   MYSQL_PASSWORD=Backend
   MYSQL_DATABASE=frbilling
   ```

3. Test connection:
   ```powershell
   mysql -u root -pBackend -D frbilling
   ```

---

### Issue 3: JWT Token Expired

**Symptoms**:

```
Error: Unauthorized
Status: 401
```

**Solution**:

1. Logout from application
2. Login again to get fresh token
3. Token expires after 1 day (configurable in `JWT_EXPIRATION`)

---

### Issue 4: CORS Error

**Symptoms**:

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:
Verify `CORS_ORIGIN` in `backend/.env`:

```env
CORS_ORIGIN=http://localhost:3000
```

If using different port, update accordingly.

---

### Issue 5: "Module not found" Error

**Symptoms**:

```
Error: Cannot find module 'cashcounterRoutes.js'
```

**Solution**:

```powershell
# Verify file exists
Test-Path "c:\Users\admin\Desktop\FRbiling\backend\src\routes\cashcounterRoutes.js"

# Restart backend server
Set-Location "c:\Users\admin\Desktop\FRbiling\backend"
npm start
```

---

### Issue 6: Form Not Submitting

**Symptoms**:

- Click Save button, nothing happens
- No error message

**Solution**:

1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify network requests are being sent
4. Check if token exists:
   ```javascript
   localStorage.getItem("token");
   ```

---

## 📈 Performance Benchmarks

Expected response times (local development):

| Operation                | Expected Time |
| ------------------------ | ------------- |
| Create Booking           | < 500ms       |
| Fetch Bulk Bookings (10) | < 300ms       |
| Delete Booking           | < 200ms       |
| Get Single Booking       | < 100ms       |

If response times are significantly higher:

1. Check database indexes
2. Review MySQL slow query log
3. Check system resources (CPU, RAM)

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Enable HTTPS
- [ ] Review database user permissions
- [ ] Enable rate limiting
- [ ] Add request validation
- [ ] Set up error logging
- [ ] Configure backup schedule

---

## 📚 Documentation Reference

| Document                         | Purpose                     | Lines  |
| -------------------------------- | --------------------------- | ------ |
| **CASHCOUNTER_MODULE_GUIDE.md**  | Complete technical guide    | 1,200+ |
| **CASHCOUNTER_MODULE_README.md** | Quick reference             | 300+   |
| **CASHCOUNTER_MODULE_SETUP.md**  | This file - Setup & testing | 800+   |

**Total Documentation**: ~2,300 lines

---

## 🎯 Success Criteria

**Module is 100% complete when**:

✅ All 3 pages accessible and functional  
✅ Can create bookings with all fields  
✅ Auto-calculations work correctly  
✅ Can print bulk receipts  
✅ Can delete unbilled consignments  
✅ Cannot delete billed consignments  
✅ All 4 API endpoints respond correctly  
✅ JWT authentication functioning  
✅ Franchise data isolation verified  
✅ All test scenarios pass

---

## 🚀 Next Steps

### After Setup Complete

1. **Customize Forms**:

   - Add company logo to receipt
   - Adjust field labels if needed
   - Modify service list

2. **Enhance Features**:

   - Add receipt template design
   - Implement barcode generation
   - Add email/SMS notifications

3. **Production Deployment**:
   - Set up production database
   - Configure production environment
   - Deploy to server
   - Set up monitoring

---

## 📞 Support

### Need Help?

1. **Check Documentation**:

   - `CASHCOUNTER_MODULE_GUIDE.md` - Detailed technical docs
   - `CASHCOUNTER_MODULE_README.md` - Quick reference
   - This file - Setup & testing guide

2. **Check Logs**:

   - Backend console output
   - Frontend browser console (F12)
   - MySQL error logs

3. **Common Fixes**:
   - Restart backend server
   - Clear browser cache (Ctrl+Shift+Delete)
   - Re-login to refresh token
   - Check network tab in browser DevTools

---

## ✅ Final Verification

Run this checklist before marking setup as complete:

### Environment

- [ ] Node.js installed and working
- [ ] MySQL running and accessible
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)

### Servers

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access both in browser

### Authentication

- [ ] Can login successfully
- [ ] JWT token stored in localStorage
- [ ] Token includes franchise_id

### Navigation

- [ ] Sidebar shows "CashCounter Menu"
- [ ] "Booking" group expands correctly
- [ ] All 3 submenu items visible

### Pages

- [ ] Print Receipt page loads (large form)
- [ ] Print Bulk Receipt page loads (2 fields)
- [ ] Delete Consignment page loads (1 field + warning)

### Functionality

- [ ] Can create booking and save
- [ ] Volumetric weight calculates
- [ ] Balance amount calculates
- [ ] Can fetch bulk bookings
- [ ] Can delete unbilled booking
- [ ] Cannot delete billed booking

### API

- [ ] All endpoints return 200 status
- [ ] Error handling works
- [ ] Authentication required
- [ ] Franchise isolation working

---

**If all checks pass**: ✅ **Module Setup Complete!**

**Estimated Setup Time**: 15 minutes  
**Estimated Testing Time**: 10 minutes  
**Total Time**: ~25 minutes

---

**Setup Complete! Start creating cash bookings! 📦🎉**
