import { useState } from "react";
import api from "../services/api";

const StationaryBulkBarcodePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid Excel or CSV file");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await api.post(
        "/stationary/bulk-barcode/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(
        response.data.message || "File uploaded and processed successfully!"
      );
      setSelectedFile(null);
      // Reset file input
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to upload file. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await api.get("/stationary/bulk-barcode/template", {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "barcode_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to download template. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Print Bulk Barcode
        </h1>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow p-12">
          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <input
                  id="fileInput"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-600
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border file:border-gray-300
                    file:text-sm file:font-medium
                    file:bg-gray-50 file:text-gray-700
                    hover:file:bg-gray-100
                    cursor-pointer"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={handleExportExcel}
                className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Export Excel
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">
                📋 Instructions:
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>
                  1. Click <strong>"Export Excel"</strong> to download the
                  template file
                </li>
                <li>
                  2. Fill in the consignment numbers in the template (one per
                  row)
                </li>
                <li>3. Save the Excel file</li>
                <li>
                  4. Click <strong>"Choose File"</strong> and select your filled
                  Excel file
                </li>
                <li>
                  5. Click <strong>"Upload"</strong> to generate bulk barcodes
                </li>
                <li>
                  6. The barcodes will be automatically generated and ready to
                  print
                </li>
              </ul>
            </div>

            {/* File Format Info */}
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">
                Supported File Formats:
              </h4>
              <div className="flex gap-4 text-sm text-gray-600">
                <span className="px-3 py-1 bg-white border border-gray-300 rounded">
                  .xlsx
                </span>
                <span className="px-3 py-1 bg-white border border-gray-300 rounded">
                  .xls
                </span>
                <span className="px-3 py-1 bg-white border border-gray-300 rounded">
                  .csv
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Need help? Contact support or refer to the user manual for detailed
            instructions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StationaryBulkBarcodePage;
