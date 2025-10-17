import {
  TrendingUp,
  Package,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export function EnhancedKPICards({ stats }) {
  const kpiData = [
    {
      title: "Today's Revenue",
      value: `₹${stats?.cashCollection?.today || 0}`,
      subtitle: `Month: ₹${stats?.cashCollection?.month || 0}`,
      icon: TrendingUp,
      color: "emerald",
      trend: "up",
    },
    {
      title: "Total Revenue (30d)",
      value: `₹${stats?.revenue || 0}`,
      subtitle: `Average Daily: ₹${((stats?.revenue || 0) / 30).toFixed(2)}`,
      icon: CreditCard,
      color: "blue",
      trend: "neutral",
    },
    {
      title: "Today's Bookings",
      value: stats?.bookings?.today || "0",
      subtitle: `Month: ${stats?.bookings?.month || 0}`,
      icon: Package,
      color: "violet",
      trend: "up",
    },
    {
      title: "Open Consignments",
      value: stats?.highlights?.openConsignment || "0",
      subtitle: "Pending Delivery",
      icon: Clock,
      color: "orange",
      trend: "down",
    },
    {
      title: "Due Invoices",
      value: stats?.highlights?.dueDaysInvoice || "0",
      subtitle: "Require Payment",
      icon: AlertCircle,
      color: "red",
      trend: "down",
    },
    {
      title: "Paid Invoices",
      value:
        stats?.paymentStatus?.find((p) => p.payment_status === "paid")?.count ||
        0,
      subtitle: `₹${(
        stats?.paymentStatus?.find((p) => p.payment_status === "paid")
          ?.total_amount || 0
      ).toFixed(2)}`,
      icon: CheckCircle,
      color: "green",
      trend: "up",
    },
  ];

  const colorClasses = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
      icon: "text-emerald-600",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      icon: "text-blue-600",
    },
    violet: {
      bg: "bg-violet-50",
      border: "border-violet-100",
      text: "text-violet-700",
      icon: "text-violet-600",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-700",
      icon: "text-orange-600",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-700",
      icon: "text-red-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      icon: "text-green-600",
    },
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon;
        const colors = colorClasses[kpi.color];

        return (
          <div
            key={kpi.title}
            className={`rounded-lg border ${colors.border} ${colors.bg} p-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                  {kpi.title}
                </p>
                <div className={`mt-2 text-2xl font-bold ${colors.text}`}>
                  {kpi.value}
                </div>
                <p className="mt-1 text-xs text-slate-500">{kpi.subtitle}</p>
              </div>
              <Icon className={`h-8 w-8 ${colors.icon} opacity-70`} />
            </div>
            <div className="mt-3 flex items-center gap-1">
              <div
                className={`h-1 w-1 rounded-full ${
                  kpi.trend === "up"
                    ? "bg-emerald-500"
                    : kpi.trend === "down"
                    ? "bg-red-500"
                    : "bg-slate-400"
                }`}
              ></div>
              <span className="text-xs font-medium text-slate-500">
                {kpi.trend === "up"
                  ? "Increasing"
                  : kpi.trend === "down"
                  ? "Decreasing"
                  : "Stable"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
