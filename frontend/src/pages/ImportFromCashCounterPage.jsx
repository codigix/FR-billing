import { useState } from "react";

export default function ImportFromCashCounterPage() {
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    customer_id: "Cash_1",
  });

  const handleBook = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/import-cashcounter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Bookings imported successfully!");
      } else {
        alert(data.message || "Failed to import bookings");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Import From CashCounter
      </h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              From Date:
            </label>
            <input
              type="date"
              value={formData.from_date}
              onChange={(e) =>
                setFormData({ ...formData, from_date: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              To Date:
            </label>
            <input
              type="date"
              value={formData.to_date}
              onChange={(e) =>
                setFormData({ ...formData, to_date: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer Id:
            </label>
            <input
              type="text"
              value={formData.customer_id}
              onChange={(e) =>
                setFormData({ ...formData, customer_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
        </div>
        <button
          onClick={handleBook}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
        >
          Book
        </button>
      </div>
    </div>
  );
}
