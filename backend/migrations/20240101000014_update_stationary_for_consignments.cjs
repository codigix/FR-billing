/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("stationary_consignments", (table) => {
    table.increments("id").primary();
    table.integer("franchise_id").unsigned().notNullable();
    table.date("receipt_date").notNullable();
    table.string("start_no", 50).notNullable();
    table.string("end_no", 50).notNullable();
    table.integer("no_of_leafs").notNullable().defaultTo(0);
    table.integer("no_of_books").notNullable().defaultTo(0);
    table.integer("total_consignments").notNullable().defaultTo(0);
    table.integer("used_consignments").notNullable().defaultTo(0);
    table.integer("remaining_consignments").notNullable().defaultTo(0);
    table.enum("type", ["All", "DOX", "NONDOX", "EXPRESS"]).defaultTo("All");
    table.enum("status", ["active", "expired", "depleted"]).defaultTo("active");
    table.timestamps(true, true);

    table
      .foreign("franchise_id")
      .references("franchises.id")
      .onDelete("CASCADE");
    table.index("franchise_id");
    table.index("receipt_date");
    table.index("status");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("stationary_consignments");
};
