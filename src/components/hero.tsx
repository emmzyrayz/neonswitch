// app/components/Hero.tsx
import clsx from "clsx";

export const Hero = () => {
  return (
    <section
      className={clsx(
        "relative",
        "w-full",
        "min-h-screen",
        "flex",
        "items-center",
        "justify-center",
        "bg-[#0A0A0C]",
        "overflow-hidden"
      )}
    >
      {/* Neon gradient glows */}
      <div
        className={clsx(
          "absolute",
          "top-0",
          "left-0",
          "w-[500px]",
          "h-[500px]",
          "bg-cyan-500/20",
          "blur-3xl",
          "rounded-full"
        )}
      />
      <div
        className={clsx(
          "absolute",
          "bottom-0",
          "right-0",
          "w-[500px]",
          "h-[500px]",
          "bg-fuchsia-500/20",
          "blur-3xl",
          "rounded-full"
        )}
      />

      {/* Subtle grid background */}
      <div
        className={clsx("absolute", "inset-0", "opacity-10")}
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/cubes.png')",
        }}
      ></div>

      <div
        className={clsx(
          "relative",
          "z-10",
          "flex",
          "flex-col",
          "items-center",
          "text-center",
          "px-6",
          "max-w-3xl",
          'gap-4'
        )}
      >
        {/* Title */}
        <h1
          className={clsx(
            "text-4xl",
            "md:text-6xl",
            "font-bold",
            "text-white",
            "leading-tight",
            "mb-4",
            "drop-shadow-[0_0_15px_rgba(0,255,255,0.35)]"
          )}
        >
          Instant Virtual Numbers & High-Speed VTU Solutions
        </h1>

        {/* Subtitle */}
        <p
          className={clsx(
            "text-gray-300",
            "text-[14px]",
            "md:text-lg",
            "sm:text-[12px]",
            "mb-8",
            "max-w-2xl",
            "font-sora"
          )}
        >
          NeonSwitch connects you to fast, reliable telecom automation — from
          virtual second numbers to airtime & data top-ups — powered by a sleek
          neon-lit dashboard built for creators, hustlers, and businesses.
        </p>

        {/* Buttons */}
        <div className={clsx("flex", "gap-4", "flex-wrap", "justify-center")}>
          <button
            className={clsx(
              "px-8",
              "py-3",
              "font-semibold",
              "text-black",
              "bg-cyan-400",
              "hover:bg-cyan-300",
              "transition",
              "rounded-lg",
              "shadow-[0_0_20px_rgba(34,211,238,0.5)]"
            )}
          >
            Start Demo
          </button>

          <button
            className={clsx(
              "px-8",
              "py-3",
              "font-semibold",
              "text-white",
              "border",
              "border-fuchsia-400",
              "rounded-lg",
              "hover:bg-fuchsia-500/10",
              "transition",
              "shadow-[0_0_15px_rgba(244,114,182,0.4)]"
            )}
          >
            Explore Services
          </button>
        </div>
      </div>
    </section>
  );
};
