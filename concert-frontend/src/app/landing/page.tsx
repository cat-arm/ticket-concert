"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🎵 ConcertHub</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                User Portal
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                Admin Portal
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Welcome to ConcertHub</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">Your premier destination for concert ticket reservations. Discover amazing concerts, reserve your seats, and enjoy unforgettable musical experiences.</p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Reserve your concert tickets with just a few clicks. Simple, fast, and secure booking process.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Amazing Concerts</h3>
              <p className="text-gray-600">Discover a wide variety of concerts from different genres. From classical to rock, we have it all.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Access our platform from any device. Responsive design ensures great experience everywhere.</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              Browse Concerts
            </Link>
            <Link href="/admin" className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              Admin Dashboard
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 ConcertHub. Built with Next.js and NestJS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
