import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { dashboardService } from "../../services/dashboardService";

export function RevenueTrendsChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["revenue-trends"],
    queryFn: () => dashboardService.getRevenueTrends(30),
  });

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg bg-slate-50">
        <div className="text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-slate-600">Loading trends...</p>
        </div>
      </div>
    );
  }

  const chartData = (data?.data || []).map((item) => ({
    date: dayjs(item.date).format("MMM DD"),
    revenue: parseFloat(item.revenue),
    bookings: item.bookings,
  }));

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-emerald-700">
          Revenue Trends (Last 30 Days)
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Daily booking revenue and volume
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
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
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#059669"
            strokeWidth={2}
            dot={{ fill: "#059669", r: 4 }}
            activeDot={{ r: 6 }}
            name="Revenue (₹)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
