# 🎨 Invoice Visual Preview

## Visual Layout

Here's exactly how your professional invoice will look:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                           ┃
┃  ╔════╗  CODIGIX INFOTECH         ┌─────────────────────┐ ┃
┃  ║ CX ║  Billing & Inventory       │ INVOICE             │ ┃
┃  ║    ║  Professional Logistics    │ Invoice #: INV/2025│ ┃
┃  ╚════╝                             │ Date: Jan 15, 2025  │ ┃
┃                                      │ Due: Feb 15, 2025   │ ┃
┃                                      └─────────────────────┘ ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                           ┃
┃  FROM              │  BILL TO          │  PAYMENT          ┃
┃  ─────────────────┼──────────────────┼───────────────────┃
┃  Main Franchise   │  ABC Company      │  UNPAID           ┃
┃  New Delhi        │  Mumbai           │  Amount: ₹10,000  ┃
┃  Ph: 1234567890   │  Ph: 9876543210   │  Paid: ₹0         ┃
┃  GST: 07XXXXX     │  GST: 27XXXXX     │  Balance: ₹10,000 ┃
┃                                        │                   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                           ┃
┃  DESCRIPTION              CONSIGNMENT  QTY    AMOUNT      ┃
┃  ───────────────────────  ────────────  ──  ──────────   ┃
┃  Document Courier Svc     CN2025_001    1    ₹5,000      ┃
┃  Express Delivery Svc     CN2025_002    1    ₹5,000      ┃
┃                                                           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                           ┃
┃  NOTES                        │  FINANCIAL SUMMARY       ┃
┃  ───────────────────────────  │  ───────────────────────┃
┃  📝 Invoice for services      │  Subtotal: ₹10,000      ┃
┃                               │  Discount: -₹500        ┃
┃  ⚖️ TERMS & CONDITIONS        │  GST (18%): ₹1,800      ┃
┃  • Payment due in 30 days     │  ─────────────────────  ┃
┃  • Late fee 18% per annum     │  TOTAL: ₹12,300        ┃
┃  • GST as applicable          │  ─────────────────────  ┃
┃                               │  Balance: ₹12,300       ┃
┃                                                           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                           ┃
┃  EMAIL              PHONE              ADDRESS            ┃
┃  ──────────────────────────────────────────────────────  ┃
┃  info@codigix...    +91 (0) XXXXX      Codigix Infotech  ┃
┃  support@codigix... www.codigix.com    Pvt. Ltd.         ┃
┃                                                           ┃
┃  Generated on: Jan 15, 2025 10:30:45 AM                  ┃
┃                                                           ┃
┃  ─────────────────────────────────────────────────────  ┃
┃  Authorized Signatory      For Codigix Infotech           ┃
┃  [Signature Line]          [Signature Line]               ┃
┃                                                           ┃
┃  Thank you for your business! ✨                         ┃
┃                                                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🎨 Color Breakdown

### Header Section

```
Background: White (#ffffff)
Company Name: Dark Blue (#1e40af)
Logo: Blue Gradient (#1e40af → #0f86e5)
Border: Dark Blue (#1e40af)
```

### Details Section

```
Background: Light Gray (#f9f9f9)
Labels (FROM, BILL TO, PAYMENT): Dark Blue (#1e40af)
Text: Dark Gray (#333333)
Balance Amount: Red (#dc2626)
```

### Items Table

```
Header: Blue Gradient (#1e40af → #0f86e5)
Header Text: White (#ffffff)
Odd Rows: Light Gray (#f9f9f9)
Even Rows: White (#ffffff)
Border: Light Gray (#eee)
```

### Summary Box

```
Background: White with Blue Border (#1e40af)
Subtotal/Discount: Light text
Total Row: Blue Gradient with White Text
Balance Row: Light Red (#fef2f2) with Red Border
```

---

## 📐 Sections Explained

### 1. Header (Logo + Company Info)

```
┌─────────────────────────────────────────────┐
│ [Logo]  COMPANY NAME                INVOICE │
│         Tagline 1                       #001 │
│         Tagline 2                      Date │
│                                        Due  │
└─────────────────────────────────────────────┘

What it shows:
✅ Company branding (logo, name, tagline)
✅ Invoice identification
✅ Important dates (invoice, due)
```

