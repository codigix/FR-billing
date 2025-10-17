const payments = [
  {
    id: "PAY-7845",
    customer: "Acme Inc.",
    amount: "$1,400.00",
    date: "Apr 20, 2024",
  },
  {
    id: "PAY-7846",
    customer: "Globex Corp",
    amount: "$795.00",
    date: "Apr 23, 2024",
  },
  {
    id: "PAY-7847",
    customer: "Stellar LLC",
    amount: "$2,150.00",
    date: "Apr 28, 2024",
  },
];

export function UpcomingPayments() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Upcoming Payments
        </h2>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
        >
          View schedule
        </button>
      </div>
      <div className="mt-5 space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
          >
            <div>
              <div className="text-sm font-semibold text-slate-800">
                {payment.customer}
              </div>
              <div className="text-xs text-slate-400">{payment.id}</div>
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {payment.amount}
            </div>
            <div className="text-xs text-slate-400">{payment.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
