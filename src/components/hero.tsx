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
        "bg-primary/60",
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
          "bg-soft/20",
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
          "bg-muted/20",
          "blur-3xl",
          "rounded-full"
        )}
      />

      {/* Subtle grid background */}
      <div
        className={clsx("absolute", "inset-0", "bg-transparent")}
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/gplay.png')",
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
          "gap-4"
        )}
      >
        {/* Title */}
        <h1
          className={clsx(
            "text-4xl",
            "md:text-6xl",
            "font-bold",
            "text-primary",
            "leading-tight",
            "mb-4",
            "drop-shadow-[0_0_15px_#E5E7EB]",
            "font-sora"
          )}
        >
          Instant Virtual Numbers & High-Speed VTU Solutions
        </h1>

        {/* Subtitle */}
        <p
          className={clsx(
            "text-primary/50",
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
              "bg-white",
              "hover:bg-muted",
              "transition",
              "rounded-lg",
              "shadow-[0_0_20px_#E5E7EB]"
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
              "border-secondary/30",
              "rounded-lg",
              "hover:bg-secondary/10",
              "transition",
              "shadow-[0_0_15px_#111111]"
            )}
          >
            Explore Services
          </button>
        </div>
      </div>
    </section>
  );
};
