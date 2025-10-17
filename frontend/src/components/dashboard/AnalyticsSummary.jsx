import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export function AnalyticsSummary({ stats }) {
  // Consignment status data
  const consignmentData = (stats?.consignmentOverview || []).map((item) => ({
    name: item.status?.replace("_", " ").toUpperCase() || "Unknown",
    value: item.count,
    amount: parseFloat(item.total_amount),
  }));

  // Payment status data
  const paymentData = (stats?.paymentStatus || []).map((item) => ({
    name: item.payment_status?.replace("_", " ").toUpperCase() || "Unknown",
    value: item.count,
    amount: parseFloat(item.total_amount),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Consignment Status */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4">
          Consignment Status Distribution
        </h3>

        {consignmentData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={consignmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {consignmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    if (name === "value") {
                      return [`${value} consignments`, "Count"];
                    }
                    return [value, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {consignmentData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-700">
                      {item.value}
                    </div>
                    <div className="text-xs text-slate-500">
                      ₹{item.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-lg bg-slate-50">
            <div className="text-center text-slate-500">
              <p className="text-sm">No consignment data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Status */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4">
          Invoice Payment Status
        </h3>

        {paymentData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    if (name === "value") {
                      return [`${value} invoices`, "Count"];
                    }
                    return [value, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {paymentData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-700">
                      {item.value}
                    </div>
                    <div className="text-xs text-slate-500">
                      ₹{item.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-lg bg-slate-50">
            <div className="text-center text-slate-500">
              <p className="text-sm">No payment data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
