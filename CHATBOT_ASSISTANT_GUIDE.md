# AI Chat Assistant for Logistics Dashboard

## Overview

The AI Chat Assistant is a conversational interface that allows users to track consignments and retrieve shipment details by simply typing in a chat-like interface. It integrates seamlessly with your existing billing system and uses natural language processing to understand user queries.

## Features

✅ **Conversational Interface** - Chat-style UI with user messages on the right and bot replies on the left
✅ **Consignment Tracking** - Enter any consignment number to get instant details
✅ **Smart Input Parsing** - Recognizes multiple formats (CN12345, 12345, "Track 12345", etc.)
✅ **Real-time Loading** - Animated typing indicator while fetching data
✅ **Formatted Results** - Beautiful card layout showing all relevant consignment information
✅ **Greeting & Help** - Responds to small talk and provides guidance
✅ **Minimize/Maximize** - Toggle the chat window for better screen space management
✅ **Mobile Responsive** - Works perfectly on desktop and mobile devices

## File Structure

### Backend Files

```
backend/src/
├── controllers/
│   └── chatbotController.js        # Chatbot logic and AI processing
├── routes/
│   └── chatbotRoutes.js            # API endpoints for chatbot
└── routes/
    └── index.js                     # Updated to include chatbot routes
```

### Frontend Files

```
frontend/src/
├── components/
│   └── ChatbotAssistant.jsx        # Main chatbot UI component
├── services/
│   └── chatbotService.js           # API service for chatbot
└── pages/
    └── App.jsx                      # Updated to include ChatbotAssistant
```

## Installation & Setup

### Backend Setup

1. **Chatbot Controller** is already created at:

   ```
   backend/src/controllers/chatbotController.js
   ```

2. **Chatbot Routes** are already created at:

   ```
   backend/src/routes/chatbotRoutes.js
   ```

3. **Routes are integrated** in:
   ```
   backend/src/routes/index.js (line 37)
   ```

### Frontend Setup

1. **Chatbot Component** is already created at:

   ```
   frontend/src/components/ChatbotAssistant.jsx
   ```

2. **Chatbot Service** is already created at:

   ```
   frontend/src/services/chatbotService.js
   ```

3. **Component is integrated** in:
   ```
   frontend/src/pages/App.jsx
   ```

## API Endpoints

### 1. Chat with Assistant

**Endpoint:** `POST /api/chatbot/chat`
**Authentication:** Required (Bearer Token)
**Request Body:**

```json
{
  "message": "Track CN12345"
}
```

**Response (Success):**

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

**Response (Not Found):**

```json
{
  "success": true,
  "data": {
    "type": "not_found",
    "message": "I couldn't find a consignment with number \"12345\"...",
    "consignmentNo": "12345"
  }
}
```

### 2. Get Consignment Details

**Endpoint:** `GET /api/chatbot/:consignmentNo`
**Authentication:** Required (Bearer Token)

**Response:**

```json
{
  "success": true,
  "data": {
    "consignmentNo": "CN12345",
    "bookingNo": "BK12345",
    "customerName": "John Doe"
    // ... all booking details
  }
}
```

## Usage Examples

### Example 1: Track Consignment

**User Input:** "Track CN12345"
**Bot Response:** Shows formatted consignment details with status, route, weight, amount, etc.

### Example 2: Check Status

**User Input:** "Check consignment 54321"
**Bot Response:** Displays all details in a beautiful card format

### Example 3: Quick Track

**User Input:** "12345"
**Bot Response:** Recognizes the number and shows details

### Example 4: Greeting

**User Input:** "Hi"
**Bot Response:** "Hello! 👋 I'm your consignment assistant. I can help you track your shipments..."

### Example 5: Help

**User Input:** "help"
**Bot Response:** Shows guidance on how to use the chatbot

### Example 6: Not Found

**User Input:** "99999"
**Bot Response:** "I couldn't find a consignment with number \"99999\". Please check..."

## Smart Input Recognition

The chatbot can recognize consignment numbers in multiple formats:

1. **Direct Format:** `12345` or `CN12345`
2. **Track Command:** `Track 12345` or `Track CN12345`
3. **Status Query:** `Check CN12345` or `What's the status of 12345?`
4. **Booking Numbers:** Also searches booking_number field
5. **Natural Language:** Extracts numbers from various sentence structures

## Component Features

### ChatbotAssistant.jsx

**Key Features:**

- Floating chat window (fixed at bottom-right)
- Minimize/Maximize toggle
- Message history with auto-scroll
- Typing animation while loading
- Responsive design (adapts to mobile)
- Quick action buttons (Hi, Help)
- Beautiful message formatting with emoji support
- Detailed booking card layout
- Error handling and user-friendly messages

**Props:** None (uses authentication from context)

**State Management:**

- `messages` - Array of chat messages
- `inputValue` - Current input text
- `isLoading` - Loading state during API calls
- `isMinimized` - Minimize/maximize state

