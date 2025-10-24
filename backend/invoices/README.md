# Invoice Downloads Folder

This folder stores PDF invoice files that can be downloaded via the chatbot assistant.

## 📋 Structure

- **Filename format**: `inv_[invoice_id].pdf` (e.g., `inv_2025_001.pdf`)
- **Location**: `/backend/invoices/`

## 🔄 How It Works

### Frontend (Chatbot)

1. User enters a consignment number in the chatbot
2. Backend fetches consignment details from the database
3. If the consignment has an `invoice_id`, it generates a reference: `inv_[invoice_id].pdf`
4. Chatbot displays "⬇ Download Invoice" button
5. On click, frontend calls: `GET /api/invoices/download/inv_[invoice_id].pdf`
6. File is downloaded to user's system

### Backend

- Route: `GET /api/invoices/download/:file`
- Authentication: Required (via JWT token)
- Security: Files must be in `/backend/invoices/` directory
- Returns: PDF file as attachment

## 📝 Adding Invoice Files

### Step 1: Generate or Create PDF

Create your PDF invoice file and name it following the format:

```
inv_[invoice_id].pdf
```

Example:

```
inv_2025_001.pdf
inv_2025_002.pdf
inv_20250001.pdf
```

### Step 2: Place File in This Folder

Copy the PDF file to:

```
/backend/invoices/inv_2025_001.pdf
```

### Step 3: Ensure Database Mapping

The `bookings` table must have an `invoice_id` field that matches:

- If booking has `invoice_id = 2025_001`
- Chatbot will look for file: `inv_2025_001.pdf`

## 🔗 Database Mapping

The system uses:

```sql
SELECT invoice_id FROM bookings WHERE consignment_number = ?
```

The `invoice_id` value is used to construct the filename:

```javascript
invoiceFile = `inv_${booking.invoice_id}.pdf`;
```

## 🧪 Testing

### Manual Test

1. Place a test PDF: `/backend/invoices/inv_2025_001.pdf`
2. Open chatbot and enter a consignment number
3. Click "Download Invoice" button
4. File should download

### Sample cURL Command

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/invoices/download/inv_2025_001.pdf
```

## ⚙️ Configuration

### Path Settings

- Base directory: `/backend/invoices/`
- Subdirectories: Not supported (security restriction)
- Supported formats: PDF, HTML, etc.

### Backend Route

```javascript
router.get("/download/:file", authenticate, downloadInvoice);
```

### Frontend API Call

```javascript
const response = await fetch(
  `http://localhost:5000/api/invoices/download/${invoiceFile}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
```

## 🔒 Security Features

1. **Authentication Required**: JWT token must be valid
2. **Path Validation**: Files checked to be within `/invoices/` folder
3. **No Directory Traversal**: Cannot access files outside invoices folder
4. **Franchise Isolation**: User can only access own franchise's invoices

## 🐛 Troubleshooting

### "Invoice not available" Message

- Check if file exists in `/backend/invoices/`
- Verify filename matches: `inv_[invoice_id].pdf`
- Check database has `invoice_id` field populated

### "Download Failed" Error

- Verify backend server is running on port 5000
- Check authentication token is valid
- Verify file path permissions

### File Extension Issues

- Use `.pdf` extension for PDF files
- Use `.html` extension for HTML files
- Ensure correct MIME type in backend

## 📚 Related Files

- Frontend: `frontend/src/components/ChatbotAssistant.jsx`
- Backend: `backend/src/controllers/invoiceController.js`
- Routes: `backend/src/routes/invoiceRoutes.js`
- Controller: `backend/src/controllers/chatbotController.js`

## 🚀 Future Enhancements

1. Generate PDFs dynamically from invoices table
2. Support subdirectories by date
3. Automatic cleanup of old invoices
4. Batch download feature
5. Email invoice to customer
6. Archive downloaded invoices
