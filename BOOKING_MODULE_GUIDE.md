# Booking Module - Complete Implementation Guide

## Overview

This document describes the complete Booking module implementation with 9 pages matching the reference images from frbilling.com.

## Database Schema

### Bookings Table Fields

Migration: `20240101000017_update_bookings_for_consignment.cjs`

**Core Fields:**

- `id` (Primary Key, Auto Increment)
- `franchise_id` (Foreign Key to franchises table)
- `consignment_number` (VARCHAR, Unique)
- `booking_date` (DATE, Required)

**Customer & Receiver Information:**

- `customer_id` (VARCHAR, Required)
- `receiver` (VARCHAR, Optional)
- `address` (TEXT, Optional)
- `pincode` (VARCHAR, Required)

**Shipment Details:**

- `consignment_type` (ENUM: Domestic, International, Default: Domestic)
- `mode` (VARCHAR, Default: AR)
- `act_wt` (DECIMAL, Actual Weight)
- `char_wt` (DECIMAL, Chargeable Weight, Required)
- `qty` (INT, Quantity, Required)
- `type` (VARCHAR, Default: D)

**Financial Fields:**

- `amount` (DECIMAL)
- `other_charges` (DECIMAL, Default: 0)
- `reference` (VARCHAR)
- `dtdc_amt` (DECIMAL, Default: 0)
- `insurance` (DECIMAL, Default: 0)
- `percentage` (DECIMAL, Default: 0)
- `risk_surcharge` (DECIMAL, Default: 0)
- `bill_amount` (DECIMAL, Default: 0)
- `total` (DECIMAL, Default: 0)

**Additional Fields:**

- `destination` (VARCHAR)
- `status` (VARCHAR, Default: Booked)
- `remarks` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Frontend Pages

### 1. Book Consignment (Add)

**Route:** `/booking/add`
**File:** `BookConsignmentPage.jsx`
**Reference:** 1.png

**Features:**

- Import from text file option
- 11 input fields in first row (Consi no*, Cust Id*, Receiver, Address, Book date*, Consignment Type, Pincode*, Mode, Act Wt, char Wt*, Qty*)
- 5 input fields in second row (Type, Amount, Other Charges, Reference, Dtdc Amt)
- Required fields validation
- Submit button to create booking

**Required Fields:**

- Consignment No
- Customer ID
- Booking Date
- Pincode
- Chargeable Weight
- Quantity

### 2. Edit Consignment (Modify)

**Route:** `/booking/modify`
**File:** `EditConsignmentPage.jsx`
**Reference:** 2.png

**Features:**

- Filter by Customer ID, From Date, To Date
- Show button to display bookings
- Data table with 14 columns
- Edit modal for updating booking details
- Total calculation at bottom

**Table Columns:**
Sr No, Consignment no, Weight, Destination, Pincode, Mode, Type, Amount, Booking Date, Insurance, Percentage, Risk surcharge, Other Charge, Total, Action

### 3. Update Rate

**Route:** `/booking/update-rate`
**File:** `UpdateRatePage.jsx`
**Reference:** 3.png

**Features:**

- Filter by Customer id, From Date*, To Date*
- Show and UpdateRate buttons
- Data table with 14 columns
- Bulk rate update functionality
- Total display

**Table Columns:**
Sr No, Consignment no, Weight, Destination, Pincode, Mode, Amount, Booking Date, Insurance, Claim amount, Percentage, Risk surcharge, Other Charges, Total

### 4. Check Booking List

**Route:** `/booking/check-list`
**File:** `CheckBookingListPage.jsx`
**Reference:** 4.png

**Features:**

- Filter by Customer Id, From Date*, To Date*
- Show, Export to Excel, Print buttons
- Comprehensive data table with 18 columns
- Action column for viewing details

**Table Columns:**
Sr No, Action, Customer Id, Consignment no, Weight, Quantity, Destination, Pincode, Address, Type, Mode, Amount, Booking Date, Insurance, Bill Amount, Percentage, Risk surcharge, Other Charges

### 5. No Booking List

**Route:** `/booking/no-booking-data`
**File:** `NoBookingListPage.jsx`
**Reference:** 5.png

**Features:**

