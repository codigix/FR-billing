import { useState } from "react";
import axios from "axios";

export default function BusinessAnalysisPage() {
  const [filters, setFilters] = useState({
    customerId: "",
    fromDate: "",
    toDate: "",
  });

  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    dtdcTotal: 0,
    profitLoss: 0,
    profitLossPercent: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        `${import.meta.env.VITE_API_URL}/api/reports/business-analysis`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReportData(response.data.data || []);
      setSummary(
        response.data.summary || {
          total: 0,
          dtdcTotal: 0,
          profitLoss: 0,
          profitLossPercent: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching business analysis:", error);
      alert("Failed to load business analysis");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = () => {
    fetchReport();
  };

  const filteredData = reportData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        Business Analysis
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Customer id
          </label>
          <input
            type="text"
            name="customerId"
            value={filters.customerId}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            From Date <span className="text-red-500">*</span>
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
            To Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-4">
        <button
          onClick={handleShow}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Show
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
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
                Consignment no
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Booking Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Weight
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Destination
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Dtdc Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Profit/Loss,(%)
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
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No data available in table
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.consignment_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {new Date(row.booking_date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.weight}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.destination}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Number(row.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Number(row.dtdc_amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.profit_loss_percent}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Badges */}
      <div className="flex gap-4">
        <div className="px-6 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
          <span className="font-medium">Total</span>
          <span className="font-semibold">{summary.total}</span>
        </div>
        <div className="px-6 py-2 bg-green-600 text-white rounded flex items-center gap-2">
          <span className="font-medium">DTDC Total</span>
          <span className="font-semibold">{summary.dtdcTotal}</span>
        </div>
        <div className="px-6 py-2 bg-red-600 text-white rounded flex items-center gap-2">
          <span className="font-medium">Profit/Loss</span>
          <span className="font-semibold">{summary.profitLoss}</span>
        </div>
        <div className="px-6 py-2 bg-orange-500 text-white rounded flex items-center gap-2">
          <span className="font-medium">Profit/Loss(%)</span>
          <span className="font-semibold">{summary.profitLossPercent}</span>
        </div>
      </div>
    </div>
  );
}
