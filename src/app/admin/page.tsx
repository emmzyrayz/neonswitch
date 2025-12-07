// app/admin/page.tsx
import StatsCard from "./components/statscard";
import DataTable from "./components/datatable";
import clsx from "clsx";

export default function AdminDashboard() {
  const users = [
    { Name: "John Doe", Email: "john@example.com", Status: "Active" },
    { Name: "Mary Ann", Email: "mary@example.com", Status: "Pending" },
  ];

  const vtuLogs = [
    { User: "John Doe", Amount: "₦500", Network: "MTN", Status: "Success" },
    { User: "Mary Ann", Amount: "₦200", Network: "Airtel", Status: "Failed" },
  ];

  return (
    <div>
      {/* Analytics Cards */}
      <h1
        className={clsx(
          "text-2xl",
          "md:text-3xl",
          "font-bold",
          "mb-6",
          "md:mb-8",
          "drop-shadow-[0_0_12px_#F9FAFB]"
        )}
      >
        Admin Overview
      </h1>

      <div
        className={clsx(
          "grid",
          "grid-cols-1",
          "sm:grid-cols-2",
          "lg:grid-cols-4",
          "gap-4",
          "md:gap-6",
          "mb-8",
          "md:mb-12"
        )}
      >
        <StatsCard title="Total Users" value="1,204" subtitle="+23 today" />
        <StatsCard
          title="VTU Transactions"
          value="3,480"
          subtitle="Last 30 days"
        />
        <StatsCard title="Virtual Numbers Issued" value="812" />
        <StatsCard title="API Requests" value="94,231" subtitle="This month" />
      </div>

      {/* Users */}
      <section id="users" className={clsx("mb-12", "md:mb-16")}>
        <h2
          className={clsx(
            "text-lg",
            "md:text-xl",
            "font-semibold",
            "mb-4",
            "text-soft"
          )}
        >
          Users
        </h2>
        <DataTable columns={["Name", "Email", "Status"]} data={users} />
      </section>

      {/* VTU Logs */}
      <section id="vtu" className={clsx("mb-12", "md:mb-16")}>
        <h2
          className={clsx(
            "text-lg",
            "md:text-xl",
            "font-semibold",
            "mb-4",
            "text-soft"
          )}
        >
          VTU Logs
        </h2>
        <DataTable
          columns={["User", "Amount", "Network", "Status"]}
          data={vtuLogs}
        />
      </section>
    </div>
  );
}
