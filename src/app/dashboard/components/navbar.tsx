'use client'
import { useState } from "react";
import clsx from "clsx";
import {
  LuChevronDown,
  LuUser,
  LuSettings,
  LuLogOut,
  LuWallet,
  LuCoins,
  LuAward,
  LuBell,
} from "react-icons/lu";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock user data - replace with actual data from your state management
  const userData = {
    username: "john_doe",
    walletBalance: 25450.5,
    coinBalance: 1250,
    tokenBalance: 350,
    unreadNotifications: 3,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const notifications = [
    {
      id: 1,
      text: "Wallet funded successfully",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      text: "VTU transaction completed",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      text: "New token reward received",
      time: "2 hours ago",
      read: false,
    },
  ];

  return (
    <header
      className={clsx(
        "w-full bg-[#0f0f0f] border-b border-gray-800",
        "px-4 py-3 flex justify-between items-center"
      )}
    >
      {/* Left Section - Logo/Title */}
      <div className={clsx("flex", "items-center", "gap-6")}>
        <h2 className={clsx("text-xl", "font-bold", "text-white")}>
          Dashboard
        </h2>

        {/* Balance Info Cards */}
        <div className={clsx("hidden", "lg:flex", "items-center", "gap-3")}>
          <div
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg",
              "bg-linear-to-r from-green-900/30 to-green-800/20",
              "border border-green-700/30"
            )}
          >
            <LuWallet className={clsx("w-4", "h-4", "text-green-400")} />
            <div className={clsx("flex", "flex-col")}>
              <span className={clsx("text-xs", "text-gray-400")}>Wallet</span>
              <span
                className={clsx("text-sm", "font-semibold", "text-green-400")}
              >
                {formatCurrency(userData.walletBalance)}
              </span>
            </div>
          </div>

          <div
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg",
              "bg-linear-to-r from-blue-900/30 to-blue-800/20",
              "border border-blue-700/30"
            )}
          >
            <LuCoins className={clsx("w-4", "h-4", "text-blue-400")} />
            <div className={clsx("flex", "flex-col")}>
              <span className={clsx("text-xs", "text-gray-400")}>Coins</span>
              <span
                className={clsx("text-sm", "font-semibold", "text-blue-400")}
              >
                {userData.coinBalance.toLocaleString()}
              </span>
            </div>
          </div>

          <div
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg",
              "bg-linear-to-r from-purple-900/30 to-purple-800/20",
              "border border-purple-700/30"
            )}
          >
            <LuAward className={clsx("w-4", "h-4", "text-purple-400")} />
            <div className={clsx("flex", "flex-col")}>
              <span className={clsx("text-xs", "text-gray-400")}>Tokens</span>
              <span
                className={clsx("text-sm", "font-semibold", "text-purple-400")}
              >
                {userData.tokenBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Notifications & User Menu */}
      <div className={clsx("flex", "items-center", "gap-3")}>
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={clsx(
              "relative p-2 rounded-lg transition-all",
              "hover:bg-gray-800 text-gray-300 hover:text-white"
            )}
          >
            <LuBell className={clsx("w-5", "h-5")} />
            {userData.unreadNotifications > 0 && (
              <span
                className={clsx(
                  "absolute -top-1 -right-1 w-5 h-5 rounded-full",
                  "bg-red-500 text-white text-xs flex items-center justify-center",
                  "font-semibold"
                )}
              >
                {userData.unreadNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                className={clsx("fixed", "inset-0", "z-10")}
                onClick={() => setShowNotifications(false)}
              />
              <div
                className={clsx(
                  "absolute right-0 top-full mt-2 w-80 z-20",
                  "bg-gray-900 border border-gray-700 rounded-lg shadow-xl",
                  "max-h-96 overflow-y-auto"
                )}
              >
                <div className={clsx("p-3", "border-b", "border-gray-700")}>
                  <h3
                    className={clsx("text-sm", "font-semibold", "text-white")}
                  >
                    Notifications
                  </h3>
                </div>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={clsx(
                      "p-3 border-b border-gray-800 hover:bg-gray-800",
                      "cursor-pointer transition-colors",
                      !notif.read && "bg-blue-900/10"
                    )}
                  >
                    <p className={clsx("text-sm", "text-gray-200")}>
                      {notif.text}
                    </p>
                    <p className={clsx("text-xs", "text-gray-500", "mt-1")}>
                      {notif.time}
                    </p>
                  </div>
                ))}
                <button
                  className={clsx(
                    "w-full",
                    "p-3",
                    "text-sm",
                    "text-blue-400",
                    "hover:bg-gray-800",
                    "transition-colors"
                  )}
                >
                  View all notifications
                </button>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={clsx(
              "flex items-center gap-2 px-3 py-2 rounded-lg",
              "bg-gray-800 hover:bg-gray-700 transition-all",
              "border border-gray-700"
            )}
          >
            <div
              className={clsx(
                "w-8 h-8 rounded-full bg-linear-to-br",
                "from-blue-500 to-purple-600 flex items-center justify-center"
              )}
            >
              <LuUser className={clsx("w-4", "h-4", "text-white")} />
            </div>
            <div
              className={clsx("hidden", "md:flex", "flex-col", "items-start")}
            >
              <span className={clsx("text-sm", "font-medium", "text-white")}>
                @{userData.username}
              </span>
              <span className={clsx("text-xs", "text-gray-400", "lg:hidden")}>
                {formatCurrency(userData.walletBalance)}
              </span>
            </div>
            <LuChevronDown
              className={clsx(
                "w-4 h-4 text-gray-400 transition-transform",
                showDropdown && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className={clsx("fixed", "inset-0", "z-10")}
                onClick={() => setShowDropdown(false)}
              />
              <div
                className={clsx(
                  "absolute right-0 top-full mt-2 w-56 z-20",
                  "bg-gray-900 border border-gray-700 rounded-lg shadow-xl",
                  "py-2"
                )}
              >
                {/* Mobile Balance Info */}
                <div
                  className={clsx(
                    "lg:hidden",
                    "px-4",
                    "py-3",
                    "border-b",
                    "border-gray-800"
                  )}
                >
                  <div className="space-y-2">
                    <div
                      className={clsx(
                        "flex",
                        "justify-between",
                        "items-center"
                      )}
                    >
                      <span className={clsx("text-xs", "text-gray-400")}>
                        Wallet
                      </span>
                      <span
                        className={clsx(
                          "text-sm",
                          "font-semibold",
                          "text-green-400"
                        )}
                      >
                        {formatCurrency(userData.walletBalance)}
                      </span>
                    </div>
                    <div
                      className={clsx(
                        "flex",
                        "justify-between",
                        "items-center"
                      )}
                    >
                      <span className={clsx("text-xs", "text-gray-400")}>
                        Coins
                      </span>
                      <span
                        className={clsx(
                          "text-sm",
                          "font-semibold",
                          "text-blue-400"
                        )}
                      >
                        {userData.coinBalance.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className={clsx(
                        "flex",
                        "justify-between",
                        "items-center"
                      )}
                    >
                      <span className={clsx("text-xs", "text-gray-400")}>
                        Tokens
                      </span>
                      <span
                        className={clsx(
                          "text-sm",
                          "font-semibold",
                          "text-purple-400"
                        )}
                      >
                        {userData.tokenBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href="/dashboard/profile"
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2.5",
                    "hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                  )}
                >
                  <LuUser className={clsx("w-4", "h-4")} />
                  <span className="text-sm">Profile</span>
                </a>

                <a
                  href="/dashboard/settings"
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2.5",
                    "hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                  )}
                >
                  <LuSettings className={clsx("w-4", "h-4")} />
                  <span className="text-sm">Settings</span>
                </a>

                <div className={clsx("border-t", "border-gray-800", "my-2")} />

                <button
                  onClick={() => {
                    /* Add logout logic */
                  }}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-2.5",
                    "hover:bg-red-900/20 transition-colors",
                    "text-red-400 hover:text-red-300"
                  )}
                >
                  <LuLogOut className={clsx("w-4", "h-4")} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
