/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("payments", (table) => {
    table.increments("id").primary();
    table.integer("franchise_id").unsigned().notNullable();
    table.integer("invoice_id").unsigned();
    table.integer("booking_id").unsigned();
    table.string("payment_number", 50).notNullable().unique();
    table.date("payment_date").notNullable();
    table.decimal("amount", 10, 2).notNullable();
    table
      .enum("payment_mode", [
        "cash",
        "online",
        "card",
        "upi",
        "bank_transfer",
        "cheque",
      ])
      .notNullable();
    table.string("transaction_id", 100);
    table.string("cheque_number", 50);
    table.date("cheque_date");
    table.string("bank_name", 100);
    table.text("remarks");
    table
      .enum("status", ["completed", "pending", "failed", "refunded"])
      .defaultTo("completed");
    table.timestamps(true, true);

    table
      .foreign("franchise_id")
      .references("franchises.id")
      .onDelete("CASCADE");
    table.foreign("invoice_id").references("invoices.id").onDelete("SET NULL");
    table.foreign("booking_id").references("bookings.id").onDelete("SET NULL");
    table.index(["franchise_id", "payment_date"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("payments");
};
