import { useState, useEffect } from "react";
import api from "../services/api";
import { Info, Search } from "lucide-react";

const StationaryRemainingPage = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [consignments, setConsignments] = useState([]);
  const [filteredConsignments, setFilteredConsignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchConsignments();
  }, []);

  useEffect(() => {
    filterConsignments();
  }, [consignments, selectedType, searchTerm]);

  const fetchConsignments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/stationary/consignments");
      setConsignments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching consignments:", error);
      alert("Failed to fetch stationary data");
    } finally {
      setLoading(false);
    }
  };

  const filterConsignments = () => {
    let filtered = [...consignments];

    // Filter by type
    if (selectedType !== "All") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.start_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.end_no.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredConsignments(filtered);
    setCurrentPage(1);
  };

  const calculateExpiringIn = (receiptDate) => {
    const receipt = new Date(receiptDate);
    const today = new Date();
    const diffTime = receipt - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Expired", color: "text-red-600" };
    } else if (diffDays === 0) {
      return { text: "Today", color: "text-orange-600" };
    } else {
      return { text: `${diffDays} Days`, color: "text-gray-700" };
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this consignment?")) {
      return;
    }

    try {
      await api.delete(`/stationary/consignments/${id}`);
      alert("Consignment deleted successfully");
      fetchConsignments();
    } catch (error) {
      console.error("Error deleting consignment:", error);
      alert("Failed to delete consignment");
    }
  };

  const handleView = (consignment) => {
    setSelectedConsignment(consignment);
  };

  // Calculate summary
  const summary = {
    daysLeft: consignments.reduce((acc, item) => {
      const days = calculateExpiringIn(item.receipt_date);
      return days.text !== "Expired" ? acc + 1 : acc;
    }, 0),
    totalConsignments: consignments.reduce(
      (acc, item) => acc + item.remaining_consignments,
      0
    ),
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConsignments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredConsignments.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Remaining Stationary
          </h1>
          <Info className="w-5 h-5 text-blue-500" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Select Type<span className="text-red-500">*</span>
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="DOX">DOX</option>
                <option value="NONDOX">NONDOX</option>
                <option value="EXPRESS">EXPRESS</option>
              </select>
              <button
                onClick={filterConsignments}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Show
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Search:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by start/end no..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-64"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">
                      Receipt Date
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">
                      Expiring in
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">
                      Start No
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">
                      End No
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">
                      No Of Consignment
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">
                      Used
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">
                      Remining
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : currentItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        No data found
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item) => {
                      const expiringInfo = calculateExpiringIn(
                        item.receipt_date
                      );
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                            {new Date(item.receipt_date).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td
                            className={`border border-gray-300 px-4 py-2 text-sm text-center font-medium ${expiringInfo.color}`}
                          >
                            {expiringInfo.text}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                            {item.start_no}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                            {item.end_no}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                            {item.total_consignments}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                            {item.used_consignments}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                            {item.remaining_consignments}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleView(item)}
                                className="px-4 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-4 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  ← Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 border-t">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Days left</div>
                <div className="text-2xl font-bold text-gray-800">
                  {summary.daysLeft}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">
                  No of consignment
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {summary.totalConsignments}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-center">
                Consignment No
              </h3>
              {selectedConsignment ? (
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-white rounded">
                    <span className="font-medium">Start:</span>{" "}
                    {selectedConsignment.start_no}
                  </div>
                  <div className="p-3 bg-white rounded">
                    <span className="font-medium">End:</span>{" "}
                    {selectedConsignment.end_no}
                  </div>
                  <div className="p-3 bg-white rounded">
                    <span className="font-medium">Total:</span>{" "}
                    {selectedConsignment.total_consignments}
                  </div>
                  <div className="p-3 bg-white rounded">
                    <span className="font-medium">Used:</span>{" "}
                    {selectedConsignment.used_consignments}
                  </div>
                  <div className="p-3 bg-white rounded">
                    <span className="font-medium">Remaining:</span>{" "}
                    {selectedConsignment.remaining_consignments}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-600 text-sm">
                  No Data Found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationaryRemainingPage;
