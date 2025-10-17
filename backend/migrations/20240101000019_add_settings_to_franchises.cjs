/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("franchises", (table) => {
    // Settings fields
    table.boolean("invoice_round_off").defaultTo(false);
    table.integer("invoice_start_from").defaultTo(1);
    table.boolean("show_image_on_invoice").defaultTo(true);
    table.string("invoice_year", 50).defaultTo("current");
    table.text("invoice_data_to_hide").defaultTo("[]");
    table.timestamp("settings_updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("franchises", (table) => {
    table.dropColumn("invoice_round_off");
    table.dropColumn("invoice_start_from");
    table.dropColumn("show_image_on_invoice");
    table.dropColumn("invoice_year");
    table.dropColumn("invoice_data_to_hide");
    table.dropColumn("settings_updated_at");
  });
};
