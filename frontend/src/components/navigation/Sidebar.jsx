import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  PackageSearch,
  NotebookText,
  CalendarCheck,
  FileText,
  CreditCard,
  MapPin,
  BarChart3,
  ClipboardList,
  Wallet,
  Trash2,
  Settings,
  Key,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const menuStructure = [
  {
    type: "item",
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    type: "item",
    to: "/franchises",
    label: "Franchisee",
    icon: Building2,
  },
  {
    type: "group",
    label: "Stationary",
    icon: NotebookText,
    items: [
      { to: "/stationary/add", label: "Add" },
      { to: "/stationary/remaining", label: "Remaining" },
      { to: "/stationary/bulk-barcode", label: "Bulk Barcode Print" },
    ],
  },
  {
    type: "group",
    label: "RateMaster",
    icon: ClipboardList,
    items: [
      { to: "/ratemaster/add-company", label: "Add Company" },
      { to: "/ratemaster/edit-company", label: "Edit Company RateMaster" },
      { to: "/ratemaster/import-excel", label: "Import From Excel" },
    ],
  },
  {
    type: "group",
    label: "Booking",
    icon: CalendarCheck,
    items: [
      { to: "/booking/add", label: "Add" },
      { to: "/booking/modify", label: "Modify" },
      { to: "/booking/update-rate", label: "Update Rate" },
      { to: "/booking/check-list", label: "Check Booking List" },
      { to: "/booking/no-booking-data", label: "No Booking Data" },
      { to: "/booking/multiple", label: "Multiple Booking" },
      { to: "/booking/import-cashcounter", label: "Import From CashCounter" },
      { to: "/booking/import-limitless", label: "Import From Limitless" },
      { to: "/booking/import-excel", label: "Import From Excel" },
    ],
  },
  {
    type: "group",
    label: "Invoice",
    icon: FileText,
    items: [
      { to: "/invoices/generate", label: "Generate Invoice" },
      { to: "/invoices/multiple", label: "Multiple Invoice" },
      { to: "/invoices/view", label: "View Invoice" },
      { to: "/invoices/generate-single", label: "Generate Single Invoice" },
      { to: "/invoices/view-single", label: "View Single Invoice" },
      {
        to: "/invoices/generate-without-gst",
        label: "Generate Invoice Without GST",
      },
      { to: "/invoices/view-without-gst", label: "View Invoice Without GST" },
    ],
  },
  {
    type: "group",
    label: "Payment",
    icon: CreditCard,
    items: [
      { to: "/payments/gst", label: "Add Payment (GST)" },
      { to: "/payments/non-gst", label: "Add Payment (Non-GST)" },
      { to: "/payments/track", label: "Payment Details" },
      { to: "/payments/credit", label: "Customer Credit" },
    ],
  },
  {
    type: "item",
    to: "/tracking",
    label: "Tracking Page",
    icon: MapPin,
  },
  {
    type: "group",
    label: "Billing Reports",
    icon: BarChart3,
    items: [
      { to: "/reports/creditors", label: "Creditor's Report" },
      {
        to: "/reports/sale-before-invoice",
        label: "SalesReport Before Invoice",
      },
      { to: "/reports/tax", label: "Tax Report" },
      { to: "/reports/billed-unbilled", label: "Billed Unbilled Report" },
      { to: "/reports/business-analysis", label: "Business Analysis" },
      { to: "/reports/customer-sales", label: "Customer Sales Comparison" },
    ],
  },
  {
    type: "heading",
    label: "CashCounter Menu",
  },
  {
    type: "group",
    label: "Booking",
    icon: PackageSearch,
    items: [
      { to: "/cashcounter/print-receipt", label: "Print" },
      { to: "/cashcounter/print-bulk", label: "Print Bulk Receipt" },
      {
        to: "/cashcounter/delete-consignment",
        label: "Delete Cash Consignment",
      },
    ],
  },
  {
    type: "group",
    label: "Daily Expenses",
    icon: Wallet,
    items: [
      { to: "/daily-expenses/add", label: "Add Expenses" },
      { to: "/daily-expenses/add-payment", label: "Add Payments" },
    ],
  },
  {
    type: "group",
    label: "Cashcounter Reports",
    icon: BarChart3,
    items: [
      { to: "/cashcounter-reports/sale-report", label: "Sale Report" },
      { to: "/cashcounter-reports/daily-report", label: "Daily Report" },
      {
        to: "/cashcounter-reports/creditors-report",
        label: "Cash Creditors Report",
      },
    ],
  },
  {
    type: "group",
    label: "Recycle Bin",
    icon: Trash2,
    items: [
      { to: "/booking/recycle", label: "Recycle Bin Consignment" },
      { to: "/invoices/recycle", label: "Recycle Bin Invoice" },
    ],
  },
  {
    type: "item",
    to: "/settings",
    label: "Settings",
    icon: Settings,
  },
  {
    type: "item",
    to: "/change-password",
    label: "Change Password",
    icon: Key,
  },
];