- Filter by From Date*, To Date*
- Default dropdown filter
- Show and Export to Excel buttons
- Simplified table with 7 columns
- Pagination controls

**Table Columns:**
Sr No, Consignment no, Weight, Pincode, Mode, Amount, Booking Date

### 6. Multiple Booking

**Route:** `/booking/multiple`
**File:** `MultipleBookingPage.jsx`
**Reference:** 6.png

**Features:**

- Warning message about DTDC TXT file requirement
- Start number and End number inputs
- Company input
- Submit button
- Limit of 100 consignments at once

**Use Case:**
Book sequential consignment numbers in bulk (e.g., ABC001 to ABC100)

### 7. Import From CashCounter

**Route:** `/booking/import-cashcounter`
**File:** `ImportFromCashCounterPage.jsx`
**Reference:** 7.png

**Features:**

- From Date and To Date date pickers
- Customer Id input (default: Cash_1)
- Book button to import bookings
- Integration with CashCounter system

### 8. Import From Limitless

**Route:** `/booking/import-limitless`
**File:** `ImportLimitlessPage.jsx`
**Reference:** 8.png

**Features:**

- Two upload sections side by side
- Upload Text File section
- Upload Excel File section
- Separate upload buttons for each format

### 9. Import From Excel

**Route:** `/booking/import-excel`
**File:** `ImportFromExcelBookingPage.jsx`
**Reference:** 9.png

**Features:**

- Three different Excel formats supported
- Download template buttons for each format
- Upload functionality for each format
- Format preview tables
- Step-by-step instructions

**Format 1: Simple Format**

- Columns: Consignment No*, Customer Id*
- Use case: Basic consignment number and customer ID import

**Format 2: Extended Format**

- Columns: Sr.No, Consignment No*, Customer Id*, Chargable Weight, Insurance Amt, FOV Amt, FOV Per, Other charges
- Use case: Import with weight and charge details

**Format 3: Complete Format**

- Columns: Sr.No, Consignment No*, Chargable Weight, Mode*, Company Address, Quantity*, Pincode*, Booking Date*, Or Gt Amt or Cv, Type or N*, Customer Id\*, Other Charges, Receiver, Amount (Optional)
- Use case: Full consignment details import

## Backend API Endpoints

### Base URL: `/api/bookings`

**Basic Operations:**

- `GET /` - Get all bookings (with pagination)
- `GET /:id` - Get booking by ID
- `POST /` - Create new booking
- `PUT /:id` - Update booking
- `DELETE /:id` - Delete booking

**Filter & Search:**

- `GET /filter?customer_id=&from_date=&to_date=` - Filter bookings
- `POST /update-rate` - Update rates for bookings in date range
- `GET /no-booking-list?from_date=&to_date=` - Get bookings without status

**Multiple Bookings:**

- `POST /multiple` - Create multiple bookings with sequential numbers

**Import Operations:**

- `POST /import-cashcounter` - Import from CashCounter system
- `POST /import-text` - Import from text file (multipart/form-data)
- `POST /import-excel-limitless` - Import from Limitless Excel file
- `POST /import-excel` - Import from Excel (3 formats)

**Template Downloads:**

- `GET /download-template/1` - Download Format 1 template
- `GET /download-template/2` - Download Format 2 template
- `GET /download-template/3` - Download Format 3 template

## Sidebar Navigation

The Booking menu is now a collapsible group with 9 submenu items:

```
Booking (CalendarCheck icon)
├── Add
├── Modify
├── Update Rate
├── Check Booking List
├── No Booking Data
├── Multiple Booking
├── Import From CashCounter
├── Import From Limitless
└── Import From Excel
```

## Required NPM Packages

Ensure these packages are installed in the backend:

```bash
npm install xlsx multer
```

**Package Usage:**

- `xlsx` - Excel file parsing and generation
- `multer` - File upload handling

## Migration Execution

Run the migration to update the bookings table:

```bash
cd backend
npx knex migrate:latest --knexfile knexfile.cjs
```

**Expected Output:**

```
Batch 6 run: 1 migrations
```

## Validation Rules

### Frontend Validation:

