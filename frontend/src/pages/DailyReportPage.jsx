import { useState, useEffect } from "react";
import axios from "axios";

export default function DailyReportPage() {
  const [date, setDate] = useState("");
  const [consignmentData, setConsignmentData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    await fetchDailyReport(1);
  };

  const fetchDailyReport = async (page = 1) => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/reports/daily-report",
        {
          params: {
            date,
            search: searchText,
            page,
            limit: pagination.limit,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setConsignmentData(response.data.consignments || []);
        setExpenseData(response.data.expenses || []);
        setPaymentData(response.data.payments || []);
        setPagination({
          page,
          limit: pagination.limit,
          total: response.data.pagination?.total || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching daily report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/reports/daily-report/export",
        {
          params: {
            date,
            search: searchText,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `daily_report_${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
    fetchDailyReport(page);
  };

  const totalExpense = expenseData.reduce(
    (sum, row) => sum + (parseFloat(row.amount) || 0),
    0
  );

  const totalPayment = paymentData.reduce(
    (sum, row) => sum + (parseFloat(row.amount) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
            <h1 className="text-2xl font-bold text-emerald-900">
              Daily Report
            </h1>
          </div>

          {/* Filter Section */}
          <div className="border-b border-slate-200 p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date:
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={handleExportToExcel}
                    className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    Export to Excel
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Consignment Report Section */}
          <div className="border-b border-slate-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-red-600">
                Consignment Report
              </h2>
              <span className="rounded bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                Total: {consignmentData.length}
              </span>
            </div>

            {/* Controls */}
            <div className="mb-4 flex items-center justify-between">
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
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search..."
                  className="rounded border border-slate-300 px-3 py-1 text-sm"
                />
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="text-slate-600">Loading...</div>
              </div>
            ) : consignmentData.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="text-slate-600">No data available in table</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Sr.No
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Consignment No
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Sender
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Sender Phone
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Destination
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Actual Weight
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Volumetric Weight
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Payment Mode
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Paid Amount
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
                          {idx + 1}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <button className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700">
                            Print
                          </button>
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-900">
                          {row.consignment_number || "-"}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-900">
                          {row.sender || "-"}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-900">
                          {row.sender_phone || "-"}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-900">
                          {row.destination || "-"}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-900">
                          {row.act_wt || "-"}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-900">
                          {row.char_wt || "-"}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-900">
                          {row.payment_mode || "-"}
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-slate-900">
                          ₹{parseFloat(row.paid_amount || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Expense Section */}
          <div className="border-b border-slate-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-red-600">Expense</h3>
              <span className="rounded bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                Total: {totalExpense.toFixed(2)}
              </span>
            </div>

            {expenseData.length === 0 ? (
              <div className="flex justify-center py-4">
                <div className="text-slate-600">No data available</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-200 hover:bg-slate-50"
                      >
                        <td className="px-6 py-3 text-sm font-medium text-slate-900">
                          ₹{parseFloat(row.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-900">
                          {row.description || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="border-b border-slate-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-blue-600">Payment</h3>
              <span className="rounded bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                Total: {totalPayment.toFixed(2)}
              </span>
            </div>

            {paymentData.length === 0 ? (
              <div className="flex justify-center py-4">
                <div className="text-slate-600">No data available</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Consignment No
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-200 hover:bg-slate-50"
                      >
                        <td className="px-6 py-3 text-sm text-slate-900">
                          {row.consignment_number || "-"}
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-slate-900">
                          ₹{parseFloat(row.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-900">
                          {row.description || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
