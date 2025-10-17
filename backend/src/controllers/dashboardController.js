import { getDb } from "../config/database.js";
import dayjs from "dayjs";

export const getDashboardStats = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const db = getDb();
    const today = dayjs().format("YYYY-MM-DD");
    const monthStart = dayjs().startOf("month").format("YYYY-MM-DD");
    const monthEnd = dayjs().endOf("month").format("YYYY-MM-DD");

    // Subscription info
    const [franchises] = await db.query(
      `SELECT subscription_status, subscription_days_remaining, subscription_end_date
       FROM franchises WHERE id = ?`,
      [franchiseId]
    );
    const franchise = franchises[0];

    // Due Days Invoices (unpaid or partial)
    const [dueDaysResult] = await db.query(
      `SELECT COUNT(*) as count FROM invoices 
       WHERE franchise_id = ? AND payment_status IN ('unpaid', 'partial')`,
      [franchiseId]
    );

    // Open Consignments (not delivered)
    const [openConsignments] = await db.query(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE franchise_id = ? AND status != 'delivered'`,
      [franchiseId]
    );

    // Today's Cash Collection
    const [todayCash] = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM payments 
       WHERE franchise_id = ? AND payment_date = ? AND payment_mode = 'cash'`,
      [franchiseId, today]
    );

    // This Month's Cash Collection
    const [monthCash] = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM payments 
       WHERE franchise_id = ? AND payment_date BETWEEN ? AND ? AND payment_mode = 'cash'`,
      [franchiseId, monthStart, monthEnd]
    );

    // Today's Bookings
    const [todayBookings] = await db.query(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE franchise_id = ? AND booking_date = ?`,
      [franchiseId, today]
    );

    // This Month's Bookings
    const [monthBookings] = await db.query(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE franchise_id = ? AND booking_date BETWEEN ? AND ?`,
      [franchiseId, monthStart, monthEnd]
    );

    // Revenue from invoices
    const [totalRevenue] = await db.query(
      `SELECT COALESCE(SUM(total_amount), 0) as total FROM invoices 
       WHERE franchise_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`,
      [franchiseId]
    );

    // Paid vs Unpaid invoices
    const [paymentStatus] = await db.query(
      `SELECT payment_status, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total_amount
       FROM invoices 
       WHERE franchise_id = ?
       GROUP BY payment_status`,
      [franchiseId]
    );

    // Recent bookings for activity feed
    const [recentBookings] = await db.query(
      `SELECT consignment_number, customer_id, receiver, 
              amount, status, booking_date, created_at
       FROM bookings 
       WHERE franchise_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [franchiseId]
    );

    // Consignment overview by status
    const [consignmentOverview] = await db.query(
      `SELECT status, COUNT(*) as count, COALESCE(SUM(amount), 0) as total_amount
       FROM bookings 
       WHERE franchise_id = ?
       GROUP BY status`,
      [franchiseId]
    );

    res.json({
      success: true,
      data: {
        subscription: {
          status: franchise.subscription_status,
          daysRemaining: franchise.subscription_days_remaining,
          expiryDate: franchise.subscription_end_date,
        },
        highlights: {
          dueDaysInvoice: dueDaysResult[0].count,
          openConsignment: openConsignments[0].count,
          newPincodes: 0,
        },
        cashCollection: {
          today: parseFloat(todayCash[0].total),
          month: parseFloat(monthCash[0].total),
        },
        bookings: {
          today: todayBookings[0].count,
          month: monthBookings[0].count,
        },
        revenue: parseFloat(totalRevenue[0].total),
        paymentStatus,
        recentBookings,
        consignmentOverview,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

// New endpoint for revenue trends
export const getRevenueTrends = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const db = getDb();
    const days = req.query.days || 30;

    const [trends] = await db.query(
      `SELECT 
        DATE(booking_date) as date,
        COUNT(*) as bookings,
        COALESCE(SUM(amount), 0) as revenue
       FROM bookings 
       WHERE franchise_id = ? AND booking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(booking_date)
       ORDER BY date ASC`,
      [franchiseId, days]
    );

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error("Revenue trends error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue trends",
    });
  }
};

// New endpoint for payment analytics
export const getPaymentAnalytics = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const db = getDb();

    const [analytics] = await db.query(
      `SELECT 
        payment_mode,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total
       FROM payments 
       WHERE franchise_id = ? AND payment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY payment_mode`,
      [franchiseId]
    );

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Payment analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment analytics",
    });
  }
};
