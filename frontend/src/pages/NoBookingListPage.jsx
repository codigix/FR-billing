import { useState } from "react";
import { Info, FileText } from "lucide-react";

export default function NoBookingListPage() {
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    filter_type: "Default",
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleShow = async () => {
    if (!filters.from_date || !filters.to_date) {
      alert("From Date and To Date are required!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/no-booking-list?from_date=${filters.from_date}&to_date=${filters.to_date}`,
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

  const handleExport = () => {
    const csv = [
      [
        "Sr No",
        "Consignment no",
        "Weight",
        "Pincode",
        "Mode",
        "Amount",
        "Booking Date",
      ],
      ...bookings.map((b, i) => [
        i + 1,
        b.consignment_number,
        b.char_wt,
        b.pincode,
        b.mode,
        b.amount,
        b.booking_date,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "no_booking_list.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-800">No Booking List</h1>
        <Info className="h-5 w-5 text-blue-500" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              From Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={filters.from_date}
              onChange={(e) =>
                setFilters({ ...filters, from_date: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              To Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={filters.to_date}
              onChange={(e) =>
                setFilters({ ...filters, to_date: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShow}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {loading ? "Loading..." : "Show"}
            </button>
            <select
              value={filters.filter_type}
              onChange={(e) =>
                setFilters({ ...filters, filter_type: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md"
            >
              <option>Default</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> Export to Excel
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-orange-600"
                  >
                    No data available in table
                  </td>
                </tr>
              ) : (
                bookings.map((b, idx) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 text-sm">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      {b.consignment_number}
                    </td>
                    <td className="px-4 py-3 text-sm">{b.char_wt}</td>
                    <td className="px-4 py-3 text-sm">{b.pincode}</td>
                    <td className="px-4 py-3 text-sm">{b.mode}</td>
                    <td className="px-4 py-3 text-sm">{b.amount}</td>
                    <td className="px-4 py-3 text-sm">{b.booking_date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
