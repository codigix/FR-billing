/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("franchises", (table) => {
    // Financial details
    table.string("cst_number", 50);
    table.string("pan_number", 50);
    table.string("service_tax_number", 50);

    // Bank details
    table.string("account_number", 50);
    table.string("ifsc_code", 50);
    table.string("bank_name", 100);
    table.string("branch_name", 100);
    table.enum("account_type", ["savings", "current", "cc"]);

    // Service charges
    table.decimal("pdf_service_charge", 10, 2).defaultTo(0);
    table.decimal("non_dest_charge", 10, 2).defaultTo(0);

    // Verification flags
    table.boolean("is_gst_verified").defaultTo(false);
    table.boolean("is_approved_receiver").defaultTo(false);
    table.boolean("use_as_consignor").defaultTo(true);

    // Additional details
    table.text("franchisee_remarks");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("franchises", (table) => {
    table.dropColumn("cst_number");
    table.dropColumn("pan_number");
    table.dropColumn("service_tax_number");
    table.dropColumn("account_number");
    table.dropColumn("ifsc_code");
    table.dropColumn("bank_name");
    table.dropColumn("branch_name");
    table.dropColumn("account_type");
    table.dropColumn("pdf_service_charge");
    table.dropColumn("non_dest_charge");
    table.dropColumn("is_gst_verified");
    table.dropColumn("is_approved_receiver");
    table.dropColumn("use_as_consignor");
    table.dropColumn("franchisee_remarks");
  });
};
