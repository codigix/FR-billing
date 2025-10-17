/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("invoice_items", (table) => {
    table.increments("id").primary();
    table.integer("invoice_id").unsigned().notNullable();
    table.integer("booking_id").unsigned();
    table.string("description", 500).notNullable();
    table.integer("quantity").defaultTo(1);
    table.decimal("unit_price", 10, 2).notNullable();
    table.decimal("gst_percentage", 5, 2).defaultTo(18);
    table.decimal("amount", 10, 2).notNullable();
    table.timestamps(true, true);

    table.foreign("invoice_id").references("invoices.id").onDelete("CASCADE");
    table.foreign("booking_id").references("bookings.id").onDelete("SET NULL");
    table.index("invoice_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("invoice_items");
};
