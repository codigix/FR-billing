import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import ChatbotAssistant from "../components/ChatbotAssistant.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { DashboardPage } from "./DashboardPage.jsx";
import FranchiseListPage from "./FranchiseListPage.jsx";
import FranchiseFormPage from "./FranchiseFormPage.jsx";
import BookingFormPage from "./BookingFormPage.jsx";
import InvoiceGeneratePage from "./InvoiceGeneratePage.jsx";
import GenerateInvoicePage from "./GenerateInvoicePage.jsx";
import MultipleInvoicePage from "./MultipleInvoicePage.jsx";
import ViewInvoicePage from "./ViewInvoicePage.jsx";
import GenerateSingleInvoicePage from "./GenerateSingleInvoicePage.jsx";
import ViewSingleInvoicePage from "./ViewSingleInvoicePage.jsx";
import GenerateInvoiceWithoutGSTPage from "./GenerateInvoiceWithoutGSTPage.jsx";
import ViewInvoiceWithoutGSTPage from "./ViewInvoiceWithoutGSTPage.jsx";
import StationaryAddPage from "./StationaryAddPage.jsx";
import StationaryRemainingPage from "./StationaryRemainingPage.jsx";
import StationaryBulkBarcodePage from "./StationaryBulkBarcodePage.jsx";
import AddCompanyPage from "./AddCompanyPage.jsx";
import EditCompanyPage from "./EditCompanyPage.jsx";
import ImportCompanyExcelPage from "./ImportCompanyExcelPage.jsx";
import BookConsignmentPage from "./BookConsignmentPage.jsx";
import EditConsignmentPage from "./EditConsignmentPage.jsx";
import UpdateRatePage from "./UpdateRatePage.jsx";
import CheckBookingListPage from "./CheckBookingListPage.jsx";
import NoBookingListPage from "./NoBookingListPage.jsx";
import MultipleBookingPage from "./MultipleBookingPage.jsx";
import ImportFromCashCounterPage from "./ImportFromCashCounterPage.jsx";
import ImportLimitlessPage from "./ImportLimitlessPage.jsx";
import ImportFromExcelBookingPage from "./ImportFromExcelBookingPage.jsx";
import AddPaymentGSTPage from "./AddPaymentGSTPage.jsx";
import AddPaymentNonGSTPage from "./AddPaymentNonGSTPage.jsx";
import PaymentTrackPage from "./PaymentTrackPage.jsx";
import CustomerCreditPage from "./CustomerCreditPage.jsx";
import CreditorsReportPage from "./CreditorsReportPage.jsx";
import SaleReportBeforeInvoicePage from "./SaleReportBeforeInvoicePage.jsx";
import TaxReportPage from "./TaxReportPage.jsx";
import BilledUnbilledListPage from "./BilledUnbilledListPage.jsx";
import BusinessAnalysisPage from "./BusinessAnalysisPage.jsx";
import CustomerSalesComparisonPage from "./CustomerSalesComparisonPage.jsx";
import PrintReceiptPage from "./PrintReceiptPage.jsx";
import PrintBulkCashReceiptPage from "./PrintBulkCashReceiptPage.jsx";
import DeleteCashConsignmentPage from "./DeleteCashConsignmentPage.jsx";
import AddExpensesPage from "./AddExpensesPage.jsx";
import AddPaymentsPage from "./AddPaymentsPage.jsx";
import SalesReportPage from "./SalesReportPage.jsx";
import DailyReportPage from "./DailyReportPage.jsx";
import CashCreditorsReportPage from "./CashCreditorsReportPage.jsx";
import RecycleConsignmentPage from "./RecycleConsignmentPage.jsx";
import RecycleInvoicePage from "./RecycleInvoicePage.jsx";
import SettingsPage from "./SettingsPage.jsx";
import ChangePasswordPage from "./ChangePasswordPage.jsx";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading...</p>
          </div>
        </div>
      }
    >
      {isAuthenticated && <ChatbotAssistant />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />

          {/* Franchise Routes */}
          <Route path="franchises" element={<FranchiseListPage />} />
          <Route path="franchises/create" element={<FranchiseFormPage />} />
          <Route path="franchises/edit/:id" element={<FranchiseFormPage />} />

          {/* Stationary Routes */}
          <Route path="stationary/add" element={<StationaryAddPage />} />
          <Route
            path="stationary/remaining"
            element={<StationaryRemainingPage />}
          />
          <Route
            path="stationary/bulk-barcode"
            element={<StationaryBulkBarcodePage />}
          />

          {/* Rate Master Company Routes */}
          <Route path="ratemaster/add-company" element={<AddCompanyPage />} />
          <Route path="ratemaster/edit-company" element={<EditCompanyPage />} />
          <Route
            path="ratemaster/import-excel"
            element={<ImportCompanyExcelPage />}
          />

          {/* Booking Routes */}
          <Route path="bookings/create" element={<BookingFormPage />} />
          <Route path="booking/add" element={<BookConsignmentPage />} />
          <Route path="booking/modify" element={<EditConsignmentPage />} />
          <Route path="booking/update-rate" element={<UpdateRatePage />} />
          <Route path="booking/check-list" element={<CheckBookingListPage />} />
          <Route
            path="booking/no-booking-data"
            element={<NoBookingListPage />}
          />
          <Route path="booking/multiple" element={<MultipleBookingPage />} />
          <Route
            path="booking/import-cashcounter"
            element={<ImportFromCashCounterPage />}
          />
          <Route
            path="booking/import-limitless"
            element={<ImportLimitlessPage />}
          />
          <Route
            path="booking/import-excel"
            element={<ImportFromExcelBookingPage />}
          />
          <Route path="booking/recycle" element={<RecycleConsignmentPage />} />

          {/* Invoice Routes */}
          <Route path="invoices/generate" element={<GenerateInvoicePage />} />
          <Route path="invoices/multiple" element={<MultipleInvoicePage />} />
          <Route path="invoices/view" element={<ViewInvoicePage />} />
          <Route
            path="invoices/generate-single"
            element={<GenerateSingleInvoicePage />}
          />
          <Route
            path="invoices/view-single"
            element={<ViewSingleInvoicePage />}
          />
          <Route
            path="invoices/generate-without-gst"
            element={<GenerateInvoiceWithoutGSTPage />}
          />
          <Route
            path="invoices/view-without-gst"
            element={<ViewInvoiceWithoutGSTPage />}
          />
          <Route path="invoices/recycle" element={<RecycleInvoicePage />} />

          {/* Payment Routes */}
          <Route path="payments/gst" element={<AddPaymentGSTPage />} />
          <Route path="payments/non-gst" element={<AddPaymentNonGSTPage />} />
          <Route path="payments/track" element={<PaymentTrackPage />} />
          <Route path="payments/credit" element={<CustomerCreditPage />} />

          {/* Billing Reports Routes */}
          <Route path="reports/creditors" element={<CreditorsReportPage />} />
          <Route
            path="reports/sale-before-invoice"
            element={<SaleReportBeforeInvoicePage />}
          />
          <Route path="reports/tax" element={<TaxReportPage />} />
          <Route
            path="reports/billed-unbilled"
            element={<BilledUnbilledListPage />}
          />
          <Route
            path="reports/business-analysis"
            element={<BusinessAnalysisPage />}
          />
          <Route
            path="reports/customer-sales"
            element={<CustomerSalesComparisonPage />}
          />

          {/* CashCounter Routes */}
          <Route
            path="cashcounter/print-receipt"
            element={<PrintReceiptPage />}
          />
          <Route
            path="cashcounter/print-bulk"
            element={<PrintBulkCashReceiptPage />}
          />
          <Route
            path="cashcounter/delete-consignment"
            element={<DeleteCashConsignmentPage />}
          />

          {/* Daily Expenses Routes */}
          <Route path="daily-expenses/add" element={<AddExpensesPage />} />
          <Route
            path="daily-expenses/add-payment"
            element={<AddPaymentsPage />}
          />

          {/* Cashcounter Reports Routes */}
          <Route
            path="cashcounter-reports/sale-report"
            element={<SalesReportPage />}
          />
          <Route
            path="cashcounter-reports/daily-report"
            element={<DailyReportPage />}
          />
          <Route
            path="cashcounter-reports/creditors-report"
            element={<CashCreditorsReportPage />}
          />

          {/* Settings Route */}
          <Route path="settings" element={<SettingsPage />} />

          {/* Change Password Route */}
          <Route path="change-password" element={<ChangePasswordPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
