import clsx from "clsx";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";

interface ListProps {
  name: string;
  path: string;
  icon?: IconType;
}

interface FooterProps {
  head: string;
  items: ListProps[];
}

const FooterLists: FooterProps[] = [
  {
    head: "Company",
    items: [
      {
        name: "About",
        path: "about",
      },
      {
        name: "Pricing",
        path: "pricing",
      },
      {
        name: "Contact",
        path: "contact",
      },
      {
        name: "Careers",
        path: "careers",
      },
    ],
  },
  {
    head: "Services",
    items: [
      {
        name: "Virtual Number",
        path: "virtual_number",
      },
      {
        name: "VTU Recharge",
        path: "vtu",
      },
      {
        name: "Tiktok Coins",
        path: "tiktok_coins",
      },
      {
        name: "API Access",
        path: "api",
      },
    ],
  },
  {
    head: "Connect",
    items: [
      {
        name: "Twitter",
        path: "https://www.x.com/",
        icon: FaXTwitter,
      },
      {
        name: "Instagram",
        path: "https://www.instagram.com/",
        icon: FaInstagram,
      },
      {
        name: "Facebook",
        path: "https://www.facebook.com/",
        icon: FaFacebookF,
      },
      {
        name: "LinkedIn",
        path: "https://www.linkedin.com/",
        icon: FaLinkedin,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className={clsx(
        "bg-soft",
        "w-[95%]",
        "rounded-lg",
        "border-t",
        "border-muted/30",
        "shadow-muted",
        "shadow-lg",
        "py-12",
        "text-primary/40"
      )}
    >
      <div
        className={clsx(
          "max-w-6xl",
          "mx-auto",
          "px-6",
          "grid",
          "md:grid-cols-2",
          "gap-12"
        )}
      >
        {/* Brand */}
        <div>
          <h1
            className={clsx(
              "text-2xl",
              "font-bold",
              "text-black",
              "drop-shadow-[0_0_8px_black]"
            )}
          >
            NeonSwitch
          </h1>
          <p className={clsx("mt-4", "text-sm", "text-muted")}>
            Fast telecom automation for creators, hustlers, and businesses.
            Virtual numbers, VTU, and digital services — powered by neon.
          </p>
        </div>

        {/* Links */}

        {/* Dynamic Footer List */}
        <div className={clsx('flex', 'flex-wrap', 'gap-2', 'w-full', 'items-center', 'justify-evenly')}>
          {FooterLists.map((section, index) => (
            <div key={index} className="min-w-[30%]">
              <h3
                className={clsx(
                  "text-lg",
                  "font-semibold",
                  "mb-4",
                  "text-black"
                )}
              >
                {section.head}
              </h3>
              <ul className={clsx("space-y-2 w-full flex-col items-center justify-center ", "text-[14px]", "md:text-[16px]")}>
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const isExternalLink = item.path.startsWith("http");
                  const isSocialLink = section.head === "Connect";

                  return (
                    <li
                      key={itemIndex}
                      className={clsx(
                        "hover:text-black w-full ",
                        "font-bold",
                        "transition-all ease-in-out duration-500",
                        "cursor-pointer"
                      )}
                    >
                      <Link
                        href={isExternalLink ? item.path : `/${item.path}`}
                        target={isExternalLink ? "_blank" : "_self"}
                        rel={isExternalLink ? "noopener noreferrer" : undefined}
                        className={clsx("flex", "items-center", "gap-2")}
                      >
                        {/* Social Link With responsive icon/name display */}
                        {isSocialLink && Icon ? (
                          <>
                            {/* Desktop: Icon + Name */}
                            <span
                              className={clsx(
                                "hidden",
                                "lg:flex",
                                "items-center",
                                "gap-2"
                              )}
                            >
                              <Icon className="text-lg" />
                              {item.name}
                            </span>

                            {/* Tablet: Name only */}
                            <span
                              className={clsx(
                                "hidden",
                                "md:inline",
                                "lg:hidden"
                              )}
                            >
                              {item.name}
                            </span>

                            {/* Mobile: Icon Only */}
                            <span className="md:hidden">
                              <Icon className="text-xl" />
                            </span>
                          </>
                        ) : (
                          // Regular Links: just show name
                          item.name
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div
        className={clsx(
          "mt-12",
          "border-t",
          "border-white/10",
          "pt-6",
          "text-center",
          "text-sm",
          "text-gray-500"
        )}
      >
        © {new Date().getFullYear()} NeonSwitch. All rights reserved.
      </div>
    </footer>
  );
}
