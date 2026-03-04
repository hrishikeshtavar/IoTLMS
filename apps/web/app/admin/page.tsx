'use client';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-blue-600 text-sm hover:underline">
          ← Home
        </Link>
        <h1 className="text-lg font-bold text-blue-600">Admin Dashboard</h1>
        <span className="text-sm text-gray-500">Quick Access</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/import"
              className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">📥</div>
              <div className="font-medium text-gray-800">Import Students</div>
              <div className="text-sm text-gray-500 mt-1">Upload CSV data</div>
            </Link>

            <Link
              href="/admin/payments"
              className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">💳</div>
              <div className="font-medium text-gray-800">Payments</div>
              <div className="text-sm text-gray-500 mt-1">Record cash & UPI</div>
            </Link>

            <Link
              href="/courses"
              className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">📚</div>
              <div className="font-medium text-gray-800">Courses</div>
              <div className="text-sm text-gray-500 mt-1">View all courses</div>
            </Link>

            <Link
              href="/admin/analytics"
              className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">📊</div>
              <div className="font-medium text-gray-800">Analytics</div>
              <div className="text-sm text-gray-500 mt-1">Charts & insights</div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
