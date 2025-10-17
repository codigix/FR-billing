/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.integer("franchise_id").unsigned().notNullable();
    table.string("username", 100).notNullable().unique();
    table.string("email", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.string("full_name", 255).notNullable();
    table.string("phone", 20);
    table
      .enum("role", ["admin", "franchisee", "staff", "cashier"])
      .defaultTo("staff");
    table.enum("status", ["active", "inactive"]).defaultTo("active");
    table.timestamp("last_login");
    table.timestamps(true, true);

    table
      .foreign("franchise_id")
      .references("franchises.id")
      .onDelete("CASCADE");
    table.index("franchise_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
