const summaryData = [
  {
    label: "Total Revenue",
    value: "$128,450",
    change: "+12.4% vs last month",
    accent: "bg-primary",
  },
  {
    label: "Outstanding Invoices",
    value: "$18,320",
    change: "24 invoices pending",
    accent: "bg-warning",
  },
  {
    label: "Active Customers",
    value: "312",
    change: "+5 new this week",
    accent: "bg-success",
  },
  {
    label: "Payments Collected",
    value: "$104,920",
    change: "86 payments processed",
    accent: "bg-accent",
  },
];

export function SummaryCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryData.map((item) => (
        <div key={item.label} className="rounded-2xl bg-white p-5 shadow-sm">
          <div
            className={`mb-4 h-10 w-10 rounded-full ${item.accent} bg-opacity-10`}
          ></div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {item.label}
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-800">
            {item.value}
          </div>
          <div className="mt-1 text-xs text-slate-400">{item.change}</div>
        </div>
      ))}
    </div>
  );
}
