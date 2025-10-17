/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // First, truncate the invoices table to avoid data issues
  return knex("invoices")
    .del()
    .then(() => {
      return knex.schema.alterTable("invoices", (table) => {
        // Drop old fields that don't match the reference
        table.dropColumn("customer_name");
        table.dropColumn("customer_phone");
        table.dropColumn("customer_email");
        table.dropColumn("customer_gst");
        table.dropColumn("due_date");
        table.dropColumn("notes");
        table.dropColumn("terms_conditions");
        table.dropColumn("status");
        table.dropColumn("discount");
        table.dropColumn("gst_amount");
        table.dropColumn("subtotal");

        // Add new fields matching the reference images
        table.string("customer_id", 100).notNullable().after("invoice_date");
        table.text("address").after("customer_id");
        table.date("period_from").notNullable().after("address");
        table.date("period_to").notNullable().after("period_from");
        table.string("consignment_no", 50).after("period_to"); // For single invoice

        // Discount and charges
        table
          .boolean("invoice_discount")
          .defaultTo(false)
          .after("consignment_no");
        table
          .boolean("reverse_charge")
          .defaultTo(false)
          .after("invoice_discount");
        table
          .decimal("fuel_surcharge_percent", 5, 2)
          .defaultTo(0)
          .after("reverse_charge");
        table
          .decimal("fuel_surcharge_total", 10, 2)
          .defaultTo(0)
          .after("fuel_surcharge_percent");
        table
          .decimal("discount_percent", 5, 2)
          .defaultTo(0)
          .after("fuel_surcharge_total");
        table
          .decimal("discount_amount", 10, 2)
          .defaultTo(0)
          .after("discount_percent");
        table
          .decimal("gst_percent", 5, 2)
          .defaultTo(18)
          .after("discount_amount");
        table
          .decimal("gst_amount_new", 10, 2)
          .defaultTo(0)
          .after("gst_percent");
        table
          .decimal("other_charge", 10, 2)
          .defaultTo(0)
          .after("gst_amount_new");
        table
          .decimal("royalty_charge", 10, 2)
          .defaultTo(0)
          .after("other_charge");
        table
          .decimal("docket_charge", 10, 2)
          .defaultTo(0)
          .after("royalty_charge");
        table
          .decimal("subtotal_amount", 10, 2)
          .defaultTo(0)
          .after("docket_charge");
        table
          .decimal("net_amount", 10, 2)
          .defaultTo(0)
          .after("subtotal_amount");

        // Modify total_amount to match 'total' field in images
        table.decimal("total_amount", 10, 2).defaultTo(0).alter();
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("invoices", (table) => {
    // Remove new columns
    table.dropColumn("customer_id");
    table.dropColumn("address");
    table.dropColumn("period_from");
    table.dropColumn("period_to");
    table.dropColumn("consignment_no");
    table.dropColumn("invoice_discount");
    table.dropColumn("reverse_charge");
    table.dropColumn("fuel_surcharge_percent");
    table.dropColumn("fuel_surcharge_total");
    table.dropColumn("discount_percent");
    table.dropColumn("discount_amount");
    table.dropColumn("gst_percent");
    table.dropColumn("gst_amount_new");
    table.dropColumn("other_charge");
    table.dropColumn("royalty_charge");
    table.dropColumn("docket_charge");
    table.dropColumn("subtotal_amount");
    table.dropColumn("net_amount");

    // Add back old columns
    table.string("customer_name", 255).notNullable();
    table.string("customer_phone", 20);
    table.string("customer_email", 255);
    table.text("customer_address");
    table.string("customer_gst", 50);
    table.date("due_date");
    table.decimal("subtotal", 10, 2).notNullable();
    table.decimal("gst_amount", 10, 2).defaultTo(0);
    table.decimal("discount", 10, 2).defaultTo(0);
    table.text("notes");
    table.text("terms_conditions");
    table
      .enum("status", ["draft", "sent", "paid", "cancelled"])
      .defaultTo("draft");
  });
};
