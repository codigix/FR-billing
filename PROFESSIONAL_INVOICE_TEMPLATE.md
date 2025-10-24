# 🎨 Professional Invoice Template Guide - Codigix Infotech

## ✨ What's New

Your invoice template has been completely redesigned with professional branding for **Codigix Infotech**. The new template includes:

### 📋 Features

| Feature                  | Details                                         |
| ------------------------ | ----------------------------------------------- |
| **Logo**                 | Codigix Infotech brand mark (CX) with gradient  |
| **Company Branding**     | Professional header with company name & tagline |
| **Three-Column Layout**  | FROM, BILL TO, PAYMENT details at a glance      |
| **Items Table**          | Description, Consignment #, Qty, Amount         |
| **Financial Summary**    | Subtotal, Discount, GST, Total, Balance Due     |
| **Notes & Terms**        | Payment terms and special notes                 |
| **Footer**               | Contact details, email, website                 |
| **Watermark**            | "CODIGIX" background watermark                  |
| **Professional Styling** | Blue gradient theme, modern typography          |
| **Print-Ready**          | Optimized for printing and PDF export           |

---

## 🎯 Template Structure

```
┌─────────────────────────────────────────────┐
│  [CX Logo]  CODIGIX INFOTECH    INVOICE    │
│             Billing Solutions      INV-001 │
│             Logistics Services      Date   │
├─────────────────────────────────────────────┤
│ FROM              BILL TO           PAYMENT │
│ Franchise         Customer Name     UNPAID  │
│ Address           Address           Amount  │
│ Phone, GST        Phone, GST        Balance │
├─────────────────────────────────────────────┤
│ Description | Consignment # | Qty | Amount │
│             |               |     |        │
├─────────────────────────────────────────────┤
│                     NOTES | SUMMARY BOX    │
│                           │ Subtotal      │
│ Terms & Conditions       │ GST           │
│                           │ TOTAL         │
│                           │ Balance Due   │
├─────────────────────────────────────────────┤
│ Contact     | Phone       | Address       │
│ Email info  | +91 XXXXX   | Codigix      │
├─────────────────────────────────────────────┤
│         Authorized Sig    For Codigix      │
└─────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Brand Colors

```
Primary Blue:      #1e40af (Dark Blue)
Light Blue:        #0f86e5 (Accent)
Gradient:          #1e40af → #0f86e5
Text Dark:         #333333
Text Light:        #666666
Success:           #22c55e
Warning:           #f59e0b
Error/Balance:     #dc2626
Background:        #f9f9f9
```

### Usage

- **Headers & Titles**: Primary Blue (#1e40af)
- **Table Headers**: Gradient Blue (Primary → Light)
- **Total Amount**: Gradient Background with White Text
- **Balance Due**: Red (#dc2626) for emphasis
- **Watermark**: Very light (10% opacity)

---

## 📝 Customization Guide

### 1. Update Company Information

Edit the footer section in template to add your actual company details:

```ejs
<div class="footer-content">
  <div class="footer-item">
    <h5>📧 Email</h5>
    <p>info@codigixinfotech.com</p>
    <p>support@codigixinfotech.com</p>
  </div>
  <div class="footer-item">
    <h5>📞 Contact</h5>
    <p>+91 (0) XXXX XXXX XXX</p>
    <p>www.codigixinfotech.com</p>
  </div>
  <div class="footer-item">
    <h5>🏢 Address</h5>
    <p>Codigix Infotech Pvt. Ltd.</p>
    <p>Professional Logistics Services</p>
  </div>
</div>
```

**TODO**: Replace with your actual contact details

### 2. Add Real Company Logo

To replace the "CX" logo with your actual logo:

**Option A: Using Image File**

```html
<div class="logo">
  <img
    src="/path/to/logo.png"
    alt="Codigix Logo"
    style="width: 100%; height: 100%; object-fit: contain;"
  />
</div>
```

**Option B: Keep Current Logo & Customize**

Edit the `.logo` CSS:

```css
.logo {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1e40af, #0f86e5); /* Change colors */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 24px;
}
```

### 3. Update Default Terms & Conditions

```ejs
<% if (invoice.terms_conditions) { %>
<h4 style="margin-top: 15px">⚖️ Terms & Conditions</h4>
<p style="margin-top: 8px"><%= invoice.terms_conditions %></p>
<% } %>
```

**Sample Default Terms:**

```
Payment Terms:
• Payment is due within 30 days from invoice date
• Late payment will attract interest @ 18% per annum
• GST as applicable will be charged additionally
• All disputes subject to jurisdiction of [Your City]
```

### 4. Change Brand Colors

Search and replace all instances of:

- `#1e40af` → Your Primary Color
- `#0f86e5` → Your Secondary/Accent Color
- `#dc2626` → Your Error/Alert Color

