import clsx from "clsx";

export default function VirtualNumber() {
  return (
    <section className={clsx('py-20', 'bg-[#0A0A0C]', 'text-white')}>
      <div className={clsx('max-w-lg', 'mx-auto', 'px-6')}>
        <h2 className={clsx('text-3xl', 'font-bold', 'text-center', 'mb-8')}>
          Buy Virtual Number
        </h2>

        <div className={clsx('p-6', 'bg-white/5', 'rounded-xl', 'border', 'border-cyan-400', 'shadow-[0_0_25px_rgba(34,211,238,0.4)]')}>
          <label className={clsx('block', 'mb-4')}>
            <span className="text-gray-300">Country</span>
            <select className={clsx('w-full', 'mt-2', 'p-3', 'bg-black/40', 'border', 'border-white/10', 'rounded-lg')}>
              <option>USA</option>
              <option>UK</option>
              <option>Nigeria</option>
            </select>
          </label>

          <label className={clsx('block', 'mb-4')}>
            <span className="text-gray-300">Service</span>
            <select className={clsx('w-full', 'mt-2', 'p-3', 'bg-black/40', 'border', 'border-white/10', 'rounded-lg')}>
              <option>WhatsApp</option>
              <option>Telegram</option>
              <option>Facebook</option>
            </select>
          </label>

          <button className={clsx('w-full', 'p-3', 'font-semibold', 'bg-cyan-400', 'text-black', 'rounded-lg', 'shadow-[0_0_20px_rgba(34,211,238,0.5)]', 'hover:bg-cyan-300', 'transition')}>
            Request Number
          </button>
        </div>
      </div>
    </section>
  );
}
