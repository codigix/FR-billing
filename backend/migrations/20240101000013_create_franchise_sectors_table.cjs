/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("franchise_sectors", (table) => {
    table.increments("id").primary();
    table
      .integer("franchise_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("franchises")
      .onDelete("CASCADE");
    table.string("sector_name", 100).notNullable();
    table.text("pincodes").notNullable(); // Comma-separated pincodes
    table.boolean("dox").defaultTo(false);
    table.boolean("nondox_air").defaultTo(false);
    table.boolean("nondox_sur").defaultTo(false);
    table.boolean("express_cargo").defaultTo(false);
    table.boolean("priority").defaultTo(false);
    table.boolean("ecom_priority").defaultTo(false);
    table.boolean("ecom_ge").defaultTo(false);
    table.integer("priority_sequence").unsigned().defaultTo(0);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("franchise_sectors");
};
