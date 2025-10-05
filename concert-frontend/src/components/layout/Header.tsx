"use client";

import { useEffect } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

function Notification({ message, type, onClose }: NotificationProps) {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const icon = {
    success: "✓",
    error: "✗",
    info: "ℹ",
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-64`}>
      <span className="text-lg">{icon[type]}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
        ✕
      </button>
    </div>
  );
}

interface HeaderProps {
  title: string;
  notification?: {
    message: string;
    type: "success" | "error" | "info";
  };
  onNotificationClose: () => void;
}

export default function Header({ title, notification, onNotificationClose }: HeaderProps) {
  return (
    <>
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </header>

      {notification && <Notification message={notification.message} type={notification.type} onClose={onNotificationClose} />}
    </>
  );
}
