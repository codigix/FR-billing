import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { dashboardService } from "../../services/dashboardService";

const COLORS = ["#059669", "#0ea5e9", "#f59e0b", "#ef4444"];

export function PaymentAnalyticsChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["payment-analytics"],
    queryFn: dashboardService.getPaymentAnalytics,
  });

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg bg-slate-50">
        <div className="text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const chartData = (data?.data || []).map((item) => ({
    name:
      item.payment_mode
        ?.replace("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()) || "Unknown",
    value: parseFloat(item.total),
    count: item.count,
  }));

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-emerald-700">
          Payment Mode Analysis
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Last 30 days payment breakdown
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            style={{ fontSize: "12px" }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f1f5f9",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
            formatter={(value) => `₹${value.toFixed(2)}`}
          />
          <Legend />
          <Bar
            dataKey="value"
            fill="#059669"
            name="Total Amount (₹)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {chartData.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {chartData.map((item, index) => (
            <div key={item.name} className="rounded-lg bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-xs font-medium text-slate-600">
                  {item.name}
                </span>
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-700">
                ₹{item.value.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500">
                {item.count} transactions
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
