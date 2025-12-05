import { Metadata } from "next";

interface PageParams {
  page?: string;
}

// Constants for easy updates
const WEB_URL = "https://neonswitch.vercel.app"; // Your NeonSwitch URL
const IMAGE_URL = `${WEB_URL}/assets/og-banner.png`; // OpenGraph banner image
const DESCRIPTION =
  "NeonSwitch: Your one-stop platform for Virtual Numbers, VTU services, API access, and more, all in a sleek dark neon interface.";

export const baseMetadata: Metadata = {
  title: "NeonSwitch - Virtual Numbers & VTU Services",
  description: DESCRIPTION,

  openGraph: {
    title: "NeonSwitch - Virtual Numbers & VTU Services",
    description: DESCRIPTION,
    url: WEB_URL,
    siteName: "NeonSwitch",
    images: [
      {
        url: IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "NeonSwitch OpenGraph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "NeonSwitch - Virtual Numbers & VTU Services",
    description: DESCRIPTION,
    images: [IMAGE_URL],
    site: "@neonswitch",
    creator: "@neonswitch",
  },

  keywords: [
    "NeonSwitch",
    "Virtual Numbers",
    "VTU Services",
    "Airtime Recharge",
    "Data Top-Up",
    "API Services",
    "Dark Neon UI",
    "Dashboard",
    "Online Recharge",
    "Business Tools",
    "Telecom Services",
    "Digital Platform",
    "Student Tools",
    "Developer API",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: WEB_URL,
    languages: {
      "en-US": WEB_URL,
    },
  },

  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export function generateMetadata({ params }: { params: PageParams }): Metadata {
  const pageSpecificMetadata: Record<string, Partial<Metadata>> = {
    dashboard: {
      title: "Dashboard | NeonSwitch",
      description:
        "Access your virtual numbers, VTU services, and manage your account from the NeonSwitch dashboard.",
      openGraph: {
        title: "Dashboard | NeonSwitch",
        description:
          "Access your virtual numbers, VTU services, and manage your account from the NeonSwitch dashboard.",
      },
      twitter: {
        title: "Dashboard | NeonSwitch",
        description:
          "Access your virtual numbers, VTU services, and manage your account from the NeonSwitch dashboard.",
      },
    },
    virtualnumber: {
      title: "Virtual Numbers | NeonSwitch",
      description:
        "Generate and manage virtual numbers quickly and securely using NeonSwitch.",
      openGraph: {
        title: "Virtual Numbers | NeonSwitch",
        description:
          "Generate and manage virtual numbers quickly and securely using NeonSwitch.",
      },
      twitter: {
        title: "Virtual Numbers | NeonSwitch",
        description:
          "Generate and manage virtual numbers quickly and securely using NeonSwitch.",
      },
    },
    vtu: {
      title: "VTU Services | NeonSwitch",
      description:
        "Top up airtime or data for yourself or others with NeonSwitch VTU services.",
      openGraph: {
        title: "VTU Services | NeonSwitch",
        description:
          "Top up airtime or data for yourself or others with NeonSwitch VTU services.",
      },
      twitter: {
        title: "VTU Services | NeonSwitch",
        description:
          "Top up airtime or data for yourself or others with NeonSwitch VTU services.",
      },
    },
    pricing: {
      title: "Pricing | NeonSwitch",
      description:
        "Check service rates and packages for virtual numbers and VTU top-ups on NeonSwitch.",
      openGraph: {
        title: "Pricing | NeonSwitch",
        description:
          "Check service rates and packages for virtual numbers and VTU top-ups on NeonSwitch.",
      },
      twitter: {
        title: "Pricing | NeonSwitch",
        description:
          "Check service rates and packages for virtual numbers and VTU top-ups on NeonSwitch.",
      },
    },
    api: {
      title: "API Docs | NeonSwitch",
      description:
        "Access the NeonSwitch API documentation for integrating virtual numbers and VTU services.",
      openGraph: {
        title: "API Docs | NeonSwitch",
        description:
          "Access the NeonSwitch API documentation for integrating virtual numbers and VTU services.",
      },
      twitter: {
        title: "API Docs | NeonSwitch",
        description:
          "Access the NeonSwitch API documentation for integrating virtual numbers and VTU services.",
      },
    },
    auth: {
      title: "Auth | NeonSwitch",
      description:
        "Login or register to access NeonSwitch services like virtual numbers, VTU, and more.",
      openGraph: {
        title: "Auth | NeonSwitch",
        description:
          "Login or register to access NeonSwitch services like virtual numbers, VTU, and more.",
      },
      twitter: {
        title: "Auth | NeonSwitch",
        description:
          "Login or register to access NeonSwitch services like virtual numbers, VTU, and more.",
      },
    },
  };

  const pageName = params.page?.toLowerCase();
  const pageMetadata: Metadata =
    pageName && pageSpecificMetadata[pageName]
      ? { ...baseMetadata, ...pageSpecificMetadata[pageName] }
      : baseMetadata;

  return pageMetadata;
}

export const metadata = baseMetadata;
