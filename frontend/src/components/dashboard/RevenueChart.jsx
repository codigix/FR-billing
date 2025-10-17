export function RevenueChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Revenue Trend</h2>
        <select className="rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-600 focus:border-primary focus:outline-none">
          <option>Last 12 months</option>
          <option>Last 6 months</option>
          <option>Last 30 days</option>
        </select>
      </div>
      <div className="mt-6 h-72">
        <div className="flex h-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          {/* Placeholder for chart implementation (e.g., Recharts, Chart.js) */}
          Chart visualization coming soon
        </div>
      </div>
    </div>
  );
}
