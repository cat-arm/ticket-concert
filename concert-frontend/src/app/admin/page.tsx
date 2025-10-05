"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import StatsCard from "@/components/dashboard/StatsCard";
import ConcertCard from "@/components/dashboard/ConcertCard";
import Tabs from "@/components/dashboard/Tabs";
import CreateConcertForm from "@/components/admin/CreateConcertForm";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";

interface Concert {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  createdAt: string;
}

interface Stats {
  totalSeats: number;
  reserve: number;
  cancel: number;
}

interface Notification {
  message: string;
  type: "success" | "error" | "info";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [userType, setUserType] = useState<"admin" | "user">("admin");
  const [activeTab, setActiveTab] = useState("overview");
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSeats: 0, reserve: 0, cancel: 0 });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    concertId: string | null;
    concertName: string;
  }>({
    isOpen: false,
    concertId: null,
    concertName: "",
  });

  const tabs = [
    { id: "overview", label: "Overview", active: activeTab === "overview" },
    { id: "create", label: "Create", active: activeTab === "create" },
  ];

  const fetchConcerts = async () => {
    try {
      const response = await fetch("http://localhost:3001/admin/concerts");
      if (response.ok) {
        const data = await response.json();
        setConcerts(data);
      }
    } catch (error) {
      console.error("Error fetching concerts:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:3001/admin/concerts/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDeleteConcert = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      concertId: id,
      concertName: name,
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.concertId) return;

    try {
      const response = await fetch(`http://localhost:3001/admin/concerts/${deleteDialog.concertId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotification({ message: "Delete successfully", type: "success" });
        await Promise.all([fetchConcerts(), fetchStats()]);
      } else {
        const errorData = await response.json();
        setNotification({
          message: errorData.message || "Failed to delete concert",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setNotification({ message: "Error deleting concert", type: "error" });
    } finally {
      setDeleteDialog({ isOpen: false, concertId: null, concertName: "" });
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, concertId: null, concertName: "" });
  };

  const handleCreateConcert = async (concertData: { name: string; description: string; totalSeats: number }) => {
    try {
      const response = await fetch("http://localhost:3001/admin/concerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(concertData),
      });

      if (response.ok) {
        setNotification({ message: "Create successfully", type: "success" });
        setActiveTab("overview");
        await Promise.all([fetchConcerts(), fetchStats()]);
      } else {
        const error = await response.json();
        setNotification({ message: error.message || "Failed to create concert", type: "error" });
        throw new Error(error.message || "Failed to create concert");
      }
    } catch (error) {
      setNotification({ message: "Error creating concert", type: "error" });
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchConcerts(), fetchStats()]);
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

  if (loading) {
    return (
      <Layout userType={userType} title="Admin Dashboard" onSwitchUserType={handleSwitchUserType} onNotificationClose={handleNotificationClose}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType={userType} title="Admin Dashboard" onSwitchUserType={handleSwitchUserType} notification={notification || undefined} onNotificationClose={handleNotificationClose}>
      <div className="mb-6">
        <Link href="/landing" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          ← Back to Landing Page
        </Link>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatsCard title="Total of seats" value={stats.totalSeats} icon="👥" color="blue" />
        <StatsCard title="Reserve" value={stats.reserve} icon="🎫" color="green" />
        <StatsCard title="Cancel" value={stats.cancel} icon="❌" color="red" />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} onTabChange={setActiveTab} />

      {/* Content */}
      {activeTab === "overview" ? <div>{concerts.length === 0 ? <div className="text-center py-12 text-gray-500">No concerts found. Create your first concert!</div> : concerts.map((concert) => <ConcertCard key={concert.id} concert={concert} onDelete={(id) => handleDeleteConcert(id, concert.name)} userType="admin" />)}</div> : <CreateConcertForm onSubmit={handleCreateConcert} />}

      {/* Confirmation Dialog */}
      <ConfirmationDialog isOpen={deleteDialog.isOpen} title="Delete Concert" message={`Are you sure you want to delete "${deleteDialog.concertName}"? This action cannot be undone and will also delete all related reservations.`} onConfirm={confirmDelete} onCancel={cancelDelete} confirmText="Delete" cancelText="Cancel" isDestructive={true} />
    </Layout>
  );
}
