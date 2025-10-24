# ⚡ Invoice Template - Quick Start (2 Minutes)

## 🎯 What You Have Now

✅ Professional invoice template with **Codigix Infotech** branding  
✅ Modern design with logo, colors, and company details  
✅ Automatic data population from database  
✅ Ready for download from chatbot  
✅ Print-ready and PDF-compatible

---

## 🚀 Quick Setup

### Step 1: Verify Template (30 seconds)

Template is already updated at:

```
backend/src/templates/invoice.ejs
```

### Step 2: Test Invoice Download (1 minute)

1. Open your dashboard
2. Open the chatbot (bottom-right)
3. Enter: `CN20240001`
4. Click **⬇ Download Invoice** button
5. File downloads automatically ✅

### Step 3: Customize (30 seconds - Optional)

Edit `backend/src/templates/invoice.ejs` and update:

```html
<!-- Line 482-484: Update Email -->
<p>info@YOUR_EMAIL.com</p>
<p>support@YOUR_EMAIL.com</p>

<!-- Line 487: Update Phone -->
<p>+91 (Your Phone Number)</p>

<!-- Line 488: Update Website -->
<p>www.yourwebsite.com</p>

<!-- Line 491-493: Update Address -->
<p>Your Company Pvt. Ltd.</p>
<p>Your Service Description</p>
```

---

## 📋 Template Features

| Feature           | Status   | Details                        |
| ----------------- | -------- | ------------------------------ |
| Company Logo      | ✅ Ready | "CX" blue gradient logo        |
| Company Name      | ✅ Ready | CODIGIX INFOTECH               |
| Branding          | ✅ Ready | Blue theme with gradient       |
| Header            | ✅ Ready | Invoice #, Date, Due Date      |
| From/To Section   | ✅ Ready | Franchise and Customer details |
| Items Table       | ✅ Ready | Consignment details            |
| Financial Summary | ✅ Ready | Subtotal, GST, Total, Balance  |
| Footer            | ✅ Ready | Contact info, address          |
| Watermark         | ✅ Ready | "CODIGIX" background           |
| Print-Ready       | ✅ Ready | Optimized for printing         |

---

## 🎨 Current Color Scheme

```
Primary:    #1e40af (Dark Blue)
Accent:     #0f86e5 (Light Blue)
Gradient:   Dark Blue → Light Blue
Error:      #dc2626 (Red for Balance)
Background: #f9f9f9 (Light Gray)
```

### Change Colors

To use different colors, find and replace:

- `#1e40af` → Your primary color
- `#0f86e5` → Your accent color
- `#dc2626` → Your error/alert color

---

## 📝 What's Displayed

### Invoice Header

- Invoice number (auto-generated)
- Invoice date
- Due date

### Company Details (3 Columns)

```
FROM                BILL TO             PAYMENT
├ Franchise name     ├ Customer name      ├ Payment status
├ Address            ├ Address            ├ Total amount
├ Phone              ├ Phone              ├ Paid amount
└ GST                └ GST                └ Balance due
```

### Line Items Table

```
Description | Consignment # | Qty | Amount
```

### Financial Summary

```
Subtotal:    ₹10,000.00
Discount:    -₹500.00
GST (18%):   ₹1,800.00
───────────────────────
TOTAL:       ₹12,300.00
Balance:     ₹12,300.00
```

### Footer

- Email addresses
- Phone number
- Website
- Company address
- Generated timestamp

---

## 🖨️ Print Instructions

### In Browser

1. **Open Invoice** in your browser
2. **Press**: `Ctrl+P` (Windows) or `Cmd+P` (Mac)
3. **Settings**:
   - Paper: A4
   - Margins: Default
   - Scale: 100%
4. **Save as PDF** or **Print**

### Recommended Settings

| Setting     | Value          |
| ----------- | -------------- |
| Paper Size  | A4             |
| Orientation | Portrait       |
| Margins     | 25mm (default) |
| Scale       | 100%           |
| Color       | Color          |

---

## 📊 Sample Invoice Sections

### Logo Section

