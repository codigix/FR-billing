/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("bookings", (table) => {
    table.increments("id").primary();
    table.integer("franchise_id").unsigned().notNullable();
    table.string("booking_number", 50).notNullable().unique();
    table.string("consignment_number", 50).notNullable().unique();
    table.date("booking_date").notNullable();

    // Sender details
    table.string("sender_name", 255).notNullable();
    table.string("sender_phone", 20).notNullable();
    table.text("sender_address");
    table.string("sender_pincode", 10).notNullable();
    table.string("sender_city", 100);
    table.string("sender_state", 100);

    // Receiver details
    table.string("receiver_name", 255).notNullable();
    table.string("receiver_phone", 20).notNullable();
    table.text("receiver_address");
    table.string("receiver_pincode", 10).notNullable();
    table.string("receiver_city", 100);
    table.string("receiver_state", 100);

    // Package details
    table.string("service_type", 50).notNullable(); // Surface, Air, Express
    table.decimal("weight", 10, 2).notNullable();
    table.integer("pieces").defaultTo(1);
    table.text("content_description");
    table.decimal("declared_value", 10, 2).defaultTo(0);

    // Billing details
    table.decimal("freight_charge", 10, 2).notNullable();
    table.decimal("fuel_surcharge", 10, 2).defaultTo(0);
    table.decimal("gst_amount", 10, 2).defaultTo(0);
    table.decimal("other_charges", 10, 2).defaultTo(0);
    table.decimal("total_amount", 10, 2).notNullable();

    // Payment details
    table
      .enum("payment_mode", ["cash", "online", "card", "to_pay"])
      .defaultTo("cash");
    table
      .enum("payment_status", ["paid", "unpaid", "partial"])
      .defaultTo("unpaid");
    table.decimal("paid_amount", 10, 2).defaultTo(0);

    // Status
    table
      .enum("status", [
        "booked",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ])
      .defaultTo("booked");
    table.text("remarks");

    table.timestamps(true, true);

    table
      .foreign("franchise_id")
      .references("franchises.id")
      .onDelete("CASCADE");
    table.index(["franchise_id", "booking_date"]);
    table.index("consignment_number");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("bookings");
};
