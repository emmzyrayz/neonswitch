/* eslint-disable react-hooks/purity */
'use client'
import { useState, useEffect, useMemo } from "react";
import { useNotFound } from "@/context/NotFoundContext";
import {
  LuShoppingBag,
  LuZap,
  LuHouse,
  LuSearch,
  LuArrowLeft,
} from "react-icons/lu";
import clsx from "clsx";

export default function NotFound() {
  const { setIsNotFound } = useNotFound();
  const [glitchActive, setGlitchActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Set not-found state on mount
  useEffect(() => {
    setIsNotFound(true);
    return () => setIsNotFound(false);
  }, [setIsNotFound]);

  // Generate particle positions once using useMemo
  const particles = useMemo(
    () =>
      Array.from({ length: 100 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
      })),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={clsx(
        "min-h-screen",
        "min-w-screen",
        "bg-linear-to-br",
        "from-muted",
        "via-black/80",
        "to-muted",
        "flex",
        "items-center",
        "justify-center",
        "p-4",
        "overflow-hidden",
        "relative"
      )}
    >
      {/* Animated background grid */}
      <div className={clsx("absolute", "inset-0", "opacity-20")}>
        <div
          className={clsx("absolute", "inset-0")}
          style={{
            backgroundImage:
              "linear-gradient(#F9FAFB 1px, transparent 1px), linear-gradient(90deg, #F9FAFB 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            transform: `perspective(500px) rotateX(60deg) translateY(-50%)`,
          }}
        />
      </div>

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className={clsx(
            "absolute",
            "w-1",
            "h-1",
            "bg-soft",
            "rounded-full",
            "animate-pulse"
          )}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      <div
        className={clsx(
          "relative",
          "z-10",
          "text-center",
          "max-w-2xl",
          "mx-auto"
        )}
      >
        {/* Animated logo/icon */}
        <div
          className={clsx("mb-8", "flex", "justify-center")}
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <div className="relative">
            <div
              className={clsx(
                "absolute",
                "inset-0",
                "bg-soft/60",
                "blur-3xl",
                "opacity-50",
                "animate-pulse"
              )}
            />
            <LuShoppingBag
              className={clsx(
                "w-24",
                "h-24",
                "text-border",
                "relative",
                "animate-bounce"
              )}
              strokeWidth={1.5}
            />
            <LuZap
              className={clsx(
                "w-8",
                "h-8",
                "text-soft/80",
                "absolute",
                "-top-2",
                "-right-2",
                "animate-ping"
              )}
            />
          </div>
        </div>

        {/* 404 Text with glitch effect */}
        <div className={clsx("relative", "mb-6")}>
          <h1
            className={clsx(
              "text-8xl",
              "md:text-9xl",
              "font-bold",
              "bg-linear-to-r",
              "from-muted",
              "via-soft",
              "to-muted",
              "bg-clip-text",
              "text-transparent",
              glitchActive && "animate-pulse"
            )}
            style={{
              textShadow: glitchActive
                ? "2px 2px #111, -2px -2px #fff"
                : "none",
              transform: glitchActive ? "translate(2px, -2px)" : "none",
            }}
          >
            404
          </h1>
          {glitchActive && (
            <>
              <h1
                className={clsx(
                  "absolute",
                  "inset-0",
                  "text-8xl",
                  "md:text-9xl",
                  "font-bold",
                  "text-black",
                  "opacity-70"
                )}
                style={{ transform: "translate(-2px, 2px)" }}
              >
                404
              </h1>
              <h1
                className={clsx(
                  "absolute",
                  "inset-0",
                  "text-8xl",
                  "md:text-9xl",
                  "font-bold",
                  "text-soft",
                  "opacity-70"
                )}
                style={{ transform: "translate(2px, -2px)" }}
              >
                404
              </h1>
            </>
          )}
        </div>

        {/* Description */}
        <div className={clsx("space-y-4", "mb-10")}>
          <h2
            className={clsx(
              "text-3xl",
              "md:text-4xl",
              "font-bold",
              "text-white"
            )}
          >
            Page Not Found
          </h2>
          <p
            className={clsx(
              "text-lg",
              "text-soft/60",
              "max-w-md",
              "mx-auto"
            )}
          >
            Looks like this payment portal got disconnected from the mainframe.
            Let&apos;s get you back on track!
          </p>
        </div>

        {/* Action buttons */}
        <div
          className={clsx(
            "flex",
            "flex-col",
            "sm:flex-row",
            "gap-4",
            "justify-center",
            "items-center"
          )}
        >
          <button
            onClick={() => (window.location.href = "/")}
            className={clsx(
              "group",
              "relative",
              "px-8",
              "py-4",
              "bg-linear-to-r",
              "from-muted",
              "to-soft",
              "text-black",
              "font-semibold",
              "rounded-lg",
              "overflow-hidden",
              "transition-all",
              "duration-300",
              "hover:scale-105",
              "hover:shadow-2xl",
              "hover:shadow-purple-500/50",
              "w-full",
              "sm:w-auto"
            )}
          >
            <div
              className={clsx(
                "absolute",
                "inset-0",
                "bg-linear-to-r",
                "from-soft",
                "to-muted",
                "opacity-0",
                "group-hover:opacity-100",
                "transition-opacity",
                "duration-500"
              )}
            />
            <span
              className={clsx(
                "relative",
                "flex",
                "items-center",
                "justify-center",
                "gap-2"
              )}
            >
              <LuHouse className={clsx("w-5", "h-5")} />
              Back to Home
            </span>
          </button>

          <button
            onClick={() => window.history.back()}
            className={clsx(
              "group",
              "relative",
              "px-8",
              "py-4",
              "bg-transparent",
              "border-2",
              "border-muted",
              "text-soft",
              "font-semibold",
              "rounded-lg",
              "overflow-hidden",
              "transition-all",
              "duration-300",
              "hover:scale-105",
              "hover:border-soft",
              "hover:text-soft/70",
              "w-full",
              "sm:w-auto"
            )}
          >
            <span
              className={clsx(
                "relative",
                "flex",
                "items-center",
                "justify-center",
                "gap-2"
              )}
            >
              <LuArrowLeft className={clsx("w-5", "h-5")} />
              Go Back
            </span>
          </button>
        </div>

        {/* Additional links */}
        <div
          className={clsx(
            "mt-12",
            "flex",
            "flex-wrap",
            "justify-center",
            "gap-6",
            "text-sm"
          )}
        >
          <a
            href="/services"
            className={clsx(
              "text-soft/50",
              "hover:text-soft",
              "transition-colors",
              "flex",
              "items-center",
              "gap-2",
              "group"
            )}
          >
            <LuShoppingBag
              className={clsx("w-4", "h-4", "group-hover:animate-bounce")}
            />
            Browse Services
          </a>
          <a
            href="/contact"
            className={clsx(
              "text-soft/40",
              "hover:text-soft",
              "transition-colors",
              "flex",
              "items-center",
              "gap-2",
              "group"
            )}
          >
            <LuSearch
              className={clsx("w-4", "h-4", "group-hover:animate-bounce")}
            />
            Contact Us
          </a>
        </div>

        {/* Neon line decoration */}
        <div className={clsx("mt-12", "flex", "justify-center")}>
          <div
            className={clsx(
              "h-1",
              "w-32",
              "bg-linear-to-r",
              "from-transparent",
              "via-muted",
              "to-transparent",
              "animate-pulse"
            )}
          />
        </div>
      </div>

      {/* Corner accents */}
      <div
        className={clsx(
          "absolute",
          "top-0",
          "left-0",
          "w-32",
          "h-32",
          "border-t-2",
          "border-l-2",
          "border-soft/60"
        )}
      />
      <div
        className={clsx(
          "absolute",
          "top-0",
          "right-0",
          "w-32",
          "h-32",
          "border-t-2",
          "border-r-2",
          "border-muted/30"
        )}
      />
      <div
        className={clsx(
          "absolute",
          "bottom-0",
          "left-0",
          "w-32",
          "h-32",
          "border-b-2",
          "border-l-2",
          "border-muted/30"
        )}
      />
      <div
        className={clsx(
          "absolute",
          "bottom-0",
          "right-0",
          "w-32",
          "h-32",
          "border-b-2",
          "border-r-2",
          "border-muted/30"
        )}
      />
    </div>
  );
}