Example: To use green theme:

```css
/* Change from blue to green */
#1e40af → #059669 (Primary Green)
#0f86e5 → #10b981 (Light Green)
```

### 5. Customize Watermark

Current: "CODIGIX"

```ejs
<div class="watermark">CODIGIX</div>
```

Change to:

```ejs
<div class="watermark">YOUR_COMPANY_NAME</div>
```

---

## 📊 Data Fields Used

### Invoice Data

| Field              | Example         | Notes                           |
| ------------------ | --------------- | ------------------------------- |
| `invoice_number`   | INV/2025/0001   | From invoices table             |
| `invoice_date`     | 2025-01-15      | Formatted to Indian date format |
| `due_date`         | 2025-02-15      | Optional                        |
| `customer_name`    | ABC Company     | From invoices table             |
| `customer_address` | Mumbai, India   | Optional                        |
| `customer_phone`   | +91-9876543210  | Optional                        |
| `customer_gst`     | 27AABCU9603R1Z5 | Optional                        |
| `subtotal`         | 10000.00        | Total before tax                |
| `discount`         | 500.00          | Optional discount               |
| `gst_amount`       | 1800.00         | 18% or custom rate              |
| `total_amount`     | 12300.00        | Final amount                    |
| `paid_amount`      | 0.00            | Amount paid                     |
| `balance_amount`   | 12300.00        | Amount due                      |
| `payment_status`   | unpaid          | paid, unpaid, partial, overdue  |
| `notes`            | Notes here...   | Custom notes                    |
| `terms_conditions` | Terms here...   | Payment terms                   |

### Franchise Data

| Field        | Example         | Notes                 |
| ------------ | --------------- | --------------------- |
| `name`       | Main Franchise  | From franchises table |
| `address`    | New Delhi       | Optional              |
| `phone`      | +91-1234567890  | Optional              |
| `gst_number` | 07AABCU9603R1Z5 | Optional              |

### Booking Data

| Field                 | Example          | Notes                  |
| --------------------- | ---------------- | ---------------------- |
| `consignment_number`  | CN2025_001       | From bookings table    |
| `content_description` | Document Courier | Service type           |
| `qty`                 | 1                | Quantity               |
| `amount`              | 500.00           | Line item amount       |
| `total_amount`        | 500.00           | Total for this booking |

---

## 🖨️ Printing & PDF Export

### For Print

1. **Open Invoice**: Display the invoice in browser
2. **Print Settings**:
   - Paper Size: A4
   - Margins: Default (25mm)
   - Scale: 100%
3. **Click Print** or Press Ctrl+P
4. **Save as PDF** from printer dialog

### Browser Compatibility

| Browser | Status  | Notes               |
| ------- | ------- | ------------------- |
| Chrome  | ✅ Best | Best print quality  |
| Firefox | ✅ Good | Good print output   |
| Safari  | ✅ Good | Works well on Mac   |
| Edge    | ✅ Good | Windows recommended |

---

## 📁 File Location

```
Backend:
c:\Users\admin\Desktop\inventory\FR-billing\FR-billing\
└── backend
    └── src
        └── templates
            └── invoice.ejs  ← Main template file
```

---

## 🔧 Technical Details

### Template Engine

- **Language**: EJS (Embedded JavaScript Templates)
- **Rendering**: Done by backend before download
- **CSS**: Embedded in HTML for PDF compatibility

### Dynamic Content

Template automatically fills:

```ejs
<%= invoice.invoice_number %>      <!-- Shows invoice number -->
<%= invoice.total_amount %>         <!-- Shows total -->
<% if (invoice.notes) { %>          <!-- Show if exists -->
  <p><%= invoice.notes %></p>
<% } %>
```

---

## 🎯 Best Practices

### ✅ Do's

- ✅ Keep margins adequate for printing
- ✅ Test print before using in production
- ✅ Use consistent date format (Indian)
- ✅ Ensure all images are embedded or base64 encoded
- ✅ Test with different amounts to see layout
- ✅ Update company details periodically

### ❌ Don'ts

