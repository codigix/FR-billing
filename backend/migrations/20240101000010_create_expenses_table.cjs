/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("expenses", (table) => {
    table.increments("id").primary();
    table.integer("franchise_id").unsigned().notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.date("expense_date").notNullable();
    table.string("category", 100).notNullable(); // Fuel, Rent, Salary, Utilities, etc.
    table.string("description", 500).notNullable();
    table.decimal("amount", 10, 2).notNullable();
    table
      .enum("payment_mode", ["cash", "online", "card", "bank_transfer"])
      .defaultTo("cash");
    table.string("bill_number", 50);
    table.string("vendor_name", 255);
    table.text("remarks");
    table
      .enum("status", ["approved", "pending", "rejected"])
      .defaultTo("pending");
    table.timestamps(true, true);

    table
      .foreign("franchise_id")
      .references("franchises.id")
      .onDelete("CASCADE");
    table.foreign("user_id").references("users.id").onDelete("CASCADE");
    table.index(["franchise_id", "expense_date"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("expenses");
};
