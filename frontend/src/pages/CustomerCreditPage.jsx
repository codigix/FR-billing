import { useState } from "react";

export default function CustomerCreditPage() {
  const [activeTab, setActiveTab] = useState("customer_id");
  const [customerId, setCustomerId] = useState("");
  const [creditData, setCreditData] = useState({
    total_credit: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleFetchCredit = async () => {
    if (!customerId.trim()) {
      alert("Please enter Customer ID");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/payments/customer-credit?customer_id=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setCreditData(data.data);
      } else {
        alert(data.message || "Failed to fetch credit data");
      }
    } catch (error) {
      console.error("Error fetching credit:", error);
      alert("Failed to fetch customer credit");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Credit Payment</h1>
        <p className="text-sm text-slate-500">
          View customer credit and balance information
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("customer_id")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "customer_id"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-800"
              }`}
            >
              Customer Id
            </button>
            <button
              onClick={() => setActiveTab("total_credit")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "total_credit"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-800"
              }`}
            >
              Total Credit
            </button>
            <button
              onClick={() => setActiveTab("last_balance")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "last_balance"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-800"
              }`}
            >
              Last Balance
            </button>
            <button
              onClick={handlePrint}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "print"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-800"
              }`}
            >
              Print
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === "customer_id" && (
            <div className="space-y-6">
              <div className="max-w-md">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter Customer ID
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="flex-1 rounded border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter customer ID"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleFetchCredit();
                      }
                    }}
                  />
                  <button
                    onClick={handleFetchCredit}
                    disabled={loading}
                    className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Search"}
                  </button>
                </div>
              </div>

              {/* Display Results */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="rounded-lg border-2 border-blue-600 bg-blue-50 p-6 text-center">
                  <div className="text-sm font-medium text-blue-700 mb-2">
                    Total Credit
                  </div>
                  <div className="text-4xl font-bold text-blue-600">
                    {creditData.total_credit}
                  </div>
                </div>

                <div className="rounded-lg border-2 border-emerald-600 bg-emerald-50 p-6 text-center">
                  <div className="text-sm font-medium text-emerald-700 mb-2">
                    Balance
                  </div>
                  <div className="text-4xl font-bold text-emerald-600">
                    {creditData.balance}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "total_credit" && (
            <div className="text-center py-12">
              <div className="rounded-lg border-2 border-blue-600 bg-blue-50 p-8 inline-block">
                <div className="text-lg font-medium text-blue-700 mb-4">
                  Total Credit
                </div>
                <div className="text-5xl font-bold text-blue-600">
                  {creditData.total_credit}
                </div>
              </div>
            </div>
          )}

          {activeTab === "last_balance" && (
            <div className="text-center py-12">
              <div className="rounded-lg border-2 border-emerald-600 bg-emerald-50 p-8 inline-block">
                <div className="text-lg font-medium text-emerald-700 mb-4">
                  Last Balance
                </div>
                <div className="text-5xl font-bold text-emerald-600">
                  {creditData.balance}
                </div>
              </div>
            </div>
          )}

          {activeTab === "print" && (
            <div className="text-center py-12">
              <button
                onClick={handlePrint}
                className="rounded-md bg-slate-600 px-8 py-3 text-base font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                Print Credit Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-2">
          <div className="text-blue-600 font-bold">ℹ️</div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How to use:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Enter the Customer ID in the input field</li>
              <li>Click "Search" to fetch credit information</li>
              <li>Use tabs to view different aspects of customer credit</li>
              <li>Click "Print" tab to generate a printable report</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
