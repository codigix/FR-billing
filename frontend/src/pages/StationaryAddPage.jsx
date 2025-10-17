import { useState } from "react";
import api from "../services/api";
import { Info } from "lucide-react";

const StationaryAddPage = () => {
  const [formData, setFormData] = useState({
    receipt_date: new Date().toISOString().split("T")[0],
    start_no: "",
    end_no: "",
    no_of_leafs: "",
    no_of_books: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateConsignments = () => {
    if (formData.start_no && formData.end_no) {
      const start = parseInt(formData.start_no);
      const end = parseInt(formData.end_no);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        return end - start + 1;
      }
    }
    return 0;
  };

  const handleSubmit = async (e, printAfterSave = false) => {
    e.preventDefault();

    if (!formData.start_no || !formData.end_no) {
      alert("Please fill Start No and End No");
      return;
    }

    const totalConsignments = calculateConsignments();
    if (totalConsignments <= 0) {
      alert("End No must be greater than or equal to Start No");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        total_consignments: totalConsignments,
        used_consignments: 0,
        remaining_consignments: totalConsignments,
      };

      await api.post("/stationary/consignments", payload);

      alert("Stationary added successfully!");

      if (printAfterSave) {
        // Trigger print dialog
        window.print();
      }

      // Reset form
      setFormData({
        receipt_date: new Date().toISOString().split("T")[0],
        start_no: "",
        end_no: "",
        no_of_leafs: "",
        no_of_books: "",
      });
    } catch (error) {
      console.error("Error adding stationary:", error);
      alert(error.response?.data?.message || "Failed to add stationary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add Stationary</h1>
          <Info className="w-5 h-5 text-blue-500" />
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={(e) => handleSubmit(e, false)}>
            <div className="space-y-6">
              {/* Receipt Date */}
              <div className="flex items-center gap-6">
                <label className="w-48 text-sm font-medium text-gray-700">
                  Receipt Date<span className="text-red-500">*</span>
                </label>
                <div className="flex-1 relative">
                  <input
                    type="date"
                    name="receipt_date"
                    value={formData.receipt_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Start No */}
              <div className="flex items-center gap-6">
                <label className="w-48 text-sm font-medium text-gray-700">
                  Start No<span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="start_no"
                    value={formData.start_no}
                    onChange={handleChange}
                    required
                    placeholder="P0001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* End No */}
              <div className="flex items-center gap-6">
                <label className="w-48 text-sm font-medium text-gray-700">
                  End No<span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="end_no"
                    value={formData.end_no}
                    onChange={handleChange}
                    required
                    placeholder="P0100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* No of Leafs */}
              <div className="flex items-center gap-6">
                <label className="w-48 text-sm font-medium text-gray-700">
                  No of Leafs
                </label>
                <div className="flex-1">
                  <input
                    type="number"
                    name="no_of_leafs"
                    value={formData.no_of_leafs}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* No of Books */}
              <div className="flex items-center gap-6">
                <label className="w-48 text-sm font-medium text-gray-700">
                  No of Books
                </label>
                <div className="flex-1">
                  <input
                    type="number"
                    name="no_of_books"
                    value={formData.no_of_books}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Total Consignments Display */}
              {formData.start_no && formData.end_no && (
                <div className="flex items-center gap-6 bg-blue-50 p-4 rounded-md">
                  <label className="w-48 text-sm font-medium text-blue-700">
                    Total Consignments:
                  </label>
                  <div className="flex-1 text-lg font-bold text-blue-700">
                    {calculateConsignments()}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                  className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  Save & Print
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StationaryAddPage;
