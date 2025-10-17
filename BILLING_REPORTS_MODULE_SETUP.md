# Billing Reports Module - Quick Setup Guide

## 🚀 Quick Start (3 Commands)

```powershell
# Backend is already running on port 5000

# Start Frontend
Set-Location "c:\Users\admin\Desktop\FRbiling\frontend"
npm run dev

# Access Reports
# Navigate to: http://localhost:3000/reports/creditors
```

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Testing](#testing)
5. [Common Issues](#common-issues)

---

## ✅ Prerequisites

### Already Installed

- ✅ Node.js (v16+)
- ✅ MySQL Server
- ✅ npm packages
- ✅ Backend running on port 5000

### Required

- Valid JWT token (login to get one)
- Sample data in database

---

## 📦 Installation

### Files Created

#### Frontend Pages (6 files)

```
frontend/src/pages/
├── CreditorsReportPage.jsx          (16 columns, filters, summaries)
├── SaleReportBeforeInvoicePage.jsx  (5 columns, pagination)
├── TaxReportPage.jsx                (15 columns, tax calculations)
├── BilledUnbilledListPage.jsx       (9 columns, billing status)
├── BusinessAnalysisPage.jsx         (8 columns, profit/loss)
└── CustomerSalesComparisonPage.jsx  (8 columns, month comparison)
```

#### Backend Files (2 files)

```
backend/src/
├── controllers/reportsController.js  (6 controller methods)
└── routes/reportsRoutes.js          (6 routes)
```

#### Navigation Updates (3 files)

```
backend/src/routes/index.js          (Added reports routes)
frontend/src/components/navigation/Sidebar.jsx  (Added Billing Reports group)
frontend/src/pages/App.jsx           (Added 6 report routes)
```

---

## ⚙️ Configuration

### Backend Configuration

**File**: `backend/src/routes/index.js`

```javascript
import reportsRoutes from "./reportsRoutes.js";
router.use("/reports", reportsRoutes);
```

### Frontend Configuration

**File**: `frontend/src/pages/App.jsx`

```javascript
// Import report pages
import CreditorsReportPage from "./CreditorsReportPage.jsx";
import SaleReportBeforeInvoicePage from "./SaleReportBeforeInvoicePage.jsx";
import TaxReportPage from "./TaxReportPage.jsx";
import BilledUnbilledListPage from "./BilledUnbilledListPage.jsx";
import BusinessAnalysisPage from "./BusinessAnalysisPage.jsx";
import CustomerSalesComparisonPage from "./CustomerSalesComparisonPage.jsx";

// Add routes
<Route path="reports/creditors" element={<CreditorsReportPage />} />
<Route path="reports/sale-before-invoice" element={<SaleReportBeforeInvoicePage />} />
<Route path="reports/tax" element={<TaxReportPage />} />
<Route path="reports/billed-unbilled" element={<BilledUnbilledListPage />} />
<Route path="reports/business-analysis" element={<BusinessAnalysisPage />} />
<Route path="reports/customer-sales" element={<CustomerSalesComparisonPage />} />
```

### Sidebar Configuration

**File**: `frontend/src/components/navigation/Sidebar.jsx`

```javascript
{
  type: "group",
  label: "Billing Reports",
  icon: BarChart3,
  items: [
    { to: "/reports/creditors", label: "Creditor's Report" },
    { to: "/reports/sale-before-invoice", label: "SalesReport Before Invoice" },
    { to: "/reports/tax", label: "Tax Report" },
    { to: "/reports/billed-unbilled", label: "Billed Unbilled Report" },
    { to: "/reports/business-analysis", label: "Business Analysis" },
    { to: "/reports/customer-sales", label: "Customer Sales Comparison" },
  ],
}
```

---

## 🧪 Testing

### Test Scenario 1: Creditor's Report (2 minutes)

**Steps**:

1. Login to application
2. Click "Billing Reports" in sidebar
3. Click "Creditor's Report"
4. Set filters:
   - From Date: 2024-01-01
   - To Date: 2024-12-31
   - Status: All
   - Invoice Type: GST
5. Click "Show"

**Expected Result**:

- ✅ Table displays invoice data
- ✅ Summary badges show totals (Total, Paid, Balance)
- ✅ Search works
- ✅ All 16 columns visible

**Screenshot**:

```
┌─────────────────────────────────────────────────┐
│ Creditor's Report                               │
├─────────────────────────────────────────────────┤
│ Filters: [Customer ID] [From] [To] [Status] [Type] │
│ Buttons: [Show] [Export] [Print] [Send Mail]   │
│ Search: [________]                              │
│                                                 │
│ Table: 16 columns with data                     │
│                                                 │
│ Summary: [Total: 0] [Paid: 0] [Balance: 0]     │
└─────────────────────────────────────────────────┘
```

---

### Test Scenario 2: Sale Report Before Invoice (1 minute)

**Steps**:

1. Navigate to "SalesReport Before Invoice"
2. Set date range: 2024-01-01 to 2024-12-31
3. Click "Show"
4. Change records per page to 25

**Expected Result**:

- ✅ Table shows grouped sales by customer
- ✅ Total badge displays sum
- ✅ Pagination works
- ✅ Shows booking count per customer

---

### Test Scenario 3: Tax Report (1 minute)

**Steps**:

1. Navigate to "Tax Report"
2. Enter Customer ID (optional)
3. Set date range
4. Click "Show"

**Expected Result**:

- ✅ Table displays with 15 columns
- ✅ CGST calculated (GST/2)
- ✅ Net Total badge shows sum
- ✅ Pagination works
- ✅ Export to Excel and Tally excel buttons visible

---

### Test Scenario 4: Billed/Unbilled List (1 minute)

**Steps**:

1. Navigate to "Billed Unbilled Report"
2. Set date range
3. Status: "Billed"
4. Click "Show"

**Expected Result**:

- ✅ Shows billed consignments
- ✅ Summary badges: Total Amount, Total Consignment
- ✅ Search filters results
- ✅ Export button visible

---

### Test Scenario 5: Business Analysis (1 minute)

**Steps**:

1. Navigate to "Business Analysis"
2. Enter Customer ID (optional)
3. Set date range
4. Click "Show"

**Expected Result**:

- ✅ Profit/Loss calculated correctly
- ✅ Percentage shown
- ✅ 4 summary badges visible
- ✅ Weight and destination displayed

---

### Test Scenario 6: Customer Sales Comparison (1 minute)

**Steps**:

1. Navigate to "Customer Sales Comparison"
2. Page auto-loads (no filters needed)

**Expected Result**:

- ✅ Data loads automatically
- ✅ Month names auto-calculated
- ✅ Sales difference calculated
- ✅ Percentage change shown
- ✅ Status (Increase/Decrease/No Change) displayed
- ✅ Numbered pagination works

---

## 🐛 Common Issues & Solutions

### Issue 1: Reports Not Loading

**Problem**: "Failed to load report" error

**Solutions**:

```powershell
# 1. Check backend is running
# Look for "Server running on port 5000"

# 2. Check database connection
# Verify MySQL is running

# 3. Check JWT token
# Login again to get fresh token

# 4. Check browser console
# Look for network errors (F12)
```

---

### Issue 2: Empty Data

**Problem**: Table shows "No data available"

**Solutions**:

```sql
-- 1. Verify data exists in database
SELECT COUNT(*) FROM invoices WHERE franchise_id = 1;
SELECT COUNT(*) FROM bookings WHERE franchise_id = 1;

-- 2. Check date filters
-- Ensure date range includes existing data

-- 3. Verify franchise_id
-- Check JWT token payload
```

---

### Issue 3: Summary Badges Show 0

**Problem**: All badges display zero

**Solutions**:

1. Load data by clicking "Show" button
2. Check API response in Network tab
3. Verify franchise has data for selected period
4. Check backend console for SQL errors

---

### Issue 4: 401 Unauthorized Error

**Problem**: API returns 401 error

**Solutions**:

```javascript
// 1. Check token in localStorage
localStorage.getItem("token");

// 2. Login again
// Navigate to /login

// 3. Check token expiration
// Default: 1 day
```

---

### Issue 5: Navigation Not Working

**Problem**: Sidebar items not showing

**Solutions**:

```powershell
# 1. Clear browser cache
# Ctrl + Shift + Delete

# 2. Restart frontend
Set-Location "c:\Users\admin\Desktop\FRbiling\frontend"
npm run dev

# 3. Check Sidebar.jsx updates
# Verify "Billing Reports" group exists
```

---

## 📊 Database Setup

### Required Tables

All reports use existing tables:

- ✅ `invoices` (Creditor's Report, Tax Report)
- ✅ `bookings` (Sale Report, Billed/Unbilled, Business Analysis, Sales Comparison)
- ✅ `payments` (indirectly via invoices)

### Sample Data Insertion

```sql
-- Insert sample invoice
INSERT INTO invoices (
  franchise_id, invoice_number, invoice_date, customer_id,
  period_from, period_to, total_amount, gst_percent,
  gst_amount_new, payment_status
) VALUES (
  1, 'INV-TEST-001', '2024-01-15', 'TEST-CUST',
  '2024-01-01', '2024-01-31', 10000, 18,
  1800, 'unpaid'
);

-- Insert sample booking
INSERT INTO bookings (
  franchise_id, consignment_number, booking_date, customer_id,
  pincode, act_wt, char_wt, qty, amount, dtdc_amt, destination
) VALUES (
  1, 'CN-TEST-001', '2024-01-15', 'TEST-CUST',
  '110001', 5.5, 6.0, 1, 500, 450, 'Delhi'
);
```

---

## 🔧 Advanced Configuration

### Environment Variables

**File**: `backend/.env`

```env
# Already configured
PORT=5000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=Backend
MYSQL_DATABASE=frbilling
JWT_SECRET=change_me
JWT_EXPIRATION=1d
```

### API Base URL

**File**: `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## 📈 Performance Monitoring

### Check Backend Logs

```powershell
# Backend console shows:
# - API request URLs
# - SQL queries executed
# - Error messages
# - Response times
```

### Check Network Tab

```
Browser DevTools (F12) > Network Tab:
- Request URL
- Status Code (200 = success)
- Response Time
- Response Data
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can login successfully
- [ ] Sidebar shows "Billing Reports" group
- [ ] All 6 report pages accessible
- [ ] Data loads when clicking "Show"
- [ ] Summary badges calculate correctly
- [ ] Search functionality works
- [ ] Pagination works (where applicable)
- [ ] No console errors
- [ ] Export buttons show alerts

---

## 🎯 Next Steps

1. **Test with Real Data**: Use production-like data
2. **Customize Filters**: Adjust date ranges per business needs
3. **Export Implementation**: Add real Excel export functionality
4. **Email Reports**: Schedule automated report emails
5. **Add Charts**: Visualize data with charts

---

## 📞 Need Help?

**Quick Diagnostics**:

```powershell
# 1. Check backend
# Should see: "Server running on port 5000"

# 2. Check frontend
# Should see: "Local: http://localhost:3000"

# 3. Check database
# MySQL should be running

# 4. Check browser console
# No errors should appear (F12)
```

**Common Commands**:

```powershell
# Restart Frontend
Set-Location "c:\Users\admin\Desktop\FRbiling\frontend"
npm run dev

# Check Backend Status
# Look at backend console for errors

# Clear Browser Cache
# Ctrl + Shift + Delete
```

---

## 📚 Additional Resources

- **Full Documentation**: See `BILLING_REPORTS_MODULE_GUIDE.md`
- **Implementation Summary**: See `BILLING_REPORTS_MODULE_SUMMARY.md`
- **API Testing**: Use Postman or Thunder Client

---

**Setup Time**: ~2 minutes (frontend start only)  
**Testing Time**: ~7 minutes (all 6 reports)  
**Total Time**: ~10 minutes

---

**Module**: Billing Reports  
**Version**: 1.0.0  
**Last Updated**: January 2025
