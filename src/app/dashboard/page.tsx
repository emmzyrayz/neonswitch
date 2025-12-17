// import Sidebar from "./components/sidebar"; egwha
import Navbar from "./components/navbar";
// import DashboardCard from "./components/dashboardcard";
import Footer from "./components/footer";
import clsx from "clsx";
import { UserContent } from "./components/contentboard";

export default function Dashboard() {
  return (
    <div className={clsx("flex", "min-h-screen", "min-w-screen", "bg-[#0a0a0a]")}>
      <div className={clsx("flex-1", "flex", "flex-col")}>
        <Navbar />
        <main className={clsx("p-8", "flex-1", "overflow-y-auto")}>
        <UserContent />
          {/* <div
            className={clsx(
              "grid",
              "grid-cols-1",
              "md:grid-cols-2",
              "lg:grid-cols-3",
              "gap-6"
            )}
          >
            <DashboardCard
              title="Virtual Number"
              description="Generate virtual numbers for testing or business use"
            >
              <button
                className={clsx(
                  "px-4",
                  "py-2",
                  "mt-2",
                  "bg-muted/30",
                  "rounded-md",
                  "shadow-muted/20",
                  "hover:shadow-muted/30",
                  "hover:test-muted/30",
                  "transition-all",
                  "hover:shadow-lg",
                  "hover:bg-muted",
                  "transition-all",
                  "duration-500",
                  "ease-in-out"
                )}
              >
                Go
              </button>
            </DashboardCard>

            <DashboardCard
              title="VTU Services"
              description="Recharge airtime or data for yourself or others"
            >
              <button
                className={clsx(
                  "px-4",
                  "py-2",
                  "mt-2",
                  "bg-muted/30",
                  "rounded-md",
                  "shadow-muted",
                  "hover:shadow-muted",
                  "transition-all",
                  "hover:shadow-lg",
                  "hover:bg-muted",
                  "transition-all",
                  "duration-500",
                  "ease-in-out"
                )}
              >
                Go
              </button>
            </DashboardCard>

            <DashboardCard title="Pricing" description="View service pricing">
              <button
                className={clsx(
                  "px-4",
                  "py-2",
                  "mt-2",
                  "bg-muted/30",
                  "rounded-md",
                  "shadow-muted",
                  "hover:shadow-muted",
                  "transition-all",
                  "hover:shadow-lg",
                  "hover:bg-muted",
                  "transition-all",
                  "duration-500",
                  "ease-in-out"
                )}
              >
                View
              </button>
            </DashboardCard>

            <DashboardCard
              title="API Docs"
              description="Access the platform API documentation"
            >
              <button
                className={clsx(
                  "px-4",
                  "py-2",
                  "mt-2",
                  "bg-muted/30",
                  "rounded-md",
                  "shadow-muted",
                  "hover:shadow-muted",
                  "transition-all",
                  "hover:shadow-lg",
                  "hover:bg-muted",
                  "transition-all",
                  "duration-500",
                  "ease-in-out"
                )}
              >
                Open
              </button>
            </DashboardCard>

            <DashboardCard
              title="Admin Panel"
              description="Manage users, services, and settings"
            >
              <button
                className={clsx(
                  "px-4",
                  "py-2",
                  "mt-2",
                  "bg-muted/30",
                  "rounded-md",
                  "shadow-muted",
                  "hover:shadow-muted",
                  "transition-all",
                  "hover:shadow-lg",
                  "hover:bg-muted",
                  "transition-all",
                  "duration-500",
                  "ease-in-out"
                )}
              >
                Enter
              </button>
            </DashboardCard>
          </div> */}
        </main>
        <Footer />
      </div>
    </div>
  );
}
