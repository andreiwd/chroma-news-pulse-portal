
import { Outlet } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <AdminHeader />
      <div className="flex flex-1 container py-6 gap-6">
        <div className="w-64 hidden md:block">
          <AdminSidebar />
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
