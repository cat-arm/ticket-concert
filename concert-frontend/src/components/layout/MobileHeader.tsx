"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileHeaderProps {
  userType: "admin" | "user";
  onSwitchUserType: () => void;
}

export default function MobileHeader({ userType, onSwitchUserType }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const adminMenuItems = [
    { name: "Home", href: "/admin", icon: "🏠" },
    { name: "History", href: "/admin/history", icon: "📋" },
  ];

  const userMenuItems = [{ name: "Concerts", href: "/", icon: "🎵" }];

  const menuItems = userType === "admin" ? adminMenuItems : userMenuItems;

  return (
    <div className="md:hidden bg-white shadow-lg">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-gray-800">{userType === "admin" ? "Admin" : "User"}</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t bg-white">
          <nav className="px-4 py-2">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${pathname === item.href ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}>
                <span className="text-xl mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="border-t pt-4 mt-4">
              <button
                onClick={() => {
                  onSwitchUserType();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
              >
                <span className="text-xl mr-3">🔄</span>
                <span>{userType === "admin" ? "Switch to User" : "Switch to Admin"}</span>
              </button>

              <button onClick={() => setIsMenuOpen(false)} className="flex items-center w-full px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50">
                <span className="text-xl mr-3">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
