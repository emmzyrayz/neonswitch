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
        </main>
        <Footer />
      </div>
    </div>
  );
}