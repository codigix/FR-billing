import { useState, useEffect } from "react";
import { Info, Users } from "lucide-react";

export default function MultipleInvoicePage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [availableCustomers, setAvailableCustomers] = useState([]);
  const [formData, setFormData] = useState({
    invoice_date: new Date().toISOString().split("T")[0],
    period_from: "",
    period_to: "",
    gst_percent: 18,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock customer list - in production, fetch from API
    const mockCustomers = [
      "2",
      "3",
      "4",
      "sj",
      "C1",
      "Ganesh",
      "ra",
      "Ramesh",
      "SIP",
    ];
    setAvailableCustomers(mockCustomers);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomers((prev) => [...prev, customer]);
    setAvailableCustomers((prev) => prev.filter((c) => c !== customer));
  };

  const handleRemoveCustomer = (customer) => {
    setAvailableCustomers((prev) => [...prev, customer]);
    setSelectedCustomers((prev) => prev.filter((c) => c !== customer));
  };

  const moveToSelected = () => {
    const firstAvailable = availableCustomers[0];
    if (firstAvailable) {
      handleSelectCustomer(firstAvailable);
    }
  };

  const moveToAvailable = () => {
    const firstSelected = selectedCustomers[0];
    if (firstSelected) {
      handleRemoveCustomer(firstSelected);
    }
  };

  const handleSave = async () => {
    if (selectedCustomers.length === 0) {
      alert("Please select at least one customer");
      return;
    }

    if (!formData.period_from || !formData.period_to) {
      alert("Please select both period dates");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/invoices/generate-multiple",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            customers: selectedCustomers,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(`Successfully generated ${data.count} invoices!`);
        setSelectedCustomers([]);
        setAvailableCustomers([
          "2",
          "3",
          "4",
          "sj",
          "C1",
          "Ganesh",
          "ra",
          "Ramesh",
          "SIP",
        ]);
      } else {
        alert(data.message || "Failed to generate invoices");
      }
    } catch (error) {
      console.error("Error generating invoices:", error);
      alert("Failed to generate invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMail = async () => {
    alert("Send Mail feature coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Generate Multiple Invoice
            </h1>
            <p className="text-sm text-slate-500">
              Create invoices for multiple customers
            </p>
          </div>
          <Info
            className="h-5 w-5 text-blue-500 cursor-pointer"
            title="Generate multiple invoices at once"
          />
        </div>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Customers */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Available Customers
            </label>
            <div className="border border-slate-300 rounded-md h-64 overflow-y-auto bg-white">
              {availableCustomers.map((customer) => (
                <div
                  key={customer}
                  onClick={() => handleSelectCustomer(customer)}
                  className="px-3 py-2 hover:bg-emerald-50 cursor-pointer border-b border-slate-100 text-sm text-slate-700"
                >
                  {customer}
                </div>
              ))}
              {availableCustomers.length === 0 && (
                <div className="flex items-center justify-center h-full text-sm text-slate-400">
                  No customers available
                </div>
              )}
            </div>
          </div>

          {/* Move Buttons */}
          <div className="flex flex-col items-center justify-center gap-4">
            <button
              onClick={moveToSelected}
              disabled={availableCustomers.length === 0}
              className="w-20 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              &gt;
            </button>
            <button
              onClick={moveToAvailable}
              disabled={selectedCustomers.length === 0}
              className="w-20 rounded-md bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50"
            >
              &lt;
            </button>
          </div>

          {/* Selected Customers */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Selected Customers
            </label>
            <div className="border border-slate-300 rounded-md h-64 overflow-y-auto bg-white">
              {selectedCustomers.map((customer) => (
                <div
                  key={customer}
                  onClick={() => handleRemoveCustomer(customer)}
                  className="px-3 py-2 hover:bg-red-50 cursor-pointer border-b border-slate-100 text-sm text-slate-700"
                >
                  {customer}
                </div>
              ))}
              {selectedCustomers.length === 0 && (
                <div className="flex items-center justify-center h-full text-sm text-slate-400">
                  No customers selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Invoice Date:
            </label>
            <input
              type="date"
              name="invoice_date"
              value={formData.invoice_date}
              onChange={handleInputChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Period From:
            </label>
            <input
              type="date"
              name="period_from"
              value={formData.period_from}
              onChange={handleInputChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Period To:
            </label>
            <input
              type="date"
              name="period_to"
              value={formData.period_to}
              onChange={handleInputChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              GST(%):
            </label>
            <input
              type="number"
              name="gst_percent"
              value={formData.gst_percent}
              onChange={handleInputChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading || selectedCustomers.length === 0}
            className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Save"}
          </button>
          <button
            onClick={handleSendMail}
            className="rounded-md bg-pink-600 px-6 py-2 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Send Mail
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 text-sm text-slate-600">
          Selected Customers: {selectedCustomers.length}
        </div>
      </div>
    </div>
  );
}
