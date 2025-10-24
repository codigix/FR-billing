import { getDb } from "../config/database.js";

// Parse user input to extract consignment number
const parseConsignmentNumber = (input) => {
  // Remove leading/trailing whitespace
  const trimmed = input.trim();

  // Match patterns like "CN12345", "12345", "Track 12345", "Check CN12345"
  const patterns = [
    /(CN\d+)/i, // CN20240001 - capture CN prefix + digits
    /track[\s:]*([A-Z0-9\s]+)/i, // track CN20240001 or track TEST9348
    /check[\s:]*([A-Z0-9\s]+)/i, // check TEST9348
    /consignment[\s:]*([A-Z0-9\s]+)/i, // consignment: TEST9348
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  // If no keyword pattern matched, assume the entire input is a consignment number
  // But only if it contains alphanumeric characters
  if (/^[A-Z0-9\s]+$/i.test(trimmed) && trimmed.length > 0) {
    return trimmed;
  }

  return null;
};

// Detect greeting and small talk
const isGreeting = (input) => {
  const greetings = [
    "hello",
    "hi",
    "hey",
    "how are you",
    "greetings",
    "what's up",
    "whats up",
  ];
  return greetings.some((g) => input.toLowerCase().includes(g));
};

const isHelpRequest = (input) => {
  const helpKeywords = [
    "help",
    "how to",
    "guide",
    "what can",
    "can you",
    "support",
  ];
  return helpKeywords.some((k) => input.toLowerCase().includes(k));
};

// Format booking data for conversation
const formatBookingResponse = (booking) => {
  // Generate invoice file name based on invoice number or ID
  let invoiceFile = null;
  let invoiceId = null;

  // Only set invoice data if BOTH invoice_id AND invoice_number are present
  if (booking.invoice_id && booking.invoice_number) {
    invoiceFile = `${booking.invoice_number}.pdf`;
    invoiceId = booking.invoice_id;
  } else if (booking.invoice_id) {
    // Fallback if only ID exists
    invoiceFile = `inv_${booking.invoice_id}.pdf`;
    invoiceId = booking.invoice_id;
  }

  return {
    consignmentNo: booking.consignment_number,
    customerId: booking.customer_id,
    receiverName: booking.receiver || "N/A",
    destination: booking.destination || "N/A",
    weight: booking.act_wt || "N/A",
    pieces: booking.qty || 1,
    mode: booking.mode || "Standard",
    bookingDate: booking.booking_date,
    amount: Number(booking.amount) || 0,
    total: Number(booking.total || booking.amount || 0),
    status: booking.status || "Booked",
    paymentStatus: booking.payment_status || "Pending",
    remarks: booking.remarks,
    consignmentType: booking.consignment_type || "N/A",
    invoiceFile: invoiceFile, // Invoice filename for display
    invoiceId: invoiceId, // Invoice ID for API calls
  };
};

// Parse date range from user input
const parseDateRange = (input) => {
  // Match patterns like "from 2024-01-01 to 2024-12-31" or "2024-01-01 to 2024-12-31"
  const datePattern =
    /(?:from\s+)?(\d{4}-\d{2}-\d{2})\s+(?:to\s+)?(\d{4}-\d{2}-\d{2})/i;
  const match = input.match(datePattern);

  if (match) {
    return {
      fromDate: match[1],
      toDate: match[2],
    };
  }
  return null;
};

// Check if user is requesting date range list
const isDateRangeRequest = (input) => {
  return /list|show|consignments|report|from|to|date/.test(input.toLowerCase());
};

// Get conversational response for booking
export const chatWithAssistant = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Check for greeting
    if (isGreeting(message)) {
      return res.json({
        success: true,
        data: {
          type: "greeting",
          message:
            "Hello! 👋 I'm your consignment assistant. I can help you track your shipments. Just enter a consignment number (e.g., 'CN12345' or '12345') and I'll fetch the details for you.",
          conversationStarters: [
            "Track CN12345",
            "Check consignment 54321",
            "What's the status of 99999?",
          ],
        },
      });
    }

    // Check for help
    if (isHelpRequest(message)) {
      return res.json({
        success: true,
        data: {
          type: "help",
          message:
            "I can help you with the following:\n\n📦 **Track Consignments** - Enter any consignment number to get instant details\n💳 **View Payment Status** - Check payment and billing information\n📍 **Track Location** - See delivery status and location\n📅 **List by Date Range** - Use 'from YYYY-MM-DD to YYYY-MM-DD' to see all consignments in that period\n\n**Examples:**\n• 'TEST9348' - Track single consignment\n• 'from 2024-01-01 to 2024-12-31' - List all consignments in 2024",
        },
      });
    }

    // Check for date range request (list consignments by dates)
    const dateRange = parseDateRange(message);
    if (dateRange && isDateRangeRequest(message)) {
      const db = getDb();
      const [consignments] = await db.query(
        `SELECT b.*, i.id as invoice_id, i.invoice_number 
         FROM bookings b
         LEFT JOIN invoice_items ii ON b.id = ii.booking_id
         LEFT JOIN invoices i ON ii.invoice_id = i.id
         WHERE b.franchise_id = ? 
         AND DATE(b.booking_date) BETWEEN ? AND ? 
         ORDER BY b.booking_date DESC 
         LIMIT 50`,
        [franchiseId, dateRange.fromDate, dateRange.toDate]
      );

      if (consignments.length === 0) {
        return res.json({
          success: true,
          data: {
            type: "date_range_empty",
            message: `No consignments found between ${dateRange.fromDate} and ${dateRange.toDate}. Please try another date range.`,
          },
        });
      }

      // Format list of consignments
      const consignmentList = consignments
        .map((c, idx) => {
          const date = new Date(c.booking_date).toLocaleDateString();
          const amount = c.total || c.amount || 0;
          return `${idx + 1}. **${c.consignment_number}** | ${
            c.receiver || "N/A"
          } | ₹${amount} | ${c.status} | ${date}`;
        })
        .join("\n");

      return res.json({
        success: true,
        data: {
          type: "date_range_list",
          message: `📋 **Consignments from ${dateRange.fromDate} to ${dateRange.toDate}**\n\n(${consignments.length} found)\n\n${consignmentList}`,
          count: consignments.length,
          consignments: consignments.map((c) => formatBookingResponse(c)),
        },
      });
    }

    // Try to extract consignment number
    const consignmentNo = parseConsignmentNumber(message);

    if (!consignmentNo) {
      return res.json({
        success: true,
        data: {
          type: "unclear",
          message:
            "I couldn't find a consignment number or date range in your message. Could you please provide:\n\n• **Consignment Number** (e.g., CN12345, TEST9348, C0001)\n• **OR Date Range** (e.g., from 2024-01-01 to 2024-12-31)\n• Or say 'help' for guidance",
        },
      });
    }

    // Query database for booking
    const db = getDb();
    // Trim and normalize consignment number
    const normalizedConsignmentNo = consignmentNo.trim();

    const [bookings] = await db.query(
      `SELECT DISTINCT b.*, i.id as invoice_id, i.invoice_number 
       FROM bookings b
       LEFT JOIN invoice_items ii ON b.id = ii.booking_id
       LEFT JOIN invoices i ON ii.invoice_id = i.id
       WHERE LOWER(b.consignment_number) = LOWER(?) AND b.franchise_id = ?`,
      [normalizedConsignmentNo, franchiseId]
    );

    if (bookings.length === 0) {
      return res.json({
        success: true,
        data: {
          type: "not_found",
          message: `I couldn't find a consignment with number "${consignmentNo}". Please check the number and try again, or contact support if you need help.`,
          consignmentNo,
        },
      });
    }

    const booking = bookings[0];
    const formattedData = formatBookingResponse(booking);

    // Create conversational response
    let statusEmoji = "📦";
    const status = booking.status?.toLowerCase() || "";
    if (status === "delivered") statusEmoji = "✅";
    else if (status === "out for delivery") statusEmoji = "🚚";
    else if (status === "in transit") statusEmoji = "🚁";
    else if (status === "cancelled") statusEmoji = "❌";

    // Determine payment status emoji
    let paymentEmoji = "💳";
    const paymentStatus = booking.payment_status?.toLowerCase() || "pending";
    if (paymentStatus === "paid") paymentEmoji = "✅";
    else if (paymentStatus === "pending") paymentEmoji = "⏳";
    else if (paymentStatus === "overdue") paymentEmoji = "⚠️";

    const bookingDateFormatted = new Date(
      formattedData.bookingDate
    ).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const conversationalMessage = `${statusEmoji} **Consignment Details**

📌 **Consignment Number:** ${formattedData.consignmentNo}
👤 **Customer ID:** ${formattedData.customerId}
👤 **Receiver Name:** ${formattedData.receiverName}
📍 **Destination:** ${formattedData.destination}
📦 **Weight:** ${formattedData.weight} kg
📦 **Quantity:** ${formattedData.pieces} piece(s)
✈️ **Mode/Service:** ${formattedData.mode}
📅 **Booking Date:** ${bookingDateFormatted}

💰 **Amount:** ₹${formattedData.total.toFixed(2)}
${paymentEmoji} **Payment Status:** ${(
      formattedData.paymentStatus || "Pending"
    ).toUpperCase()}
🔴 **Delivery Status:** ${(formattedData.status || "Booked").toUpperCase()}
📦 **Type:** ${formattedData.consignmentType}${
      formattedData.remarks ? `\n📝 **Remarks:** ${formattedData.remarks}` : ""
    }`;

    res.json({
      success: true,
      data: {
        type: "booking_found",
        message: conversationalMessage,
        booking: formattedData,
      },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process your message",
    });
  }
};

// Get booking by consignment for chatbot (non-conversational)
export const getConsignmentForChat = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const normalizedConsignmentNo = req.params.consignmentNo?.trim();
    const db = getDb();

    const [bookings] = await db.query(
      `SELECT DISTINCT b.*, i.id as invoice_id, i.invoice_number 
       FROM bookings b
       LEFT JOIN invoice_items ii ON b.id = ii.booking_id
       LEFT JOIN invoices i ON ii.invoice_id = i.id
       WHERE LOWER(b.consignment_number) = LOWER(?) AND b.franchise_id = ?`,
      [normalizedConsignmentNo, franchiseId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Consignment not found",
      });
    }

    const booking = bookings[0];
    res.json({
      success: true,
      data: formatBookingResponse(booking),
    });
  } catch (error) {
    console.error("Get consignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch consignment details",
    });
  }
};
