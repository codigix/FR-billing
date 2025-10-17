import { useState } from "react";
import { Info, FileText, Plus } from "lucide-react";

export default function GenerateSingleInvoicePage() {
  const [formData, setFormData] = useState({
    customer_id: "",
    invoice_no: "",
    invoice_date: new Date().toISOString().split("T")[0],
    period_from: "",
    period_to: "",
    consignment_no: "",
    address: "",
    invoice_discount: false,
    reverse_charge: false,
    gst_percent: 18,
  });

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculations, setCalculations] = useState({
    total: 0,
    fuel_surcharge_tax_percent: 0,
    subtotal: 0,
    royalty_charge: 0,
    docket_charge: 0,
    other_charge: 0,
    net_amount: 0,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddBooking = async () => {
    if (!formData.consignment_no) {
      alert("Please enter a consignment number");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/bookings/consignment/${formData.consignment_no}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setBooking(data.data);
        calculateTotals(data.data);
      } else {
        alert("Booking not found");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      alert("Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (bookingData) => {
    const total = parseFloat(bookingData.total) || 0;
    const subtotal = total;
    const fuelSurcharge = (subtotal * formData.gst_percent) / 100;
    const netAmount = subtotal + fuelSurcharge;

    setCalculations({
      total: total.toFixed(2),
      fuel_surcharge_tax_percent: formData.gst_percent,
      subtotal: subtotal.toFixed(2),
      royalty_charge: 0,
      docket_charge: 0,
      other_charge: 0,
      net_amount: netAmount.toFixed(2),
    });
  };

  const handleGenerate = async () => {
    if (!formData.customer_id || !booking) {
      alert("Please fill all required fields and add a booking");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/invoices/generate-single",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            booking_id: booking.id,
            ...calculations,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Invoice generated successfully!");
        // Reset form
        setFormData({
          customer_id: "",
          invoice_no: "",
          invoice_date: new Date().toISOString().split("T")[0],
          period_from: "",
          period_to: "",
          consignment_no: "",
          address: "",
          invoice_discount: false,
          reverse_charge: false,
          gst_percent: 18,
        });
        setBooking(null);
        setCalculations({
          total: 0,
          fuel_surcharge_tax_percent: 0,
          subtotal: 0,
          royalty_charge: 0,
          docket_charge: 0,
          other_charge: 0,
          net_amount: 0,
        });
      } else {
        alert(data.message || "Failed to generate invoice");
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Failed to generate invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await handleGenerate();
  };

  const handleSendEmail = async () => {
    alert("Send Invoice From Email feature coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Generate SINGLE Invoice
            </h1>
            <p className="text-sm text-slate-500">
              Create invoice for single consignment
            </p>
          </div>
          <Info
            className="h-5 w-5 text-blue-500 cursor-pointer"
            title="Generate invoice for one consignment"
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer Id:
            </label>
            <input
              type="text"
              name="customer_id"
              value={formData.customer_id}
              onChange={handleInputChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Invoice No:
            </label>
            <input
              type="text"
              name="invoice_no"
              value={formData.invoice_no}
              onChange={handleInputChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Invoice Date:
            </label>
            <input
              type="date"
              name="invoice_date"
              value={formData.invoice_date}
              onChange={handleInputChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Period From:
            </label>
            <input
              type="date"
              name="period_from"
              value={formData.period_from}
              onChange={handleInputChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Period To:
            </label>
            <input
              type="date"
              name="period_to"
              value={formData.period_to}
              onChange={handleInputChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              name="consignment_no"
              value={formData.consignment_no}
              onChange={handleInputChange}
              placeholder="Consignment No"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={handleAddBooking}
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Address:
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="2"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Booking Table */}
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Sr. No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Consignment No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Destination
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Weight
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Pincode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Mode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Booking
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Insurance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Bill Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Percentage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Other Charges
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Risk Surcharge
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {!booking ? (
                <tr>
                  <td
                    colSpan="14"
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    No Data Found
                  </td>
                </tr>
              ) : (
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-900">1</td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.consignment_no}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.destination || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.char_wt}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.pincode}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.mode}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.amount || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.booking_date}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.insurance || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.bill_amount || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.percentage || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.other_charges || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {booking.risk_surcharge || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium">
                    {booking.total || 0}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Discount Options */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">
              Invoice Discount :
            </span>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="invoice_discount"
                checked={formData.invoice_discount}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, invoice_discount: true }))
                }
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="invoice_discount"
                checked={!formData.invoice_discount}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, invoice_discount: false }))
                }
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">No</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">
              Reverse Charge :
            </span>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="reverse_charge"
                checked={formData.reverse_charge}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, reverse_charge: true }))
                }
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="reverse_charge"
                checked={!formData.reverse_charge}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, reverse_charge: false }))
                }
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">No</span>
            </label>
          </div>
        </div>

        {/* Calculations */}
        <div className="mt-6 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-700">Total</span>
              <span className="text-sm text-slate-900">
                {calculations.total}
              </span>
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-700">
                Fuel/Surcharge Tax(%):
              </span>
              <input
                type="number"
                value={calculations.fuel_surcharge_tax_percent}
                onChange={(e) =>
                  setCalculations((prev) => ({
                    ...prev,
                    fuel_surcharge_tax_percent: e.target.value,
                  }))
                }
                className="w-32 rounded-md border border-slate-300 px-2 py-1 text-sm text-right focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between bg-slate-50 px-3 py-2 rounded">
              <span className="text-sm font-medium text-slate-700">
                SubTotal
              </span>
              <span className="text-sm text-slate-900">
                {calculations.subtotal}
              </span>
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-700">
                Royalty Charge
              </span>
              <input
                type="number"
                value={calculations.royalty_charge}
                onChange={(e) =>
                  setCalculations((prev) => ({
                    ...prev,
                    royalty_charge: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-32 rounded-md border border-slate-300 px-2 py-1 text-sm text-right focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-700">
                Docket Charge
              </span>
              <input
                type="number"
                value={calculations.docket_charge}
                onChange={(e) =>
                  setCalculations((prev) => ({
                    ...prev,
                    docket_charge: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-32 rounded-md border border-slate-300 px-2 py-1 text-sm text-right focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-700">
                Other Charge
              </span>
              <input
                type="number"
                value={calculations.other_charge}
                onChange={(e) =>
                  setCalculations((prev) => ({
                    ...prev,
                    other_charge: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-32 rounded-md border border-slate-300 px-2 py-1 text-sm text-right focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-700">GST%</span>
              <input
                type="number"
                name="gst_percent"
                value={formData.gst_percent}
                onChange={handleInputChange}
                className="w-32 rounded-md border border-slate-300 px-2 py-1 text-sm text-right focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between bg-slate-50 px-3 py-2 rounded">
              <span className="text-sm font-medium text-slate-700">
                Net Amount
              </span>
              <span className="text-sm text-slate-900 font-semibold">
                {calculations.net_amount}
              </span>
            </div>
            <div></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSendEmail}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Invoice From Email
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !booking}
            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Generate
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !booking}
            className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
