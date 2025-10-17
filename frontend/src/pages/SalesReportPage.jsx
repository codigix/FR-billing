import { useState, useEffect } from "react";
import axios from "axios";

export default function SalesReportPage() {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    await fetchSalesReport(1);
  };

  const fetchSalesReport = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/reports/sales-report",
        {
          params: {
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            search: searchText,
            page,
            limit: pagination.limit,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setSalesData(response.data.data);
        setPagination({
          page,
          limit: pagination.limit,
          total: response.data.pagination?.total || response.data.total || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching sales report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/reports/sales-report/export",
        {
          params: {
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            search: searchText,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sales_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
    fetchSalesReport(page);
  };

  const totalAmount = salesData.reduce(
    (sum, row) => sum + (parseFloat(row.amount) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
            <h1 className="text-2xl font-bold text-emerald-900">
              Sales Report
            </h1>
          </div>

          {/* Filter Section */}
          <div className="border-b border-slate-200 p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end">
                {/* From Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    From Date:
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleDateChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    To Date:
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleDateChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={handleExportToExcel}
                    className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    Export to Excel
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Controls Section */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <label className="text-sm text-slate-600">
                Records per page:
              </label>
              <select
                value={pagination.limit}
                onChange={(e) => {
                  setPagination({
                    ...pagination,
                    limit: Number(e.target.value),
                    page: 1,
                  });
                }}
                className="rounded border border-slate-300 px-3 py-1 text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Search:</label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="rounded border border-slate-300 px-3 py-1 text-sm"
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="text-slate-600">Loading...</div>
              </div>
            ) : salesData.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="text-slate-600">No data available in table</div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Sr. No.
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Consignment No.
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Sender City
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Sender Pincode
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Recipient Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Recipient Pincode
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Booking Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Amount (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <button className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700">
                          Print
                        </button>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.consignment_number || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.destination || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.sender_city || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.sender_pincode || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.recipient_name || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.recipient_pincode || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.booking_date
                          ? new Date(row.booking_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-slate-900">
                        ₹{parseFloat(row.amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <div className="text-sm text-slate-600">
              Showing 1 to {salesData.length} of {pagination.total} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.page - 1))
                }
                disabled={pagination.page === 1}
                className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({
                length: Math.ceil(pagination.total / pagination.limit) || 1,
              }).map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`rounded px-3 py-1 text-sm ${
                    pagination.page === idx + 1
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(
                      Math.ceil(pagination.total / pagination.limit) || 1,
                      pagination.page + 1
                    )
                  )
                }
                disabled={
                  pagination.page ===
                  Math.ceil(pagination.total / pagination.limit)
                }
                className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex justify-end items-center gap-4">
              <span className="font-medium text-slate-700">Total</span>
              <span className="text-lg font-bold text-slate-900">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
