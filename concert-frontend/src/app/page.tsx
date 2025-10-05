"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import ConcertCard from "@/components/dashboard/ConcertCard";

interface Concert {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  createdAt: string;
}

interface Reservation {
  id: string;
  concertId: string;
  status: "RESERVED" | "CANCELLED";
}

export default function UserDashboard() {
  const router = useRouter();
  const [userType, setUserType] = useState<"admin" | "user">("user");
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Mock user ID - in real app this would come from authentication
  const userId = "user-123";

  const fetchConcerts = async () => {
    try {
      const response = await fetch("http://localhost:3001/admin/concerts");
      if (response.ok) {
        const data = await response.json();
        setConcerts(data);
      }
    } catch (error) {
      console.error("Error fetching concerts:", error);
      setNotification({ message: "Error fetching concerts", type: "error" });
    }
  };

  const fetchUserReservations = async () => {
    try {
      // In real app, this would be a specific endpoint for user's reservations
      const response = await fetch("http://localhost:3001/reservations");
      if (response.ok) {
        const data = await response.json();
        // Filter reservations for current user
        const userReservations = data.filter((res: { sessionId: string }) => res.sessionId === userId);
        setReservations(userReservations);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleReserve = async (concertId: string) => {
    try {
      const response = await fetch("http://localhost:3001/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: userId, // Use userId as sessionId for now
          concertId,
          status: "RESERVED",
        }),
      });

      if (response.ok) {
        setNotification({ message: "Reservation successful!", type: "success" });
        fetchUserReservations();
      } else {
        const error = await response.json();
        setNotification({
          message: error.message || "Failed to reserve ticket",
          type: "error",
        });
      }
    } catch {
      setNotification({ message: "Error making reservation", type: "error" });
    }
  };

  const handleCancel = async (concertId: string) => {
    try {
      const response = await fetch("http://localhost:3001/reservations/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: userId, // Use userId as sessionId for now
          concertId,
        }),
      });

      if (response.ok) {
        setNotification({ message: "Reservation cancelled!", type: "success" });
        fetchUserReservations();
      } else {
        const error = await response.json();
        setNotification({
          message: error.message || "Failed to cancel reservation",
          type: "error",
        });
      }
    } catch {
      setNotification({ message: "Error cancelling reservation", type: "error" });
    }
  };

  const isConcertReserved = (concertId: string) => {
    return reservations.some((reservation) => reservation.concertId === concertId && reservation.status === "RESERVED");
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchConcerts(), fetchUserReservations()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSwitchUserType = () => {
    router.push("/admin");
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  if (loading) {
    return (
      <Layout userType={userType} title="Concert Tickets" onSwitchUserType={handleSwitchUserType} onNotificationClose={handleNotificationClose}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType={userType} title="Concert Tickets" onSwitchUserType={handleSwitchUserType} notification={notification || undefined} onNotificationClose={handleNotificationClose}>
      <div className="mb-6">
        <Link href="/landing" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          ← Back to Landing Page
        </Link>
      </div>
      <div className="space-y-6">{concerts.length === 0 ? <div className="text-center py-12 text-gray-500">No concerts available at the moment.</div> : concerts.map((concert) => <ConcertCard key={concert.id} concert={concert} onReserve={handleReserve} onCancel={handleCancel} userType="user" isReserved={isConcertReserved(concert.id)} />)}</div>
    </Layout>
  );
}
