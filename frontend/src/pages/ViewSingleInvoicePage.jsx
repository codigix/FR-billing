import { useState, useEffect } from "react";
import { Search, Eye, Edit } from "lucide-react";

export default function ViewSingleInvoicePage() {
  const [filters, setFilters] = useState({
    company_name: "",
    invoice_number: "",
    from_date: "",
    to_date: "",
  });

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    paid_amount: 0,
    unpaid_amount: 0,
    total_sale: 0,
    partial_paid: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/invoices/single-summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setSummary(data.data);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        ...filters,
        type: "single",
      }).toString();

      const response = await fetch(
        `http://localhost:5000/api/invoices?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setInvoices(data.data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      alert("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    alert(`View Invoice ID: ${id}`);
  };

  const handleEdit = (id) => {
    alert(`Edit Invoice ID: ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            View Single Invoice
          </h1>
          <p className="text-sm text-slate-500">
            View and manage single consignment invoices
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Paid Amount</div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            ₹{summary.paid_amount.toLocaleString()}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Unpaid Amount</div>
          <div className="mt-2 text-2xl font-bold text-red-600">
            ₹{summary.unpaid_amount.toLocaleString()}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Total Sale</div>
          <div className="mt-2 text-2xl font-bold text-blue-600">
            ₹{summary.total_sale.toLocaleString()}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Partial Paid</div>
          <div className="mt-2 text-2xl font-bold text-orange-600">
            ₹{summary.partial_paid.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Name
            </label>
            <select
              name="company_name"
              value={filters.company_name}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Select Companies</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              name="invoice_number"
              value={filters.invoice_number}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              name="from_date"
              value={filters.from_date}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              name="to_date"
              value={filters.to_date}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>

      {/* Invoices Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Invoice No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Invoice Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Customer Id
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Period From
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Period To
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Fuel Surcharge(%)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Fuel Surcharge Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Discount(%)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Discount Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  GST(%)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  GST Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Other Charge
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Net Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Paid Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan="17"
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    No invoices found. Use filters and click Submit to search.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.invoice_date}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.customer_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.period_from}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.period_to}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.total_amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.fuel_surcharge_percent}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.fuel_surcharge_total}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.discount_percent}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.discount_amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.gst_percent}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.gst_amount_new}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.other_charge}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 font-medium">
                      {invoice.net_amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.paid_amount}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                        {invoice.payment_status || "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(invoice.id)}
                          className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(invoice.id)}
                          className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
