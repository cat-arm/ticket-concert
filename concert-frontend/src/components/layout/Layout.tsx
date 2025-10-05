"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  userType: "admin" | "user";
  title: string;
  onSwitchUserType: () => void;
  notification?: {
    message: string;
    type: "success" | "error" | "info";
  };
  onNotificationClose: () => void;
}

export default function Layout({ children, userType, title, onSwitchUserType, notification, onNotificationClose }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType={userType} onSwitchUserType={onSwitchUserType} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader userType={userType} onSwitchUserType={onSwitchUserType} />
        <Header title={title} notification={notification} onNotificationClose={onNotificationClose} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
