/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("rate_master", (table) => {
    table.increments("id").primary();
    table.integer("franchise_id").unsigned().notNullable();
    table.string("from_pincode", 10).notNullable();
    table.string("to_pincode", 10).notNullable();
    table.string("service_type", 50).notNullable(); // Surface, Air, Express
    table.decimal("weight_from", 10, 2).notNullable();
    table.decimal("weight_to", 10, 2).notNullable();
    table.decimal("rate", 10, 2).notNullable();
    table.decimal("fuel_surcharge", 5, 2).defaultTo(0);
    table.decimal("gst_percentage", 5, 2).defaultTo(18);
    table.enum("status", ["active", "inactive"]).defaultTo("active");
    table.timestamps(true, true);

    table
      .foreign("franchise_id")
      .references("franchises.id")
      .onDelete("CASCADE");
    table.index(["franchise_id", "from_pincode", "to_pincode"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("rate_master");
};
