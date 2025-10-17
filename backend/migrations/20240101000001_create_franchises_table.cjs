/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("franchises", (table) => {
    table.increments("id").primary();
    table.string("franchise_code", 50).notNullable().unique();
    table.string("franchise_name", 255).notNullable();
    table.string("owner_name", 255).notNullable();
    table.string("email", 255).notNullable().unique();
    table.string("phone", 20).notNullable();
    table.string("whatsapp", 20);
    table.text("address");
    table.string("city", 100);
    table.string("state", 100);
    table.string("pincode", 10);
    table.string("gst_number", 50);
    table.date("subscription_start_date");
    table.date("subscription_end_date");
    table
      .enum("subscription_status", ["active", "expired", "trial"])
      .defaultTo("trial");
    table.integer("subscription_days_remaining").defaultTo(0);
    table
      .enum("status", ["active", "inactive", "suspended"])
      .defaultTo("active");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("franchises");
};
