import { useState, useEffect } from "react";
import axios from "axios";

export default function AddPaymentsPage() {
  const [formData, setFormData] = useState({
    consignment_number: "",
    amount: "",
    payment_mode: "cash",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [consignmentData, setConsignmentData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [searchText, setSearchText] = useState("");

  const paymentModes = ["Cash", "Credit", "Cheque", "Card", "Other"];

  useEffect(() => {
    fetchConsignmentReport();
  }, [pagination.page]);

  const fetchConsignmentReport = async () => {
    setTableLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/payments/consignment-report",
        {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            search: searchText,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setConsignmentData(response.data.data);
        setPagination({
          ...pagination,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching consignment report:", error);
    } finally {
      setTableLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.consignment_number ||
      !formData.amount ||
      !formData.payment_mode ||
      !formData.description
    ) {
      setMessage("All fields are required");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/payments",
        {
          consignment_number: formData.consignment_number,
          amount: parseFloat(formData.amount),
          payment_mode: formData.payment_mode.toLowerCase(),
          description: formData.description,
          payment_date: new Date().toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setMessage("Payment added successfully");
        setMessageType("success");
        setFormData({
          consignment_number: "",
          amount: "",
          payment_mode: "cash",
          description: "",
        });

        // Refresh the table
        fetchConsignmentReport();

        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      setMessage(
        error.response?.data?.message ||
          "Failed to add payment. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Form Section */}
        <div className="mb-8 rounded-lg bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
            <h1 className="text-2xl font-bold text-emerald-900">Add Payment</h1>
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Consignment No */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Consignment No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="consignment_number"
                  value={formData.consignment_number}
                  onChange={handleChange}
                  placeholder="Enter Consignment No"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

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
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Mode <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {paymentModes.map((mode) => (
                  <label key={mode} className="flex items-center">
                    <input
                      type="radio"
                      name="payment_mode"
                      value={mode.toLowerCase()}
                      checked={formData.payment_mode === mode.toLowerCase()}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter payment description"
                rows="3"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
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

        {/* Report Section */}
        <div className="rounded-lg bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
            <h2 className="text-xl font-bold text-emerald-900">
              Consignment Report
            </h2>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <label className="text-sm text-slate-600">
                Records per page:
              </label>
              <select
                value={pagination.limit}
                onChange={(e) => {
                  setPagination({
                    ...pagination,
                    limit: Number(e.target.value),
                    page: 1,
                  });
                }}
                className="rounded border border-slate-300 px-3 py-1 text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Search:</label>
              <input
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Search consignments..."
                className="rounded border border-slate-300 px-3 py-1 text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {tableLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-slate-600">Loading...</div>
              </div>
            ) : consignmentData.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="text-slate-600">No data available in table</div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Consignment No
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Booking Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Sender Phone
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Recipients Pincode
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Charge Total
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Paid Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Balance Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {consignmentData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.consignment_number || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.booking_date
                          ? new Date(row.booking_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.destination || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.sender_phone || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.sender || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        {row.recipient_pincode || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        ₹{parseFloat(row.charge_total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        ₹{parseFloat(row.paid_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900">
                        ₹
                        {parseFloat(
                          (row.charge_total || 0) - (row.paid_amount || 0)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <div className="text-sm text-slate-600">
              Showing 0 to {consignmentData.length} of {pagination.total}{" "}
              entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.page - 1))
                }
                disabled={pagination.page === 1}
                className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(pagination.totalPages, pagination.page + 1)
                  )
                }
                disabled={pagination.page === pagination.totalPages}
                className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Total Balance */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <button className="rounded bg-blue-600 px-6 py-2 text-white">
              Total Balance
              <span className="ml-2 font-semibold">
                ₹
                {consignmentData
                  .reduce(
                    (sum, row) =>
                      sum + ((row.charge_total || 0) - (row.paid_amount || 0)),
                    0
                  )
                  .toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
