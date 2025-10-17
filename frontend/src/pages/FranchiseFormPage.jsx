import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const FranchiseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [activeTab, setActiveTab] = useState("franchisee");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    franchise_code: "",
    franchise_name: "",
    owner_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gst_number: "",
    cst_number: "",
    pan_number: "",
    service_tax_number: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
    branch_name: "",
    account_type: "savings",
    pdf_service_charge: 0,
    non_dest_charge: 0,
    is_gst_verified: false,
    is_approved_receiver: false,
    use_as_consignor: true,
    franchisee_remarks: "",
    subscription_start_date: "",
    subscription_end_date: "",
    subscription_status: "active",
    status: "active",
  });

  // Sectors state
  const [sectors, setSectors] = useState([
    {
      sector_name: "",
      pincodes: "",
      dox: false,
      nondox_air: false,
      nondox_sur: false,
      express_cargo: false,
      priority: false,
      ecom_priority: false,
      ecom_ge: false,
    },
  ]);

  // Upload state
  const [uploadUrls, setUploadUrls] = useState({
    logo_url: null,
    stamp_url: null,
    qr_code_url: null,
  });
  const [uploading, setUploading] = useState({
    logo: false,
    stamp: false,
    qr_code: false,
  });

  useEffect(() => {
    if (isEdit) {
      fetchFranchise();
      fetchSectors();
    }
  }, [id]);

  const fetchFranchise = async () => {
    try {
      const response = await api.get(`/franchises/${id}`);
      const franchise = response.data.data;
      setFormData(franchise);
      setUploadUrls({
        logo_url: franchise.logo_url,
        stamp_url: franchise.stamp_url,
        qr_code_url: franchise.qr_code_url,
      });
    } catch (error) {
      console.error("Error fetching franchise:", error);
      alert("Failed to load franchise data");
    }
  };

  const fetchSectors = async () => {
    try {
      const response = await api.get(`/sectors/franchise/${id}`);
      if (response.data.data.length > 0) {
        setSectors(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/franchises/${id}`, formData);
        alert("Franchise updated successfully");
      } else {
        const response = await api.post("/franchises", formData);
        const newId = response.data.data.id;
        alert("Franchise created successfully");
        navigate(`/franchises/edit/${newId}`);
      }
    } catch (error) {
      console.error("Error saving franchise:", error);
      alert(error.response?.data?.message || "Failed to save franchise");
    } finally {
      setLoading(false);
    }
  };

  // Sector handlers
  const addSector = () => {
    setSectors([
      ...sectors,
      {
        sector_name: "",
        pincodes: "",
        dox: false,
        nondox_air: false,
        nondox_sur: false,
        express_cargo: false,
        priority: false,
        ecom_priority: false,
        ecom_ge: false,
      },
    ]);
  };

  const removeSector = (index) => {
    const newSectors = sectors.filter((_, i) => i !== index);
    setSectors(newSectors);
  };

  const handleSectorChange = (index, field, value) => {
    const newSectors = [...sectors];
    newSectors[index][field] = value;
    setSectors(newSectors);
  };

  const saveSectors = async () => {
    if (!isEdit) {
      alert("Please save the franchise first before adding sectors");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/sectors/franchise/${id}`, { sectors });
      alert("Sectors saved successfully");
      fetchSectors();
    } catch (error) {
      console.error("Error saving sectors:", error);
      alert("Failed to save sectors");
    } finally {
      setLoading(false);
    }
  };

  // Upload handlers
  const handleFileUpload = async (type, file) => {
    if (!isEdit) {
      alert("Please save the franchise first before uploading files");
      return;
    }

    if (!file) return;

    setUploading({ ...uploading, [type]: true });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await api.post(`/uploads/franchise/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadUrls({
        ...uploadUrls,
        [`${type}_url`]: response.data.data.url,
      });

      alert("File uploaded successfully");
      fetchFranchise();
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const handleFileRemove = async (type) => {
    if (!confirm("Are you sure you want to remove this file?")) return;

    setUploading({ ...uploading, [type]: true });

    try {
      await api.delete(`/uploads/franchise/${id}`, { data: { type } });

      setUploadUrls({
        ...uploadUrls,
        [`${type}_url`]: null,
      });

      alert("File removed successfully");
      fetchFranchise();
    } catch (error) {
      console.error("Remove error:", error);
      alert("Failed to remove file");
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {isEdit ? "Edit Franchisee" : "Add New Franchisee"}
        </h1>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab("franchisee")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === "franchisee"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Edit Franchisee
            </button>
            <button
              onClick={() => setActiveTab("sectors")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === "sectors"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              } ${!isEdit ? "opacity-40 cursor-not-allowed" : ""}`}
              disabled={!isEdit}
              title={!isEdit ? "Save franchise first to enable this tab" : ""}
            >
              Edit Sectors {!isEdit && "🔒"}
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === "upload"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              } ${!isEdit ? "opacity-40 cursor-not-allowed" : ""}`}
              disabled={!isEdit}
              title={!isEdit ? "Save franchise first to enable this tab" : ""}
            >
              Upload {!isEdit && "🔒"}
            </button>
          </nav>
        </div>

        {/* Help Text for disabled tabs */}
        {!isEdit && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>ℹ️ Note:</strong> Please save the franchise information
              first to unlock the "Edit Sectors" and "Upload" tabs.
            </p>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Franchisee Tab */}
          {activeTab === "franchisee" && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    FR Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="franchise_code"
                    value={formData.franchise_code}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Franchisee Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="franchise_name"
                    value={formData.franchise_name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Owner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Invoice Start Prefix
                  </label>
                  <input
                    type="text"
                    name="invoice_prefix"
                    value={formData.invoice_prefix || ""}
                    onChange={handleChange}
                    placeholder="INV"
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    ARN (Application Reference Number)
                  </label>
                  <input
                    type="text"
                    name="arn"
                    value={formData.arn || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    GST No
                  </label>
                  <input
                    type="text"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pan No
                  </label>
                  <input
                    type="text"
                    name="pan_number"
                    value={formData.pan_number || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Service No
                  </label>
                  <input
                    type="text"
                    name="service_tax_number"
                    value={formData.service_tax_number || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Service Area
                  </label>
                  <input
                    type="text"
                    name="service_area"
                    value={formData.service_area || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    name="account_name"
                    value={formData.account_name || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account No
                  </label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifsc_code"
                    value={formData.ifsc_code || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    name="branch_name"
                    value={formData.branch_name || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account Type
                  </label>
                  <select
                    name="account_type"
                    value={formData.account_type || "savings"}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="cc">CC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    GEC Service (Applicable/Not)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_gst_verified"
                      checked={formData.is_gst_verified || false}
                      onChange={handleChange}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">
                      Check the option if the GEC service is applicable for this
                      entry. Leave it unchecked if not applicable.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Template For the Invoice
                  </label>
                  <select
                    name="invoice_template"
                    value={formData.invoice_template || "template_1"}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="template_1">Template 1</option>
                    <option value="template_2">Template 2</option>
                    <option value="template_3">Template 3</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/franchises")}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          )}

          {/* Sectors Tab */}
          {activeTab === "sectors" && (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Note:</strong> Arrange the Priority based on the
                  sequence you prefer for displaying sectors, and fill in with
                  semi-colon.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="border px-2 py-3 text-sm">Sr.No</th>
                      <th className="border px-2 py-3 text-sm">Sector Name</th>
                      <th className="border px-2 py-3 text-sm">Pincode</th>
                      <th className="border px-2 py-3 text-sm">DOX</th>
                      <th className="border px-2 py-3 text-sm">NONDOX Air</th>
                      <th className="border px-2 py-3 text-sm">NONDOX Sur</th>
                      <th className="border px-2 py-3 text-sm">
                        EXPRESS CARGO
                      </th>
                      <th className="border px-2 py-3 text-sm">PRIORITY</th>
                      <th className="border px-2 py-3 text-sm">
                        ECOM PRIORITY
                      </th>
                      <th className="border px-2 py-3 text-sm">ECOM GE</th>
                      <th className="border px-2 py-3 text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectors.map((sector, index) => (
                      <tr key={index}>
                        <td className="border px-2 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border px-2 py-2">
                          <input
                            type="text"
                            value={sector.sector_name}
                            onChange={(e) =>
                              handleSectorChange(
                                index,
                                "sector_name",
                                e.target.value
                              )
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                        <td className="border px-2 py-2">
                          <textarea
                            value={sector.pincodes}
                            onChange={(e) =>
                              handleSectorChange(
                                index,
                                "pincodes",
                                e.target.value
                              )
                            }
                            rows="2"
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={sector.dox}
                            onChange={(e) =>
                              handleSectorChange(index, "dox", e.target.checked)
                            }
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={sector.nondox_air}
                            onChange={(e) =>
                              handleSectorChange(
                                index,
                                "nondox_air",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={sector.nondox_sur}
                            onChange={(e) =>
                              handleSectorChange(
                                index,
                                "nondox_sur",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={sector.express_cargo}
                            onChange={(e) =>
                              handleSectorChange(
                                index,
                                "express_cargo",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={sector.priority}
                            onChange={(e) =>
                              handleSectorChange(
                                index,
                                "priority",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={sector.ecom_priority}
                            onChange={(e) =>
                              handleSectorChange(
                                index,
                                "ecom_priority",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={sector.ecom_ge}
                            onChange={(e) =>
                              handleSectorChange(
                                index,
                                "ecom_ge",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeSector(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={addSector}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add New
                </button>
                <button
                  type="button"
                  onClick={saveSectors}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div>
              <p className="text-sm text-red-600 mb-6">
                <strong>Note:</strong> It will appear on invoice & image must be
                .png or .jpg or .jpeg format
              </p>

              <div className="space-y-8">
                {/* Upload Logo */}
                <div className="flex items-center gap-6 pb-6 border-b">
                  <label className="w-48 font-medium">Upload Logo</label>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={(e) =>
                        handleFileUpload("logo", e.target.files[0])
                      }
                      disabled={uploading.logo}
                      className="block w-full text-sm"
                    />
                  </div>
                  <div className="w-48 text-center">
                    {uploadUrls.logo_url ? (
                      <div>
                        <img
                          src={`http://localhost:5000${uploadUrls.logo_url}`}
                          alt="Logo"
                          className="h-16 mx-auto mb-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleFileRemove("logo")}
                          disabled={uploading.logo}
                          className="px-4 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <span className="text-blue-600">Image not Uploaded</span>
                    )}
                  </div>
                </div>

                {/* Upload Stamp */}
                <div className="flex items-center gap-6 pb-6 border-b">
                  <label className="w-48 font-medium">Upload Stamp</label>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={(e) =>
                        handleFileUpload("stamp", e.target.files[0])
                      }
                      disabled={uploading.stamp}
                      className="block w-full text-sm"
                    />
                  </div>
                  <div className="w-48 text-center">
                    {uploadUrls.stamp_url ? (
                      <div>
                        <img
                          src={`http://localhost:5000${uploadUrls.stamp_url}`}
                          alt="Stamp"
                          className="h-16 mx-auto mb-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleFileRemove("stamp")}
                          disabled={uploading.stamp}
                          className="px-4 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <span className="text-blue-600">Image not Uploaded</span>
                    )}
                  </div>
                </div>

                {/* Upload QRCode */}
                <div className="flex items-center gap-6 pb-6">
                  <label className="w-48 font-medium">Upload QRCode</label>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={(e) =>
                        handleFileUpload("qr_code", e.target.files[0])
                      }
                      disabled={uploading.qr_code}
                      className="block w-full text-sm"
                    />
                  </div>
                  <div className="w-48 text-center">
                    {uploadUrls.qr_code_url ? (
                      <div>
                        <img
                          src={`http://localhost:5000${uploadUrls.qr_code_url}`}
                          alt="QR Code"
                          className="h-16 mx-auto mb-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleFileRemove("qr_code")}
                          disabled={uploading.qr_code}
                          className="px-4 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <span className="text-blue-600">Image not Uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FranchiseFormPage;
