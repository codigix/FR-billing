import { useState } from "react";
import { Info, Download } from "lucide-react";

export default function ImportFromExcelBookingPage() {
  const [format1File, setFormat1File] = useState(null);
  const [format2File, setFormat2File] = useState(null);
  const [format3File, setFormat3File] = useState(null);
  const [importedData, setImportedData] = useState(null);
  const [importedFormat, setImportedFormat] = useState(null);

  const handleUpload = async (file, format) => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/import-excel",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        // Store imported data for display
        setImportedData(data.data.data || []);
        setImportedFormat(format);
        alert(
          `Format ${format} imported successfully! ${data.data.imported} rows imported.`
        );
        if (format === 1) setFormat1File(null);
        if (format === 2) setFormat2File(null);
        if (format === 3) setFormat3File(null);
      } else {
        alert(data.message || "Failed to import file");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  const downloadTemplate = (format) => {
    window.open(
      `http://localhost:5000/api/bookings/download-template/${format}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Import From Excel</h1>

      {/* First Format */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          First Format
        </h2>

        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Download the format1</li>
            <li>Fill in your data & upload your file</li>
            <li>You need to upload a .txt file for this format</li>
            <li>
              Below is a preview of the excel format. Please ensure all required
              columns are filled and the data matches the expected format
            </li>
          </ol>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFormat1File(e.target.files[0])}
            className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700"
          />
          <button
            onClick={() => handleUpload(format1File, 1)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Upload
          </button>
          <button
            onClick={() => downloadTemplate(1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Download Format1
          </button>
        </div>

        <div className="bg-slate-50 border rounded-lg p-4">
          <h4 className="font-medium mb-2">Format Preview:</h4>
          <table className="w-full text-sm border">
            <thead className="bg-slate-100">
              <tr>
                <th className="border px-4 py-2">A</th>
                <th className="border px-4 py-2">B</th>
              </tr>
              <tr>
                <th className="border px-4 py-2">Consignment No*</th>
                <th className="border px-4 py-2">Customer Id*</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">TT2300345</td>
                <td className="border px-4 py-2">Test Logistic</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">2</td>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Second Format */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Second Format
        </h2>

        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Download the format2</li>
            <li>Fill in your data & upload your file</li>
            <li>You need to upload a .txt file for this format</li>
            <li>
              Below is a preview of the excel format. Please ensure all required
              columns are filled and the data matches the expected format
            </li>
          </ol>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFormat2File(e.target.files[0])}
            className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700"
          />
          <button
            onClick={() => handleUpload(format2File, 2)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Upload
          </button>
          <button
            onClick={() => downloadTemplate(2)}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Download Format2
          </button>
        </div>

        <div className="bg-slate-50 border rounded-lg p-4 overflow-x-auto">
          <h4 className="font-medium mb-2">Format Preview:</h4>
          <table className="w-full text-sm border">
            <thead className="bg-slate-100">
              <tr>
                <th className="border px-4 py-2">A</th>
                <th className="border px-4 py-2">B</th>
                <th className="border px-4 py-2">C</th>
                <th className="border px-4 py-2">D</th>
                <th className="border px-4 py-2">E</th>
                <th className="border px-4 py-2">F</th>
                <th className="border px-4 py-2">G</th>
                <th className="border px-4 py-2">H</th>
              </tr>
              <tr>
                <th className="border px-4 py-2">Sr.No</th>
                <th className="border px-4 py-2">Consignment No*</th>
                <th className="border px-4 py-2">Customer Id*</th>
                <th className="border px-4 py-2">Chargable Weight</th>
                <th className="border px-4 py-2">Insurance Amt</th>
                <th className="border px-4 py-2">FOV Amt</th>
                <th className="border px-4 py-2">FOV Per</th>
                <th className="border px-4 py-2">Other charges</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">TT2380345</td>
                <td className="border px-4 py-2">Test Logistic</td>
                <td className="border px-4 py-2">1.1</td>
                <td className="border px-4 py-2">100</td>
                <td className="border px-4 py-2">0.2</td>
                <td className="border px-4 py-2">2</td>
                <td className="border px-4 py-2">50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Third Format */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Third Format
        </h2>

        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Download the format3</li>
            <li>Fill in your data & upload your file</li>
            <li>
              If you enter the amount, it will be saved. If left said, the
              amount will be calculated based on the ratemaster
            </li>
            <li>
              Below is a preview of the excel format. Please ensure all required
              columns are filled and the data matches the expected format
            </li>
          </ol>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFormat3File(e.target.files[0])}
            className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700"
          />
          <button
            onClick={() => handleUpload(format3File, 3)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Upload
          </button>
          <button
            onClick={() => downloadTemplate(3)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Download Format3
          </button>
        </div>

        <div className="bg-slate-50 border rounded-lg p-4 overflow-x-auto">
          <h4 className="font-medium mb-2">Format Preview:</h4>
          <table className="w-full text-sm border">
            <thead className="bg-slate-100">
              <tr>
                <th className="border px-2 py-2">Sr.No</th>
                <th className="border px-2 py-2">Consignment No*</th>
                <th className="border px-2 py-2">Chargable Weight</th>
                <th className="border px-2 py-2">Mode*</th>
                <th className="border px-2 py-2">Company Address</th>
                <th className="border px-2 py-2">Quantity*</th>
                <th className="border px-2 py-2">Pincode*</th>
                <th className="border px-2 py-2">Booking Date*</th>
                <th className="border px-2 py-2">Or Gt Amt or Cv</th>
                <th className="border px-2 py-2">Type or N*</th>
                <th className="border px-2 py-2">Customer Id*</th>
                <th className="border px-2 py-2">Other Charges</th>
                <th className="border px-2 py-2">Receiver</th>
                <th className="border px-2 py-2">Amount (Optional)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-2">1</td>
                <td className="border px-2 py-2">TT2380345</td>
                <td className="border px-2 py-2">1.1</td>
                <td className="border px-2 py-2">AR</td>
                <td className="border px-2 py-2">Pune</td>
                <td className="border px-2 py-2">2</td>
                <td className="border px-2 py-2">400001</td>
                <td className="border px-2 py-2">30/01/2020</td>
                <td className="border px-2 py-2">D</td>
                <td className="border px-2 py-2">Test Logistic</td>
                <td className="border px-2 py-2">50</td>
                <td className="border px-2 py-2">Bob</td>
                <td className="border px-2 py-2">50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Imported Data Display */}
      {importedData && importedData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Imported Data (Format {importedFormat})
            </h2>
            <button
              onClick={() => {
                setImportedData(null);
                setImportedFormat(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Clear
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 border">
              <thead className="bg-slate-100">
                <tr>
                  {importedData[0] &&
                    Object.keys(importedData[0]).map((key) => (
                      <th
                        key={key}
                        className="border px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {importedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {Object.values(row).map((value, colIdx) => (
                      <td
                        key={colIdx}
                        className="border px-4 py-2 text-sm text-slate-900"
                      >
                        {value !== null && value !== undefined
                          ? String(value)
                          : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              ✅ <strong>{importedData.length} rows</strong> imported
              successfully and saved to database
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
