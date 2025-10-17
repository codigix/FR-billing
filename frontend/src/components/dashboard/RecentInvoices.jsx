const invoices = [
  {
    id: "INV-2024-098",
    customer: "Acme Inc.",
    amount: "$2,480.00",
    status: "Overdue",
    dueDate: "Apr 12, 2024",
  },
  {
    id: "INV-2024-099",
    customer: "Globex Corp",
    amount: "$1,250.00",
    status: "Pending",
    dueDate: "Apr 18, 2024",
  },
  {
    id: "INV-2024-100",
    customer: "Stellar LLC",
    amount: "$3,600.00",
    status: "Paid",
    dueDate: "Apr 02, 2024",
  },
];

const statusColors = {
  Paid: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Overdue: "bg-danger/10 text-danger",
};

export function RecentInvoices() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Invoices
        </h2>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </button>
      </div>
      <div className="mt-5 space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
          >
            <div>
              <div className="text-sm font-semibold text-slate-800">
                {invoice.id}
              </div>
              <div className="text-xs text-slate-400">{invoice.customer}</div>
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {invoice.amount}
            </div>
            <div className="text-xs text-slate-400">Due {invoice.dueDate}</div>
            <div
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusColors[invoice.status]
              }`}
            >
              {invoice.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
