import { useState } from "react";
import axios from "axios";

export default function PrintBulkCashReceiptPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from_consignment: "",
    to_consignment: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownload = async () => {
    if (!formData.from_consignment || !formData.to_consignment) {
      alert("Please enter both From and To Consignment Numbers");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/cashcounter/bulk-print",
        {
          params: {
            from: formData.from_consignment,
            to: formData.to_consignment,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert(
          `Found ${response.data.data.count} bookings. Opening print dialog...`
        );
        // In a real implementation, this would open a print preview with all receipts
        window.print();
      }
    } catch (error) {
      console.error("Bulk print error:", error);
      alert(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Print Bulk Cash Receipt
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              From Consignment No
            </label>
            <input
              type="text"
              name="from_consignment"
              value={formData.from_consignment}
              onChange={handleInputChange}
              placeholder="Enter From Consignment Number"
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              To Consignment No
            </label>
            <input
              type="text"
              name="to_consignment"
              value={formData.to_consignment}
              onChange={handleInputChange}
              placeholder="Enter To Consignment Number"
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Loading..." : "Download"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
