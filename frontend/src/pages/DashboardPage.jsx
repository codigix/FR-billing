import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import dayjs from "dayjs";
import { EnhancedKPICards } from "../components/dashboard/EnhancedKPICards";
import { RevenueTrendsChart } from "../components/dashboard/RevenueTrendsChart";
import { PaymentAnalyticsChart } from "../components/dashboard/PaymentAnalyticsChart";
import { AnalyticsSummary } from "../components/dashboard/AnalyticsSummary";

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-600">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  const stats = data?.data || {};

  return (
    <div className="space-y-6">
      {/* Header with subscription info */}
      <div className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100">
              {stats.subscription?.status === "active"
                ? `✓ Active Subscription`
                : "⚠ Subscription Inactive"}
            </p>
            {stats.subscription?.expiryDate && (
              <p className="text-sm text-emerald-100">
                Expires:{" "}
                {dayjs(stats.subscription.expiryDate).format("DD/MM/YYYY")}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              {stats.subscription?.daysRemaining || 0}
            </p>
            <p className="text-emerald-100">Days Remaining</p>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-700">
          Key Performance Indicators
        </h2>
        <EnhancedKPICards stats={stats} />
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        <RevenueTrendsChart />
        <PaymentAnalyticsChart />
      </section>

      {/* Analytics Summary */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-700">
          Detailed Analysis
        </h2>
        <AnalyticsSummary stats={stats} />
      </section>

      {/* Recent Activity */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-emerald-700 mb-4">
            Recent Bookings
          </h3>
          {stats.recentBookings && stats.recentBookings.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {stats.recentBookings.map((booking) => (
                <div
                  key={booking.booking_number}
                  className="rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">
                      {booking.consignment_number || booking.booking_number}
                    </span>
                    <span className="text-xs text-slate-500">
                      {dayjs(booking.booking_date).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      {booking.customer_id || booking.receiver}
                    </span>
                    <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 capitalize">
                      {booking.status?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="mt-1 text-right text-sm font-semibold text-emerald-600">
                    ₹{parseFloat(booking.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50">
              <p className="text-sm text-slate-400">No recent bookings</p>
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-emerald-700 mb-4">
            Important Information
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-amber-50 p-3 border border-amber-200">
              <p className="text-sm font-medium text-amber-800">
                ⚠ Pending Invoices
              </p>
              <p className="text-lg font-bold text-amber-700 mt-1">
                {stats.highlights?.dueDaysInvoice || 0}
              </p>
              <p className="text-xs text-amber-600">
                Require immediate attention
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
              <p className="text-sm font-medium text-blue-800">
                📦 Open Consignments
              </p>
              <p className="text-lg font-bold text-blue-700 mt-1">
                {stats.highlights?.openConsignment || 0}
              </p>
              <p className="text-xs text-blue-600">Pending delivery</p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold">Note:</span> Consignment counts
                shown in reports may differ from invoice records. Please verify
                before finalizing payments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
