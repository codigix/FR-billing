import { useState } from "react";
import axios from "axios";

export default function DeleteCashConsignmentPage() {
  const [loading, setLoading] = useState(false);
  const [consignmentNo, setConsignmentNo] = useState("");

  const handleDelete = async () => {
    if (!consignmentNo) {
      alert("Please enter Consignment Number");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete consignment ${consignmentNo}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/api/cashcounter/delete-booking/${consignmentNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Consignment deleted successfully!");
        setConsignmentNo("");
      }
    } catch (error) {
      console.error("Delete booking error:", error);
      alert(error.response?.data?.message || "Failed to delete consignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Delete Cashcounter Consignment
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Consignment No
            </label>
            <input
              type="text"
              value={consignmentNo}
              onChange={(e) => setConsignmentNo(e.target.value)}
              placeholder="Enter Consignment Number"
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> Deleting a consignment will permanently
            remove it from the system. This action cannot be undone. Please
            ensure you have entered the correct consignment number.
          </p>
        </div>
      </div>
    </div>
  );
}
