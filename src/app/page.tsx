// import Image from "next/image";

// import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
// import Navbar from "@/components/navbar";
import ServiceCards from "@/components/servicecard";
// import VirtualNumber from "@/components/virtualnumber";
// import VTU from "@/components/vtu";
import clsx from "clsx";

export default function Home() {
  return (
    <div
      className={clsx(
        "flex",
        "flex-col",
        "w-full",
        "h-full",
        "items-center",
        "justify-center"
      )}
    >
      <Hero />
      <ServiceCards />
    </div>
  );
}
