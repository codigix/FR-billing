import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/navigation/Sidebar.jsx";
import { TopBar } from "../components/navigation/TopBar.jsx";

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
