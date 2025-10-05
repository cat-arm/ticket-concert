"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";

interface Reservation {
  id: string;
  sessionId: string;
  concertId: string;
  status: "RESERVED" | "CANCELLED";
  createdAt: string;
  concert: {
    id: string;
    name: string;
  };
}

export default function AdminHistory() {
  const router = useRouter();
  const [userType, setUserType] = useState<"admin" | "user">("admin");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:3001/reservations");
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        setNotification({ message: "Failed to fetch reservations", type: "error" });
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setNotification({ message: "Error fetching reservations", type: "error" });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchReservations();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSwitchUserType = () => {
    router.push("/");
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <Layout userType={userType} title="Reservation History" onSwitchUserType={handleSwitchUserType} onNotificationClose={handleNotificationClose}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType={userType} title="Reservation History" onSwitchUserType={handleSwitchUserType} notification={notification || undefined} onNotificationClose={handleNotificationClose}>
      <div className="mb-6">
        <Link href="/landing" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          ← Back to Landing Page
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date time</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concert name</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No reservations found
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(reservation.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.sessionId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.concert?.name || "Unknown Concert"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${reservation.status === "RESERVED" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{reservation.status === "RESERVED" ? "Reserve" : "Cancel"}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
