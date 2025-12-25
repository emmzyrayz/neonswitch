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
    <main
      className={clsx(
        "min-h-screen",
        'min-w-screen',
        "bg-[#050507]",
        "text-white",
        "flex flex-row items-center justify-between",
        "relative"
      )}
    >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div
        className={clsx(
          "flex-1",
          "p-4",
          "md:p-6",
          "lg:p-10",
          "overflow-y-auto",
          "pt-20", // Extra top padding on mobile for menu button
          "md:pt-[80px]"
        )}
      >
        {children}
      </div>
    </main>
  );
}
