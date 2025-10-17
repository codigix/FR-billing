import { useState } from "react";
import { Info } from "lucide-react";

export default function UpdateRatePage() {
  const [filters, setFilters] = useState({
    customer_id: "",
    from_date: "",
    to_date: "",
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleShow = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(
        `http://localhost:5000/api/bookings/filter?${query}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      if (data.success) setBookings(data.data.bookings || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRate = async () => {
    if (!filters.from_date || !filters.to_date) {
      alert("From Date and To Date are required!");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/update-rate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(filters),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Rates updated successfully!");
        handleShow();
      } else {
        alert(data.message || "Failed to update rates");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  const total = bookings.reduce(
    (sum, b) => sum + (parseFloat(b.total) || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Update Rate</h1>
        <Info className="h-5 w-5 text-blue-500" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer id
            </label>
            <input
              type="text"
              name="customer_id"
              value={filters.customer_id}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              From Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="from_date"
              value={filters.from_date}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              To Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="to_date"
              value={filters.to_date}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShow}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Loading..." : "Show"}
            </button>
            <button
              onClick={handleUpdateRate}
              className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              UpdateRate
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Sr No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Consignment no
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Weight
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Destination
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Pincode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Mode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Booking Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Insurance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Claim amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Percentage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Risk surcharge
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Other Charges
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="14"
                    className="px-4 py-8 text-center text-orange-600"
                  >
                    No data available in table
                  </td>
                </tr>
              ) : (
                bookings.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      {b.consignment_number}
                    </td>
                    <td className="px-4 py-3 text-sm">{b.char_wt}</td>
                    <td className="px-4 py-3 text-sm">{b.destination}</td>
                    <td className="px-4 py-3 text-sm">{b.pincode}</td>
                    <td className="px-4 py-3 text-sm">{b.mode}</td>
                    <td className="px-4 py-3 text-sm">{b.amount}</td>
                    <td className="px-4 py-3 text-sm">{b.booking_date}</td>
                    <td className="px-4 py-3 text-sm">{b.insurance}</td>
                    <td className="px-4 py-3 text-sm">{b.bill_amount}</td>
                    <td className="px-4 py-3 text-sm">{b.percentage}</td>
                    <td className="px-4 py-3 text-sm">{b.risk_surcharge}</td>
                    <td className="px-4 py-3 text-sm">{b.other_charges}</td>
                    <td className="px-4 py-3 text-sm">{b.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-4 py-3 border-t">
          <div className="flex justify-end">
            <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium">
              Total: {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
