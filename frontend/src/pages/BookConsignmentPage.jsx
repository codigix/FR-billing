import { useState } from "react";
import { Info } from "lucide-react";

export default function BookConsignmentPage() {
  const [formData, setFormData] = useState({
    consignment_no: "",
    customer_id: "",
    receiver: "",
    address: "",
    booking_date: new Date().toISOString().split("T")[0],
    consignment_type: "Domestic",
    pincode: "",
    mode: "AR",
    act_wt: "",
    char_wt: "",
    qty: "",
    type: "D",
    amount: "",
    other_charges: "",
    reference: "",
    dtdc_amt: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.consignment_no ||
      !formData.customer_id ||
      !formData.booking_date ||
      !formData.pincode ||
      !formData.char_wt ||
      !formData.qty
    ) {
      alert("Please fill all required fields marked with *");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Consignment booked successfully!");
        // Reset form
        setFormData({
          consignment_no: "",
          customer_id: "",
          receiver: "",
          address: "",
          booking_date: new Date().toISOString().split("T")[0],
          consignment_type: "Domestic",
          pincode: "",
          mode: "AR",
          act_wt: "",
          char_wt: "",
          qty: "",
          type: "D",
          amount: "",
          other_charges: "",
          reference: "",
          dtdc_amt: "",
        });
      } else {
        alert(data.message || "Failed to book consignment");
      }
    } catch (error) {
      console.error("Error booking consignment:", error);
      alert("An error occurred while booking consignment");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Book Consignment</h1>
        <Info
          className="h-5 w-5 text-blue-500 cursor-help"
          title="Book new consignment"
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {/* File Upload */}
        <div className="mb-6 flex items-center gap-3">
          <label className="text-sm text-slate-600">Choose File:</label>
          <input
            type="file"
            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          <button
            type="button"
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm"
          >
            Import from text
          </button>
        </div>

        {/* First Row */}
        <div className="grid grid-cols-10 gap-4 mb-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Consi no<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="consignment_no"
              value={formData.consignment_no}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cust Id<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Receiver
            </label>
            <input
              type="text"
              name="receiver"
              value={formData.receiver}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Book date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Consignment Type
            </label>
            <select
              name="consignment_type"
              value={formData.consignment_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Domestic">Domestic</option>
              <option value="International">International</option>
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pincode<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mode
            </label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="AR">AR</option>
              <option value="SR">SR</option>
              <option value="Express">Express</option>
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Act Wt
            </label>
            <input
              type="number"
              step="0.01"
              name="act_wt"
              value={formData.act_wt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              char Wt<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="char_wt"
              value={formData.char_wt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Qty<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="D">D</option>
              <option value="P">P</option>
              <option value="COD">COD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Other Charges
            </label>
            <input
              type="number"
              step="0.01"
              name="other_charges"
              value={formData.other_charges}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reference
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Dtdc Amt
            </label>
            <input
              type="number"
              step="0.01"
              name="dtdc_amt"
              value={formData.dtdc_amt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
