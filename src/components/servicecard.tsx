import clsx from "clsx";

const services = [
  {
    title: "Virtual Numbers",
    desc: "Instant second numbers for verification or business.",
    glow: "shadow-[0_0_30px_rgba(34,211,238,0.4)]",
    color: "border-cyan-400",
  },
  {
    title: "VTU Services",
    desc: "Airtime, data, and electricity tokens delivered fast.",
    glow: "shadow-[0_0_30px_rgba(244,114,182,0.4)]",
    color: "border-fuchsia-400",
  },
  {
    title: "TikTok Coins (Soon)",
    desc: "Auto-delivery TikTok boosting & coin purchases.",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.4)]",
    color: "border-purple-400",
  },
];

export default function ServiceCards() {
  return (
    <section className={clsx('py-20', 'bg-[#0A0A0C]', 'text-white', 'w-full')}>
      <div className={clsx('max-w-6xl', 'mx-auto', 'px-6', 'text-center')}>
        <h2 className={clsx('text-4xl', 'font-bold', 'mb-12')}>Our Services</h2>

        <div className={clsx('grid', 'md:grid-cols-3', 'gap-8')}>
          {services.map((s, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl border ${s.color} 
                bg-white/5 backdrop-blur-md hover:bg-white/10 
                transition ${s.glow}`}
            >
              <h3 className={clsx('text-2xl', 'font-bold', 'mb-3')}>{s.title}</h3>
              <p className="text-gray-300">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