1. **Book Consignment:** Consignment No, Customer ID, Booking Date, Pincode, Chargeable Weight, Quantity are required
2. **Filter Operations:** Date ranges (From Date, To Date) are required
3. **Multiple Booking:** Start number, End number, and Company are required (max 100 bookings)
4. **File Uploads:** File selection required before upload

### Backend Validation:

1. **Create Booking:** Validates all required fields
2. **Duplicate Check:** Consignment number must be unique per franchise
3. **Date Range:** Validates date formats and ranges
4. **File Format:** Validates file types (text, Excel)

## Business Logic

### Total Calculation:

```javascript
Total = Amount + Other Charges + Insurance + Risk Surcharge
```

### Multiple Booking Logic:

- Generates sequential consignment numbers
- Format: {Company}{Number} (e.g., ABC001, ABC002, ...)
- Maximum 100 bookings per operation

### Excel Import Logic:

- **Format 1:** Minimal data - auto-fills defaults
- **Format 2:** Includes weights and charges
- **Format 3:** Complete data - uses provided amount or calculates from rate master

## Status Tracking

Bookings are automatically tracked in the `tracking` table:

**Initial Status:**

- Status: "Booked"
- Location: "Origin"
- Remarks: "Consignment booked successfully"

## Future Enhancements

1. **Rate Master Integration:** Auto-calculate amount based on company_rate_master table
2. **Real-time Tracking:** WebSocket updates for tracking status
3. **Barcode Generation:** Auto-generate barcodes for consignment numbers
4. **SMS/Email Notifications:** Send booking confirmation
5. **Bulk Operations:** Bulk edit, bulk delete, bulk status update
6. **Advanced Filters:** More filter options (status, mode, type, etc.)
7. **Export Options:** PDF export, formatted Excel export
8. **Print Templates:** Customizable print templates for bookings

## Testing

### Test Scenarios:

1. **Create Single Booking:**

   - Navigate to Booking > Add
   - Fill all required fields
   - Submit and verify creation

2. **Edit Booking:**

   - Navigate to Booking > Modify
   - Filter bookings
   - Edit a booking and save

3. **Update Rates:**

   - Navigate to Booking > Update Rate
   - Select date range
   - Click UpdateRate and verify

4. **Check Booking List:**

   - Navigate to Booking > Check Booking List
   - Filter by date range
   - Export to Excel and verify file

5. **Multiple Booking:**

   - Navigate to Booking > Multiple Booking
   - Enter range (e.g., 1-10)
   - Enter company name
   - Submit and verify 10 bookings created

6. **Import Excel:**
   - Navigate to Booking > Import From Excel
   - Download Format 1 template
   - Fill with sample data
   - Upload and verify import

## Troubleshooting

### Common Issues:

1. **Migration Failed:**

   - Check if MySQL server is running
   - Verify database credentials in `.env`
   - Check for existing data conflicts

2. **File Upload Failed:**

   - Ensure `uploads/temp/` directory exists
   - Check file permissions
   - Verify file size limits

3. **Import Errors:**

   - Verify Excel format matches template
   - Check for required fields
   - Ensure no duplicate consignment numbers

4. **API Errors:**
   - Check authentication token
   - Verify franchise_id in user session
   - Check network connectivity

## Security Considerations

1. **Authentication:** All endpoints require valid JWT token
2. **Authorization:** Users can only access their franchise bookings
3. **File Upload:** Validate file types and sizes
4. **SQL Injection:** Use parameterized queries
5. **XSS Protection:** Sanitize user inputs

## Performance Optimization

1. **Pagination:** Implemented for large datasets
2. **Indexes:** Added on franchise_id, booking_date, consignment_number
3. **Batch Operations:** Use transactions for multiple bookings
4. **File Processing:** Process large Excel files in chunks
5. **Caching:** Consider Redis for frequently accessed data

## Conclusion

The Booking module is now fully implemented with all 9 pages matching the reference images from frbilling.com. The system supports:

- ✅ Single and multiple booking creation
- ✅ Booking modification and updates
- ✅ Rate updates for date ranges
- ✅ Comprehensive booking lists and filters
- ✅ Multiple import formats (Text, Excel, CashCounter)
- ✅ Template downloads for easy data entry
- ✅ Export functionality (Excel, Print)
- ✅ Status tracking and history

All pages are integrated with the backend API and follow the design patterns established in the existing application.
