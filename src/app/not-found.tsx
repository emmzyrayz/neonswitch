/* eslint-disable react-hooks/purity */
'use client'
import { useState, useEffect, useMemo } from "react";
import {
  LuShoppingBag,
  LuZap,
  LuHouse,
  LuSearch,
  LuArrowLeft,
} from "react-icons/lu";
import clsx from "clsx";

export default function NotFound() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Generate particle positions once using useMemo
  const particles = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
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
        "bg-linear-to-br",
        "from-slate-900",
        "via-purple-900",
        "to-slate-900",
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
              "linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)",
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
            "bg-purple-400",
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
                "bg-purple-500",
                "blur-3xl",
                "opacity-50",
                "animate-pulse"
              )}
            />
            <LuShoppingBag
              className={clsx(
                "w-24",
                "h-24",
                "text-purple-400",
                "relative",
                "animate-bounce"
              )}
              strokeWidth={1.5}
            />
            <LuZap
              className={clsx(
                "w-12",
                "h-12",
                "text-cyan-400",
                "absolute",
                "top-0",
                "right-0",
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
              "from-purple-400",
              "via-pink-500",
              "to-cyan-400",
              "bg-clip-text",
              "text-transparent",
              glitchActive && "animate-pulse"
            )}
            style={{
              textShadow: glitchActive
                ? "2px 2px #ff00de, -2px -2px #00ffff"
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
                  "text-cyan-400",
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
                  "text-pink-400",
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
              "text-purple-200",
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
              "from-purple-600",
              "to-pink-600",
              "text-white",
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
                "from-cyan-600",
                "to-purple-600",
                "opacity-0",
                "group-hover:opacity-100",
                "transition-opacity",
                "duration-300"
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
              "border-purple-400",
              "text-purple-300",
              "font-semibold",
              "rounded-lg",
              "overflow-hidden",
              "transition-all",
              "duration-300",
              "hover:scale-105",
              "hover:border-cyan-400",
              "hover:text-cyan-300",
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
            href="/shop"
            className={clsx(
              "text-purple-300",
              "hover:text-cyan-300",
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
            Browse Shop
          </a>
          <a
            href="/search"
            className={clsx(
              "text-purple-300",
              "hover:text-cyan-300",
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
            Search Products
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
              "via-purple-500",
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
          "border-purple-500/30"
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
          "border-cyan-500/30"
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
          "border-cyan-500/30"
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
          "border-purple-500/30"
        )}
      />
    </div>
  );
}
