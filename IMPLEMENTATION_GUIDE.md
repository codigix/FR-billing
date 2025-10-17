# FR Billing - Implementation Guide

## 🎯 Overview

This implementation adds complete **Franchisee Management**, **Booking/Consignment**, and **Invoice Generation** functionality to your FR Billing system, inspired by the reference website (frbilling.com).

## 📋 What's Been Implemented

### 1. **Franchisee Management Module**

- ✅ Complete CRUD operations for franchises
- ✅ Enhanced franchise table with all required fields:
  - Basic Info: FR Code, Name, Owner, Email, Phone, WhatsApp
  - Address: Full address with City, State, Pincode
  - Tax Details: GST, CST, PAN, Service Tax numbers
  - Bank Details: Account Number, IFSC, Bank Name, Branch, Account Type
  - Service Charges: PDF Service Charge, Non-Dest Charge
  - Verification Flags: GST Verified, Approved Receiver, Use as Consignor
  - Subscription Management: Start/End dates, Status
- ✅ List view with search, filters, and pagination
- ✅ Create/Edit form with all fields organized in sections
- ✅ Status management (Active, Inactive, Suspended)

### 2. **Booking/Consignment Module**

- ✅ Comprehensive booking form with:
  - Auto-generated Booking & Consignment numbers
  - Sender Details (Name, Phone, Address, Pincode, City, State)
  - Receiver Details (Name, Phone, Address, Pincode, City, State)
  - Package Details (Service Type, Weight, Pieces, Content, Declared Value)
  - Billing Details (Freight, Fuel Surcharge, GST, Other Charges)
  - Payment Details (Mode, Status, Paid Amount)
- ✅ Auto-calculation of GST (18%) and Total Amount
- ✅ Real-time charge calculations
- ✅ Payment status tracking

### 3. **Invoice Generation Module**

- ✅ Generate invoices from scratch or from bookings
- ✅ Customer information management
- ✅ Dynamic item addition/removal
- ✅ Add items from unpaid bookings
- ✅ Auto-calculation of:
  - Subtotal
  - Discount
  - GST (18%)
  - Total Amount
- ✅ Notes & Terms & Conditions
- ✅ Modal for selecting bookings

## 🔧 Backend Implementation

### New Files Created:

1. **Migration**: `backend/migrations/20240101000011_enhance_franchises_table.cjs`
2. **Controller**: `backend/src/controllers/franchiseController.js`
3. **Routes**: `backend/src/routes/franchiseRoutes.js`
4. **Updated**: `backend/src/routes/index.js` (added franchise routes)

### API Endpoints Added:

```
GET    /api/franchises              - List all franchises (with pagination & search)
GET    /api/franchises/:id          - Get franchise by ID with statistics
POST   /api/franchises              - Create new franchise
PUT    /api/franchises/:id          - Update franchise
DELETE /api/franchises/:id          - Delete franchise
PATCH  /api/franchises/:id/status   - Toggle franchise status
```

## 🎨 Frontend Implementation

### New Pages Created:

1. **FranchiseListPage.jsx** - List/manage franchises
2. **FranchiseFormPage.jsx** - Create/edit franchise (comprehensive form)
3. **BookingFormPage.jsx** - Create consignment/booking
4. **InvoiceGeneratePage.jsx** - Generate invoices

### Routes Added:

```
/franchises              - List franchises
/franchises/create       - Create new franchise
/franchises/edit/:id     - Edit franchise
/bookings/create         - Create booking/consignment
/invoices/generate       - Generate invoice
```

## 🚀 Setup Instructions

### Step 1: Run Database Migration

```bash
cd backend
npx knex migrate:latest
```

This will add the following columns to the `franchises` table:

- `cst_number`
- `pan_number`
- `service_tax_number`
- `account_number`
- `ifsc_code`
- `bank_name`
- `branch_name`
- `account_type`
- `pdf_service_charge`
- `non_dest_charge`
- `is_gst_verified`
- `is_approved_receiver`
- `use_as_consignor`
- `franchisee_remarks`

### Step 2: Install Dependencies (if needed)

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 3: Start the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

## 📱 Usage Guide

### Managing Franchises

1. **Navigate to Franchises**

   - Click on "Franchises" in the sidebar or navigate to `/franchises`

2. **Create New Franchise**

   - Click "Add New Franchisee" button
   - Fill in all required fields (marked with \*)
   - Submit to create

