// app/admin/layout.tsx
import clsx from "clsx";
import "../globals.css";
import AdminSidebar from "./components/adminsidebar";

export const metadata = {
  title: "Admin Dashboard • NeonSwitch",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={clsx('min-h-screen', 'bg-[#050507]', 'text-white', 'flex')}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className={clsx('flex-1', 'p-10', 'overflow-y-auto')}>{children}</div>
    </main>
  );
}
