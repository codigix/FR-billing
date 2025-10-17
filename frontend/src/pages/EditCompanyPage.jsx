import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditCompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    // Filter companies based on search term
    if (searchTerm) {
      const filtered = companies.filter(
        (company) =>
          company.company_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          company.company_id
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          company.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
    setCurrentPage(1);
  }, [searchTerm, companies]);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/rates/company",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setCompanies(response.data.data);
        setFilteredCompanies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      alert("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/api/rates/company/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Company deleted successfully!");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      alert(error.response?.data?.message || "Failed to delete company");
    }
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/rates/company/${editingCompany.id}`,
        editingCompany,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Company updated successfully!");
        setShowEditModal(false);
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert(error.response?.data?.message || "Failed to update company");
    }
  };

  const handlePrint = (company) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Company Details - ${company.company_name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
          }
          .status-active {
            background-color: #d4edda;
            color: #155724;
          }
          .status-inactive {
            background-color: #f8d7da;
            color: #721c24;
          }
        </style>
      </head>
      <body>
        <h1>Company Details</h1>
        <table>
          <tr><th>Company ID</th><td>${company.company_id || "N/A"}</td></tr>
          <tr><th>Company Name</th><td>${company.company_name}</td></tr>
          <tr><th>Company Address</th><td>${
            company.company_address || "N/A"
          }</td></tr>
          <tr><th>Phone</th><td>${company.phone || "N/A"}</td></tr>
          <tr><th>Email</th><td>${company.email || "N/A"}</td></tr>
          <tr><th>GST No</th><td>${company.gst_no || "N/A"}</td></tr>
          <tr><th>Insurance %</th><td>${
            company.insurance_percent || "0"
          }</td></tr>
          <tr><th>Minimum Risk Surcharge</th><td>${
            company.minimum_risk_surcharge || "0"
          }</td></tr>
          <tr><th>Other Details</th><td>${
            company.other_details || "N/A"
          }</td></tr>
          <tr><th>Topay Charge</th><td>${company.topay_charge || "0"}</td></tr>
          <tr><th>COD Charge</th><td>${company.cod_charge || "0"}</td></tr>
          <tr><th>Fuel Surcharge %</th><td>${
            company.fuel_surcharge_percent || "0"
          }</td></tr>
          <tr><th>GEC Fuel Surcharge %</th><td>${
            company.gec_fuel_surcharge_percent || "0"
          }</td></tr>
          <tr><th>Royalty Charges %</th><td>${
            company.royalty_charges_percent || "0"
          }</td></tr>
          <tr><th>PAN No</th><td>${company.pan_no || "N/A"}</td></tr>
          <tr><th>Due Days</th><td>${company.due_days || "0"}</td></tr>
          <tr><th>Status</th><td><span class="status status-${
            company.status
          }">${
      company.status === "active" ? "Active" : "Inactive"
    }</span></td></tr>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCompanies.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredCompanies.length / recordsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Company RateMaster
          </h1>
          <button
            onClick={() => navigate("/ratemaster/add-company")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Company
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show</label>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">records per page</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Option
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Print
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No companies found
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((company, index) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {indexOfFirstRecord + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            company.status === "active"
                              ? "text-green-800 bg-green-100"
                              : "text-red-800 bg-red-100"
                          }`}
                        >
                          {company.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(company)}
                          className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.company_id || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.company_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {company.company_address || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handlePrint(company)}
                          className="px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Print
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstRecord + 1} to{" "}
              {Math.min(indexOfLastRecord, filteredCompanies.length)} of{" "}
              {filteredCompanies.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Edit Company
            </h2>
            <form onSubmit={handleUpdateCompany} className="space-y-4">
              {/* Company ID and Company Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Id <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCompany.company_id || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        company_id: e.target.value,
                      })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCompany.company_name || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        company_name: e.target.value,
                      })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Company Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editingCompany.company_address || ""}
                  onChange={(e) =>
                    setEditingCompany({
                      ...editingCompany,
                      company_address: e.target.value,
                    })
                  }
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCompany.phone || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        phone: e.target.value,
                      })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editingCompany.email || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        email: e.target.value,
                      })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* GST No and Insurance % */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCompany.gst_no || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        gst_no: e.target.value,
                      })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insurance %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCompany.insurance_percent || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        insurance_percent: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Minimum Risk Surcharge and Other Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Risk Surcharge
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCompany.minimum_risk_surcharge || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        minimum_risk_surcharge: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Details
                  </label>
                  <input
                    type="text"
                    value={editingCompany.other_details || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        other_details: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Topay Charge and COD Charge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topay Charge
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCompany.topay_charge || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        topay_charge: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    COD Charge
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCompany.cod_charge || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        cod_charge: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Fuel Surcharge % and GEC Fuel Surcharge % */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Surcharge %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCompany.fuel_surcharge_percent || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        fuel_surcharge_percent: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GEC Fuel Surcharge %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCompany.gec_fuel_surcharge_percent || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        gec_fuel_surcharge_percent: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Royalty Charges % and PAN No */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Royalty Charges %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCompany.royalty_charges_percent || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        royalty_charges_percent: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pan No
                  </label>
                  <input
                    type="text"
                    value={editingCompany.pan_no || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        pan_no: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Due Days and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Days
                  </label>
                  <input
                    type="number"
                    value={editingCompany.due_days || ""}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        due_days: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingCompany.status}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCompanyPage;
