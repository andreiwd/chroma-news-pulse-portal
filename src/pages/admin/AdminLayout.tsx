
import { Outlet } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebarWithLayout from "@/components/admin/AdminSidebarWithLayout";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <AdminHeader />
      <div className="flex flex-1 container py-6 gap-6">
        <aside className="w-64 hidden md:block">
          <AdminSidebarWithLayout />
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
