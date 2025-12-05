import clsx from "clsx";

// app/docs/components/Section.tsx
export default function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={clsx('mb-16', 'scroll-mt-24')}>
      <h2 className={clsx('text-2xl', 'font-bold', 'mb-2', 'drop-shadow-[0_0_12px_rgba(34,211,238,0.25)]')}>
        {title}
      </h2>
      <div className={clsx('h-[2px]', 'w-20', 'bg-cyan-400/40', 'mb-6')} />
      <div>{children}</div>
    </section>
  );
}
