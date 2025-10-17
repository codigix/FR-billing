import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function PaymentTrackPage() {
  const [filters, setFilters] = useState({
    customer_id: "",
    from_date: "",
    to_date: "",
  });

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totals, setTotals] = useState({
    net_total: 0,
    total: 0,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShow = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: recordsPerPage,
        search: searchTerm,
        ...filters,
      }).toString();

      const response = await fetch(
        `http://localhost:5000/api/payments/track?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setPayments(data.data);
        setTotalRecords(data.pagination.total);
        setTotals(data.totals || { net_total: 0, total: 0 });
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      alert("Failed to fetch payment details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (payment) => {
    alert(`Edit payment for Invoice: ${payment.invoice_number}`);
  };

  const handleDelete = async (payment) => {
    if (!confirm(`Are you sure you want to delete this payment?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/payments/${payment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Payment deleted successfully");
        handleShow(); // Refresh the list
      } else {
        alert(data.message || "Failed to delete payment");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment");
    }
  };

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Payment Details</h1>
        <p className="text-sm text-slate-500">
          Track and manage payment history
        </p>
      </div>

      {/* Filter Section */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              CustomerId
            </label>
            <input
              type="text"
              name="customer_id"
              value={filters.customer_id}
              onChange={handleFilterChange}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter customer ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              From Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="from_date"
              value={filters.from_date}
              onChange={handleFilterChange}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              To Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="to_date"
              value={filters.to_date}
              onChange={handleFilterChange}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleShow}
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Show"}
            </button>
          </div>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Sr.No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Invoiceno
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  invoicedate
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Customer_Id
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Modeofpayment
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Remark
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Payment date
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  Net Amount
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    {loading
                      ? "Loading..."
                      : "No records found. Click 'Show' to load data."}
                  </td>
                </tr>
              ) : (
                payments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(payment)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(payment)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {payment.invoice_number}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {new Date(payment.invoice_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {payment.customer_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {payment.payment_mode}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {payment.notes || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {new Date(payment.payment_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-900">
                      {payment.amount}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                      {payment.net_amount}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-red-600 font-medium">
                      {payment.balance || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Totals */}
        {payments.length > 0 && (
          <>
            <div className="border-t border-slate-200 px-4 py-3 flex justify-end gap-8">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                  Net Total
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {totals.net_total.toLocaleString("en-IN", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                  Total
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {totals.total.toLocaleString("en-IN", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </span>
              </div>
            </div>

            {/* Pagination */}
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
          </>
        )}
      </div>
    </div>
  );
}
