import { useState } from "react";
import { Info } from "lucide-react";

export default function ImportLimitlessPage() {
  const [textFile, setTextFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);

  const handleTextUpload = async () => {
    if (!textFile) {
      alert("Please select a text file");
      return;
    }

    const formData = new FormData();
    formData.append("file", textFile);

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/import-text",
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
        alert("Text file imported successfully!");
        setTextFile(null);
      } else {
        alert(data.message || "Failed to import text file");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile) {
      alert("Please select an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/import-excel-limitless",
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
        alert("Excel file imported successfully!");
        setExcelFile(null);
      } else {
        alert(data.message || "Failed to import Excel file");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-800">
          Import Excel from the Limitless
        </h1>
        <Info className="h-5 w-5 text-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Upload Text File */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Upload Text File
          </h2>
          <div className="space-y-4">
            <input
              type="file"
              accept=".txt"
              onChange={(e) => setTextFile(e.target.files[0])}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
            <button
              onClick={handleTextUpload}
              className="w-full px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Upload Excel File */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Upload Excel File
          </h2>
          <div className="space-y-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setExcelFile(e.target.files[0])}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
            <button
              onClick={handleExcelUpload}
              className="w-full px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