### 2. Company Details (3-Column)

```
┌─────────────────┬──────────────────┬────────────────┐
│ FROM            │ BILL TO          │ PAYMENT        │
├─────────────────┼──────────────────┼────────────────┤
│ Franchise name  │ Customer name    │ Payment status │
│ Address         │ Address          │ Total amount   │
│ Phone           │ Phone            │ Paid amount    │
│ GST             │ GST              │ Balance due    │
└─────────────────┴──────────────────┴────────────────┘

What it shows:
✅ Who issued the invoice (franchisee)
✅ Who it's billed to (customer)
✅ Payment tracking at a glance
```

### 3. Line Items Table

```
┌──────────────┬──────────────┬─────┬──────────┐
│ Description  │ Consignment# │ Qty │  Amount  │
├──────────────┼──────────────┼─────┼──────────┤
│ Service 1    │ CN2025_001   │  1  │ ₹5,000   │
│ Service 2    │ CN2025_002   │  1  │ ₹5,000   │
└──────────────┴──────────────┴─────┴──────────┘

What it shows:
✅ What services were provided
✅ Which consignments included
✅ Quantity of items
✅ Price per item
```

### 4. Financial Summary

```
┌───────────────────────────┐
│ Subtotal:    ₹10,000.00  │
│ Discount:    -₹500.00    │
│ GST (18%):   ₹1,800.00   │
├───────────────────────────┤
│ TOTAL:       ₹12,300.00  │
├───────────────────────────┤
│ Balance:     ₹12,300.00  │ ← Red for emphasis
└───────────────────────────┘

What it shows:
✅ Breakdown of charges
✅ Tax calculations
✅ Total invoice amount
✅ Amount still due
```

### 5. Notes & Terms

```
Left Side:
📝 NOTES
Your special notes here...

⚖️ TERMS & CONDITIONS
• Payment terms
• Interest rates
• Applicable taxes
• Legal jurisdiction

Right Side:
[Summary Box]
```

### 6. Footer

```
┌─────────────┬──────────────┬──────────────┐
│ EMAIL       │ PHONE        │ ADDRESS      │
├─────────────┼──────────────┼──────────────┤
│ info@...    │ +91 XXXXX    │ Company Name │
│ support@... │ website.com  │ Pvt. Ltd.    │
└─────────────┴──────────────┴──────────────┘

Generated on: [Timestamp]

[Authorized Sig]    [For Company]

Thank you for your business!

What it shows:
✅ Contact information
✅ How to reach out
✅ Document generation date
✅ Signature fields
```

---

## 🎯 Sample Invoice Output

### Example 1: Typical Invoice

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  CODIGIX INFOTECH                        INVOICE      ║
║  Professional Logistics                 INV/2025/0001 ║
║                                          Jan 15, 2025  ║
║                                                        ║
║  FROM: Main Franchise          TO: TCS Express        ║
║        New Delhi                    Mumbai             ║
║        Ph: 1111111111               Ph: 2222222222     ║
║        GST: 07XXXXX                 GST: 27XXXXX      ║
║                                                        ║
║  ─────────────────────────────────────────────────── ║
║  Description          │ Ref      │ Qty │ Amount      ║
║  ─────────────────────┼──────────┼─────┼────────── ║
║  Courier Service      │ CN001    │  1  │ ₹3,000     ║
║  Express Delivery     │ CN002    │  1  │ ₹2,000     ║
║  Special Handling     │ CN003    │  1  │ ₹1,500     ║
║                                                        ║
║  Subtotal:                            ₹6,500.00      ║
║  Discount (10%):                      -₹650.00       ║
║  GST (18%):                           ₹1,053.00      ║
║                                                        ║
║  TOTAL AMOUNT:                        ₹6,903.00      ║
║  BALANCE DUE:                         ₹6,903.00      ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### Example 2: Partial Payment

