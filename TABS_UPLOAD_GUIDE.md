# Franchisee Tabs, Uploads & Sectors Guide

## 🎉 New Features Implemented

### ✅ Three-Tab Interface for Franchisee Management

Your franchisee form now has **three tabs** matching the reference website:

1. **Edit Franchisee** - Complete franchise information form
2. **Edit Sectors** - Manage delivery sectors with pincodes and service types
3. **Upload** - Upload Logo, Stamp, and QR Code images

---

## 📋 How to Use

### Step 1: Create or Edit a Franchise

1. Go to **Franchisee** in the sidebar
2. Click **"Add New Franchisee"** or click **Edit** on existing franchise
3. Fill in all required fields in the **Edit Franchisee** tab
4. Click **"Create"** or **"Update"**

### Step 2: Manage Sectors (Only after saving franchise)

1. Click on the **"Edit Sectors"** tab
2. Add sectors with:
   - **Sector Name** (e.g., "WITHIN CITY", "WITHIN STATE")
   - **Pincodes** (comma-separated or semicolon-separated)
   - **Service Types** (check applicable boxes):
     - DOX
     - NONDOX Air
     - NONDOX Sur
     - EXPRESS CARGO
     - PRIORITY
     - ECOM PRIORITY
     - ECOM GE
3. Click **"Add New"** to add more sectors
4. Click **"Save"** to save all sectors

### Step 3: Upload Images (Only after saving franchise)

1. Click on the **"Upload"** tab
2. Upload three types of images:
   - **Logo** - Will appear on invoices
   - **Stamp** - Will appear on invoices
   - **QR Code** - For payment/tracking
3. Accepted formats: **.png, .jpg, .jpeg** (max 5MB)
4. Click **"Remove"** to delete uploaded images

---

## 🗄️ Database Changes

### New Tables:

- **franchise_sectors** - Stores sector information with pincodes and service types

### Updated franchise table fields:

- `logo_url` - Path to uploaded logo
- `stamp_url` - Path to uploaded stamp
- `qr_code_url` - Path to uploaded QR code

---

## 🔌 New API Endpoints

### Upload Endpoints:

- `POST /api/uploads/franchise/:id` - Upload logo/stamp/qr_code
- `DELETE /api/uploads/franchise/:id` - Remove uploaded file

### Sector Endpoints:

- `GET /api/sectors/franchise/:franchiseId` - Get all sectors for a franchise
- `POST /api/sectors/franchise/:franchiseId` - Save sectors (bulk)
- `DELETE /api/sectors/:id` - Delete a sector

---

## 📁 File Storage

Uploaded files are stored in:

```
backend/uploads/
```

Files are accessible via:

```
http://localhost:5000/uploads/filename.jpg
```

---

## ⚠️ Important Notes

1. **Tabs are disabled until franchise is saved** - You must create/save the franchise first before accessing Sectors and Upload tabs
2. **Image formats** - Only .png, .jpg, .jpeg allowed (max 5MB)
3. **Sectors priority** - Arrange sectors in the order you want them displayed
4. **Pincodes format** - Enter pincodes separated by commas or semicolons

---

## 🧪 Testing the Features

### Test Franchisee Creation:

1. Navigate to `/franchises/create`
2. Fill required fields (FR Code, Name, Email, Owner Name)
3. Save franchise
4. You'll be redirected to edit mode

### Test Sectors:

1. Open an existing franchise in edit mode
2. Click "Edit Sectors" tab
3. Add sector: "WITHIN CITY"
4. Add pincodes: "400001, 400002, 400003"
5. Check service types (DOX, NONDOX Air)
6. Click "Save"

### Test Uploads:

1. Open an existing franchise in edit mode
2. Click "Upload" tab
3. Select a logo image
4. Wait for upload confirmation
5. Image should display with "Remove" button

---

## 🚀 Quick Start

**If backend is already running, just refresh your frontend:**

```powershell
# Frontend should auto-reload, but if not:
Set-Location "c:\Users\admin\Desktop\FRbiling\frontend"
npm run dev
```

**Access the feature:**

1. Go to http://localhost:3000
2. Login
3. Click "Franchisee" in sidebar
4. Create or edit a franchisee
5. Try all three tabs!

---

## 🎨 UI Features

- **Tab Navigation** - Clean tab interface with active state indicators
- **Disabled State** - Sectors and Upload tabs disabled until franchise is saved
- **Image Preview** - Uploaded images show preview with remove option
- **Dynamic Table** - Add/remove sector rows dynamically
- **Checkboxes** - Easy service type selection for each sector
- **Responsive** - Works on all screen sizes

---

## 🔧 Troubleshooting

### Images not uploading?

- Check file size (max 5MB)
- Check file format (.png, .jpg, .jpeg only)
- Ensure franchise is saved first

### Sectors not saving?

- Ensure franchise is created first
- Fill in sector name and pincodes
- Check at least one service type

### Backend errors?

- Check if backend is running on port 5000
- Check uploads folder exists: `backend/uploads/`
- Restart backend if needed

---

## 📦 Installed Packages

**Backend:**

- `multer` - File upload handling

All other dependencies were already available.

---

Enjoy your new franchisee management features! 🎉