3. **Edit Franchise**

   - Click "Edit" button in the franchise list
   - Update any fields
   - Save changes

4. **Change Status**

   - Use the status dropdown in the list to change franchise status
   - Options: Active, Inactive, Suspended

5. **Delete Franchise**
   - Click "Delete" button (only allowed if no bookings exist)

### Creating Bookings/Consignments

1. **Navigate to Bookings**

   - Go to `/bookings/create`

2. **Fill Booking Details**

   - Booking and Consignment numbers are auto-generated
   - Enter sender details
   - Enter receiver details
   - Add package information
   - Enter freight charges
   - GST and total are auto-calculated

3. **Submit Booking**
   - Review all details
   - Submit to create booking

### Generating Invoices

1. **Navigate to Invoice Generation**

   - Go to `/invoices/generate`

2. **Enter Customer Details**

   - Fill in customer information

3. **Add Items**

   - Option 1: Click "Add Item" to manually add items
   - Option 2: Click "Add from Bookings" to select unpaid bookings

4. **Review Totals**

   - Subtotal, GST, and Total are auto-calculated
   - Add discount if needed

5. **Generate Invoice**
   - Add notes and terms if needed
   - Click "Generate Invoice"

## 🔑 Key Features

### Franchisee Management

- ✅ Comprehensive franchise profiles
- ✅ Financial and tax information tracking
- ✅ Bank details management
- ✅ Service charge configuration
- ✅ Subscription tracking
- ✅ Status management

### Booking/Consignment

- ✅ Auto-generated unique numbers
- ✅ Complete sender/receiver tracking
- ✅ Package details management
- ✅ Automatic charge calculations
- ✅ Multiple payment modes
- ✅ Payment status tracking

### Invoice Generation

- ✅ Create from scratch or from bookings
- ✅ Dynamic item management
- ✅ Automatic tax calculations
- ✅ Discount support
- ✅ Notes and terms customization
- ✅ Professional invoice format

## 🔄 Process Flow

### Complete Workflow:

```
1. Franchise Setup
   ↓
2. Create Bookings/Consignments
   ↓
3. Generate Invoices from Bookings
   ↓
4. Track Payments
```

## 📊 Database Schema Updates

### Franchises Table (Enhanced)

```sql
- id (PK)
- franchise_code (unique)
- franchise_name
- owner_name
- email (unique)
- phone
- whatsapp
- address, city, state, pincode
- gst_number, cst_number, pan_number, service_tax_number
- account_number, ifsc_code, bank_name, branch_name, account_type
- pdf_service_charge, non_dest_charge
- is_gst_verified, is_approved_receiver, use_as_consignor
- subscription_start_date, subscription_end_date, subscription_status
- status
- franchisee_remarks
- timestamps
```

## 🎯 Next Steps (Optional Enhancements)

1. **Add Booking List Page** - View and manage all bookings
2. **Add Invoice List Page** - View and manage all invoices
3. **Add PDF Generation** - Generate PDF for invoices and bookings
4. **Add Email Integration** - Send invoices via email
5. **Add Dashboard Widgets** - Show franchise statistics
6. **Add Reports** - Generate various reports
7. **Add Payment Recording** - Record payments against invoices
8. **Add Tracking System** - Track consignment status

## 🐛 Troubleshooting

### Migration Issues

If migration fails, check:

- Database connection in `.env`
- Existing database structure
- Run: `npx knex migrate:rollback` and try again

### CORS Issues

If you get CORS errors:

1. Stop backend server
2. Restart backend server (to reload .env)
3. Check `CORS_ORIGIN` in `backend/.env` matches your frontend URL

### Import Errors

If you get module import errors:

- Check all file paths are correct
- Ensure all dependencies are installed
- Restart development server

## 📝 Notes

- All monetary values use decimal(10,2) for precision
- GST is calculated at 18% (CGST 9% + SGST 9%)
- Booking and consignment numbers are auto-generated using timestamp
- Invoice numbers follow pattern: INV-YYYY-####
- All forms include validation
- All list pages include pagination and search

## 🎉 Success!

You now have a complete FR Billing system with:

- ✅ Franchisee Management
- ✅ Booking/Consignment Creation
- ✅ Invoice Generation
- ✅ Payment Tracking
- ✅ Professional UI/UX

Ready to use! 🚀
