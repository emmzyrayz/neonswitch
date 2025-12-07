import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import DashboardCard from "./components/dashboardcard";
import Footer from "./components/footer";
import clsx from "clsx";

export default function Dashboard() {
  return (
    <div className={clsx('flex', 'min-h-screen', 'bg-[#0a0a0a]')}>
      <Sidebar />
      <div className={clsx('flex-1', 'flex', 'flex-col')}>
        <Navbar />
        <main className={clsx('p-8', 'flex-1', 'overflow-y-auto')}>
          <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
            <DashboardCard
              title="Virtual Number"
              description="Generate virtual numbers for testing or business use"
            >
              <button className={clsx('px-4', 'py-2', 'mt-2', 'bg-muted', 'rounded-md', 'shadow-muted/20', 'hover:shadow-muted/30', 'transition-all')}>
                Go
              </button>
            </DashboardCard>

            <DashboardCard
              title="VTU Services"
              description="Recharge airtime or data for yourself or others"
            >
              <button className={clsx('px-4', 'py-2', 'mt-2', 'bg-muted', 'rounded-md', 'shadow-muted', 'hover:shadow-muted', 'transition-all')}>
                Go
              </button>
            </DashboardCard>

            <DashboardCard title="Pricing" description="View service pricing">
              <button className={clsx('px-4', 'py-2', 'mt-2', 'bg-muted', 'rounded-md', 'shadow-muted', 'hover:shadow-muted', 'transition-all')}>
                View
              </button>
            </DashboardCard>

            <DashboardCard
              title="API Docs"
              description="Access the platform API documentation"
            >
              <button className={clsx('px-4', 'py-2', 'mt-2', 'bg-muted', 'rounded-md', 'shadow-muted', 'hover:shadow-muted', 'transition-all')}>
                Open
              </button>
            </DashboardCard>

            <DashboardCard
              title="Admin Panel"
              description="Manage users, services, and settings"
            >
              <button className={clsx('px-4', 'py-2', 'mt-2', 'bg-muted', 'rounded-md', 'shadow-muted', 'hover:shadow-muted', 'transition-all')}>
                Enter
              </button>
            </DashboardCard>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
