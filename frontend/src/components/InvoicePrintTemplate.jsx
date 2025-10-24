import React from "react";

export default function InvoicePrintTemplate({ invoice, bookings = [] }) {
  // Codigix Infotech brand colors
  const colors = {
    primary: "#1e40af", // Deep blue
    accent: "#dc2626", // Vibrant red
    lightBg: "#f0f9ff", // Light blue background
    borderColor: "#dbeafe",
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      {/* Header Section */}
      <div
        style={{
          borderBottom: `3px solid ${colors.primary}`,
          marginBottom: "2rem",
        }}
      >
        <div className="flex justify-between items-start mb-4">
          {/* Company Logo and Name */}
          <div>
            <div
              style={{
                color: colors.primary,
                fontSize: "2rem",
                fontWeight: "900",
                letterSpacing: "-1px",
              }}
            >
              CODIGIX INFOTECH
            </div>
            <div
              style={{
                color: colors.accent,
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              ✓ Premium Logistics & Billing Solutions
            </div>
          </div>

          {/* Invoice Title */}
          <div className="text-right">
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: colors.primary,
                marginBottom: "0.5rem",
              }}
            >
              INVOICE
            </div>
            <div style={{ color: "#666", fontSize: "0.875rem" }}>
              {invoice?.invoice_number || "INV/2025/0001"}
            </div>
          </div>
        </div>

        {/* Company Contact Info */}
        <div className="grid grid-cols-3 gap-4 pt-4 text-sm">
          <div>
            <div style={{ color: colors.primary, fontWeight: "600" }}>
              CODIGIX INFOTECH
            </div>
            <div
              style={{
                color: "#666",
                fontSize: "0.75rem",
                marginTop: "0.25rem",
              }}
            >
              Corporate Office
            </div>
            <div style={{ color: "#666", fontSize: "0.75rem" }}>
              Mumbai, India
            </div>
            <div style={{ color: colors.primary, marginTop: "0.5rem" }}>
              📧 info@codigix.com
            </div>
          </div>
          <div>
            <div style={{ color: colors.primary, fontWeight: "600" }}>
              Invoice Date
            </div>
            <div style={{ marginTop: "0.25rem" }}>
              {formatDate(invoice?.invoice_date)}
            </div>
          </div>
          <div>
            <div style={{ color: colors.primary, fontWeight: "600" }}>
              Bill To
            </div>
            <div style={{ marginTop: "0.25rem", fontWeight: "600" }}>
              {invoice?.customer_id || "Customer"}
            </div>
            <div style={{ color: "#666", fontSize: "0.75rem" }}>
              {invoice?.address || "Billing Address"}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details Section */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <div
              style={{
                color: colors.primary,
                fontWeight: "700",
                marginBottom: "0.5rem",
              }}
            >
              Bill To:
            </div>
            <div style={{ color: "#333", fontWeight: "600" }}>
              {invoice?.customer_id}
            </div>
            <div
              style={{
                color: "#666",
                fontSize: "0.875rem",
                marginTop: "0.5rem",
              }}
            >
              {invoice?.address}
            </div>
          </div>

          {/* Right Column - Invoice Details */}
          <div className="text-right">
            <div className="grid grid-cols-2 gap-4">
              <div style={{ color: "#666", fontSize: "0.875rem" }}>
                Invoice No.:
              </div>
              <div style={{ fontWeight: "700" }}>{invoice?.invoice_number}</div>

              <div style={{ color: "#666", fontSize: "0.875rem" }}>Period:</div>
              <div style={{ fontSize: "0.875rem" }}>
                {formatDate(invoice?.period_from)} to{" "}
                {formatDate(invoice?.period_to)}
              </div>

              <div style={{ color: "#666", fontSize: "0.875rem" }}>Status:</div>
              <div
                style={{
                  fontWeight: "600",
                  color:
                    invoice?.payment_status === "paid"
                      ? "#059669"
                      : colors.accent,
                }}
              >
                {(invoice?.payment_status || "Unpaid").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          {/* Table Header */}
          <thead>
            <tr style={{ backgroundColor: colors.primary, color: "white" }}>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  fontWeight: "600",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                Consignment No.
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  fontWeight: "600",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                Receiver
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  fontWeight: "600",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                Destination
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "right",
                  fontWeight: "600",
                }}
              >
                Amount
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {bookings && bookings.length > 0 ? (
              bookings.map((booking, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: idx % 2 === 0 ? colors.lightBg : "white",
                    borderBottom: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <td
                    style={{
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: colors.primary,
                    }}
                  >
                    {booking.consignment_number || booking.consignment_no}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      color: "#333",
                    }}
                  >
                    {booking.receiver || "—"}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      color: "#666",
                    }}
                  >
                    {booking.destination || "—"}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      textAlign: "right",
                      fontWeight: "600",
                      color: colors.primary,
                    }}
                  >
                    {formatCurrency(booking.amount || booking.total || 0)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    padding: "1.5rem",
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  No consignments in this invoice
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Notes Section */}
        <div>
          <div
            style={{
              color: colors.primary,
              fontWeight: "700",
              marginBottom: "0.5rem",
            }}
          >
            PAYMENT TERMS
          </div>
          <ul
            style={{
              color: "#666",
              fontSize: "0.875rem",
              lineHeight: "1.6",
              listStyleType: "disc",
            }}
          >
            <li style={{ marginLeft: "1.25rem" }}>
              Payment due within 30 days of invoice date
            </li>
            <li style={{ marginLeft: "1.25rem" }}>
              Bank Transfer / Cheque accepted
            </li>
            <li style={{ marginLeft: "1.25rem" }}>
              Late payment charges as per agreement
            </li>
          </ul>
        </div>

        {/* Totals Section */}
        <div>
          <div
            style={{
              border: `2px solid ${colors.borderColor}`,
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
          >
            {/* Subtotal */}
            <div
              className="flex justify-between mb-3 pb-3"
              style={{ borderBottom: `1px solid ${colors.borderColor}` }}
            >
              <span style={{ color: "#666" }}>Subtotal:</span>
              <span style={{ fontWeight: "600" }}>
                {formatCurrency(invoice?.subtotal_amount)}
              </span>
            </div>

            {/* Fuel Surcharge */}
            {invoice?.fuel_surcharge_total > 0 && (
              <div
                className="flex justify-between mb-3 pb-3"
                style={{ borderBottom: `1px solid ${colors.borderColor}` }}
              >
                <span style={{ color: "#666", fontSize: "0.875rem" }}>
                  Fuel Surcharge ({invoice?.fuel_surcharge_percent || 0}%):
                </span>
                <span style={{ fontWeight: "600" }}>
                  {formatCurrency(invoice?.fuel_surcharge_total)}
                </span>
              </div>
            )}

            {/* Other Charges */}
            {invoice?.other_charge > 0 && (
              <div
                className="flex justify-between mb-3 pb-3"
                style={{ borderBottom: `1px solid ${colors.borderColor}` }}
              >
                <span style={{ color: "#666", fontSize: "0.875rem" }}>
                  Other Charges:
                </span>
                <span style={{ fontWeight: "600" }}>
                  {formatCurrency(invoice?.other_charge)}
                </span>
              </div>
            )}

            {/* Docket Charge */}
            {invoice?.docket_charge > 0 && (
              <div
                className="flex justify-between mb-3 pb-3"
                style={{ borderBottom: `1px solid ${colors.borderColor}` }}
              >
                <span style={{ color: "#666", fontSize: "0.875rem" }}>
                  Docket Charge:
                </span>
                <span style={{ fontWeight: "600" }}>
                  {formatCurrency(invoice?.docket_charge)}
                </span>
              </div>
            )}

            {/* Royalty Charge */}
            {invoice?.royalty_charge > 0 && (
              <div
                className="flex justify-between mb-3 pb-3"
                style={{ borderBottom: `1px solid ${colors.borderColor}` }}
              >
                <span style={{ color: "#666", fontSize: "0.875rem" }}>
                  Royalty Charge:
                </span>
                <span style={{ fontWeight: "600" }}>
                  {formatCurrency(invoice?.royalty_charge)}
                </span>
              </div>
            )}

            {/* GST */}
            <div
              className="flex justify-between mb-3 pb-3"
              style={{ borderBottom: `1px solid ${colors.borderColor}` }}
            >
              <span style={{ color: "#666", fontSize: "0.875rem" }}>
                GST ({invoice?.gst_percent || 0}%):
              </span>
              <span style={{ fontWeight: "600" }}>
                {formatCurrency(invoice?.gst_amount_new)}
              </span>
            </div>

            {/* Total Amount */}
            <div
              className="flex justify-between"
              style={{ padding: "0.75rem 0" }}
            >
              <span
                style={{
                  color: colors.primary,
                  fontWeight: "700",
                  fontSize: "1.125rem",
                }}
              >
                TOTAL:
              </span>
              <span
                style={{
                  color: colors.primary,
                  fontWeight: "900",
                  fontSize: "1.25rem",
                }}
              >
                {formatCurrency(invoice?.total_amount)}
              </span>
            </div>

            {/* Balance Amount */}
            <div
              className="flex justify-between mt-2 pt-2"
              style={{ borderTop: `2px solid ${colors.accent}` }}
            >
              <span style={{ color: colors.accent, fontWeight: "700" }}>
                Balance Due:
              </span>
              <span
                style={{
                  color: colors.accent,
                  fontWeight: "900",
                  fontSize: "1.125rem",
                }}
              >
                {formatCurrency(invoice?.balance_amount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: `1px solid ${colors.borderColor}`,
          paddingTop: "1.5rem",
          textAlign: "center",
          color: "#666",
          fontSize: "0.75rem",
          marginTop: "2rem",
        }}
      >
        <p>
          <strong>Thank you for your business!</strong>
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          For queries contact: info@codigix.com | 📞 +91-XXXXXXXXXX
        </p>
        <p
          style={{
            color: colors.primary,
            marginTop: "0.5rem",
            fontWeight: "600",
          }}
        >
          www.codigix.com
        </p>
        <p style={{ marginTop: "1rem", color: "#999", fontSize: "0.7rem" }}>
          This is a computer-generated invoice. No signature is required.
        </p>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .max-w-4xl {
            max-width: 100%;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}
