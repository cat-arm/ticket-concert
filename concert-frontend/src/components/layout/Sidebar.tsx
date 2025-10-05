"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  userType: "admin" | "user";
  onSwitchUserType: () => void;
}

export default function Sidebar({ userType, onSwitchUserType }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminMenuItems = [
    { name: "Home", href: "/admin", icon: "🏠" },
    { name: "History", href: "/admin/history", icon: "📋" },
  ];

  const userMenuItems = [{ name: "Concerts", href: "/", icon: "🎵" }];

  const menuItems = userType === "admin" ? adminMenuItems : userMenuItems;

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} hidden md:block`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h1 className="text-2xl font-bold text-gray-800">{userType === "admin" ? "Admin" : "User"}</h1>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      <nav className="px-4 pb-4">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${pathname === item.href ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}>
            <span className="text-xl mr-3">{item.icon}</span>
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}

        <div className="border-t pt-4 mt-4">
          <button onClick={onSwitchUserType} className={`flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 ${isCollapsed ? "justify-center" : ""}`}>
            <span className="text-xl mr-3">🔄</span>
            {!isCollapsed && <span>{userType === "admin" ? "Switch to User" : "Switch to Admin"}</span>}
          </button>

          <button className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 ${isCollapsed ? "justify-center" : ""}`}>
            <span className="text-xl mr-3">🚪</span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
}
