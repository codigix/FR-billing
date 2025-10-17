import { useState, useEffect } from "react";
import { Info } from "lucide-react";

export default function AddPaymentNonGSTPage() {
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

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
        "http://localhost:5000/api/payments/invoice-summary?gst=false",
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

  const handleShow = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: recordsPerPage,
        payment_status: paymentStatus,
        search: searchTerm,
        gst: "false",
      }).toString();

      const response = await fetch(
        `http://localhost:5000/api/payments/invoice-list?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setInvoices(data.data);
        setTotalRecords(data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      alert("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = (invoice) => {
    // Navigate to payment form or open modal
    alert(`Add payment for Invoice: ${invoice.invoice_number}`);
  };

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Add Payment (Non-GST)
          </h1>
          <Info className="h-5 w-5 text-blue-500 cursor-pointer" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Paid Amount</div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            ₹
            {summary.paid_amount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Unpaid Amount</div>
          <div className="mt-2 text-2xl font-bold text-red-600">
            ₹
            {summary.unpaid_amount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Total Sale</div>
          <div className="mt-2 text-2xl font-bold text-blue-600">
            ₹
            {summary.total_sale.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Partial Paid</div>
          <div className="mt-2 text-2xl font-bold text-orange-600">
            ₹
            {summary.partial_paid.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Unpaid</option>
              <option value="partial">Partial</option>
            </select>
          </div>

          <button
            onClick={handleShow}
            disabled={loading}
            className="rounded-md bg-blue-600 px-6 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Show"}
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <select
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              className="rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-slate-600">records per page</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded border border-slate-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700"></th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Customer Id
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Invoice No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Invoice Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  Sub Total
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  Fuel Surcharge(%)
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  Fuel Surcharge Total
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  GST(%)
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  GST Total
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  Net Amount
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  Paid
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan="12"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    {loading
                      ? "Loading..."
                      : "No records found. Click 'Show' to load data."}
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleAddPayment(invoice)}
                        className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-700"
                      >
                        Add Payments
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.customer_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {new Date(invoice.invoice_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-900">
                      {invoice.sub_total}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-900">
                      {invoice.fuel_surcharge_percent || 0}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-900">
                      {invoice.fuel_surcharge || 0}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-900">
                      {invoice.gst_percent || 0}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-900">
                      {invoice.gst_total || 0}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                      {invoice.net_amount}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-emerald-600 font-medium">
                      {invoice.paid_amount || 0}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-red-600 font-medium">
                      {invoice.balance || invoice.net_amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {invoices.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
            <div className="text-sm text-slate-600">
              Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
              {Math.min(currentPage * recordsPerPage, totalRecords)} of{" "}
              {totalRecords} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`rounded px-3 py-1 text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
