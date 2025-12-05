// app/docs/layout.tsx
import DocsSidebar from "./components/docsidebar";
import "../globals.css";
import clsx from "clsx";

export const metadata = {
  title: "API Documentation • NeonSwitch",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={clsx('min-h-screen', 'bg-[#050507]', 'text-white')}>
      <div className={clsx('mx-auto', 'flex', 'max-w-7xl', 'px-6')}>
        {/* Sidebar */}
        <aside className={clsx('hidden', 'md:block', 'w-64', 'sticky', 'top-0', 'h-screen', 'py-20', 'border-r', 'border-white/5')}>
          <DocsSidebar />
        </aside>

        {/* Main Content */}
        <div className={clsx('flex-1', 'py-20', 'md:pl-12')}>{children}</div>
      </div>
    </main>
  );
}