- ❌ Don't change table structure without testing
- ❌ Don't remove security fields
- ❌ Don't add external links/fonts (use web-safe fonts)
- ❌ Don't modify CSS grid without understanding layout
- ❌ Don't use too large images for logo

---

## 📞 Download Flow

### How Invoices Are Generated

```
User Action: Click Download in Chat
    ↓
Frontend: Send download request with invoice file name
    ↓
Backend: Authenticate JWT token
    ↓
Backend: Check if file exists in /backend/invoices/
    ↓
Backend: Render EJS template with data from database
    ↓
Backend: Generate HTML (or convert to PDF)
    ↓
Backend: Send to browser
    ↓
Browser: Download as PDF file
```

---

## 🚀 Next Steps

1. **Customize Colors**: Update brand colors (if needed)
2. **Update Contact Details**: Add real email and phone
3. **Add Logo**: Replace "CX" with actual company logo
4. **Update Terms**: Add your payment terms
5. **Test Print**: Generate test invoice and print
6. **Deploy**: Push to production

---

## 📝 Sample Invoice Data

For testing, here's what a complete invoice looks like:

```json
{
  "invoice": {
    "invoice_number": "INV/2025/0001",
    "invoice_date": "2025-01-15",
    "due_date": "2025-02-15",
    "customer_name": "ABC Company Pvt Ltd",
    "customer_address": "Mumbai, Maharashtra",
    "customer_phone": "+91-9876543210",
    "customer_gst": "27AABCU9603R1Z5",
    "subtotal": 10000.0,
    "discount": 500.0,
    "gst_amount": 1800.0,
    "total_amount": 12300.0,
    "paid_amount": 0.0,
    "balance_amount": 12300.0,
    "payment_status": "unpaid",
    "notes": "Invoice for consignment services",
    "terms_conditions": "Payment due within 30 days"
  },
  "franchise": {
    "name": "Codigix Infotech Main Branch",
    "address": "New Delhi, India",
    "phone": "+91-1234567890",
    "gst_number": "07AABCU9603R1Z5"
  },
  "bookings": [
    {
      "consignment_number": "CN2025_001",
      "content_description": "Document Courier Service",
      "qty": 1,
      "amount": 5000.0,
      "total_amount": 5000.0
    }
  ]
}
```

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] Template renders without errors
- [ ] All company details are correct
- [ ] Logo displays properly
- [ ] Colors match brand guidelines
- [ ] Prints correctly on A4 paper
- [ ] PDF file downloads successfully
- [ ] All amounts calculate correctly
- [ ] Payment status displays correctly
- [ ] Footer information is complete
- [ ] Watermark is visible but not intrusive
- [ ] Works on all major browsers
- [ ] Mobile responsive (if needed)

---

## 🎓 Tutorial: Creating Your First Professional Invoice

### Step 1: Database Setup (Already Done ✅)

Invoice ID is linked to consignments:

```sql
ALTER TABLE bookings ADD COLUMN invoice_id VARCHAR(255) NULL;
UPDATE bookings SET invoice_id = '2025_001' WHERE id = 1;
```

### Step 2: Add Consignment to Invoice

When creating an invoice in the system:

```sql
INSERT INTO invoices (franchise_id, invoice_number, invoice_date, customer_name, ...)
VALUES (1, 'INV/2025/0001', '2025-01-15', 'ABC Company', ...);

INSERT INTO invoice_items (invoice_id, booking_id, description, amount, ...)
VALUES (1, 3, 'Consignment Service', 5000, ...);
```

### Step 3: Download from Chatbot

1. Open chatbot
2. Enter consignment number: `CN20240001`
3. Click **⬇ Download Invoice**
4. File downloads as PDF

### Step 4: Customize & Print

1. Open downloaded PDF
2. Verify all details
3. Print or share
4. Done! ✅

---

## 💡 Pro Tips

1. **Branding**: Update all company details before launch
2. **Testing**: Create a test invoice with various amounts
3. **Consistency**: Use same format for all invoices
4. **Backup**: Keep original template as backup
5. **Updates**: Review quarterly and update as needed

---

## 📞 Support

For issues or questions:

1. Check template rendering in browser
2. Verify database has correct values
3. Test print functionality
4. Check console for JavaScript errors
5. Verify file permissions in /backend/invoices/ folder

---

**Template Version**: 2.0  
**Last Updated**: January 2025  
**Company**: Codigix Infotech Pvt. Ltd.

✨ **Your professional invoice template is ready!** ✨
