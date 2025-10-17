import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const FranchiseListPage = () => {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchFranchises();
  }, [pagination.page, statusFilter, searchTerm]);

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      const response = await api.get("/franchises", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          status: statusFilter,
        },
      });

      if (response.data.success) {
        setFranchises(response.data.data.franchises);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching franchises:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this franchise?")) {
      try {
        await api.delete(`/franchises/${id}`);
        fetchFranchises();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete franchise");
      }
    }
  };

  const handleStatusToggle = async (id, newStatus) => {
    try {
      await api.patch(`/franchises/${id}/status`, { status: newStatus });
      fetchFranchises();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Franchisee Management</h1>
        <Link
          to="/franchises/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Franchisee
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by code, name, email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Franchise List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : franchises.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No franchises found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    FR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Franchisee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Owner Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {franchises.map((franchise) => (
                  <tr key={franchise.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {franchise.franchise_code}
                    </td>
                    <td className="px-6 py-4">{franchise.franchise_name}</td>
                    <td className="px-6 py-4">{franchise.owner_name}</td>
                    <td className="px-6 py-4">{franchise.email}</td>
                    <td className="px-6 py-4">{franchise.phone}</td>
                    <td className="px-6 py-4">
                      <select
                        value={franchise.status}
                        onChange={(e) =>
                          handleStatusToggle(franchise.id, e.target.value)
                        }
                        className={`px-2 py-1 text-xs rounded ${
                          franchise.status === "active"
                            ? "bg-green-100 text-green-800"
                            : franchise.status === "inactive"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/franchises/edit/${franchise.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(franchise.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {franchises.length} of {pagination.total} franchises
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FranchiseListPage;
