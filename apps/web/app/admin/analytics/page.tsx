'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const enrollmentData = [
  { month: 'Oct', enrollments: 4 },
  { month: 'Nov', enrollments: 8 },
  { month: 'Dec', enrollments: 6 },
  { month: 'Jan', enrollments: 12 },
  { month: 'Feb', enrollments: 18 },
  { month: 'Mar', enrollments: 24 },
];

const completionData = [
  { course: 'Arduino', enrolled: 24, completed: 18 },
  { course: 'ARM', enrolled: 16, completed: 10 },
  { course: 'IoT', enrolled: 20, completed: 14 },
  { course: 'RISC-V', enrolled: 8, completed: 4 },
];

const languageData = [
  { name: 'English', value: 45, color: '#2563eb' },
  { name: 'Hindi', value: 35, color: '#f97316' },
  { name: 'Marathi', value: 20, color: '#16a34a' },
];

const quizData = [
  { lesson: 'L1', avgScore: 82 },
  { lesson: 'L2', avgScore: 74 },
  { lesson: 'L3', avgScore: 91 },
  { lesson: 'L4', avgScore: 68 },
  { lesson: 'L5', avgScore: 85 },
];

const deviceData = [
  { name: 'Mobile', value: 62, color: '#8b5cf6' },
  { name: 'Desktop', value: 28, color: '#2563eb' },
  { name: 'Tablet', value: 10, color: '#06b6d4' },
];

export default function AnalyticsPage() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/courses')
      .then(r => r.json())
      .then(setCourses)
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-blue-600 text-sm hover:underline">← Admin</Link>
        <h1 className="text-lg font-bold text-blue-600">Analytics</h1>
        <span className="text-xs text-gray-500">Last 6 months</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Students', value: '84', change: '+12%', color: 'text-blue-600' },
            { label: 'Enrollments', value: '124', change: '+24%', color: 'text-green-600' },
            { label: 'Completion Rate', value: '72%', change: '+5%', color: 'text-purple-600' },
            { label: 'Avg Quiz Score', value: '80%', change: '+3%', color: 'text-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border p-4">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              <div className="text-xs text-green-600 mt-1 font-medium">{stat.change} this month</div>
            </div>
          ))}
        </div>

        {/* Enrollment Trend */}
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-6">Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="enrollments"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: '#2563eb', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Course Completion + Quiz Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Course Completion</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="course" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="enrolled" fill="#bfdbfe" name="Enrolled" radius={[4,4,0,0]} />
                <Bar dataKey="completed" fill="#2563eb" name="Completed" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Avg Quiz Score by Lesson</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={quizData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="lesson" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="avgScore" name="Avg Score" radius={[4,4,0,0]}>
                  {quizData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.avgScore >= 80 ? '#16a34a' : entry.avgScore >= 70 ? '#f97316' : '#dc2626'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language + Device Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Language Preference</h3>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={languageData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {languageData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {languageData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold text-gray-800 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Device Usage</h3>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {deviceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {deviceData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold text-gray-800 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Table */}
        <div className="bg-white rounded-xl border">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-800">Course Performance</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Lessons</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-800">{c.title_en}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{c.category}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{c.lessons?.length ?? 0}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