## Database Integration

The chatbot queries your existing **bookings** table with the following relevant fields:

```sql
- consignment_number (searched field)
- booking_number (searched field)
- sender_name
- receiver_name
- sender_city, receiver_city
- weight
- pieces
- service_type
- booking_date
- total_amount
- paid_amount
- status
- payment_status
- content_description
```

## Customization Options

### 1. Modify Greeting Message

Edit `chatbotController.js`, line ~27:

```javascript
const isGreeting = (input) => {
  const greetings = [
    "hello", "hi", "hey", "how are you", // Add more greetings here
  ];
```

### 2. Change Chatbot Colors

Edit `ChatbotAssistant.jsx`:

- Header: `from-blue-600 to-blue-700` (change to your color)
- User Message: `bg-blue-600` (your primary color)
- Bot Message: `bg-gray-200` (your secondary color)

### 3. Customize Quick Actions

Edit `ChatbotAssistant.jsx`, around line 290:

```jsx
<button className="..." onClick={() => handleQuickAction("Your Action")}>
  Your Label
</button>
```

### 4. Add More Response Types

Edit `chatbotController.js` to add new response types like:

- Payment inquiry
- Delivery address modification
- Feedback collection
- Escalation to human support

## Testing the Chatbot

### Manual Testing Steps

1. **Start Backend Server**

   ```bash
   npm run dev    # From backend directory
   ```

2. **Start Frontend Server**

   ```bash
   npm run dev    # From frontend directory
   ```

3. **Login to Dashboard**

   - Navigate to `http://localhost:5173`
   - Login with your credentials

4. **Open Chatbot**

   - Look for the chat icon at bottom-right
   - Click to open the chat window

5. **Test Cases**
   - **Greeting:** Type "Hi" → Should show welcome message
   - **Help:** Type "help" → Should show guidance
   - **Valid Consignment:** Type "CN12345" → Should show booking details
   - **Alternative Format:** Type "12345" → Should show booking details
   - **Invalid Number:** Type "99999" → Should show "not found" message
   - **Minimize:** Click "-" button → Should minimize chat
   - **Maximize:** Click "+" or "Open Chat" → Should restore chat
   - **Quick Actions:** Click "Hi" or "Help" buttons → Should send query

### Automated Testing (Example)

```javascript
// Test example using fetch API
async function testChatbot() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/chatbot/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: "Track CN12345" }),
  });

  const data = await response.json();
  console.log("Chatbot Response:", data);
}
```

## Troubleshooting

### Issue: Chatbot not appearing

**Solution:**

- Ensure you're logged in (not on login page)
- Check browser console for errors
- Verify `App.jsx` has `ChatbotAssistant` component imported

### Issue: API calls failing

**Solution:**

- Check backend is running on port 5000
- Verify authentication token is valid
- Check network tab in browser developer tools
- Ensure chatbot routes are registered in `index.js`

### Issue: Messages not sending

**Solution:**

- Check input field has text
- Verify loading indicator clears after response
- Check for network connectivity
- Verify API endpoint returns valid JSON

### Issue: Wrong consignment data

**Solution:**

- Verify consignment exists in database
- Check `consignment_number` field spelling in database
- Ensure franchise_id matches authenticated user
- Query database directly to verify data exists

## Performance Optimization

1. **Message History Limit** - Currently unlimited. Add pagination if needed:

   ```javascript
   if (messages.length > 50) {
     setMessages((prev) => prev.slice(prev.length - 50));
   }
   ```

2. **Debounce Input** - Add if needed for rapid typing:

   ```javascript
   const [typingTimeout, setTypingTimeout] = useState(null);
   ```

3. **Lazy Load Chat** - Load component only when needed:
   ```javascript
   const ChatbotAssistant = React.lazy(() => import("./ChatbotAssistant"));
   ```

## Security Considerations

✅ **Authentication Required** - All endpoints require valid Bearer token
✅ **Franchise Isolation** - Queries filtered by franchise_id from authenticated user
✅ **Input Validation** - Message input validated and sanitized
✅ **Error Handling** - Generic error messages to prevent info leakage
✅ **CORS Protected** - API calls restricted to allowed origins

## Future Enhancements

- 🤖 Integrate with OpenAI for more intelligent responses
- 📱 Add support for multiple languages
- 💬 Add human handoff capability
- 📊 Analytics tracking for chat interactions
- 🔔 Push notifications for shipment updates
- 📞 Quick call feature for support
- ⭐ Rating system for chatbot responses
- 🎨 Customizable themes for different franchises

## Support

For issues or questions about the chatbot implementation:

1. Check the troubleshooting section above
2. Review error messages in browser console
3. Check backend server logs
4. Verify database connections and data
5. Contact development team with specific error details

---

**Created:** 2024
**Last Updated:** 2024
**Version:** 1.0
