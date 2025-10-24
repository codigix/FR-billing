import { useState, useEffect, useRef } from "react";
import { Printer, Download, X, Loader } from "lucide-react";
import InvoicePrintTemplate from "../components/InvoicePrintTemplate";

export default function InvoiceDisplayPage() {
  const [invoiceId, setInvoiceId] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const printRef = useRef();

  const fetchInvoice = async () => {
    if (!invoiceId.trim()) {
      setError("Please enter an invoice number or ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // First, try to fetch invoice by number or ID
      const response = await fetch(
        `http://localhost:5000/api/invoices?invoice_number=${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        const invoiceData = data.data[0];
        setInvoice(invoiceData);

        // Fetch associated bookings
        if (invoiceData.period_from && invoiceData.period_to) {
          const bookingsResponse = await fetch(
            `http://localhost:5000/api/bookings/filter?customer_id=${invoiceData.customer_id}&from_date=${invoiceData.period_from}&to_date=${invoiceData.period_to}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const bookingsData = await bookingsResponse.json();
          if (bookingsData.success) {
            setBookings(bookingsData.data?.bookings || []);
          }
        }
      } else {
        setError(
          "Invoice not found. Please check the invoice number and try again."
        );
        setInvoice(null);
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching invoice:", err);
      setError("Failed to fetch invoice details. Please try again.");
      setInvoice(null);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=900");
    printWindow.document.write(printRef.current.innerHTML);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownloadPDF = async () => {
    if (!invoice?.id) {
      alert("Please load an invoice first");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/invoices/${invoice.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice-${invoice.invoice_number}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to download invoice");
      }
    } catch (err) {
      console.error("Download error:", err);
      alert("Error downloading invoice: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchInvoice();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Professional Invoice
          </h1>
          <p className="text-slate-600">
            View and print invoices with Codigix Infotech branding
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Invoice Number or ID
              </label>
              <input
                type="text"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., INV/2025/0001 or invoice_id"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchInvoice}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 flex items-center gap-2 font-medium"
              >
                {loading && <Loader className="h-4 w-4 animate-spin" />}
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Invoice Display */}
        {invoice && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>

            {/* Invoice Template */}
            <div
              ref={printRef}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <InvoicePrintTemplate invoice={invoice} bookings={bookings} />
            </div>

            {/* Invoice Details Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-600">
                <div className="text-sm text-slate-600">Invoice Number</div>
                <div className="text-xl font-bold text-slate-800 mt-1">
                  {invoice.invoice_number}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-600">
                <div className="text-sm text-slate-600">Total Amount</div>
                <div className="text-xl font-bold text-slate-800 mt-1">
                  ₹
                  {parseFloat(invoice.total_amount || 0).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-600">
                <div className="text-sm text-slate-600">Balance Due</div>
                <div className="text-xl font-bold text-slate-800 mt-1">
                  ₹
                  {parseFloat(invoice.balance_amount || 0).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-600">
                <div className="text-sm text-slate-600">Payment Status</div>
                <div
                  className={`text-xl font-bold mt-1 ${
                    invoice.payment_status === "paid"
                      ? "text-green-600"
                      : invoice.payment_status === "partial"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {(invoice.payment_status || "unpaid").toUpperCase()}
                </div>
              </div>
            </div>

            {/* Consignments List */}
            {bookings.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Consignments in Invoice ({bookings.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          Consignment No.
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Receiver
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Destination
                        </th>
                        <th className="px-4 py-2 text-right font-semibold">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, idx) => (
                        <tr
                          key={idx}
                          className={`border-b ${
                            idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-2 font-medium text-blue-600">
                            {booking.consignment_number ||
                              booking.consignment_no}
                          </td>
                          <td className="px-4 py-2">
                            {booking.receiver || "—"}
                          </td>
                          <td className="px-4 py-2 text-slate-600">
                            {booking.destination || "—"}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold">
                            ₹
                            {parseFloat(
                              booking.amount || booking.total || 0
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!invoice && !error && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-slate-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No Invoice Selected
            </h3>
            <p className="text-slate-600">
              Enter an invoice number above to view the professional invoice
              template
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
