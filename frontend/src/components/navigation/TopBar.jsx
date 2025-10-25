import { ChevronDown, Menu, MessageCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export function TopBar({ onOpenChat }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const daysRemaining = user?.subscription_end_date
    ? dayjs(user.subscription_end_date).diff(dayjs(), "day")
    : 0;

  return (
    <header className="sticky top-0 z-10 flex h-auto flex-none flex-wrap items-center gap-3 bg-white px-4 py-3 shadow md:px-6">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-emerald-50 md:hidden"
          >
            <Menu className="h-5 w-5 text-emerald-600" />
          </button>
          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 md:flex">
            <button
              type="button"
              onClick={() => navigate("/booking/add")}
              className="rounded-md border border-transparent px-3 py-2 hover:bg-emerald-50 transition"
            >
              Booking
            </button>
            <button
              type="button"
              onClick={() => navigate("/invoices/generate")}
              className="rounded-md border border-transparent px-3 py-2 hover:bg-emerald-50 transition"
            >
              Generate Invoice
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="hidden md:inline">
            Support WhatsApp No:
            <a
              className="ml-1 font-semibold text-emerald-600"
              href="tel:8830991572"
            >
              8830991572
            </a>
          </span>
          <span className="hidden md:inline">|</span>
          <span>
            Franchise:{" "}
            <span className="font-semibold text-emerald-600">
              {user?.franchise_code || "N/A"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
            title="Open AI Assistant"
          >
            <MessageCircle size={16} />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>
          <span className="text-sm font-medium text-slate-600">
            {user?.full_name || user?.username}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="flex w-full items-center justify-between rounded-md bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {user?.franchise_name || "Franchisee Dashboard"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-600">
          <span>Left {daysRemaining} Days</span>
          <span className="hidden md:inline">|</span>
          <span>
            Expires On{" "}
            <strong className="font-semibold">
              {user?.subscription_end_date
                ? dayjs(user.subscription_end_date).format("DD/MM/YYYY")
                : "N/A"}
            </strong>
          </span>
        </div>
      </div>
    </header>
  );
}
