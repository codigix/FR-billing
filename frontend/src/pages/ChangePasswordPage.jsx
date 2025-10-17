import { useState } from "react";
import axios from "axios";
import { Lock, AlertCircle, CheckCircle, Loader } from "lucide-react";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleToggleVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (!formData.oldPassword) {
      setError("Old password is required");
      return false;
    }

    if (!formData.newPassword) {
      setError("New password is required");
      return false;
    }

    if (!formData.confirmPassword) {
      setError("Confirm password is required");
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return false;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError("New password must be different from old password");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Password changed successfully!");
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Auto-dismiss success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to change password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-emerald-100 p-2">
              <Lock className="h-6 w-6 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              Change Password
            </h1>
          </div>
          <p className="text-slate-600">
            Update your account password securely
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Form Section */}
          <div className="md:col-span-2">
            <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-800">
                    {successMessage}
                  </span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Old Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleInputChange}
                      placeholder="Enter your current password"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors hover:border-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility("old")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPasswords.old ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter your new password"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors hover:border-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility("new")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPasswords.new ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your new password"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors hover:border-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility("confirm")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPasswords.confirm ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Password"
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Minimum 6 characters long</li>
                  <li>• Must be different from current password</li>
                  <li>• New password and confirm password must match</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Help Panel */}
          <div className="md:col-span-1">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 sticky top-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-4">
                Security Tips
              </h3>
              <ul className="space-y-3 text-sm text-blue-800">
                <li>
                  <strong>Use strong passwords:</strong> Mix uppercase,
                  lowercase, numbers, and symbols for maximum security.
                </li>
                <li>
                  <strong>Never share:</strong> Keep your password confidential
                  and never share it with anyone.
                </li>
                <li>
                  <strong>Change regularly:</strong> Update your password
                  periodically for better security.
                </li>
                <li>
                  <strong>Unique password:</strong> Use different passwords for
                  different accounts.
                </li>
                <li>
                  <strong>Avoid patterns:</strong> Don't use sequential numbers
                  or keyboard patterns.
                </li>
              </ul>

              <div className="mt-6 rounded-lg bg-blue-100 p-3">
                <p className="text-xs text-blue-900">
                  💡 <strong>Tip:</strong> After changing your password, you'll
                  be logged out for security. Sign in again with your new
                  password.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
