import { useState, useEffect } from "react";
import axios from "axios";

export default function CreditorsReportPage() {
  const [filters, setFilters] = useState({
    customerId: "",
    fromDate: "",
    toDate: "",
    status: "All",
    invoiceType: "All",
  });

  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({ total: 0, paid: 0, balance: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reports/creditors`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReportData(response.data.data || []);
      setSummary(response.data.summary || { total: 0, paid: 0, balance: 0 });
    } catch (error) {
      console.error("Error fetching creditors report:", error);
      alert("Failed to load creditors report");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = () => {
    setCurrentPage(1);
    fetchReport();
  };

  const handleExportToExcel = () => {
    alert("Export to Excel - Feature coming soon!");
  };

  const filteredData = reportData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        Creditor's Report
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Customer ID
          </label>
          <input
            type="text"
            name="customerId"
            value={filters.customerId}
            onChange={handleFilterChange}
            placeholder="Customer ID"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Invoice Type
          </label>
          <select
            name="invoiceType"
            value={filters.invoiceType}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="GST">GST</option>
            <option value="Non-GST">Non-GST</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleShow}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Show
        </button>
        <button
          onClick={handleExportToExcel}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Export to Excel
        </button>
      </div>

      {/* Records Per Page and Search */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <select
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-slate-600">records per page</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg mb-4">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Sr No.
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Invoice ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Total Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Paid Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Balance
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Invoice Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Due Days
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="10"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No data available in table
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.invoice_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.customer_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.invoice_type}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Number(row.total_amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Number(row.paid_amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Number(row.balance_amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        row.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : row.payment_status === "partial"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {row.payment_status || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {new Date(row.invoice_date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.due_days}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-slate-600">
          Showing {filteredData.length === 0 ? 0 : startIndex + 1} to{" "}
          {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
          entries
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || filteredData.length === 0}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Summary Badges */}
      <div className="flex gap-4 flex-wrap">
        <div className="px-6 py-3 bg-blue-600 text-white rounded-lg flex flex-col">
          <span className="text-xs font-medium text-blue-100">Total</span>
          <span className="font-semibold text-lg">
            {Number(summary.total || 0).toLocaleString("en-IN")}
          </span>
        </div>
        <div className="px-6 py-3 bg-green-600 text-white rounded-lg flex flex-col">
          <span className="text-xs font-medium text-green-100">Paid</span>
          <span className="font-semibold text-lg">
            {Number(summary.paid || 0).toLocaleString("en-IN")}
          </span>
        </div>
        <div className="px-6 py-3 bg-red-600 text-white rounded-lg flex flex-col">
          <span className="text-xs font-medium text-red-100">Balance</span>
          <span className="font-semibold text-lg">
            {Number(summary.balance || 0).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
