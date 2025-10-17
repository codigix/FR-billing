import { useState, useEffect } from "react";
import axios from "axios";

export default function RecycleConsignmentPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  useEffect(() => {
    fetchRecycledConsignments();
  }, [currentPage, recordsPerPage]);

  const fetchRecycledConsignments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/recycle/list`,
        {
          params: {
            page: currentPage,
            limit: recordsPerPage,
            search: searchTerm,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData(response.data.data.consignments || []);
      setPagination(response.data.data.pagination || {});
    } catch (error) {
      console.error("Error fetching recycled consignments:", error);
      alert("Failed to load recycled consignments");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchRecycledConsignments();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Are you sure you want to restore this consignment?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}`,
        { status: "booked" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Consignment restored successfully");
      fetchRecycledConsignments();
    } catch (error) {
      console.error("Error restoring consignment:", error);
      alert("Failed to restore consignment");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        Recycle Consignment
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
            onKeyPress={handleKeyPress}
            placeholder="Consignment No or Customer ID"
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
                Consignment_no
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Customer_Id
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                booking_date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No data available in table
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {(currentPage - 1) * recordsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.consignment_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.customer_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {new Date(row.booking_date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Number(row.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleRestore(row.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-600">
          Showing{" "}
          {data.length === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1} to{" "}
          {Math.min(currentPage * recordsPerPage, pagination.total)} of{" "}
          {pagination.total} entries
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
              setCurrentPage((prev) => Math.min(pagination.pages, prev + 1))
            }
            disabled={currentPage === pagination.pages || data.length === 0}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
