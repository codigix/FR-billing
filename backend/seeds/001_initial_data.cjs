const bcrypt = require("bcryptjs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Clear existing data in reverse order of dependencies
  await knex("tracking").del();
  await knex("expenses").del();
  await knex("payments").del();
  await knex("invoice_items").del();
  await knex("invoices").del();
  await knex("bookings").del();
  await knex("stationary").del();
  await knex("rate_master").del();
  await knex("users").del();
  await knex("franchises").del();

  // Insert franchise
  const [franchiseId] = await knex("franchises").insert({
    franchise_code: "FR001",
    franchise_name: "Mumbai Central Franchise",
    owner_name: "Rajesh Kumar",
    email: "rajesh@frbilling.com",
    phone: "+91 9876543210",
    whatsapp: "+91 9876543210",
    address: "123, Marine Drive, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    gst_number: "27AAAAA0000A1Z5",
    subscription_start_date: "2024-01-01",
    subscription_end_date: "2024-12-31",
    subscription_status: "active",
    subscription_days_remaining: 245,
    status: "active",
  });

  // Hash password for users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Insert users
  await knex("users").insert([
    {
      franchise_id: franchiseId,
      username: "admin",
      email: "admin@frbilling.com",
      password: hashedPassword,
      full_name: "Admin User",
      phone: "+91 9876543210",
      role: "admin",
      status: "active",
    },
    {
      franchise_id: franchiseId,
      username: "cashier1",
      email: "cashier@frbilling.com",
      password: hashedPassword,
      full_name: "Ramesh Sharma",
      phone: "+91 9876543211",
      role: "cashier",
      status: "active",
    },
  ]);

  // Insert rate master data
  await knex("rate_master").insert([
    {
      franchise_id: franchiseId,
      from_pincode: "400001",
      to_pincode: "110001",
      service_type: "Surface",
      weight_from: 0,
      weight_to: 5,
      rate: 50.0,
      fuel_surcharge: 5.0,
      gst_percentage: 18.0,
      status: "active",
    },
    {
      franchise_id: franchiseId,
      from_pincode: "400001",
      to_pincode: "110001",
      service_type: "Air",
      weight_from: 0,
      weight_to: 5,
      rate: 120.0,
      fuel_surcharge: 10.0,
      gst_percentage: 18.0,
      status: "active",
    },
    {
      franchise_id: franchiseId,
      from_pincode: "400001",
      to_pincode: "560001",
      service_type: "Express",
      weight_from: 0,
      weight_to: 5,
      rate: 200.0,
      fuel_surcharge: 15.0,
      gst_percentage: 18.0,
      status: "active",
    },
  ]);

  // Insert stationary items
  await knex("stationary").insert([
    {
      franchise_id: franchiseId,
      item_name: "Consignment Note Book",
      item_code: "CNB001",
      description: "Pre-printed consignment note book (100 pages)",
      quantity: 50,
      unit_price: 150.0,
      unit: "book",
      minimum_stock: 10,
      status: "active",
    },
    {
      franchise_id: franchiseId,
      item_name: "Packing Tape",
      item_code: "TAPE001",
      description: "Brown packing tape (2 inch x 65 meters)",
      quantity: 200,
      unit_price: 35.0,
      unit: "roll",
      minimum_stock: 50,
      status: "active",
    },
    {
      franchise_id: franchiseId,
      item_name: "Bubble Wrap",
      item_code: "BW001",
      description: "Bubble wrap roll (1.5m x 10m)",
      quantity: 30,
      unit_price: 250.0,
      unit: "roll",
      minimum_stock: 10,
      status: "active",
    },
  ]);

  // Insert sample bookings (insert individually to get IDs)
  const [booking1Id] = await knex("bookings").insert({
    franchise_id: franchiseId,
    booking_number: "BK20240001",
    consignment_number: "CN20240001",
    booking_date: "2024-01-15",
    sender_name: "Amit Patel",
    sender_phone: "+91 9876543212",
    sender_address: "45, MG Road",
    sender_pincode: "400001",
    sender_city: "Mumbai",
    sender_state: "Maharashtra",
    receiver_name: "Suresh Reddy",
    receiver_phone: "+91 9876543213",
    receiver_address: "12, Brigade Road",
    receiver_pincode: "560001",
    receiver_city: "Bangalore",
    receiver_state: "Karnataka",
    service_type: "Surface",
    weight: 2.5,
    pieces: 1,
    content_description: "Documents",
    declared_value: 1000.0,
    freight_charge: 100.0,
    fuel_surcharge: 10.0,
    gst_amount: 19.8,
    other_charges: 0,
    total_amount: 129.8,
    payment_mode: "cash",
    payment_status: "paid",
    paid_amount: 129.8,
    status: "in_transit",
  });

  const [booking2Id] = await knex("bookings").insert({
    franchise_id: franchiseId,
    booking_number: "BK20240002",
    consignment_number: "CN20240002",
    booking_date: "2024-01-15",
    sender_name: "Priya Sharma",
    sender_phone: "+91 9876543214",
    sender_address: "78, Linking Road",
    sender_pincode: "400001",
    sender_city: "Mumbai",
    sender_state: "Maharashtra",
    receiver_name: "Vikram Singh",
    receiver_phone: "+91 9876543215",
    receiver_address: "90, Connaught Place",
    receiver_pincode: "110001",
    receiver_city: "Delhi",
    receiver_state: "Delhi",
    service_type: "Air",
    weight: 1.0,
    pieces: 1,
    content_description: "Electronics",
    declared_value: 5000.0,
    freight_charge: 120.0,
    fuel_surcharge: 10.0,
    gst_amount: 23.4,
    other_charges: 0,
    total_amount: 153.4,
    payment_mode: "online",
    payment_status: "paid",
    paid_amount: 153.4,
    status: "booked",
  });

  // Insert tracking data
  await knex("tracking").insert([
    {
      booking_id: booking1Id,
      consignment_number: "CN20240001",
      status: "Booked",
      location: "Mumbai Central",
      remarks: "Consignment booked successfully",
      status_date: "2024-01-15 10:30:00",
      updated_by: "Admin User",
    },
    {
      booking_id: booking1Id,
      consignment_number: "CN20240001",
      status: "In Transit",
      location: "Mumbai Hub",
      remarks: "Dispatched from Mumbai",
      status_date: "2024-01-15 18:00:00",
      updated_by: "System",
    },
    {
      booking_id: booking2Id,
      consignment_number: "CN20240002",
      status: "Booked",
      location: "Mumbai Central",
      remarks: "Consignment booked successfully",
      status_date: "2024-01-15 14:00:00",
      updated_by: "Admin User",
    },
  ]);

  // Insert sample invoice
  const [invoiceId] = await knex("invoices").insert({
    franchise_id: franchiseId,
    invoice_number: "INV20240001",
    invoice_date: "2024-01-15",
    due_date: "2024-01-30",
    customer_name: "ABC Logistics Pvt Ltd",
    customer_phone: "+91 9876543220",
    customer_email: "accounts@abclogistics.com",
    customer_address: "456, Industrial Area, Mumbai",
    customer_gst: "27BBBBB1111B1Z5",
    subtotal: 5000.0,
    gst_amount: 900.0,
    discount: 0,
    total_amount: 5900.0,
    paid_amount: 0,
    balance_amount: 5900.0,
    payment_status: "unpaid",
    notes: "Payment due in 15 days",
    status: "sent",
  });

  // Insert invoice items
  await knex("invoice_items").insert([
    {
      invoice_id: invoiceId,
      booking_id: booking1Id,
      description: "Surface Freight - Mumbai to Bangalore (CN20240001)",
      quantity: 1,
      unit_price: 2500.0,
      gst_percentage: 18.0,
      amount: 2500.0,
    },
    {
      invoice_id: invoiceId,
      booking_id: booking2Id,
      description: "Air Freight - Mumbai to Delhi (CN20240002)",
      quantity: 1,
      unit_price: 2500.0,
      gst_percentage: 18.0,
      amount: 2500.0,
    },
  ]);

  // Insert sample payments
  await knex("payments").insert([
    {
      franchise_id: franchiseId,
      booking_id: booking1Id,
      payment_number: "PAY20240001",
      payment_date: "2024-01-15",
      amount: 129.8,
      payment_mode: "cash",
      transaction_id: null,
      remarks: "Cash payment at booking",
      status: "completed",
    },
    {
      franchise_id: franchiseId,
      booking_id: booking2Id,
      payment_number: "PAY20240002",
      payment_date: "2024-01-15",
      amount: 153.4,
      payment_mode: "upi",
      transaction_id: "UPI123456789",
      remarks: "UPI payment",
      status: "completed",
    },
  ]);

  // Insert sample expenses
  const [userId] = await knex("users")
    .where({ username: "admin" })
    .select("id");
  await knex("expenses").insert([
    {
      franchise_id: franchiseId,
      user_id: userId.id,
      expense_date: "2024-01-15",
      category: "Fuel",
      description: "Petrol for delivery vehicle",
      amount: 2000.0,
      payment_mode: "cash",
      bill_number: "FUEL001",
      vendor_name: "HP Petrol Pump",
      status: "approved",
    },
    {
      franchise_id: franchiseId,
      user_id: userId.id,
      expense_date: "2024-01-15",
      category: "Utilities",
      description: "Office electricity bill",
      amount: 1500.0,
      payment_mode: "online",
      bill_number: "EB123456",
      vendor_name: "MSEB",
      status: "approved",
    },
  ]);
};
