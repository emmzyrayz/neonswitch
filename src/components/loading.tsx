"use client";

import { useState, useEffect } from "react";
import { LuShoppingBag, LuZap } from "react-icons/lu";
import clsx from "clsx";

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({
  isLoading,
  onLoadingComplete,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Start fade out after 2.7 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2700);

    // Complete loading after 3 seconds
    const completeTimer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [isLoading, onLoadingComplete]);

  // Reset state when isLoading changes to true
  useEffect(() => {
    if (isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgress(0);
      setFadeOut(false);
    }
  }, [isLoading]);

  if (!isLoading && fadeOut) return null;

  return (
    <div
      className={clsx(
        "fixed",
        "inset-0",
        "z-50",
        "bg-black",
        "flex",
        "items-center",
        "justify-center",
        "transition-opacity",
        "duration-300",
        fadeOut && "opacity-0"
      )}
    >
      {/* Animated grid background */}
      <div className={clsx("absolute", "inset-0", "opacity-10")}>
        <div
          className={clsx("absolute", "inset-0")}
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            animation: "gridScroll 20s linear infinite",
          }}
        />
      </div>

      {/* Scanning lines effect */}
      <div
        className={clsx("absolute", "inset-0", "opacity-5")}
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)",
          animation: "scan 8s linear infinite",
        }}
      />

      <div
        className={clsx("relative", "z-10", "text-center", "max-w-md", "px-8")}
      >
        {/* Logo section */}
        <div className={clsx("mb-12", "flex", "justify-center", "relative")}>
          {/* Pulsing glow effect */}
          <div
            className={clsx("absolute", "inset-0", "blur-2xl", "opacity-30")}
            style={{
              background: "radial-gradient(circle, white 0%, transparent 70%)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />

          {/* Main logo */}
          <div
            className={clsx(
              "relative",
              "flex",
              "items-center",
              "justify-center"
            )}
          >
            <LuShoppingBag
              className={clsx("w-20", "h-20", "text-white")}
              strokeWidth={1.5}
              style={{ animation: "float 3s ease-in-out infinite" }}
            />
            <LuZap
              className={clsx(
                "w-10",
                "h-10",
                "text-white",
                "absolute",
                "-top-2",
                "-right-2"
              )}
              style={{ animation: "zap 1.5s ease-in-out infinite" }}
            />
          </div>
        </div>

        {/* Brand name */}
        <h1
          className={clsx(
            "text-4xl",
            "md:text-5xl",
            "font-bold",
            "text-white",
            "mb-4",
            "tracking-wider"
          )}
          style={{ animation: "fadeIn 0.5s ease-in" }}
        >
          NEON SWITCH
        </h1>

        <p
          className={clsx("text-gray-400", "text-sm", "mb-12", "tracking-wide")}
          style={{ animation: "fadeIn 0.5s ease-in 0.2s backwards" }}
        >
          SHOPPING & PAYMENT PLATFORM
        </p>

        {/* Progress bar */}
        <div
          className={clsx(
            "relative",
            "w-full",
            "h-1",
            "bg-gray-800",
            "overflow-hidden"
          )}
        >
          {/* Background track with dashed pattern */}
          <div
            className={clsx("absolute", "inset-0", "opacity-30")}
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, white 0px, white 10px, transparent 10px, transparent 20px)",
            }}
          />

          {/* Progress fill */}
          <div
            className={clsx("absolute", "inset-y-0", "left-0", "bg-white")}
            style={{
              width: `${progress}%`,
              transition: "width 0.3s ease-out",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
            }}
          />
        </div>

        {/* Progress percentage */}
        <div
          className={clsx(
            "mt-4",
            "text-white",
            "text-xs",
            "font-mono",
            "tracking-wider"
          )}
        >
          {Math.round(progress)}%
        </div>

        {/* Loading dots */}
        <div className={clsx("mt-8", "flex", "justify-center", "gap-2")}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={clsx("w-2", "h-2", "bg-white", "rounded-full")}
              style={{
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner brackets */}
      <div className={clsx("absolute", "top-8", "left-8", "w-16", "h-16")}>
        <div
          className={clsx(
            "absolute",
            "top-0",
            "left-0",
            "w-full",
            "h-0.5",
            "bg-white"
          )}
        />
        <div
          className={clsx(
            "absolute",
            "top-0",
            "left-0",
            "w-0.5",
            "h-full",
            "bg-white"
          )}
        />
      </div>
      <div className={clsx("absolute", "top-8", "right-8", "w-16", "h-16")}>
        <div
          className={clsx(
            "absolute",
            "top-0",
            "right-0",
            "w-full",
            "h-0.5",
            "bg-white"
          )}
        />
        <div
          className={clsx(
            "absolute",
            "top-0",
            "right-0",
            "w-0.5",
            "h-full",
            "bg-white"
          )}
        />
      </div>
      <div className={clsx("absolute", "bottom-8", "left-8", "w-16", "h-16")}>
        <div
          className={clsx(
            "absolute",
            "bottom-0",
            "left-0",
            "w-full",
            "h-0.5",
            "bg-white"
          )}
        />
        <div
          className={clsx(
            "absolute",
            "bottom-0",
            "left-0",
            "w-0.5",
            "h-full",
            "bg-white"
          )}
        />
      </div>
      <div className={clsx("absolute", "bottom-8", "right-8", "w-16", "h-16")}>
        <div
          className={clsx(
            "absolute",
            "bottom-0",
            "right-0",
            "w-full",
            "h-0.5",
            "bg-white"
          )}
        />
        <div
          className={clsx(
            "absolute",
            "bottom-0",
            "right-0",
            "w-0.5",
            "h-full",
            "bg-white"
          )}
        />
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gridScroll {
          0% {
            transform: translateY(0) translateX(0);
          }
          100% {
            transform: translateY(40px) translateX(40px);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes zap {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
