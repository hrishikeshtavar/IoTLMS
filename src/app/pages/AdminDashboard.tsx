import { useState } from 'react';
import {
  BarChart3,
  Users,
  BookOpen,
  FileText,
  CreditCard,
  Palette,
  Megaphone,
  Settings,
  Download,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Upload,
  Plus,
  Bell,
  FileBarChart,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [enrollmentView, setEnrollmentView] = useState('Week');

  const metrics = [
    {
      icon: Users,
      label: 'Total Students',
      value: '342',
      trend: '+24',
      trendLabel: 'this month',
      color: '#1A73E8',
      isPositive: true,
    },
    {
      icon: BookOpen,
      label: 'Active Enrollments',
      value: '891',
      trend: '+67',
      trendLabel: 'this month',
      color: '#34A853',
      isPositive: true,
    },
    {
      icon: FileText,
      label: 'Course Completions',
      value: '156',
      trend: '+23',
      trendLabel: 'this month',
      color: '#FF6F00',
      isPositive: true,
    },
    {
      icon: CreditCard,
      label: 'Revenue',
      value: '₹45,600',
      trend: '+₹8,200',
      trendLabel: 'this month',
      color: '#9C27B0',
      isPositive: true,
    },
    {
      icon: BarChart3,
      label: 'Avg NPS Score',
      value: '48',
      trend: '+3',
      trendLabel: 'this month',
      color: '#00BCD4',
      isPositive: true,
    },
  ];

  const enrollmentData = [
    { week: 'W1', enrollments: 45, completions: 12 },
    { week: 'W2', enrollments: 52, completions: 18 },
    { week: 'W3', enrollments: 48, completions: 15 },
    { week: 'W4', enrollments: 61, completions: 22 },
    { week: 'W5', enrollments: 55, completions: 19 },
    { week: 'W6', enrollments: 68, completions: 25 },
    { week: 'W7', enrollments: 72, completions: 28 },
    { week: 'W8', enrollments: 78, completions: 31 },
  ];

  const coursePerformance = [
    { course: 'Arduino Fundamentals', completion: 92 },
    { course: 'Raspberry Pi Projects', completion: 87 },
    { course: 'ARM Architecture', completion: 81 },
    { course: 'IoT Protocols', completion: 78 },
    { course: 'RISC-V Basics', completion: 74 },
  ];

  const students = [
    {
      id: 1,
      name: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      batch: 'TE-A',
      courses: 3,
      progress: 67,
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      batch: 'SE-B',
      courses: 5,
      progress: 89,
      lastActive: '1 hour ago',
    },
    {
      id: 3,
      name: 'Rohan Desai',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      batch: 'BE-A',
      courses: 4,
      progress: 45,
      lastActive: '5 hours ago',
    },
    {
      id: 4,
      name: 'Ananya Singh',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      batch: 'TE-B',
      courses: 6,
      progress: 92,
      lastActive: '30 min ago',
    },
    {
      id: 5,
      name: 'Arjun Kumar',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      batch: 'SE-A',
      courses: 2,
      progress: 34,
      lastActive: '1 day ago',
    },
    {
      id: 6,
      name: 'Sneha Reddy',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100',
      batch: 'TE-A',
      courses: 4,
      progress: 78,
      lastActive: '3 hours ago',
    },
    {
      id: 7,
      name: 'Vikram Nair',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100',
      batch: 'BE-B',
      courses: 3,
      progress: 56,
      lastActive: '6 hours ago',
    },
    {
      id: 8,
      name: 'Diya Mehta',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
      batch: 'SE-B',
      courses: 5,
      progress: 81,
      lastActive: '2 hours ago',
    },
  ];

  const payments = [
    {
      id: 1,
      student: 'Aarav Sharma',
      amount: '₹2,500',
      method: 'UPI',
      date: 'Today',
    },
    {
      id: 2,
      student: 'Priya Patel',
      amount: '₹3,000',
      method: 'Online',
      date: 'Yesterday',
    },
    {
      id: 3,
      student: 'Rohan Desai',
      amount: '₹1,500',
      method: 'Cash',
      date: '2 days ago',
    },
    {
      id: 4,
      student: 'Ananya Singh',
      amount: '₹2,800',
      method: 'UPI',
      date: '3 days ago',
    },
  ];

  const topCourses = [
    { name: 'Arduino Fundamentals', enrollments: 234, progress: 92 },
    { name: 'Raspberry Pi Projects', enrollments: 189, progress: 87 },
    { name: 'ARM Architecture', enrollments: 167, progress: 81 },
    { name: 'IoT Communication', enrollments: 145, progress: 78 },
    { name: 'RISC-V Essentials', enrollments: 123, progress: 74 },
  ];

  const deviceData = [
    { name: 'Mobile', value: 62, color: '#1A73E8' },
    { name: 'Desktop', value: 31, color: '#34A853' },
    { name: 'Tablet', value: 7, color: '#FF6F00' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F4F7FF]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0F1626] text-white flex flex-col">
        {/* Logo & Brand */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white mb-1">IoTLearn</h2>
          <p className="text-sm text-[var(--color-primary)]">Admin Panel</p>
        </div>

        {/* School Info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
              DP
            </div>
            <div>
              <p className="text-sm font-medium">DY Patil Institute</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <NavItem icon={BarChart3} label="Dashboard" active />
          <NavItem icon={Users} label="Users" />
          <NavItem icon={BookOpen} label="Courses" />
          <NavItem icon={FileText} label="Assessments" />
          <NavItem icon={CreditCard} label="Payments" />
          <NavItem icon={Palette} label="Branding" />
          <NavItem icon={Megaphone} label="Announcements" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10">
          <Link to="/">
            <Button variant="ghost" size="small" className="w-full text-white hover:bg-white/10 mb-3">
              <ArrowLeft className="w-4 h-4" />
              Student View
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Last updated: 2 min ago
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-10 px-4 pr-8 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
              </select>
              <Button variant="primary" size="medium">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            {/* Enrollment Trend Chart */}
            <div className="col-span-3 bg-white rounded-[var(--radius-lg)] shadow-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Enrollment Trends</h3>
                <div className="flex gap-2">
                  {['Week', 'Month', 'Quarter'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setEnrollmentView(view)}
                      className={`px-3 py-1 text-sm rounded-[var(--radius-sm)] transition-colors ${
                        enrollmentView === view
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#1A73E8"
                    fill="#1A73E8"
                    fillOpacity={0.2}
                    name="Enrollments"
                  />
                  <Area
                    type="monotone"
                    dataKey="completions"
                    stroke="#34A853"
                    fill="#34A853"
                    fillOpacity={0.2}
                    name="Completions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Course Performance Chart */}
            <div className="col-span-2 bg-white rounded-[var(--radius-lg)] shadow-1 p-6">
              <h3 className="font-semibold mb-6">Course Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coursePerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" domain={[0, 100]} stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis type="category" dataKey="course" width={120} stroke="#6B7280" style={{ fontSize: '11px' }} />
                  <Tooltip />
                  <Bar dataKey="completion" fill="#1A73E8" radius={[0, 4, 4, 0]}>
                    {coursePerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Students & Quick Actions Row */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Students Table */}
            <div className="col-span-2 bg-white rounded-[var(--radius-lg)] shadow-1">
              <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                <h3 className="font-semibold">Recent Students</h3>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="small">
                    <Upload className="w-4 h-4" />
                    Import CSV
                  </Button>
                  <button className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-surface-alt)] sticky top-0">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase">
                        Student Name
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase">
                        Batch
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase">
                        Courses
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase">
                        Progress
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase">
                        Last Active
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-[var(--color-border)] hover:bg-[#EEF5FF] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                          {student.batch}
                        </td>
                        <td className="px-6 py-4 text-sm">{student.courses}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-[var(--color-surface-alt)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--color-primary)] rounded-full"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-[var(--color-text-secondary)] min-w-[3ch]">
                              {student.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                          {student.lastActive}
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-1 hover:bg-[var(--color-surface-alt)] rounded">
                            <MoreVertical className="w-4 h-4 text-[var(--color-text-secondary)]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Showing 1-8 of 342
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded border border-[var(--color-border)] text-sm hover:bg-[var(--color-surface-alt)]">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded bg-[var(--color-primary)] text-white text-sm">
                    1
                  </button>
                  <button className="px-3 py-1 rounded border border-[var(--color-border)] text-sm hover:bg-[var(--color-surface-alt)]">
                    2
                  </button>
                  <button className="px-3 py-1 rounded border border-[var(--color-border)] text-sm hover:bg-[var(--color-surface-alt)]">
                    3
                  </button>
                  <button className="px-3 py-1 rounded border border-[var(--color-border)] text-sm hover:bg-[var(--color-surface-alt)]">
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions & Payments */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-[var(--radius-lg)] shadow-1 p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" size="medium" className="w-full justify-start">
                    <Upload className="w-4 h-4" />
                    Import Students
                  </Button>
                  <Button variant="outline" size="medium" className="w-full justify-start">
                    <Plus className="w-4 h-4" />
                    Add Course
                  </Button>
                  <Button variant="outline" size="medium" className="w-full justify-start">
                    <Bell className="w-4 h-4" />
                    Send Announcement
                  </Button>
                  <Button variant="outline" size="medium" className="w-full justify-start">
                    <FileBarChart className="w-4 h-4" />
                    Generate Report
                  </Button>
                </div>
              </div>

              {/* Recent Payments */}
              <div className="bg-white rounded-[var(--radius-lg)] shadow-1 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Payments</h3>
                  <button className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{payment.student}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">{payment.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{payment.amount}</span>
                        <span
                          className={`px-2 py-0.5 rounded-[var(--radius-sm)] text-xs font-medium ${
                            payment.method === 'UPI'
                              ? 'bg-green-100 text-green-700'
                              : payment.method === 'Cash'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {payment.method}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Cards Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Lab Sessions Heatmap */}
            <div className="bg-white rounded-[var(--radius-lg)] shadow-1 p-6">
              <h3 className="font-semibold mb-4">Lab Sessions</h3>
              <div className="space-y-2">
                {[...Array(4)].map((_, weekIndex) => (
                  <div key={weekIndex} className="flex gap-1">
                    {[...Array(7)].map((_, dayIndex) => {
                      const intensity = Math.random();
                      let bgColor = '#F3F4F6';
                      if (intensity > 0.7) bgColor = '#1A73E8';
                      else if (intensity > 0.4) bgColor = '#93C5FD';
                      else if (intensity > 0.2) bgColor = '#DBEAFE';

                      return (
                        <div
                          key={dayIndex}
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: bgColor }}
                          title={`Week ${weekIndex + 1}, Day ${dayIndex + 1}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-[var(--color-text-secondary)]">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-[#F3F4F6]" />
                  <div className="w-3 h-3 rounded bg-[#DBEAFE]" />
                  <div className="w-3 h-3 rounded bg-[#93C5FD]" />
                  <div className="w-3 h-3 rounded bg-[#1A73E8]" />
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Top Courses */}
            <div className="bg-white rounded-[var(--radius-lg)] shadow-1 p-6">
              <h3 className="font-semibold mb-4">Top Courses</h3>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{course.name}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {course.enrollments} students
                      </p>
                    </div>
                    <div className="w-16 h-2 bg-[var(--color-surface-alt)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-success)] rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Usage */}
            <div className="bg-white rounded-[var(--radius-lg)] shadow-1 p-6">
              <h3 className="font-semibold mb-4">Device Usage</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {deviceData.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: device.color }}
                      />
                      <span className="text-sm">{device.name}</span>
                    </div>
                    <span className="text-sm font-medium">{device.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: any) {
  const isLink = label === 'Branding';
  const content = (
    <>
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
      )}
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </>
  );

  if (isLink) {
    return (
      <Link
        to="/wizard"
        className={`w-full h-12 px-6 flex items-center gap-3 text-sm transition-colors relative ${
          active
            ? 'bg-white/10 text-white'
            : 'text-white/70 hover:bg-white/5 hover:text-white'
        }`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={`w-full h-12 px-6 flex items-center gap-3 text-sm transition-colors relative ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      }`}
    >
      {content}
    </button>
  );
}

function MetricCard({ icon: Icon, label, value, trend, trendLabel, color, isPositive }: any) {
  return (
    <div className="bg-white rounded-[var(--radius-lg)] shadow-1 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div
          className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
        ) : (
          <TrendingDown className="w-4 h-4 text-[var(--color-error)]" />
        )}
        <span
          className={`text-sm font-medium ${
            isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
          }`}
        >
          {trend}
        </span>
        <span className="text-sm text-[var(--color-text-secondary)]">{trendLabel}</span>
      </div>
    </div>
  );
}