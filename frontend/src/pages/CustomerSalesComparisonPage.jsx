import { useState, useEffect } from "react";
import axios from "axios";

export default function CustomerSalesComparisonPage() {
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({
    previousMonthTotal: 0,
    lastMonthTotal: 0,
    previousMonth: "August",
    lastMonth: "September",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reports/customer-sales-comparison`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReportData(response.data.data || []);
      setSummary(
        response.data.summary || {
          previousMonthTotal: 0,
          lastMonthTotal: 0,
          previousMonth: "August",
          lastMonth: "September",
        }
      );
    } catch (error) {
      console.error("Error fetching sales comparison:", error);
      alert("Failed to load sales comparison report");
    } finally {
      setLoading(false);
    }
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
        Customer Sales Report Comparison
      </h1>

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
                Sr.No
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Comapany Id
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Comapany Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Previous Month Sale({summary.previousMonth})
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Last Month Sale({summary.lastMonth})
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Sales Differnce
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Percentage Change
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
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
                    {row.company_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Number(row.previous_month_sale).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Number(row.last_month_sale).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Number(row.sales_difference).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.percentage_change}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded-md text-sm ${
                page === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}
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
      <div className="flex gap-4">
        <div className="px-6 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
          <span className="font-medium">
            Previous Month Total Sale({summary.previousMonth})
          </span>
          <span className="font-semibold">{summary.previousMonthTotal}</span>
        </div>
        <div className="px-6 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
          <span className="font-medium">
            Last Month Total Sale({summary.lastMonth})
          </span>
          <span className="font-semibold">{summary.lastMonthTotal}</span>
        </div>
      </div>
    </div>
  );
}
