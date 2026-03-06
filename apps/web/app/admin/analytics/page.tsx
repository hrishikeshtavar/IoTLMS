'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#9333ea'];

type Stats = {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  completionRate: number;
  totalRevenue: number;
  passRate: number;
  enrollmentTrend: { month: string; enrollments: number }[];
  coursePerformance: { title: string; enrolled: number; completed: number }[];
  paymentMethods: { name: string; value: number }[];
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/analytics/dashboard')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading analytics...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-blue-600 text-sm hover:underline">← Admin Panel</Link>
        <h1 className="text-lg font-bold text-blue-600">Analytics Dashboard</h1>
        <span className="text-xs text-gray-400">Live from DB</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Students', value: stats?.totalStudents ?? 0, color: 'text-blue-600' },
            { label: 'Courses', value: stats?.totalCourses ?? 0, color: 'text-green-600' },
            { label: 'Enrollments', value: stats?.totalEnrollments ?? 0, color: 'text-purple-600' },
            { label: 'Completion %', value: `${stats?.completionRate ?? 0}%`, color: 'text-orange-600' },
            { label: 'Quiz Pass %', value: `${stats?.passRate ?? 0}%`, color: 'text-pink-600' },
            { label: 'Revenue ₹', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`, color: 'text-emerald-600' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl border p-4 text-center">
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Enrollment Trend */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Enrollment Trend</h2>
          {stats?.enrollmentTrend && stats.enrollmentTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-400">No enrollment data yet</div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Performance */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Course Performance</h2>
            {stats?.coursePerformance && stats.coursePerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.coursePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrolled" fill="#2563eb" name="Enrolled" />
                  <Bar dataKey="completed" fill="#16a34a" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-400">No course data yet</div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Payment Methods</h2>
            {stats?.paymentMethods && stats.paymentMethods.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={stats.paymentMethods} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {stats.paymentMethods.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-400">No payment data yet</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
