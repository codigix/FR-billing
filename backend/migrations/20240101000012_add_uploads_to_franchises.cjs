/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("franchises", (table) => {
    table.string("logo_url", 255);
    table.string("stamp_url", 255);
    table.string("qr_code_url", 255);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("franchises", (table) => {
    table.dropColumn("logo_url");
    table.dropColumn("stamp_url");
    table.dropColumn("qr_code_url");
  });
};
