/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("stationary", (table) => {
    table.increments("id").primary();
    table.integer("franchise_id").unsigned().notNullable();
    table.string("item_name", 255).notNullable();
    table.string("item_code", 50).notNullable();
    table.text("description");
    table.integer("quantity").defaultTo(0);
    table.decimal("unit_price", 10, 2).notNullable();
    table.string("unit", 50).defaultTo("piece");
    table.integer("minimum_stock").defaultTo(10);
    table.enum("status", ["active", "inactive"]).defaultTo("active");
    table.timestamps(true, true);

    table
      .foreign("franchise_id")
      .references("franchises.id")
      .onDelete("CASCADE");
    table.unique(["franchise_id", "item_code"]);
    table.index("franchise_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("stationary");
};
