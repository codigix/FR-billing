import { useState } from "react";
import axios from "axios";

export default function AddExpensesPage() {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const categories = [
    "Fuel",
    "Rent",
    "Salary",
    "Utilities",
    "Maintenance",
    "Insurance",
    "Supplies",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.description || !formData.category) {
      setMessage("All fields are required");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/expenses",
        {
          ...formData,
          amount: parseFloat(formData.amount),
          expense_date: new Date().toISOString().split("T")[0],
          payment_mode: "cash",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setMessage("Expense added successfully");
        setMessageType("success");
        setFormData({
          amount: "",
          description: "",
          category: "",
        });

        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      setMessage(
        error.response?.data?.message ||
          "Failed to add expense. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
            <h1 className="text-2xl font-bold text-emerald-900">
              Add Expenses
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Message */}
            {message && (
              <div
                className={`rounded-lg px-4 py-3 ${
                  messageType === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter Amount"
                step="0.01"
                min="0"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Reason/Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter reason for expense"
                rows="4"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Select</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-8 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
