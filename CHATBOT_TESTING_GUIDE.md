# Chatbot Testing & Verification Guide

## Pre-Testing Checklist

Before you start testing, make sure:

- ✅ Backend server is running (`npm run dev` in backend directory)
- ✅ Frontend server is running (`npm run dev` in frontend directory)
- ✅ Database is connected and has sample data
- ✅ You have valid login credentials
- ✅ At least one consignment exists in the bookings table

## Part 1: Backend API Testing

### 1.1 Test Backend Health Check

**Purpose:** Verify backend is running

**Step 1:** Open Postman or use curl:

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-XX-XXTXX:XX:XX.000Z"
}
```

---

### 1.2 Test Authentication

**Purpose:** Verify auth tokens work

**Step 1:** Send login request:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "password": "your-password"}'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "your-email@example.com",
      "franchise_id": 1
      // ... more user data
    }
  }
}
```

**Step 2:** Copy the `token` value for next tests.

---

### 1.3 Test Chatbot Chat Endpoint (Valid Consignment)

**Purpose:** Verify chatbot can find and return consignment details

**Prerequisites:**

- Have a valid token from 1.2
- Know a valid consignment number from your database

**Step 1:** Query the chatbot:

```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"message": "Track CN12345"}'
```

**Replace:**

- `YOUR_TOKEN_HERE` with the token from 1.2
- `CN12345` with a real consignment number from your database

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "type": "booking_found",
    "message": "📦 **Consignment Details**\n\n📌 **Tracking Number:** CN12345\n...",
    "booking": {
      "consignmentNo": "CN12345",
      "bookingNo": "BK12345",
      "customerName": "John Doe",
      "receiverName": "Jane Smith",
      "senderCity": "Mumbai",
      "receiverCity": "Delhi",
      "weight": "5",
      "pieces": 2,
      "serviceType": "Express",
      "bookingDate": "2024-10-20",
      "totalAmount": 450,
      "paidAmount": 450,
      "status": "in_transit",
      "paymentStatus": "paid"
    }
  }
}
```

**Check Points:**

- ✅ `success` is `true`
- ✅ `data.type` is `booking_found`
- ✅ `booking` object contains all required fields
- ✅ `status` is one of: `booked`, `in_transit`, `out_for_delivery`, `delivered`, `cancelled`

---

### 1.4 Test Chatbot Chat Endpoint (Invalid Consignment)

**Purpose:** Verify error handling for non-existent consignments

**Step 1:** Send invalid consignment:

```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"message": "Track 999999999"}'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "type": "not_found",
    "message": "I couldn't find a consignment with number \"999999999\"...",
    "consignmentNo": "999999999"
  }
}
```

**Check Points:**

- ✅ `success` is `true`
- ✅ `data.type` is `not_found`
- ✅ User-friendly error message is shown

---

### 1.5 Test Chatbot Chat Endpoint (Greeting)

**Purpose:** Verify greeting response

**Step 1:** Send greeting:

```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"message": "Hi"}'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "type": "greeting",
    "message": "Hello! 👋 I'm your consignment assistant...",
    "conversationStarters": [...]
  }
}
```

**Check Points:**

- ✅ `success` is `true`
- ✅ `data.type` is `greeting`
- ✅ Contains helpful guidance message

---

### 1.6 Test Chatbot Chat Endpoint (Help)

**Purpose:** Verify help response

**Step 1:** Send help request:

```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"message": "help"}'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "type": "help",
    "message": "I can help you with the following:\n\n📦 Track Consignments..."
  }
}
```

**Check Points:**

- ✅ `success` is `true`
- ✅ `data.type` is `help`
- ✅ Contains guidance on available features

---

### 1.7 Test Chatbot GET Endpoint

**Purpose:** Verify direct consignment query

**Step 1:** Query consignment directly:

```bash
curl -X GET http://localhost:5000/api/chatbot/CN12345 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Replace:**

- `CN12345` with a real consignment number

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "consignmentNo": "CN12345"
    // ... all booking fields
  }
}
```

**Check Points:**

- ✅ `success` is `true`
- ✅ Returns complete booking object

---

### 1.8 Test Authentication Protection

**Purpose:** Verify endpoints are protected

**Step 1:** Try without token:

```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Track CN12345"}'
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Authentication failed" // or similar
}
```

**Check Points:**

- ✅ Request is rejected without token
- ✅ Status code is 401 or 403

---

## Part 2: Frontend UI Testing

### 2.1 Test Chatbot Component Visibility

**Step 1:** Open browser and go to `http://localhost:5173`
**Step 2:** Login with valid credentials
**Step 3:** Look at bottom-right corner

**Expected:**

- ✅ Floating chat window visible
- ✅ Blue gradient header "Consignment Tracker"
- ✅ Default greeting message shown
- ✅ Input field and send button visible

---

### 2.2 Test Minimize/Maximize

**Step 1:** Click the "-" button in header

**Expected:**

- ✅ Chat window collapses
- ✅ Shows "Open Chat" button

**Step 2:** Click "Open Chat" button

**Expected:**

- ✅ Chat window expands
- ✅ All messages still visible

---

### 2.3 Test Valid Consignment Query

**Step 1:** Type a valid consignment number in input field
**Step 2:** Press Enter or click Send button

**Expected:**

- ✅ User message appears on right side
- ✅ Loading animation (3 dots) appears
- ✅ After loading, formatted booking details appear on left
- ✅ Shows all required fields: Consignment No, Sender, Receiver, Weight, Amount, Status, etc.

