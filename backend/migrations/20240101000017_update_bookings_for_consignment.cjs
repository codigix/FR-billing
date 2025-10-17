/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable("bookings", (table) => {
      // Drop old fields that don't match the reference
      table.dropColumn("booking_number");
      table.dropColumn("sender_name");
      table.dropColumn("sender_phone");
      table.dropColumn("sender_address");
      table.dropColumn("sender_pincode");
      table.dropColumn("sender_city");
      table.dropColumn("sender_state");
      table.dropColumn("receiver_name");
      table.dropColumn("receiver_phone");
      table.dropColumn("receiver_city");
      table.dropColumn("receiver_state");
      table.dropColumn("service_type");
      table.dropColumn("weight");
      table.dropColumn("pieces");
      table.dropColumn("content_description");
      table.dropColumn("declared_value");
      table.dropColumn("freight_charge");
      table.dropColumn("fuel_surcharge");
      table.dropColumn("gst_amount");
      // other_charges, status, remarks - keep these as they already exist
      table.dropColumn("total_amount");
      table.dropColumn("payment_mode");
      table.dropColumn("payment_status");
      table.dropColumn("paid_amount");

      // Add new fields matching the reference images
      table.string("customer_id", 50).notNullable().after("booking_date");
      table.string("receiver", 255).after("customer_id");
      table.text("address").after("receiver");
      table.renameColumn("receiver_address", "temp_receiver_address");
    })
    .then(() => {
      return knex.schema.alterTable("bookings", (table) => {
        table.dropColumn("temp_receiver_address");
        table.string("pincode", 10).after("address");
        table
          .enum("consignment_type", ["Domestic", "International"])
          .defaultTo("Domestic")
          .after("pincode");
        table.string("mode", 50).defaultTo("AR").after("consignment_type");
        table.decimal("act_wt", 10, 2).after("mode"); // Actual Weight
        table.decimal("char_wt", 10, 2).after("act_wt"); // Chargeable Weight
        table.integer("qty").after("char_wt"); // Quantity
        table.string("type", 10).defaultTo("D").after("qty"); // Type (D dropdown)
        table.decimal("amount", 10, 2).after("type");
        table.string("reference", 255).after("other_charges");
        table.decimal("dtdc_amt", 10, 2).defaultTo(0).after("reference");

        // Additional fields for calculations
        table.decimal("insurance", 10, 2).defaultTo(0).after("dtdc_amt");
        table.decimal("percentage", 10, 2).defaultTo(0).after("insurance");
        table.decimal("risk_surcharge", 10, 2).defaultTo(0).after("percentage");
        table
          .decimal("bill_amount", 10, 2)
          .defaultTo(0)
          .after("risk_surcharge");
        table.decimal("total", 10, 2).defaultTo(0).after("bill_amount");
        table.string("destination", 255).after("total");

        // Modify existing columns
        table.string("status", 50).defaultTo("Booked").alter();
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("bookings", (table) => {
    // Remove new columns
    table.dropColumn("customer_id");
    table.dropColumn("receiver");
    table.dropColumn("address");
    table.dropColumn("pincode");
    table.dropColumn("consignment_type");
    table.dropColumn("mode");
    table.dropColumn("act_wt");
    table.dropColumn("char_wt");
    table.dropColumn("qty");
    table.dropColumn("type");
    table.dropColumn("amount");
    table.dropColumn("reference");
    table.dropColumn("dtdc_amt");
    table.dropColumn("insurance");
    table.dropColumn("percentage");
    table.dropColumn("risk_surcharge");
    table.dropColumn("bill_amount");
    table.dropColumn("total");
    table.dropColumn("destination");

    // Add back original fields (partial restoration)
    table.string("booking_number", 50);
    table.string("sender_name", 255);
    table.string("sender_phone", 20);
    table.text("sender_address");
    table.string("sender_pincode", 10);
    table.string("service_type", 50);
    table.decimal("weight", 10, 2);
    table.integer("pieces");
    table.decimal("freight_charge", 10, 2);
    table.decimal("total_amount", 10, 2);
  });
};
