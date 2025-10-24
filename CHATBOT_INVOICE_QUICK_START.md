# ⚡ Chatbot Invoice Download - Quick Start

## 🎯 5-Minute Setup

### ✅ Prerequisites Completed

- ✓ Frontend modified with download button
- ✓ Backend routes added
- ✓ `/backend/invoices/` folder created
- ✓ Database schema updated

### 🔧 Step-by-Step Setup

#### Step 1: Update Bookings Database (1 minute)

Your bookings need an `invoice_id` field. Run this SQL:

```sql
-- Check if column exists
SHOW COLUMNS FROM bookings WHERE Field = 'invoice_id';

-- If not, add it:
ALTER TABLE bookings ADD COLUMN invoice_id VARCHAR(255) NULL;

-- Add sample invoice IDs:
UPDATE bookings SET invoice_id = '2025_001' WHERE consignment_number = 'CN20240001' LIMIT 1;
UPDATE bookings SET invoice_id = '2025_002' WHERE consignment_number LIKE 'CN%' LIMIT 1 OFFSET 1;
```

#### Step 2: Create Sample Invoice Files (2 minutes)

Create PDF files with this naming format:

**File**: `/backend/invoices/inv_2025_001.pdf`

Or if you don't have PDF files yet, use text files for testing:
**File**: `/backend/invoices/inv_2025_001.pdf` (can be any binary file)

**Quick Alternative**: Use these commands to create test files:

```powershell
# Windows - Create test PDF files
New-Item -Path "c:\Users\admin\Desktop\inventory\FR-billing\FR-billing\backend\invoices\inv_2025_001.pdf" -ItemType File
New-Item -Path "c:\Users\admin\Desktop\inventory\FR-billing\FR-billing\backend\invoices\inv_2025_002.pdf" -ItemType File
```

Or add real invoice PDFs by exporting from your invoice generator.

#### Step 3: Restart Backend (30 seconds)

```bash
# Stop the server
# Then restart:
npm start
```

#### Step 4: Test in Chat (1 minute)

1. Open dashboard (login if needed)
2. Find floating chat widget (bottom-right)
3. Enter a consignment number: `CN20240001`
4. See consignment details appear
5. Look for "⬇ Download Invoice" button
6. Click it
7. File should download

## 🧪 Testing Scenarios

### ✅ Scenario 1: Download Success

```
Expected:
1. Enter consignment number in chat
2. Bot shows details
3. "⬇ Download Invoice" button appears
4. Click button
5. Shows "⏳ Downloading..."
6. File downloads
7. Chat shows "✅ Download Complete!"
```

### ✅ Scenario 2: No Invoice for Consignment

```
Expected:
1. Enter consignment number without invoice_id
2. Bot shows details
3. NO download button appears
```

### ✅ Scenario 3: File Not Found

```
Expected:
1. Enter consignment with invoice_id
2. But file doesn't exist in /backend/invoices/
3. Click download
4. Shows "❌ Download Failed - Invoice not available"
```

## 📋 Verification Checklist

- [ ] Backend running on port 5000
- [ ] `/backend/invoices/` folder exists
- [ ] At least one invoice PDF file in folder (e.g., `inv_2025_001.pdf`)
- [ ] Booking record has `invoice_id` value (e.g., '2025_001')
- [ ] Frontend is running
- [ ] User is logged in
- [ ] Chat widget shows download button for consignment with invoice_id

## 🚀 Deploy to Production

1. Build frontend:

```bash
cd frontend
npm run build
```

2. Copy built files:

```bash
# Built files in: frontend/dist/
```

3. Restart backend:

```bash
cd backend
npm start
```

4. Test in production environment

## 🔍 Debug Commands

### Check if file exists

```powershell
Test-Path "c:\Users\admin\Desktop\inventory\FR-billing\FR-billing\backend\invoices\inv_2025_001.pdf"
```

### Check database

```sql
-- Verify bookings have invoice_id
SELECT consignment_number, invoice_id FROM bookings WHERE invoice_id IS NOT NULL LIMIT 5;

-- Add invoice_id if missing
UPDATE bookings SET invoice_id = '2025_001' WHERE id = 1;
```

### Check backend logs

```powershell
# Terminal output shows logs as server runs
# Look for any error messages when download is attempted
```

### Browser console

```javascript
// F12 → Console tab
// Try this to test API:
fetch("http://localhost:5000/api/invoices/download/inv_2025_001.pdf", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})
  .then((r) => r.blob())
  .then((b) => console.log("Success!", b));
```

## 📱 Mobile Testing

1. Open app on mobile device
2. Navigate to chat widget
3. Enter consignment number
4. Tap "⬇ Download Invoice"
5. File downloads to device's downloads folder

## 🎨 Customization Options

### Change Button Text

Edit `ChatbotAssistant.jsx` line ~321:

```javascript
<Download size={14} />
Download Invoice  // ← Change this text
```

### Change Button Color

Edit `ChatbotAssistant.jsx` line ~303 className:

```javascript
// Current: uses inherited colors
// To change, add custom color class:
className = "... bg-blue-500 text-white ...";
```

### Add More File Formats

Edit `invoiceController.js` line ~837:

```javascript
// Support .pdf, .xlsx, .docx, etc:
res.setHeader("Content-Type", "application/pdf");
// Change based on file extension
```

## 📊 Expected API Responses

### Success Response

```
Status: 200 OK
Content-Type: application/pdf
Body: Binary PDF file content
```

### File Not Found

```json
{
  "success": false,
  "message": "Invoice file not found"
}
```

### Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## 🆘 Common Issues & Solutions

| Issue                  | Solution                                   |
| ---------------------- | ------------------------------------------ |
| No download button     | Check invoice_id in database               |
| "File not found"       | Verify file exists in `/backend/invoices/` |
| "Downloading..." stuck | Restart backend, check port 5000           |
| Unauthorized error     | Login again, check token                   |
| Wrong file downloaded  | Check filename matches pattern             |

## 💡 Pro Tips

1. **Use consistent naming**: Always use `inv_[ID].pdf` format
2. **Test with small files**: Start with small PDFs to verify it works
3. **Check file permissions**: Ensure files are readable
4. **Monitor server logs**: Watch for errors as you test
5. **Clear browser cache**: If changes don't appear, clear cache
6. **Use browser DevTools**: F12 to debug and monitor requests

## 📚 Next Steps

After successful test:

1. Add more invoice PDFs to `/backend/invoices/`
2. Update all bookings with invoice_id values
3. Deploy to production
4. Monitor user feedback
5. Consider auto-generating PDFs (see advanced guide)

## 🎓 Learning Resources

- [Full Implementation Guide](./CHATBOT_INVOICE_DOWNLOAD_GUIDE.md)
- [ChatBot Architecture](./CHATBOT_ARCHITECTURE.md)
- [Backend API Reference](./BACKEND_DATA_FLOW_REFERENCE.md)

---

**Last Updated**: October 24, 2025
**Status**: ✅ Ready to Test
