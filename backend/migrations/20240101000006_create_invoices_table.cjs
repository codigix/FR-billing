/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("invoices", (table) => {
    table.increments("id").primary();
    table.integer("franchise_id").unsigned().notNullable();
    table.string("invoice_number", 50).notNullable().unique();
    table.date("invoice_date").notNullable();
    table.date("due_date");

    // Customer details
    table.string("customer_name", 255).notNullable();
    table.string("customer_phone", 20);
    table.string("customer_email", 255);
    table.text("customer_address");
    table.string("customer_gst", 50);

    // Invoice details
    table.decimal("subtotal", 10, 2).notNullable();
    table.decimal("gst_amount", 10, 2).defaultTo(0);
    table.decimal("discount", 10, 2).defaultTo(0);
    table.decimal("total_amount", 10, 2).notNullable();

    // Payment tracking
    table.decimal("paid_amount", 10, 2).defaultTo(0);
    table.decimal("balance_amount", 10, 2).notNullable();
    table
      .enum("payment_status", ["paid", "unpaid", "partial", "overdue"])
      .defaultTo("unpaid");

    table.text("notes");
    table.text("terms_conditions");
    table
      .enum("status", ["draft", "sent", "paid", "cancelled"])
      .defaultTo("draft");

    table.timestamps(true, true);

    table
      .foreign("franchise_id")
      .references("franchises.id")
      .onDelete("CASCADE");
    table.index(["franchise_id", "invoice_date"]);
    table.index("invoice_number");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("invoices");
};
