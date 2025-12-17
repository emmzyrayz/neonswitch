import clsx from "clsx";
import React from "react";
import {
  LuPhone,
  LuLock,
  LuGlobe,
  LuCircleCheck,
} from "react-icons/lu";

export default function VirtualNumberServicePage() {
  return (
    <div className={clsx('min-h-screen', 'bg-white', 'px-[20px]', 'mt-[25px]')}>
      <section className={clsx('border-b-2', 'border-muted')}>
        <div className={clsx('max-w-7xl', 'mx-auto', 'py-20', 'text-muted')}>
          <h1 className={clsx('text-5xl', 'font-bold', 'mb-6')}>Virtual Numbers</h1>
          <p className={clsx('text-xl', 'text-gray-600', 'max-w-3xl')}>
            Rent secure virtual phone numbers for SMS verification, messaging,
            and online services without exposing your personal number.
          </p>
        </div>
      </section>

      <section className={clsx('max-w-7xl', 'mx-auto', 'py-20', 'text-muted')}>
        <h2 className={clsx('text-4xl', 'font-bold', 'mb-12')}>Key Benefits</h2>
        <div className={clsx('grid', 'md:grid-cols-3', 'gap-6')}>
          {[
            {
              icon: LuPhone,
              title: "Instant Access",
              desc: "Activate numbers instantly across supported regions.",
            },
            {
              icon: LuLock,
              title: "Privacy First",
              desc: "Protect your personal identity online.",
            },
            {
              icon: LuGlobe,
              title: "Global Coverage",
              desc: "Use numbers from multiple countries.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className={clsx('border-2', 'border-muted', 'rounded-2xl', 'p-8')}
            >
              <Icon className={clsx('w-12', 'h-12', 'mb-4')} />
              <h3 className={clsx('text-2xl', 'font-bold', 'mb-2')}>{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={clsx('bg-gray-50', 'border-t-2', 'border-muted')}>
        <div className={clsx('max-w-7xl', 'mx-auto', 'py-20', 'text-muted')}>
          <h2 className={clsx('text-4xl', 'font-bold', 'mb-6')}>Use Cases</h2>
          <ul className={clsx('space-y-4', 'text-lg')}>
            {[
              "Social media verification",
              "Online services & apps",
              "Temporary registrations",
              "Business messaging",
            ].map((item) => (
              <li key={item} className={clsx('flex', 'gap-3')}>
                <LuCircleCheck className={clsx('w-6', 'h-6', 'mt-1')} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