```
╔════════════════════════════════════════════════════════╗
║  CODIGIX INFOTECH                       INVOICE       ║
║                                    INV/2025/0002       ║
║                                    Feb 10, 2025        ║
║                                                        ║
║  TO: ABC Industries, Bangalore                        ║
║      GST: 29XXXXX                                     ║
║                                                        ║
║  Items: 2 consignments                                ║
║  Subtotal:                           ₹10,000.00       ║
║  GST (18%):                          ₹1,800.00        ║
║  TOTAL:                              ₹11,800.00       ║
║  PAID:                               -₹5,900.00       ║
║  BALANCE DUE:                        ₹5,900.00 ⚠️     ║
║                                                        ║
║  Payment Status: PARTIAL              Last updated:   ║
║  Thank you for your payment!          Feb 15, 2025   ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## 🖨️ Print Preview

When you print the invoice to PDF, it looks like this:

```
Page 1 (A4 Size):
┌─────────────────────────────────────────────────┐
│ [0.5" margin]                                   │
│                                                 │
│   [Logo] CODIGIX INFOTECH        INVOICE       │
│          Company Details          INV/2025/0001 │
│                                   Date: Jan 15  │
│   ───────────────────────────────────────────  │
│                                                 │
│   FROM                BILL TO       PAYMENT    │
│   Franchise           Customer      UNPAID     │
│   ...                 ...           Amount: ₹X │
│                                                 │
│   ───────────────────────────────────────────  │
│                                                 │
│   Description    │ Ref  │ Qty │ Amount        │
│   ...            │ ...  │ ... │ ₹...          │
│                                                 │
│   SUMMARY              │ Financial Details    │
│   Subtotal: ₹X         │ Subtotal: ₹X         │
│   Total: ₹X            │ GST: ₹X              │
│                        │ TOTAL: ₹X            │
│                        │ BALANCE: ₹X          │
│                                                 │
│   CONTACT INFO                                  │
│   Email │ Phone │ Website                      │
│                                                 │
│   [Signature Lines]                            │
│                                                 │
│ [0.5" margin]                                  │
└─────────────────────────────────────────────────┘
```

---

## 📱 Mobile View

On mobile devices, the layout adapts:

```
Mobile (320px width):
┌──────────────────┐
│ [Logo] CODIGIX   │
│ Invoice INV/0001 │
│ Date: Jan 15     │
├──────────────────┤
│ FROM             │
│ Franchise        │
│ Address          │
├──────────────────┤
│ BILL TO          │
│ Customer         │
│ Address          │
├──────────────────┤
│ PAYMENT          │
│ UNPAID           │
│ Amount: ₹10,000  │
├──────────────────┤
│ Items:           │
│ Consign│ Amount  │
│ CN001  │ ₹5,000  │
├──────────────────┤
│ Subtotal ₹10,000 │
│ GST      ₹1,800  │
│ TOTAL   ₹11,800  │
│ DUE     ₹11,800  │
├──────────────────┤
│ Contact Info     │
│ Email Phone Addr │
└──────────────────┘
```

---

## 🎨 Color Reference

### Main Colors

```css
Primary Blue (#1e40af):
████████████████████████████████

Light Blue (#0f86e5):
████████████████████████████████

Dark Gray (#333333):
████████████████████████████████

Light Gray (#f9f9f9):
████████████████████████████████

Red (#dc2626):
████████████████████████████████

White (#ffffff):
████████████████████████████████
```

### Gradient (Used in Headers)

```css
Left (#1e40af) → Right (#0f86e5):
████████████░░░░░░░░░░░░░░░░░░░░
```

---

## 📊 Typography Sizes

```
Logo/Logo Mark:       60x60px (CX inside)
Main Heading (H1):    24-28px, Bold (#1e40af)
Page Title (H2):      32px, Bold (#1e40af)
Section Headers (H3): 12px, Bold, UPPERCASE (#1e40af)
Section Headers (H4): 11px, Bold (#1e40af)
Body Text:            12-13px, Regular (#333333)
Small Text:           10-11px, Light (#666666)
Footer:               10-11px, Light (#999999)
```

---

## ✨ Visual Features

### Effects Used

1. **Gradients**

   - Logo: Diagonal (#1e40af → #0f86e5)
   - Table Headers: Horizontal (#1e40af → #0f86e5)
   - Total Row: Same gradient with white text

2. **Shadows**

   - Container: Light shadow (0 0 10px rgba(0,0,0,0.1))
   - Subtle depth effect

3. **Borders**

   - Header: 3px solid #1e40af
   - Sections: 1-2px solid #ddd
   - Emphasis: 4px solid #1e40af (left border on highlights)

4. **Spacing**

   - Container: 40px padding
   - Sections: 20-40px margin
   - Table cells: 10-12px padding
   - Borders: 1px consistent

5. **Hover Effects** (on screen)
   - Table rows: Subtle blue tint
   - Links: Darker blue
   - Buttons: Shadow increase

---

## 🎯 What Each Color Represents

```
DARK BLUE (#1e40af)     = Trust, Professionalism
  ├─ Headers
  ├─ Titles
  ├─ Labels
  └─ Important elements

LIGHT BLUE (#0f86e5)    = Accent, Highlight
  ├─ Gradients
  ├─ Secondary elements
  └─ Visual interest

RED (#dc2626)           = Alert, Important
  ├─ Balance due
  ├─ Outstanding amount
  └─ Requires attention

GRAY (#f9f9f9)          = Background, Neutral
  ├─ Section backgrounds
  ├─ Table alternating rows
  └─ Subtle distinction

DARK GRAY (#333)        = Content, Readable
  ├─ Body text
  ├─ Information
  └─ Primary reading material
```

---

## 📋 Data Display Order

The invoice displays information in this order:

```
1. HEADER
   ├─ Company Logo & Name
   ├─ Invoice Title
   └─ Invoice Details (number, date, due)

2. COMPANY DETAILS (3-Column)
   ├─ FROM (Franchisee)
   ├─ BILL TO (Customer)
   └─ PAYMENT (Status & amounts)

3. LINE ITEMS
   ├─ Service Description
   ├─ Consignment Reference
   ├─ Quantity
   └─ Amount

4. FINANCIAL SUMMARY
   ├─ Subtotal
   ├─ Discount (if any)
   ├─ GST
   ├─ Total
   └─ Balance Due

5. NOTES & TERMS
   ├─ Special Notes (left)
   ├─ Terms & Conditions (left)
   └─ Summary Box (right)

6. FOOTER
   ├─ Contact Information
   ├─ Generated Date
   ├─ Signature Fields
   └─ Thank You Message
```

---

## 🎓 Design Principles Used

1. **Hierarchy**: Important info (amounts) is larger and colored
2. **Balance**: Three-column layout for even distribution
3. **Consistency**: Same fonts, sizes, and colors throughout
4. **Clarity**: Clear section divisions with lines and colors
5. **Professionalism**: Corporate colors and clean design
6. **Accessibility**: Good contrast ratios, readable fonts
7. **Scalability**: Responsive to different screen sizes
8. **Print-Friendly**: Works on paper and screens

---

## ✅ Preview Checklist

When viewing the invoice, look for:

- [ ] Logo displays correctly (CX mark)
- [ ] Company name is visible
- [ ] Invoice number is shown
- [ ] Date and due date present
- [ ] Three-column layout is aligned
- [ ] Company details are correct
- [ ] Customer info is correct
- [ ] Payment status shows
- [ ] Items are listed
- [ ] Amounts are correct
- [ ] Colors are consistent
- [ ] Text is readable
- [ ] Footer info is visible
- [ ] Print preview looks good
- [ ] No overlapping elements

---

## 🚀 Ready to Use!

Your professional invoice template is ready for download and printing. The visual design is clean, professional, and perfectly suited for Codigix Infotech's branding.

**Start using it now:**

1. Open your dashboard
2. Open the chatbot
3. Enter a consignment number
4. Click **Download Invoice**
5. Enjoy your professional PDF! 📄✨

---

**Template Visual Version**: 1.0  
**Last Updated**: January 2025  
**Status**: Production Ready ✅