export function Sidebar() {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState({
    Stationary: location.pathname.startsWith("/stationary"),
    RateMaster: location.pathname.startsWith("/ratemaster"),
    Booking:
      (location.pathname.startsWith("/booking") &&
        !location.pathname.startsWith("/booking/recycle")) ||
      location.pathname.startsWith("/cashcounter"),
    Invoice:
      location.pathname.startsWith("/invoices") &&
      !location.pathname.startsWith("/invoices/recycle"),
    Payment: location.pathname.startsWith("/payments"),
    "Billing Reports": location.pathname.startsWith("/reports"),
    "Daily Expenses": location.pathname.startsWith("/daily-expenses"),
    "Cashcounter Reports": location.pathname.startsWith("/cashcounter-reports"),
    "Recycle Bin":
      location.pathname.startsWith("/booking/recycle") ||
      location.pathname.startsWith("/invoices/recycle"),
  });

  // Update sidebar expansion when route changes
  useEffect(() => {
    setExpandedGroups((prev) => ({
      ...prev,
      Booking:
        (location.pathname.startsWith("/booking") &&
          !location.pathname.startsWith("/booking/recycle")) ||
        location.pathname.startsWith("/cashcounter"),
      Invoice:
        location.pathname.startsWith("/invoices") &&
        !location.pathname.startsWith("/invoices/recycle"),
      "Recycle Bin":
        location.pathname.startsWith("/booking/recycle") ||
        location.pathname.startsWith("/invoices/recycle"),
    }));
  }, [location.pathname]);

  const toggleGroup = (label) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="hidden w-64 flex-col border-r border-emerald-100 bg-white md:flex">
      <div className="flex h-20 flex-col justify-center bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 text-white">
        <span className="text-lg font-semibold tracking-tight">FR-Billing</span>
        <span className="text-xs text-emerald-100">Go Easy...</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuStructure.map((entry, index) => {
          if (entry.type === "heading") {
            return (
              <div
                key={`heading-${index}`}
                className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-emerald-600"
              >
                {entry.label}
              </div>
            );
          }

          if (entry.type === "group") {
            const Icon = entry.icon;
            const isExpanded = expandedGroups[entry.label];
            const isAnyChildActive = entry.items.some((item) =>
              location.pathname.startsWith(item.to)
            );

            return (
              <div key={`group-${index}`}>
                <button
                  onClick={() => toggleGroup(entry.label)}
                  className={`group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-emerald-50 hover:text-emerald-700 ${
                    isAnyChildActive
                      ? "bg-emerald-100 text-emerald-700 shadow-sm"
                      : "text-slate-600"
                  }`}
                >
                  <span
                    className={`absolute inset-y-0 left-0 w-1 rounded-r bg-emerald-500 transition-all ${
                      isAnyChildActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{entry.label}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {isExpanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    {entry.items.map((subItem) => (
                      <NavLink
                        key={subItem.to}
                        to={subItem.to}
                        className={({ isActive }) =>
                          `block rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700 ${
                            isActive
                              ? "text-emerald-700 font-medium"
                              : "text-slate-600"
                          }`
                        }
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const Icon = entry.icon;
          return (
            <NavLink
              key={`item-${index}`}
              to={entry.to}
              end={entry.to === "/" || entry.to.includes("/cashcounter/")}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-emerald-50 hover:text-emerald-700 ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700 shadow-sm"
                    : "text-slate-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute inset-y-0 left-0 w-1 rounded-r bg-emerald-500 transition-all ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Icon className="h-4 w-4" />
                  <span>{entry.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
