/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("company_rate_master", (table) => {
    table.increments("id").primary();
    table.integer("franchise_id").unsigned().notNullable();
    table.string("company_id", 50).notNullable();
    table.string("company_name", 255).notNullable();
    table.text("company_address").nullable();
    table.string("phone", 20).nullable();
    table.string("email", 100).nullable();

    // Rate fields
    table.decimal("rate", 10, 2).notNullable().defaultTo(0);
    table.decimal("dox_rk", 10, 2).nullable().defaultTo(0);
    table.decimal("minimum_rate_surcharge", 10, 2).nullable().defaultTo(0);
    table.decimal("fuel_surcharge", 10, 2).nullable().defaultTo(0);
    table.decimal("obs_fuel_surcharge", 10, 2).nullable().defaultTo(0);
    table.decimal("royalty_charges", 10, 2).nullable().defaultTo(0);
    table.decimal("eco_bl", 10, 2).nullable().defaultTo(0);
    table.decimal("dox_roce", 10, 2).nullable().defaultTo(0);
    table.decimal("name_average", 10, 2).nullable().defaultTo(0);

    // Additional fields
    table.text("other_remark").nullable();
    table.string("field_u", 100).nullable();
    table.string("field_v", 100).nullable();
    table.string("field_w", 100).nullable();
    table.string("field_h", 100).nullable();

    table.enum("status", ["active", "inactive"]).defaultTo("active");
    table.timestamps(true, true);

    table
      .foreign("franchise_id")
      .references("franchises.id")
      .onDelete("CASCADE");

    table.index(["franchise_id", "status"]);
    table.index("company_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("company_rate_master");
};
