import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const InvoiceGeneratePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [searchInvoiceInput, setSearchInvoiceInput] = useState("");
  const [searchedInvoices, setSearchedInvoices] = useState([]);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
    customer_gst: "",
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: "",
    discount: 0,
    notes: "",
    terms_conditions: "Payment due within 30 days",
  });

  const [items, setItems] = useState([
    {
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      booking_id: null,
    },
  ]);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [items, formData.discount]);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings", {
        params: { limit: 100, payment_status: "unpaid" },
      });
      if (response.data.success) {
        setBookings(response.data.data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "quantity" || field === "rate") {
      newItems[index].amount = (
        parseFloat(newItems[index].quantity || 0) *
        parseFloat(newItems[index].rate || 0)
      ).toFixed(2);
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
        booking_id: null,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const addBookingToInvoice = (booking) => {
    const newItem = {
      description: `Booking ${booking.booking_number} - ${booking.consignment_number}`,
      quantity: 1,
      rate: booking.total_amount,
      amount: booking.total_amount,
      booking_id: booking.id,
    };

    setItems([...items, newItem]);
    setSelectedBookings([...selectedBookings, booking.id]);

    // Auto-fill customer details from booking
    if (!formData.customer_name) {
      setFormData({
        ...formData,
        customer_name: booking.sender_name,
        customer_phone: booking.sender_phone,
        customer_address: booking.sender_address,
      });
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    const discount = parseFloat(formData.discount || 0);
    const taxableAmount = subtotal - discount;
    const gstAmount = taxableAmount * 0.18; // 18% GST
    const totalAmount = taxableAmount + gstAmount;

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totals = calculateTotals();

    const invoiceData = {
      ...formData,
      items: items.map((item) => ({
        booking_id: item.booking_id,
        description: item.description,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        amount: parseFloat(item.amount),
      })),
      subtotal: parseFloat(totals.subtotal),
      gst_amount: parseFloat(totals.gstAmount),
      discount: parseFloat(formData.discount || 0),
      total_amount: parseFloat(totals.totalAmount),
    };

    try {
      setLoading(true);
      await api.post("/invoices", invoiceData);
      alert("Invoice generated successfully");
      navigate("/invoices");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInvoices = async () => {
    if (!searchInvoiceInput.trim()) {
      alert("Please enter an invoice number or customer ID");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/invoices?invoice_number=${searchInvoiceInput}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setSearchedInvoices(data.data || []);
      } else {
        setSearchedInvoices([]);
      }
    } catch (error) {
      console.error("Error searching invoices:", error);
      alert("Failed to search invoices");
    }
  };

  const handleDownloadInvoice = async (invoiceId, invoiceNumber) => {
    try {
      setDownloadingInvoiceId(invoiceId);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/invoices/${invoiceId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Invoice download failed");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download invoice");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Generate Invoice</h1>

        {/* Search and Download Invoices Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Search & Download Invoices
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter invoice number..."
              value={searchInvoiceInput}
              onChange={(e) => setSearchInvoiceInput(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              onClick={handleSearchInvoices}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {searchedInvoices.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 border-b">
                    <th className="px-2 py-1 text-left font-semibold">
                      Invoice Number
                    </th>
                    <th className="px-2 py-1 text-left font-semibold">
                      Customer ID
                    </th>
                    <th className="px-2 py-1 text-left font-semibold">
                      Invoice Date
                    </th>
                    <th className="px-2 py-1 text-right font-semibold">
                      Total Amount
                    </th>
                    <th className="px-2 py-1 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchedInvoices.map((invoice, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-100">
                      <td className="px-2 py-1 font-medium">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-2 py-1">
                        {invoice.customer_id || "N/A"}
                      </td>
                      <td className="px-2 py-1">
                        {invoice.invoice_date
                          ? new Date(invoice.invoice_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-2 py-1 text-right">
                        ₹{parseFloat(invoice.total_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-center">
                        <button
                          onClick={() =>
                            handleDownloadInvoice(
                              invoice.id,
                              invoice.invoice_number
                            )
                          }
                          disabled={downloadingInvoiceId === invoice.id}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                        >
                          {downloadingInvoiceId === invoice.id
                            ? "Downloading..."
                            : "Download"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {searchedInvoices.length === 0 && searchInvoiceInput && (
            <p className="text-center text-gray-500 mt-4">
              No invoices found for the search criteria.
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          {/* Customer Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer Phone
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer Email
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  GST Number
                </label>
                <input
                  type="text"
                  name="customer_gst"
                  value={formData.customer_gst}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Customer Address
                </label>
                <textarea
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Invoice Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Invoice Date
                </label>
                <input
                  type="date"
                  name="invoice_date"
                  value={formData.invoice_date}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Discount
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold">Invoice Items</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(true)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Add from Bookings
                </button>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left w-24">Qty</th>
                    <th className="px-4 py-2 text-left w-32">Rate</th>
                    <th className="px-4 py-2 text-left w-32">Amount</th>
                    <th className="px-4 py-2 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          required
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          required
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(index, "rate", e.target.value)
                          }
                          required
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.amount}
                          readOnly
                          className="w-full border rounded px-2 py-1 bg-gray-50"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          className="text-red-600 hover:text-red-900 disabled:opacity-30"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="mb-6 bg-gray-50 p-4 rounded">
            <div className="max-w-md ml-auto">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{totals.subtotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Discount:</span>
                <span className="font-semibold">₹{totals.discount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Taxable Amount:</span>
                <span className="font-semibold">₹{totals.taxableAmount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>GST (18%):</span>
                <span className="font-semibold">₹{totals.gstAmount}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total Amount:</span>
                <span>₹{totals.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  name="terms_conditions"
                  value={formData.terms_conditions}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/invoices")}
              className="px-6 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Invoice"}
            </button>
          </div>
        </form>
      </div>

      {/* Booking Selection Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Select Bookings</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No unpaid bookings available
                </p>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded p-3 hover:bg-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold">
                        {booking.booking_number} - {booking.consignment_number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.sender_name} → {booking.receiver_name}
                      </div>
                      <div className="text-sm font-semibold text-blue-600">
                        ₹{booking.total_amount}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addBookingToInvoice(booking);
                        setShowBookingModal(false);
                      }}
                      disabled={selectedBookings.includes(booking.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {selectedBookings.includes(booking.id) ? "Added" : "Add"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGeneratePage;
