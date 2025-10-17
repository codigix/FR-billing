import { useState } from "react";
import axios from "axios";

const ImportCompanyExcelPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];

      if (
        !validTypes.includes(file.type) &&
        !file.name.match(/\.(xlsx|xls|csv)$/i)
      ) {
        alert("Please select a valid Excel or CSV file");
        return;
      }

      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/rates/company/import-excel",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUploadResult({
          success: true,
          message: response.data.message,
          data: response.data.data,
        });
        setSelectedFile(null);
        // Reset file input
        document.getElementById("fileInput").value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadResult({
        success: false,
        message: error.response?.data?.message || "Failed to upload file",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleExportTemplate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/rates/company/export-template",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "company_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("Failed to download template");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Import Company From Excel
          </h1>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Upload Companies
          </h2>

          <div className="flex items-center gap-4 mb-4">
            <input
              id="fileInput"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[100px]"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={handleExportTemplate}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export Excel
            </button>
          </div>

          {selectedFile && (
            <div className="text-sm text-gray-600 mb-2">
              Selected file:{" "}
              <span className="font-semibold">{selectedFile.name}</span>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div
              className={`p-4 rounded-md ${
                uploadResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`font-semibold ${
                  uploadResult.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {uploadResult.message}
              </p>
              {uploadResult.data && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    ✅ Successfully imported: {uploadResult.data.successCount}{" "}
                    companies
                  </p>
                  {uploadResult.data.errorCount > 0 && (
                    <>
                      <p className="text-red-600">
                        ❌ Failed: {uploadResult.data.errorCount} companies
                      </p>
                      {uploadResult.data.errors &&
                        uploadResult.data.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold">Errors:</p>
                            <ul className="list-disc list-inside ml-4">
                              {uploadResult.data.errors.map((error, index) => (
                                <li key={index} className="text-red-600">
                                  {error}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              Download the Excel template by clicking "Export Excel" button
            </li>
            <li>Fill in the company details in the template</li>
            <li>Save the Excel file</li>
            <li>Click "Choose File" to select your filled Excel file</li>
            <li>Click "Upload" to import the companies</li>
            <li>Review the upload results for any errors</li>
          </ol>
        </div>

        {/* File Format Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Supported File Formats
          </h2>
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              .xlsx
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              .xls
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              .csv
            </span>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            <strong>Note:</strong> Make sure your Excel file contains the
            following columns:
          </p>
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside ml-4">
            <li>
              <strong>company_id</strong> (required) - Unique identifier for the
              company
            </li>
            <li>
              <strong>company_name</strong> (required) - Name of the company
            </li>
            <li>
              <strong>company_address</strong> - Full address of the company
            </li>
            <li>
              <strong>phone</strong> - Contact phone number
            </li>
            <li>
              <strong>email</strong> - Contact email address
            </li>
            <li>
              <strong>rate</strong> (required) - Base rate
            </li>
            <li>
              <strong>dox_rk</strong> - Dox RK value
            </li>
            <li>
              <strong>minimum_rate_surcharge</strong> - Minimum rate surcharge
            </li>
            <li>
              <strong>fuel_surcharge</strong> - Fuel surcharge percentage
            </li>
            <li>
              <strong>obs_fuel_surcharge</strong> - OBS fuel surcharge
            </li>
            <li>
              <strong>royalty_charges</strong> - Royalty charges
            </li>
            <li>
              <strong>eco_bl</strong> - Eco BL value
            </li>
            <li>
              <strong>dox_roce</strong> - Dox Roce value
            </li>
            <li>
              <strong>name_average</strong> - Name average value
            </li>
            <li>
              <strong>other_remark</strong> - Additional remarks
            </li>
            <li>
              <strong>status</strong> - Status (active/inactive), defaults to
              active
            </li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Need help? Contact support or refer to the user manual.
        </div>
      </div>
    </div>
  );
};

export default ImportCompanyExcelPage;
