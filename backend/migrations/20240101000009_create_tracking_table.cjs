/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("tracking", (table) => {
    table.increments("id").primary();
    table.integer("booking_id").unsigned().notNullable();
    table.string("consignment_number", 50).notNullable();
    table.string("status", 100).notNullable();
    table.text("location");
    table.text("remarks");
    table.timestamp("status_date").notNullable();
    table.string("updated_by", 100);
    table.timestamps(true, true);

    table.foreign("booking_id").references("bookings.id").onDelete("CASCADE");
    table.index(["booking_id", "status_date"]);
    table.index("consignment_number");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("tracking");
};
