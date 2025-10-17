import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, FileText, Printer } from "lucide-react";

export default function CheckBookingListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    customer_id: "",
    from_date: "",
    to_date: "",
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShow = async () => {
    setError("");

    if (!filters.from_date || !filters.to_date) {
      setError("From Date and To Date are required!");
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      console.log(
        "Fetching from:",
        `http://localhost:5000/api/bookings/filter?${query}`
      );

      const response = await fetch(
        `http://localhost:5000/api/bookings/filter?${query}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        setError(`API Error: ${data.message || "Failed to fetch bookings"}`);
        setBookings([]);
        return;
      }

      if (data.success) {
        setBookings(data.data.bookings || []);
        if (!data.data.bookings || data.data.bookings.length === 0) {
          setError("No bookings found for the selected criteria.");
        }
      } else {
        setError(data.message || "Failed to fetch bookings");
        setBookings([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(`Error: ${error.message}`);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csv = [
      [
        "Sr No",
        "Customer Id",
        "Consignment no",
        "Weight",
        "Quantity",
        "Destination",
        "Pincode",
        "Address",
        "Type",
        "Mode",
        "Amount",
        "Booking Date",
        "Insurance",
        "Bill Amount",
        "Percentage",
        "Risk surcharge",
        "Other Charges",
      ],
      ...bookings.map((b, i) => [
        i + 1,
        b.customer_id,
        b.consignment_number,
        b.char_wt,
        b.qty,
        b.destination,
        b.pincode,
        b.address,
        b.type,
        b.mode,
        b.amount,
        b.booking_date,
        b.insurance,
        b.bill_amount,
        b.percentage,
        b.risk_surcharge,
        b.other_charges,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "booking_list.csv";
    a.click();
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-800">
          Check Booking List
        </h1>
        <Info className="h-5 w-5 text-blue-500" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer Id
            </label>
            <input
              type="text"
              name="customer_id"
              value={filters.customer_id}
              onChange={(e) =>
                setFilters({ ...filters, customer_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Optional - leave blank for all"
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
              name="to_date"
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
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Loading..." : "Show"}
            </button>
            <button
              onClick={handleExport}
              disabled={bookings.length === 0}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2 disabled:bg-emerald-400"
            >
              <FileText className="h-4 w-4" /> Export
            </button>
            <button
              onClick={handlePrint}
              disabled={bookings.length === 0}
              className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 flex items-center gap-2 disabled:bg-slate-400"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
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
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Customer Id
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Consignment no
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Weight
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Destination
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Pincode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                  Type
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
                  Bill Amount
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="18"
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
                      <button
                        onClick={() => navigate(`/booking/modify?id=${b.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">{b.customer_id}</td>
                    <td className="px-4 py-3 text-sm">
                      {b.consignment_number}
                    </td>
                    <td className="px-4 py-3 text-sm">{b.char_wt}</td>
                    <td className="px-4 py-3 text-sm">{b.qty}</td>
                    <td className="px-4 py-3 text-sm">{b.destination}</td>
                    <td className="px-4 py-3 text-sm">{b.pincode}</td>
                    <td className="px-4 py-3 text-sm">{b.address}</td>
                    <td className="px-4 py-3 text-sm">{b.type}</td>
                    <td className="px-4 py-3 text-sm">{b.mode}</td>
                    <td className="px-4 py-3 text-sm">{b.amount}</td>
                    <td className="px-4 py-3 text-sm">{b.booking_date}</td>
                    <td className="px-4 py-3 text-sm">{b.insurance}</td>
                    <td className="px-4 py-3 text-sm">{b.bill_amount}</td>
                    <td className="px-4 py-3 text-sm">{b.percentage}</td>
                    <td className="px-4 py-3 text-sm">{b.risk_surcharge}</td>
                    <td className="px-4 py-3 text-sm">{b.other_charges}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-4 py-3 border-t">
          <div className="flex justify-end">
            <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium">
              Total: 0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