---

### 2.4 Test Invalid Consignment Query

**Step 1:** Type "999999999"
**Step 2:** Press Enter or click Send

**Expected:**

- ✅ User message appears on right
- ✅ Loading animation appears briefly
- ✅ Error message appears: "I couldn't find a consignment..."

---

### 2.5 Test Quick Action Buttons

**Step 1:** Click "👋 Hi" button

**Expected:**

- ✅ "Hi" appears in input (or is sent automatically)
- ✅ Greeting response appears from bot

**Step 2:** Click "❓ Help" button

**Expected:**

- ✅ "help" is sent to bot
- ✅ Help message appears

---

### 2.6 Test Alternative Input Formats

**Test Case 1:** Type just the number

```
Input: 12345
Expected: Shows booking details
```

**Test Case 2:** Type with "Track"

```
Input: Track CN12345
Expected: Shows booking details
```

**Test Case 3:** Type with "Check"

```
Input: Check consignment 12345
Expected: Shows booking details
```

**Test Case 4:** Conversational format

```
Input: What's the status of CN12345?
Expected: Shows booking details
```

---

### 2.7 Test Message Auto-Scroll

**Step 1:** Send multiple messages so chat is full
**Step 2:** Send another message

**Expected:**

- ✅ Chat automatically scrolls to newest message
- ✅ Newest message is always visible

---

### 2.8 Test Responsive Design

**Test on Desktop:**

- ✅ Chat window is 384px wide (w-96)
- ✅ Header and messages readable
- ✅ Input field properly sized

**Test on Tablet:**

```
Resize browser window to 768px width
```

- ✅ Chat window adapts
- ✅ Still readable and usable

**Test on Mobile:**

```
Resize browser window to 375px width
```

- ✅ Chat window uses `max-w-[calc(100vw-24px)]`
- ✅ Fits on screen without overflow
- ✅ All buttons clickable

---

### 2.9 Test Button States

**Step 1:** Focus on input field and type nothing
**Step 2:** Look at Send button

**Expected:**

- ✅ Send button is disabled (grayed out)
- ✅ Cannot click it

**Step 3:** Type something

**Expected:**

- ✅ Send button becomes enabled
- ✅ Can click it

**Step 4:** Message is sending

**Expected:**

- ✅ Send button shows loading spinner
- ✅ Input field is disabled
- ✅ Cannot send another message while loading

---

### 2.10 Test Error Handling

**Scenario 1:** Disconnect internet while typing
**Step 1:** Turn off WiFi
**Step 2:** Try to send message

**Expected:**

- ✅ Shows error: "I'm having trouble connecting..."
- ✅ Chat remains functional after reconnect

**Scenario 2:** Invalid response from server
**Expected:**

- ✅ Shows generic error message
- ✅ No console errors that crash the app

---

## Part 3: Database Testing

### 3.1 Verify Consignment Data Exists

**Step 1:** Connect to your database (MySQL)

**Step 2:** Run query:

```sql
SELECT consignment_number, sender_name, receiver_name, status, total_amount
FROM bookings
LIMIT 5;
```

**Expected:**

- ✅ At least 5 rows returned
- ✅ All required columns have data
- ✅ Status is one of the valid values

---

### 3.2 Verify Franchise Isolation

**Step 1:** Check if your user's franchise_id:

```sql
SELECT franchise_id FROM users WHERE id = YOUR_USER_ID;
```

**Step 2:** Verify chatbot only returns bookings from that franchise:

```sql
SELECT COUNT(*) FROM bookings WHERE franchise_id = YOUR_FRANCHISE_ID;
```

**Expected:**

- ✅ Chatbot only shows consignments from your franchise
- ✅ Cannot access other franchise's data

---

## Test Results Checklist

After completing all tests, check off:

### Backend Tests

- [ ] Health check working
- [ ] Authentication working
- [ ] Chat endpoint finds consignments
- [ ] Chat endpoint handles invalid input
- [ ] Greeting response works
- [ ] Help response works
- [ ] Direct GET endpoint works
- [ ] Authentication protection working

### Frontend Tests

- [ ] Chatbot component visible after login
- [ ] Minimize/maximize working
- [ ] Valid queries show results
- [ ] Invalid queries show error
- [ ] Quick buttons work
- [ ] Alternative formats work
- [ ] Auto-scroll works
- [ ] Responsive on all devices
- [ ] Button states correct
- [ ] Error handling graceful

### Database Tests

- [ ] Sample data exists
- [ ] Franchise isolation working

## Summary

If all tests pass, your **Chatbot Assistant is fully functional**! 🎉

### What to Do Next

1. **Show to Users** - Demonstrate the chatbot in action
2. **Gather Feedback** - Ask users what they think
3. **Make Customizations** - Adjust colors, messages, or features
4. **Add to Documentation** - Include in staff training materials
5. **Monitor Usage** - Track if users are using the feature

### Common Test Failures & Solutions

**Issue: "Cannot find module: ChatbotAssistant"**

- Solution: Ensure file is created at correct path and imported correctly

**Issue: API returns 401**

- Solution: Verify token is valid and not expired

**Issue: Chatbot shows "Not found" for valid consignment**

- Solution: Check consignment_number format matches database exactly

**Issue: Component not visible**

- Solution: Verify user is authenticated and not on login page

---

**Testing Guide Complete!** ✅
