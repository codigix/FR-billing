import { useState } from "react";
import { Info } from "lucide-react";

export default function MultipleBookingPage() {
  const [formData, setFormData] = useState({
    start_number: "",
    end_number: "",
    company: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.start_number || !formData.end_number || !formData.company) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/multiple",
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
        alert("Multiple bookings created successfully!");
        setFormData({ start_number: "", end_number: "", company: "" });
      } else {
        alert(data.message || "Failed to create bookings");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Multiple Booking</h1>
        <Info className="h-5 w-5 text-blue-500" />
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-orange-700">
        You can access this feature only after uploading the DTDC TXT file
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Start number
            </label>
            <input
              type="text"
              value={formData.start_number}
              onChange={(e) =>
                setFormData({ ...formData, start_number: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              End number
            </label>
            <input
              type="text"
              value={formData.end_number}
              onChange={(e) =>
                setFormData({ ...formData, end_number: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
          >
            Submit
          </button>
        </div>

        <p className="mt-6 text-sm text-red-600">
          You can book only upto 100 consignment At One Time...
        </p>
      </form>
    </div>
  );
}
