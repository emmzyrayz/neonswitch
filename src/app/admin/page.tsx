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
      <h1 className={clsx('text-3xl', 'font-bold', 'mb-8', 'drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]')}>
        Admin Overview
      </h1>

      <div className={clsx('grid', 'md:grid-cols-4', 'gap-6', 'mb-12')}>
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
      <section id="users" className="mb-16">
        <h2 className={clsx('text-xl', 'font-semibold', 'mb-4', 'text-cyan-300')}>Users</h2>
        <DataTable columns={["Name", "Email", "Status"]} data={users} />
      </section>

      {/* VTU Logs */}
      <section id="vtu" className="mb-16">
        <h2 className={clsx('text-xl', 'font-semibold', 'mb-4', 'text-cyan-300')}>VTU Logs</h2>
        <DataTable
          columns={["User", "Amount", "Network", "Status"]}
          data={vtuLogs}
        />
      </section>
    </div>
  );
}
