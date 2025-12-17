'use client'
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { baseMetadata } from "@/utils/metadata";
import LoadingScreen from "@/components/loading";
import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layoutWrapper";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Ads from "@/components/Ads";
import { NotFoundProvider } from "@/context/NotFoundContext";
import clsx from "clsx";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const sora = localFont({
  src: [
    {
      path: "./fonts/Sora-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Sora-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Sora-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sora",
});

const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show loading screen for 3 seconds on initial mount
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html
      lang="en"
      className={`
      ${geistSans.variable} 
      ${geistMono.variable} 
      ${sora.variable} 
      antialiased
    `}
    >
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
      </head>
      <body className={clsx(
        "flex",
        "flex-col",
        "w-full",
        "h-full",
        "items-center",
        "justify-center",
        ''
      )}>
      <NotFoundProvider>
          <LoadingScreen
            isLoading={isLoading}
            onLoadingComplete={() => setShowContent(true)}
          />
          
          {showContent && (
            <LayoutWrapper
              navbar={<Navbar />}
              footer={<Footer />}
              ads={<Ads />}
            >
              {children}
            </LayoutWrapper>
          )}
        </NotFoundProvider>
      </body>
    </html>
  );
}
