import { useState, useEffect } from "react";
import axios from "axios";

export default function SaleReportBeforeInvoicePage() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({ total: 0 });
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
        `${import.meta.env.VITE_API_URL}/api/reports/sale-before-invoice`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReportData(response.data.data || []);
      setSummary(response.data.summary || { total: 0 });
    } catch (error) {
      console.error("Error fetching sale report:", error);
      alert("Failed to load sale report");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = () => {
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
        SaleReport Before Invoice
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            placeholder="From Date"
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
            placeholder="To Date"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
                Company ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Customer Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Total
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                No OF Bookings
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
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
                    {row.company_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.customer_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Number(row.total).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.booking_count}
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

      {/* Summary Badge */}
      <div className="flex gap-4">
        <div className="px-6 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
          <span className="font-medium">Total</span>
          <span className="font-semibold">{summary.total}</span>
        </div>
      </div>
    </div>
  );
}
