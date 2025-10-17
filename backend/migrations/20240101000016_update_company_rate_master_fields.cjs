/**
 * Migration to update company_rate_master table with new fields matching reference
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("company_rate_master", (table) => {
    // Drop old fields that are not in reference (keeping field_v since we'll reuse it)
    table.dropColumn("rate");
    table.dropColumn("dox_rk");
    table.dropColumn("minimum_rate_surcharge");
    table.dropColumn("fuel_surcharge");
    table.dropColumn("obs_fuel_surcharge");
    table.dropColumn("royalty_charges");
    table.dropColumn("eco_bl");
    table.dropColumn("dox_roce");
    table.dropColumn("name_average");
    table.dropColumn("other_remark");
    table.dropColumn("field_u");
    table.dropColumn("field_w");
    table.dropColumn("field_h");

    // Add new fields from reference image
    table.string("gst_no", 50).nullable();
    table.decimal("insurance_percent", 10, 2).nullable().defaultTo(0);
    table.decimal("minimum_risk_surcharge", 10, 2).nullable().defaultTo(0);
    table.text("other_details").nullable();
    table.decimal("topay_charge", 10, 2).nullable().defaultTo(0);
    table.decimal("cod_charge", 10, 2).nullable().defaultTo(0);
    table.decimal("fuel_surcharge_percent", 10, 2).nullable().defaultTo(0);
    table.decimal("gec_fuel_surcharge_percent", 10, 2).nullable().defaultTo(0);
    table.decimal("royalty_charges_percent", 10, 2).nullable().defaultTo(0);
    table.string("pan_no", 50).nullable();
    table.integer("due_days").nullable().defaultTo(0);

    // Additional fields: D, M, E, V (already exists), I, N, G, B
    table.string("field_d", 100).nullable();
    table.string("field_m", 100).nullable();
    table.string("field_e", 100).nullable();
    // field_v already exists from original migration, so we skip it
    table.string("field_i", 100).nullable();
    table.string("field_n", 100).nullable();
    table.string("field_g", 100).nullable();
    table.string("field_b", 100).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("company_rate_master", (table) => {
    // Restore old fields
    table.decimal("rate", 10, 2).notNullable().defaultTo(0);
    table.decimal("dox_rk", 10, 2).nullable().defaultTo(0);
    table.decimal("minimum_rate_surcharge", 10, 2).nullable().defaultTo(0);
    table.decimal("fuel_surcharge", 10, 2).nullable().defaultTo(0);
    table.decimal("obs_fuel_surcharge", 10, 2).nullable().defaultTo(0);
    table.decimal("royalty_charges", 10, 2).nullable().defaultTo(0);
    table.decimal("eco_bl", 10, 2).nullable().defaultTo(0);
    table.decimal("dox_roce", 10, 2).nullable().defaultTo(0);
    table.decimal("name_average", 10, 2).nullable().defaultTo(0);
    table.text("other_remark").nullable();
    table.string("field_u", 100).nullable();
    table.string("field_w", 100).nullable();
    table.string("field_h", 100).nullable();

    // Drop new fields
    table.dropColumn("gst_no");
    table.dropColumn("insurance_percent");
    table.dropColumn("minimum_risk_surcharge");
    table.dropColumn("other_details");
    table.dropColumn("topay_charge");
    table.dropColumn("cod_charge");
    table.dropColumn("fuel_surcharge_percent");
    table.dropColumn("gec_fuel_surcharge_percent");
    table.dropColumn("royalty_charges_percent");
    table.dropColumn("pan_no");
    table.dropColumn("due_days");
    table.dropColumn("field_d");
    table.dropColumn("field_m");
    table.dropColumn("field_e");
    table.dropColumn("field_i");
    table.dropColumn("field_n");
    table.dropColumn("field_g");
    table.dropColumn("field_b");
  });
};