```
[CX Logo]  CODIGIX INFOTECH        INVOICE
           Billing Solutions         INV/2025/0001
           Logistics Services        Date: Jan 15, 2025
```

### Details Section

```
FROM                BILL TO              PAYMENT
Franchise Branch    ABC Company          UNPAID
New Delhi          Mumbai                Amount: ₹10,000
Ph: 1234567890     Ph: 9876543210       Paid: ₹0
GST: 07XXXXX       GST: 27XXXXX         Balance: ₹10,000
```

### Items Section

```
Description              | Consignment # | Qty | Amount
Document Courier Service | CN2025_001    | 1   | ₹5,000
Express Delivery         | CN2025_002    | 1   | ₹5,000
```

### Summary Section

```
SUMMARY                    NOTES & TERMS
Subtotal: ₹10,000         Notes: Invoice for services
Discount: -₹500
GST: ₹1,800               Terms: Due within 30 days
TOTAL: ₹12,300
Balance: ₹12,300
```

---

## ✨ Next Enhancements (Optional)

| Enhancement           | Effort | Impact     |
| --------------------- | ------ | ---------- |
| Add real logo image   | 5 min  | ⭐⭐⭐⭐⭐ |
| Update contact info   | 2 min  | ⭐⭐⭐⭐   |
| Change color scheme   | 10 min | ⭐⭐⭐     |
| Add company signature | 5 min  | ⭐⭐⭐     |
| Custom watermark      | 2 min  | ⭐⭐       |

---

## 🔍 Troubleshooting

### Invoice looks blank?

- Check: Database has invoice data
- Check: Franchise details exist
- Check: Customer name is filled

### Download button not showing?

- Bookings must have `invoice_id` set
- Example: `invoice_id = '2025_001'`

### Amounts showing as ₹0?

- Check: Invoice has subtotal/total values
- Check: Bookings have amount values

### Colors not updating?

- Restart backend: `npm start`
- Clear browser cache: `Ctrl+Shift+Delete`

### Print quality poor?

- Use Chrome (best results)
- Scale: 100%
- Margins: Default

---

## 📱 Mobile-Friendly

The template includes:

- ✅ Responsive design
- ✅ Mobile-friendly tables
- ✅ Touch-friendly buttons
- ✅ Readable on all devices

Test on phone by:

1. Open invoice on mobile
2. Tap **⋯** (menu)
3. Select **Print**
4. Choose **Save as PDF**

---

## ✅ Checklist

Before using in production:

- [ ] Download works from chatbot
- [ ] Invoice displays correctly
- [ ] All amounts show properly
- [ ] Print preview looks good
- [ ] Company details are correct
- [ ] Colors match brand
- [ ] No errors in console
- [ ] Works on mobile

---

## 📞 Quick References

### File Locations

```
Template:  backend/src/templates/invoice.ejs
Invoices:  backend/invoices/inv_[id].pdf
Docs:      PROFESSIONAL_INVOICE_TEMPLATE.md
```

### API Endpoints

```
View Invoice:    GET /invoices/:id/download
Download File:   GET /invoices/download/:file
Chat Consignment: POST /api/chatbot
```

### Database Tables

```
invoices       - Invoice records
invoice_items  - Line items
bookings       - Consignments
franchises     - Company details
```

---

## 🎓 How It Works

```
1. User enters consignment in chat
   ↓
2. Backend finds booking with invoice_id
   ↓
3. User clicks "Download Invoice"
   ↓
4. Backend renders EJS template with data
   ↓
5. Template shows company info, items, totals
   ↓
6. Browser downloads as PDF
   ↓
7. User prints or shares ✅
```

---

## 🚀 You're All Set!

Your professional invoice template is ready to use:

✅ Professional design with Codigix Infotech branding  
✅ Automatic data from database  
✅ Download from chatbot  
✅ Print-ready and PDF-compatible  
✅ Fully customizable

**Start using it now:**

1. Open chatbot
2. Enter consignment number
3. Click Download Invoice
4. Done! 📥

---

**Need more details?** Read: `PROFESSIONAL_INVOICE_TEMPLATE.md`

Happy invoicing! 📄✨
