import { useState, useEffect } from "react";
import axios from "axios";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    invoice_round_off: false,
    invoice_start_from: 1,
    show_image_on_invoice: true,
    invoice_year: "current",
    invoice_data_to_hide: [],
  });

  const [invoiceColumns, setInvoiceColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [franchiseCode, setFranchiseCode] = useState("");
  const [franchiseName, setFranchiseName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const invoiceYearOptions = [
    { value: "choose", label: "Choose an Option" },
    { value: "current", label: "Current Year" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
  ];

  useEffect(() => {
    fetchSettings();
    fetchInvoiceColumns();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/settings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data.data;
      setFranchiseCode(data.franchiseCode);
      setFranchiseName(data.franchiseName);
      setSettings(data.settings);
      setError("");
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceColumns = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/settings/columns`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInvoiceColumns(response.data.data.columns || []);
    } catch (error) {
      console.error("Error fetching invoice columns:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleColumnToggle = (columnValue) => {
    setSettings((prev) => {
      const hidden = prev.invoice_data_to_hide;
      if (hidden.includes(columnValue)) {
        return {
          ...prev,
          invoice_data_to_hide: hidden.filter((col) => col !== columnValue),
        };
      } else {
        return {
          ...prev,
          invoice_data_to_hide: [...hidden, columnValue],
        };
      }
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (
        settings.invoice_start_from < 1 ||
        isNaN(settings.invoice_start_from)
      ) {
        setError("Invoice Start From must be a valid number greater than 0");
        setSaving(false);
        return;
      }

      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/settings`,
        settings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setError(
        error.response?.data?.message ||
          "Failed to save settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchSettings();
    setError("");
    setSuccessMessage("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Settings for {franchiseCode} - {franchiseName}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                  {successMessage}
                </div>
              )}

              {/* Invoice Round Off */}
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex-1">
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={settings.invoice_round_off}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            invoice_round_off: e.target.checked,
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-slate-700">
                        Invoice Round Off
                      </span>
                    </label>
                    <p className="text-sm text-slate-500">
                      When enabled, invoice amounts will be rounded to the
                      nearest whole number.
                    </p>
                  </div>
                </div>
                <select
                  value={settings.invoice_round_off ? "Yes" : "No"}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      invoice_round_off: e.target.value === "Yes",
                    }))
                  }
                  className="mt-2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {/* Invoice Start From */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Invoice Start From
                </label>
                <input
                  type="number"
                  name="invoice_start_from"
                  value={settings.invoice_start_from}
                  onChange={handleInputChange}
                  placeholder="e.g., 1, 100, etc."
                  min="1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Starting number for invoice sequence (default: 1).
                </p>
              </div>

              {/* Want to show Image on Invoice */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Want to show Image on Invoice?
                </label>
                <select
                  value={settings.show_image_on_invoice ? "Yes" : "No"}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      show_image_on_invoice: e.target.value === "Yes",
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
                <p className="text-sm text-slate-500 mt-1">
                  When disabled, invoice DTDC Image will not be shown.
                </p>
              </div>

              {/* Invoice Year */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Invoice Year
                </label>
                <select
                  value={settings.invoice_year}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      invoice_year: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {invoiceYearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-slate-500 mt-1">
                  The invoice year will be changed according to the selected
                  option.
                </p>
              </div>

              {/* Invoice Data To Hide */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Invoice Data To Hide
                </label>
                <div className="p-3 border border-slate-300 rounded-md bg-slate-50 max-h-48 overflow-y-auto">
                  {invoiceColumns.length > 0 ? (
                    <div className="space-y-2">
                      {invoiceColumns.map((column) => (
                        <label
                          key={column.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={settings.invoice_data_to_hide.includes(
                              column.value
                            )}
                            onChange={() => handleColumnToggle(column.value)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-slate-700">
                            {column.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No columns available
                    </p>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  The selected invoice table columns will be hidden.
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  <strong>
                    Selected: {settings.invoice_data_to_hide.length}
                  </strong>{" "}
                  ({invoiceColumns.length})
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
                >
                  <span>💾</span>
                  {saving ? "Saving..." : "Save Settings"}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <span>✕</span>
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Settings Help Panel */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 rounded-lg shadow-sm p-6 border border-blue-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span>ℹ️</span> Settings Help
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Invoice Round Off
                  </h3>
                  <p className="text-slate-600">
                    When this option is enabled, all invoice amounts will be
                    automatically rounded to the nearest whole number. This
                    helps in simplifying payment processes and accounting.
                  </p>
                </div>

                <div className="border-t border-blue-200 pt-3">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Invoice Start From
                  </h3>
                  <p className="text-slate-600">
                    This setting allows you to customize the starting number for
                    invoice sequences. For example, if you set this to 100, your
                    first invoice will be "INV/2024-25/100".
                  </p>
                  <ul className="mt-2 space-y-1 text-slate-600">
                    <li>• 1 - Start from invoice number 1 (default)</li>
                    <li>• 100 - Start from invoice number 100</li>
                    <li>• 1000 - Start from invoice number 1000</li>
                  </ul>
                  <p className="mt-2 text-slate-600">
                    <strong>Note:</strong> This only applies to new franchise
                    codes with no existing invoices.
                  </p>
                </div>

                <div className="border-t border-blue-200 pt-3">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Want to show Image on Invoice?
                  </h3>
                  <p className="text-slate-600">
                    When this option is disabled (i.e. Selected - False), the
                    DTDC Image will be hidden on newly generated Invoice PDF.
                  </p>
                </div>

                <div className="border-t border-blue-200 pt-3">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Invoice Year
                  </h3>
                  <p className="text-slate-600">
                    The invoice number (e.g., INV/2025-26/1) for newly generated
                    Invoices will change according to the selected year. Select
                    the Auto option (recommended) if you don't want to update it
                    manually.
                  </p>
                </div>

                <div className="border-t border-blue-200 pt-3">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Invoice Data To Hide
                  </h3>
                  <p className="text-slate-600">
                    The columns that you don't want to be shown on the generated
                    invoice will be removed from newly generated PDFs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
