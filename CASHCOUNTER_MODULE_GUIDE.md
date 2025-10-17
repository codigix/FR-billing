# CashCounter Booking Module - Complete Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Pages & Functionality](#pages--functionality)
4. [Backend API Endpoints](#backend-api-endpoints)
5. [Database Schema](#database-schema)
6. [Installation & Setup](#installation--setup)
7. [Usage Guide](#usage-guide)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The **CashCounter Booking Module** provides a comprehensive cash counter management system for creating, printing, and managing cash bookings (consignments). This module includes three main pages:

1. **Print Receipt** - Complete booking form for creating cash consignments
2. **Print Bulk Cash Receipt** - Bulk printing of receipts by consignment range
3. **Delete Cash Consignment** - Safe deletion of cash consignments

---

## Features

### ✅ Print Receipt Page

- **Complete Booking Form** with all required fields
- **Sender & Recipient Details** with full address information
- **Shipment Type Selection**: Dox, Air, International, Non Dox, Surface
- **Volumetric Weight Auto-calculation**: L × B × H ÷ Divide By
- **Charges Management**: Amount, Service Charge, Risk Surcharge, GST, Discount
- **Multiple Payment Modes**: Cash, Card, Online, Cheque, Credit, Other
- **Auto-calculate Balance**: Total Amount - Paid Amount
- **Service Selection**: 11 different service types with color coding
  - Lite, Non Dox Air, Non Dox Surface (Basic)
  - DTDC Plus (Red), DTDC Blue (Blue), DTDC Green (Green)
  - PTP 10.30 AM, PTP 12.00 PM, PTP 2.00 PM, Sunday PTP (Purple)
  - Other (Pink)
- **Actions**: Save and Print, Save, Clear

### ✅ Print Bulk Cash Receipt Page

- **Range Selection**: From Consignment No to To Consignment No
- **Bulk Print**: Print multiple receipts in one operation
- **Download Button**: Fetch and print all receipts in range
- **Simple Interface**: Minimal fields for quick operation

### ✅ Delete Cash Consignment Page

- **Safe Deletion**: Confirmation dialog before deletion
- **Validation**: Checks if consignment is already invoiced
- **Prevention**: Cannot delete billed consignments
- **Warning Message**: Clear warning about permanent deletion

---

## Pages & Functionality

### 1. Print Receipt Page (`PrintReceiptPage.jsx`)

**Location**: `/cashcounter/print-receipt`

**Form Sections**:

#### A. Top Section

- **Consignment No**: Unique consignment identifier
- **Date**: Booking date (defaults to today)
- **Destination**: Delivery destination

#### B. Sender Details

- **Ph No**: Sender phone number
- **Email**: Sender email address
- **Sender**: Sender name
- **Company**: Sender company name
- **Address**: Full sender address (textarea)
- **City**: Sender city
- **State**: Sender state
- **Pincode**: Sender pincode

#### C. Recipient's Details

- **Ph No**: Recipient phone number
- **Email**: Recipient email address
- **Recipient**: Recipient name
- **Company**: Recipient company name
- **Address**: Full recipient address (textarea)
- **City**: Recipient city
- **State**: Recipient state
- **Pincode**: Recipient pincode

#### D. Shipment Type

- **Type Radio Buttons**: Dox, Air, International
- **Sub-Type Radio Buttons**: Non Dox, Surface
- **QTY**: Quantity of packages
- **Total**: Total quantity/count
- **A.W**: Actual weight
- **Weight**: Chargeable weight
- **L**: Length (for volumetric calculation)
- **B**: Breadth (for volumetric calculation)
- **H**: Height (for volumetric calculation)
- **Pcs**: Number of pieces
- **Devide By**: Divisor for volumetric weight (default: 3000)
- **V.Wt**: Auto-calculated volumetric weight (read-only)

**Volumetric Weight Formula**: `V.Wt = (L × B × H) / Divide By`

#### E. Description of Content & Value Of Goods

- **Description 1, 2, 3**: Three description fields
- **Total Value of Goods**: Total declared value
- **Amount 1, 2, 3**: Three amount fields
- **Total**: Sum of amounts

#### F. Charges (Right Side)

- **Amount**: Base amount
- **Service Charge**: Additional service charge
- **Risk Surcharge**: Risk/insurance charge
- **GST**: GST amount
- **Discount**: Discount amount
- **Select Dropdown**: Additional charge type (Handling/Packing/Delivery)
- **Additional Charge**: Additional charge amount
- **Total**: Final total amount

#### G. Mode Of Payment

- **Payment Mode Radio Buttons**: Cash, Card, Online, Cheque, Credit, Other
- **Paid Amount**: Amount paid by customer
- **Balance Amount**: Auto-calculated (Total - Paid) [read-only]

**Balance Calculation Formula**: `Balance = Total Amount - Paid Amount`

#### H. Services

11 service options with checkboxes and individual amount fields:

- **Lite** (Light grey)
- **Non Dox Air** (Light grey)
- **Non Dox Surface** (Light grey)
- **DTDC Plus** (Red background, white text)
- **DTDC Blue** (Blue background, white text)
- **DTDC Green** (Green background, white text)
- **PTP 10.30 AM** (Purple background, white text)
- **PTP 12.00 PM** (Purple background, white text)
- **PTP 2.00 PM** (Purple background, white text)
- **Sunday PTP** (Purple background, white text)
- **Other** (Pink background)

#### Action Buttons

- **Save and Print**: Saves booking and opens print dialog
- **Save**: Saves booking without printing
- **Clear**: Resets entire form to defaults

---

### 2. Print Bulk Cash Receipt Page (`PrintBulkCashReceiptPage.jsx`)

**Location**: `/cashcounter/print-bulk`

**Fields**:

- **From Consignment No**: Starting consignment number
- **To Consignment No**: Ending consignment number

**Functionality**:

- Validates both fields are filled
- Fetches all bookings in the specified range
- Shows count of bookings found
- Opens print dialog for bulk printing

**Action Button**:

- **Download**: Fetches and prints all receipts in range

---

### 3. Delete Cash Consignment Page (`DeleteCashConsignmentPage.jsx`)

**Location**: `/cashcounter/delete-consignment`

**Field**:

- **Consignment No**: Consignment number to delete

**Validations**:

- Confirms consignment exists
- Checks if consignment is already billed/invoiced
- Shows confirmation dialog before deletion
- Prevents deletion of billed consignments

**Action Button**:

- **Delete**: Permanently deletes the consignment

**Warning**:
Red warning box explains:

- Deletion is permanent and cannot be undone
- Ensure correct consignment number before deleting

---

## Backend API Endpoints

### Base URL

```
http://localhost:5000/api/cashcounter
```

### Authentication

All endpoints require JWT authentication via Bearer token in header:

```
Authorization: Bearer <token>
```

---

### 1. Create Cash Booking (Print Receipt)

**Endpoint**: `POST /cashcounter/create-booking`

**Description**: Creates a new cash counter booking with all details

**Request Body**:

```json
{
  "consignment_no": "CON123456",
  "date": "2025-01-10",
  "destination": "Mumbai",

  "sender_name": "John Doe",
  "sender_phone": "9876543210",
  "sender_email": "john@example.com",
  "sender_company": "ABC Corp",
  "sender_address": "123 Main St",
  "sender_city": "Delhi",
  "sender_state": "Delhi",
  "sender_pincode": "110001",

  "receiver_name": "Jane Smith",
  "receiver_phone": "9876543211",
  "receiver_email": "jane@example.com",
  "receiver_company": "XYZ Ltd",
  "receiver_address": "456 Park Ave",
  "receiver_city": "Mumbai",
  "receiver_state": "Maharashtra",
  "receiver_pincode": "400001",

  "shipment_type": "Dox",
  "shipment_sub_type": "Non Dox",
  "qty": "1",
  "weight": "2.5",
  "aw": "2.3",
  "length": "30",
  "breadth": "20",
  "height": "10",
  "pcs": "1",
  "divide_by": "3000",
  "vol_weight": "2.0",

  "description1": "Documents",
  "description2": "",
  "description3": "",
  "total_value": "5000",

  "amount1": "5000",
  "amount2": "",
  "amount3": "",

  "amount": "500",
  "service_charge": "50",
  "risk_surcharge": "20",
  "gst": "102.60",
  "discount": "0",
  "additional_charge_type": "handling",
  "additional_charge": "30",
  "total_amount": "702.60",

  "payment_mode": "Cash",
  "paid_amount": "700",
  "balance_amount": "2.60",

  "service_selected": ["DTDC Plus", "Non Dox Air"]
}
```

**Response (Success)**:

```json
{
  "success": true,
  "message": "Cash booking created successfully",
  "data": {
    "booking_number": "CB1736499654504"
  }
}
```

**Response (Error)**:

```json
{
  "success": false,
  "message": "Failed to create cash booking",
  "error": "Error details"
}
```

**Status Codes**:

- `200`: Success
- `500`: Server error

---

### 2. Get Bulk Print Bookings

**Endpoint**: `GET /cashcounter/bulk-print`

**Description**: Fetches all bookings in a consignment number range for bulk printing

**Query Parameters**:

- `from`: Starting consignment number (required)
- `to`: Ending consignment number (required)

**Example Request**:

```
GET /cashcounter/bulk-print?from=CON001&to=CON010
```

**Response (Success)**:

```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": 1,
        "consignment_number": "CON001",
        "booking_date": "2025-01-10",
        "sender_name": "John Doe",
        "receiver_name": "Jane Smith",
        "total_amount": "702.60"
        // ... other booking fields
      }
      // ... more bookings
    ],
    "count": 10
  }
}
```

**Response (Error - Missing Parameters)**:

```json
{
  "success": false,
  "message": "From and To consignment numbers are required"
}
```

**Status Codes**:

- `200`: Success
- `400`: Missing parameters
- `500`: Server error

---

### 3. Delete Cash Booking

**Endpoint**: `DELETE /cashcounter/delete-booking/:consignmentNo`

**Description**: Deletes a cash booking by consignment number (only if not invoiced)

**URL Parameters**:

- `consignmentNo`: Consignment number to delete

**Example Request**:

```
DELETE /cashcounter/delete-booking/CON123456
```

**Response (Success)**:

```json
{
  "success": true,
  "message": "Cash booking deleted successfully"
}
```

**Response (Error - Not Found)**:

```json
{
  "success": false,
  "message": "Booking not found"
}
```

**Response (Error - Already Invoiced)**:

```json
{
  "success": false,
  "message": "Cannot delete booking. This consignment has already been invoiced."
}
```

**Status Codes**:

- `200`: Success
- `400`: Already invoiced
- `404`: Booking not found
- `500`: Server error

---

### 4. Get Booking by Consignment Number

**Endpoint**: `GET /cashcounter/booking/:consignmentNo`

**Description**: Fetches a single booking by consignment number

**URL Parameters**:

- `consignmentNo`: Consignment number

**Example Request**:

```
GET /cashcounter/booking/CON123456
```

**Response (Success)**:

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": 1,
      "consignment_number": "CON123456",
      "booking_date": "2025-01-10",
      "sender_name": "John Doe",
      "receiver_name": "Jane Smith"
      // ... all booking fields
    }
  }
}
```

**Status Codes**:

- `200`: Success
- `404`: Booking not found
- `500`: Server error

---

## Database Schema

### Bookings Table Extensions

The CashCounter module uses the existing `bookings` table with additional fields stored in JSON format or new columns added via migration.

**Core Fields Used**:

- `id` (INT, Primary Key)
- `franchise_id` (INT, Foreign Key)
- `booking_number` (VARCHAR(50), Unique)
- `consignment_number` (VARCHAR(50), Unique)
- `booking_date` (DATE)
- `destination` (VARCHAR(255))

**Sender Fields**:

- `sender_name`, `sender_phone`, `sender_email`, `sender_company`
- `sender_address`, `sender_city`, `sender_state`, `sender_pincode`

**Receiver Fields**:

- `receiver_name`, `receiver_phone`, `receiver_email`, `receiver_company`
- `receiver_address`, `receiver_city`, `receiver_state`, `receiver_pincode`

**Shipment Fields**:

- `shipment_type`, `shipment_sub_type`, `qty`, `weight`
- `act_wt`, `char_wt`, `vol_weight`
- `length`, `breadth`, `height`, `pieces`

**Charges Fields**:

- `amount`, `service_charge`, `risk_surcharge`, `gst_amount`
- `discount`, `additional_charge_type`, `additional_charge`, `total_amount`

**Payment Fields**:

- `payment_mode`, `paid_amount`, `balance_amount`, `payment_status`

**Other Fields**:

- `description` (JSON: contains description items and amounts)
- `services_selected` (JSON: array of selected services)
- `status` (ENUM: booked, in_transit, out_for_delivery, delivered, cancelled)
- `created_at`, `updated_at` (TIMESTAMP)

---

## Installation & Setup

### Prerequisites

- Node.js v16+ installed
- MySQL database running
- Backend server running on port 5000
- Frontend dev server (Vite) available

### Step 1: Install Dependencies (if needed)

```powershell
# Backend (if not already installed)
Set-Location "c:\Users\admin\Desktop\FRbiling\backend"
npm install

# Frontend (if not already installed)
Set-Location "c:\Users\admin\Desktop\FRbiling\frontend"
npm install
```

### Step 2: Database Setup

No additional migrations required - uses existing `bookings` table.

If you need to add custom fields, create a new migration:

```powershell
Set-Location "c:\Users\admin\Desktop\FRbiling\backend"
# Create migration for additional fields if needed
```

### Step 3: Start Backend Server

```powershell
Set-Location "c:\Users\admin\Desktop\FRbiling\backend"
npm start
```

Backend should be running at: `http://localhost:5000`

### Step 4: Start Frontend Dev Server

```powershell
Set-Location "c:\Users\admin\Desktop\FRbiling\frontend"
npm run dev
```

Frontend should be running at: `http://localhost:3000`

### Step 5: Verify Installation

1. Navigate to: `http://localhost:3000`
2. Login with your credentials
3. Open sidebar and expand "Booking" under "CashCounter Menu"
4. Verify 3 submenu items appear:
   - Print
   - Print Bulk Receipt
   - Delete Cash Consignment

---

## Usage Guide

### Creating a Cash Booking (Print Receipt)

1. **Navigate** to CashCounter Menu > Booking > Print
2. **Fill Top Section**:

   - Enter unique Consignment No
   - Select date (defaults to today)
   - Enter destination city

3. **Enter Sender Details**:

   - Phone number (required)
   - Sender name (required)
   - Email (optional)
   - Company name (optional)
   - Full address
   - City, State, Pincode

4. **Enter Recipient Details**:

   - Phone number (required)
   - Recipient name (required)
   - Email (optional)
   - Company name (optional)
   - Full address
   - City, State, Pincode

5. **Select Shipment Type**:

   - Choose type: Dox / Air / International
   - Choose sub-type: Non Dox / Surface
   - Enter QTY, Weight, A.W

6. **Enter Package Dimensions** (for volumetric weight):

   - Length, Breadth, Height
   - V.Wt will auto-calculate
   - Adjust "Divide By" if needed (default: 3000)

7. **Add Description & Value**:

   - Enter up to 3 description items
   - Enter corresponding amounts
   - Enter total value of goods

8. **Enter Charges**:

   - Base amount
   - Service charge (if any)
   - Risk surcharge (if any)
   - GST amount
   - Discount (if any)
   - Select additional charge type and amount
   - Enter final total amount

9. **Select Payment Mode**:

   - Choose: Cash / Card / Online / Cheque / Credit / Other
   - Enter paid amount
   - Balance will auto-calculate

10. **Select Services** (if applicable):

    - Check service type (Lite, DTDC Plus, PTP, etc.)
    - Enter service amount

11. **Save**:
    - Click **"Save and Print"** to save and open print dialog
    - OR Click **"Save"** to save without printing
    - Click **"Clear"** to reset form

---

### Printing Bulk Receipts

1. **Navigate** to CashCounter Menu > Booking > Print Bulk Receipt
2. **Enter Range**:
   - From Consignment No: `CON001`
   - To Consignment No: `CON050`
3. **Click Download**:
   - System fetches all bookings in range
   - Shows count of found bookings
   - Opens print dialog with all receipts
4. **Print** from browser print dialog

---

### Deleting a Cash Consignment

1. **Navigate** to CashCounter Menu > Booking > Delete Cash Consignment
2. **Enter Consignment No**: Type the consignment number to delete
3. **Click Delete**:
   - Confirmation dialog appears
   - Click "OK" to confirm
4. **System Checks**:
   - Verifies consignment exists
   - Checks if already invoiced
   - If invoiced, shows error: "Cannot delete. Already invoiced."
   - If not invoiced, deletes successfully
5. **Confirmation**: Success message appears

⚠️ **Warning**: Deletion is permanent and cannot be undone!

---

## Testing

### Test Scenario 1: Create Basic Cash Booking (3 minutes)

**Steps**:

1. Navigate to Print Receipt page
2. Enter:
   - Consignment No: `TEST001`
   - Date: Today
   - Destination: `Mumbai`
3. Sender:
   - Phone: `9876543210`
   - Name: `John Doe`
   - Address: `123 Main St`
   - City: `Delhi`, State: `Delhi`, Pincode: `110001`
4. Receiver:
   - Phone: `9876543211`
   - Name: `Jane Smith`
   - Address: `456 Park Ave`
   - City: `Mumbai`, State: `Maharashtra`, Pincode: `400001`
5. Shipment: Dox, Non Dox, Weight: `2.5`
6. Charges: Amount: `500`, Total: `500`
7. Payment: Cash, Paid: `500`
8. Click **Save**

**Expected Result**:

- Success message appears
- Form clears
- Booking saved to database

---

### Test Scenario 2: Volumetric Weight Calculation (1 minute)

**Steps**:

1. Navigate to Print Receipt page
2. Enter dimensions:
   - L: `30`
   - B: `20`
   - H: `10`
   - Divide By: `3000`

**Expected Result**:

- V.Wt automatically shows: `2.00`
- Formula: (30 × 20 × 10) / 3000 = 2.00

---

### Test Scenario 3: Balance Calculation (1 minute)

**Steps**:

1. Navigate to Print Receipt page
2. Enter:
   - Total Amount: `1000`
   - Paid Amount: `750`

**Expected Result**:

- Balance Amount automatically shows: `250.00`

---

### Test Scenario 4: Bulk Print (2 minutes)

**Steps**:

1. First, create 3 bookings with consignment numbers:
   - `BULK001`, `BULK002`, `BULK003`
2. Navigate to Print Bulk Receipt page
3. Enter:
   - From: `BULK001`
   - To: `BULK003`
4. Click **Download**

**Expected Result**:

- Alert shows: "Found 3 bookings. Opening print dialog..."
- Print dialog opens

---

### Test Scenario 5: Delete Unbilled Consignment (2 minutes)

**Steps**:

1. Create a test booking: `DELETE001`
2. Navigate to Delete Cash Consignment page
3. Enter Consignment No: `DELETE001`
4. Click **Delete**
5. Confirm deletion

**Expected Result**:

- Confirmation dialog appears
- After confirming, success message appears
- Consignment is deleted from database

---

### Test Scenario 6: Prevent Deletion of Billed Consignment (2 minutes)

**Steps**:

1. Create a booking: `BILLED001`
2. Create an invoice that includes `BILLED001`
3. Navigate to Delete Cash Consignment page
4. Enter Consignment No: `BILLED001`
5. Click **Delete**

**Expected Result**:

- Error message: "Cannot delete booking. This consignment has already been invoiced."
- Consignment is NOT deleted

---

### Test Scenario 7: Service Selection (1 minute)

**Steps**:

1. Navigate to Print Receipt page
2. In Services section, select:
   - DTDC Plus (Red)
   - PTP 10.30 AM (Purple)
3. Enter amounts for each
4. Save booking

**Expected Result**:

- Selected services are saved in JSON format
- Color coding displays correctly (Red and Purple backgrounds)

---

## Troubleshooting

### Issue 1: "Failed to create cash booking"

**Symptoms**:

- Error message appears on save
- Booking not created

**Possible Causes**:

1. Duplicate consignment number
2. Missing required fields
3. Database connection issue
4. JWT token expired

**Solutions**:

```
1. Check consignment number is unique
2. Verify all required fields are filled:
   - consignment_no
   - sender_name, sender_phone, sender_pincode
   - receiver_name, receiver_phone, receiver_pincode
3. Check backend console for errors
4. Re-login to refresh JWT token
```

---

### Issue 2: Volumetric Weight Not Calculating

**Symptoms**:

- V.Wt field remains empty
- Auto-calculation not working

**Possible Causes**:

1. Missing L, B, or H values
2. Divide By is 0 or empty
3. Non-numeric values entered

**Solutions**:

```
1. Enter numeric values for L, B, H
2. Ensure Divide By has value (default: 3000)
3. Check browser console for JavaScript errors
```

---

### Issue 3: Balance Amount Incorrect

**Symptoms**:

- Balance shows wrong value
- Auto-calculation not updating

**Possible Causes**:

1. Total Amount or Paid Amount not numeric
2. JavaScript calculation error

**Solutions**:

```
1. Enter numeric values only
2. Check format: use decimal (702.60) not comma (702,60)
3. Refresh page and try again
```

---

### Issue 4: Cannot Delete Consignment

**Symptoms**:

- Error: "Cannot delete booking. Already invoiced."

**Possible Causes**:

- Consignment is included in an invoice

**Solutions**:

```
This is expected behavior - billed consignments cannot be deleted.
To delete:
1. First delete or modify the invoice
2. Remove consignment from invoice
3. Then delete the consignment
```

---

### Issue 5: Bulk Print Returns No Results

**Symptoms**:

- Alert shows "Found 0 bookings"
- No data for given range

**Possible Causes**:

1. No bookings exist in that range
2. Consignment numbers don't match format
3. Wrong franchise (data isolation)

**Solutions**:

```
1. Verify bookings exist with those consignment numbers
2. Check consignment number format matches
3. Ensure logged in with correct franchise
4. Use exact consignment numbers (case-sensitive)
```

---

### Issue 6: Print Dialog Not Opening

**Symptoms**:

- "Save and Print" saves but doesn't print
- No print dialog appears

**Possible Causes**:

1. Browser blocking print dialog
2. Pop-up blocker enabled

**Solutions**:

```
1. Allow pop-ups for localhost in browser settings
2. Manually trigger print: Ctrl+P (Windows) / Cmd+P (Mac)
3. Use "Save" button and print separately
```

---

### Issue 7: JWT Token Expired Error

**Symptoms**:

- Error: "Unauthorized" or "Token expired"
- API calls fail with 401 status

**Solutions**:

```
1. Logout and login again
2. Token expires after configured time (default: 1 day)
3. Check JWT_EXPIRATION in backend .env file
```

---

## Security Considerations

### 1. Authentication

- All endpoints require JWT authentication
- Token must be valid and not expired
- Token includes franchise_id for data isolation

### 2. Authorization

- Users can only access bookings from their own franchise
- Franchise ID from JWT token used in all queries
- Prevents cross-franchise data access

### 3. Data Validation

- Consignment numbers must be unique
- Required fields validated on backend
- SQL injection prevented by parameterized queries
- XSS prevented by React escaping

### 4. Deletion Safety

- Cannot delete billed consignments
- Confirmation required before deletion
- Checks invoice relationship before allowing delete

---

## Performance Optimization

### 1. Database Indexes

Recommended indexes for optimal performance:

```sql
CREATE INDEX idx_consignment ON bookings(consignment_number);
CREATE INDEX idx_franchise_date ON bookings(franchise_id, booking_date);
CREATE INDEX idx_status ON bookings(status);
```

### 2. Query Optimization

- Use `.whereBetween()` for consignment ranges
- Single query for bulk print (not loop)
- LEFT JOIN for checking invoices

### 3. Frontend Optimization

- Auto-calculation using useEffect hooks
- Debouncing on input fields (if needed)
- Lazy loading for large forms

---

## Future Enhancements

### Phase 2 Features

1. **Receipt Template**: Custom printable receipt design with logo
2. **Barcode Generation**: Auto-generate barcode for consignment number
3. **Email Receipt**: Send receipt via email to customer
4. **SMS Notification**: Send booking confirmation via SMS
5. **Real-time Validation**: Check duplicate consignment on blur

### Phase 3 Features

1. **Edit Booking**: Allow modification of existing bookings
2. **Booking History**: View all bookings with filters
3. **Export to Excel**: Export booking data to Excel
4. **Print Templates**: Multiple receipt templates
5. **Signature Capture**: Digital signature on receipt

### Phase 4 Features

1. **Mobile App**: React Native app for field staff
2. **QR Code Scanning**: Scan QR for quick booking entry
3. **Auto-rate Calculation**: Fetch rates from rate master
4. **Payment Gateway**: Integrate online payment
5. **Dashboard Analytics**: Booking statistics and charts

---

## API Integration Examples

### Example 1: Create Booking with Axios

```javascript
import axios from "axios";

const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5000/api/cashcounter/create-booking",
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};
```

### Example 2: Fetch Bulk Bookings

```javascript
const getBulkBookings = async (from, to) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:5000/api/cashcounter/bulk-print",
      {
        params: { from, to },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};
```

### Example 3: Delete Booking

```javascript
const deleteBooking = async (consignmentNo) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `http://localhost:5000/api/cashcounter/delete-booking/${consignmentNo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
```

---

## File Structure

```
FRbiling/
├── frontend/
│   └── src/
│       └── pages/
│           ├── PrintReceiptPage.jsx              (870 lines)
│           ├── PrintBulkCashReceiptPage.jsx      (90 lines)
│           └── DeleteCashConsignmentPage.jsx     (85 lines)
│
├── backend/
│   └── src/
│       ├── controllers/
│       │   └── cashcounterController.js          (220 lines)
│       └── routes/
│           └── cashcounterRoutes.js              (25 lines)
│
└── CASHCOUNTER_MODULE_GUIDE.md                   (This file)
```

**Total Lines of Code**: ~1,290 lines

---

## Maintenance

### Regular Tasks

1. **Database Cleanup**: Archive old bookings periodically
2. **Backup**: Regular backup of bookings table
3. **Monitoring**: Track API response times
4. **Updates**: Keep dependencies updated

### Monthly Checks

- Review error logs
- Check disk space for database
- Verify backup integrity
- Update documentation if needed

---

## Support

### Getting Help

- **Documentation**: This file
- **API Docs**: Check endpoint descriptions above
- **Backend Logs**: Check `backend/logs/` folder
- **Frontend Console**: Check browser developer console

### Reporting Issues

When reporting issues, include:

1. Page/endpoint where issue occurred
2. Steps to reproduce
3. Error message (if any)
4. Browser console output
5. Backend logs (if available)

---

## Changelog

### Version 1.0.0 (January 2025)

- ✅ Initial release
- ✅ Print Receipt page with complete booking form
- ✅ Print Bulk Cash Receipt page
- ✅ Delete Cash Consignment page
- ✅ 4 backend API endpoints
- ✅ Auto-calculation features
- ✅ Service selection with color coding
- ✅ JWT authentication
- ✅ Franchise data isolation

---

## Credits

**Module**: CashCounter Booking Module  
**Version**: 1.0.0  
**Date**: January 2025  
**Framework**: React + Express.js + MySQL  
**Author**: FR-Billing Development Team

---

**End of Guide** 📚
