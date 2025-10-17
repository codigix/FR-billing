import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AddCompanyPage = () => {
  // Courier company types
  const COURIER_TYPES = [
    "Add Company",
    "Dox",
    "NonDox",
    "Dtdc PLUS",
    "Dtdc PTP",
    "Express Cargo",
    "Priority",
    "E-Commerce",
  ];

  const [activeTab, setActiveTab] = useState("Add Company");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const tabScrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_id: "",
    company_name: "",
    company_address: "",
    phone: "",
    email: "",
    gst_no: "",
    insurance_percent: "",
    minimum_risk_surcharge: "",
    other_details: "",
    topay_charge: "",
    cod_charge: "",
    fuel_surcharge_percent: "",
    gec_fuel_surcharge_percent: "",
    royalty_charges_percent: "",
    pan_no: "",
    due_days: "",
    field_d: "",
    field_m: "",
    field_e: "",
    field_v: "",
    field_i: "",
    field_n: "",
    field_g: "",
    field_b: "",
  });

  // Fetch companies on mount and tab change
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/rates/company",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCompanies(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.company_id ||
      !formData.company_name ||
      !formData.company_address ||
      !formData.phone ||
      !formData.email ||
      !formData.gst_no
    ) {
      alert(
        "Company ID, Company Name, Company Address, Phone Number, Email, and GST No are required!"
      );
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/rates/company",
        { ...formData, courier_type: activeTab },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Company added successfully!");
        // Reset form
        setFormData({
          company_id: "",
          company_name: "",
          company_address: "",
          phone: "",
          email: "",
          gst_no: "",
          insurance_percent: "",
          minimum_risk_surcharge: "",
          other_details: "",
          topay_charge: "",
          cod_charge: "",
          fuel_surcharge_percent: "",
          gec_fuel_surcharge_percent: "",
          royalty_charges_percent: "",
          pan_no: "",
          due_days: "",
          field_d: "",
          field_m: "",
          field_e: "",
          field_v: "",
          field_i: "",
          field_n: "",
          field_g: "",
          field_b: "",
        });
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error adding company:", error);
      alert(error.response?.data?.message || "Failed to add company");
    } finally {
      setLoading(false);
    }
  };

  // Tab scrolling functions
  const scroll = (direction) => {
    if (tabScrollRef.current) {
      const scrollAmount = 300;
      if (direction === "left") {
        tabScrollRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else {
        tabScrollRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  // Handle Excel file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/rates/company/import-excel",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert(
          `Successfully imported! ${
            response.data.data?.successCount || 0
          } companies added.`
        );
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(
        error.response?.data?.message || "Failed to upload companies from Excel"
      );
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Rate Master - Add Company</h1>
            <p className="text-blue-100 mt-1">
              Manage courier company rates and charges
            </p>
          </div>
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploadLoading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadLoading}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              {uploadLoading ? "Uploading..." : "📤 Upload From Excel"}
            </button>
          </div>
        </div>

        {/* Tab Navigation with Scroll */}
        <div className="border-b border-gray-200 px-6 py-0 flex items-center gap-2 bg-gray-50">
          <button
            onClick={() => scroll("left")}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={tabScrollRef}
            className="flex-1 overflow-x-auto scroll-smooth no-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex gap-1 min-w-min pb-0">
              {COURIER_TYPES.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll("right")}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === "Add Company" ? (
            // Add Company Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-900 font-semibold">
                  📋 First Of All Add Company
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Add your courier company details below. Fill all required
                  fields marked with *
                </p>
              </div>

              {/* Company ID and Company Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Id <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_id"
                    value={formData.company_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company ID (e.g., DX01)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              {/* Company Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter complete company address"
                />
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* GST and Insurance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="gst_no"
                    value={formData.gst_no}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter GST number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="insurance_percent"
                    value={formData.insurance_percent}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Minimum Risk Surcharge and Other Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Risk Surcharge
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="minimum_risk_surcharge"
                    value={formData.minimum_risk_surcharge}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Details
                  </label>
                  <input
                    type="text"
                    name="other_details"
                    value={formData.other_details}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional details"
                  />
                </div>
              </div>

              {/* Charges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topay Charge
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="topay_charge"
                    value={formData.topay_charge}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    COD Charge
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="cod_charge"
                    value={formData.cod_charge}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Fuel Surcharges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Surcharge %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="fuel_surcharge_percent"
                    value={formData.fuel_surcharge_percent}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GEC Fuel Surcharge %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="gec_fuel_surcharge_percent"
                    value={formData.gec_fuel_surcharge_percent}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Royalty and PAN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Royalty Charges %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="royalty_charges_percent"
                    value={formData.royalty_charges_percent}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pan No
                  </label>
                  <input
                    type="text"
                    name="pan_no"
                    value={formData.pan_no}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter PAN number"
                  />
                </div>
              </div>

              {/* Due Days */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Days
                  </label>
                  <input
                    type="number"
                    name="due_days"
                    value={formData.due_days}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Additional Fields: D, M, E, V, I, N, G, B */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Additional Fields
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {[
                    { key: "field_d", label: "D" },
                    { key: "field_m", label: "M" },
                    { key: "field_e", label: "E" },
                    { key: "field_v", label: "V" },
                    { key: "field_i", label: "I" },
                    { key: "field_n", label: "N" },
                    { key: "field_g", label: "G" },
                    { key: "field_b", label: "B" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {label}
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={label}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? "Saving..." : "Save Company"}
                </button>
              </div>
            </form>
          ) : (
            // Show company data for selected courier type
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 font-semibold">
                  📋 Companies for {activeTab}
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Manage rate master data for this courier company
                </p>
              </div>

              {fetchLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 mt-2">Loading companies...</p>
                </div>
              ) : companies.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Company ID
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Company Name
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          GST No
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {companies.map((company) => (
                        <tr key={company.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900">
                            {company.company_id}
                          </td>
                          <td className="px-4 py-3 text-gray-900">
                            {company.company_name}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {company.email}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {company.phone}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {company.gst_no}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                company.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {company.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-2">
                    No companies found for {activeTab}
                  </p>
                  <p className="text-sm text-gray-400">
                    Switch to "Add Company" tab to create a new company
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCompanyPage;
