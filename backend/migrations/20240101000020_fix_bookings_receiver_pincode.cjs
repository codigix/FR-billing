/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("bookings", (table) => {
    // Drop receiver_pincode if it still exists (leftover from original migration)
    table.dropColumn("receiver_pincode");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("bookings", (table) => {
    table.string("receiver_pincode", 10).notNullable();
  });
};
