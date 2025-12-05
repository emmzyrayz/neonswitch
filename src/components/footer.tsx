import clsx from "clsx";

export default function Footer() {
  return (
    <footer className={clsx('bg-[#0A0A0C]', 'border-t', 'border-white/10', 'py-12', 'text-gray-300')}>
      <div className={clsx('max-w-6xl', 'mx-auto', 'px-6', 'grid', 'md:grid-cols-4', 'gap-12')}>
        {/* Brand */}
        <div>
          <h1 className={clsx('text-2xl', 'font-bold', 'text-cyan-400', 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]')}>
            NeonSwitch
          </h1>
          <p className={clsx('mt-4', 'text-sm', 'text-gray-400')}>
            Fast telecom automation for creators, hustlers, and businesses.
            Virtual numbers, VTU, and digital services — powered by neon.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className={clsx('text-lg', 'font-semibold', 'mb-4', 'text-white')}>Company</h3>
          <ul className={clsx('space-y-2', 'text-sm')}>
            <li className={clsx('hover:text-cyan-400', 'transition', 'cursor-pointer')}>
              About
            </li>
            <li className={clsx('hover:text-cyan-400', 'transition', 'cursor-pointer')}>
              Pricing
            </li>
            <li className={clsx('hover:text-cyan-400', 'transition', 'cursor-pointer')}>
              Contact
            </li>
            <li className={clsx('hover:text-cyan-400', 'transition', 'cursor-pointer')}>
              Careers
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className={clsx('text-lg', 'font-semibold', 'mb-4', 'text-white')}>Services</h3>
          <ul className={clsx('space-y-2', 'text-sm')}>
            <li className={clsx('hover:text-cyan-400', 'transition', 'cursor-pointer')}>
              Virtual Numbers
            </li>
            <li className={clsx('hover:text-cyan-400', 'transition', 'cursor-pointer')}>
              VTU Recharge
            </li>
            <li className={clsx('hover:text-cyan-400', 'transition', 'cursor-pointer')}>
              TikTok Coins
            </li>
            <li className={clsx('hover:text-cyan-400', 'transition', 'cursor-pointer')}>
              API Access
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className={clsx('text-lg', 'font-semibold', 'mb-4', 'text-white')}>Connect</h3>
          <ul className={clsx('space-y-2', 'text-sm')}>
            <li className={clsx('hover:text-cyan-400', 'transition', 'cursor-pointer')}>
              Twitter
            </li>
            <li className={clsx('hover:text-cyan-400', 'transition', 'cursor-pointer')}>
              Instagram
            </li>
            <li className={clsx('hover:text-cyan-400', 'transition', 'cursor-pointer')}>
              Facebook
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className={clsx('mt-12', 'border-t', 'border-white/10', 'pt-6', 'text-center', 'text-sm', 'text-gray-500')}>
        © {new Date().getFullYear()} NeonSwitch. All rights reserved.
      </div>
    </footer>
  );
}
