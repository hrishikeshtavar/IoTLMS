'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/auth';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#FF6B35', '#00C896', '#1A73E8', '#A855F7', '#FFD93D'];

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

const STAT_CARDS = [
  { key: 'totalStudents',   label: 'Students',      emoji: '👨‍🎓', color: '#1A73E8' },
  { key: 'totalCourses',    label: 'Courses',        emoji: '📚', color: '#A855F7' },
  { key: 'totalEnrollments',label: 'Enrollments',    emoji: '✅', color: '#00C896' },
  { key: 'completionRate',  label: 'Completion',     emoji: '🏁', color: '#FF6B35', pct: true },
  { key: 'passRate',        label: 'Quiz Pass Rate', emoji: '🎯', color: '#FFD93D' , pct: true },
  { key: 'totalRevenue',    label: 'Revenue',        emoji: '💰', color: '#00C896', rupee: true },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/analytics/dashboard')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>⚡ IoTLearn</Link>
          <Link href="/admin" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>← Admin Panel</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C896', display: 'inline-block', animation: 'float 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}>Live from DB</span>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, var(--text) 0%, #2d2d4e 100%)', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        {['📊','📈','💡','🎯','📉'].map((em, i) => (
          <div key={i} className="animate-float" style={{ position: 'absolute', fontSize: '1.8rem', opacity: 0.07, left: `${i * 22 + 4}%`, top: `${(i * 19) % 60 + 10}%`, animationDelay: `${i * 0.6}s` }}>{em}</div>
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="animate-fadeUp" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            📊 Analytics Dashboard
          </h1>
          <p className="animate-fadeUp delay-100" style={{ color: '#aaa', fontSize: '0.95rem' }}>
            Real-time data from your IoTLearn database
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text3)' }}>
            <div className="animate-spin" style={{ fontSize: '3rem', display: 'inline-block', marginBottom: '1rem' }}>⚙️</div>
            <div style={{ fontSize: '1rem' }}>Loading analytics...</div>
          </div>
        ) : (
          <>
            {/* STAT CARDS */}
            <div className="animate-fadeUp" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {STAT_CARDS.map((card, i) => {
                const raw = stats?.[card.key as keyof Stats] ?? 0;
                const display = card.rupee
                  ? `₹${Number(raw).toLocaleString('en-IN')}`
                  : card.pct
                  ? `${raw}%`
                  : Number(raw).toLocaleString('en-IN');
                return (
                  <div key={card.key} className={`card-hover animate-popIn delay-${Math.min((i + 1) * 100, 500)}`}
                    style={{ background: 'var(--card)', borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center', border: '1.5px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{card.emoji}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: card.color }}>{display}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.25rem', fontWeight: 600 }}>{card.label}</div>
                    <div style={{ height: '3px', width: '40%', background: card.color, borderRadius: '2px', margin: '0.5rem auto 0', opacity: 0.5 }} />
                  </div>
                );
              })}
            </div>

            {/* ENROLLMENT TREND */}
            <div className="animate-fadeUp delay-200" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.75rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📈 Enrollment Trend
              </h2>
              {stats?.enrollmentTrend && stats.enrollmentTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={stats.enrollmentTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" />
                    <XAxis dataKey="month" tick={{ fill: '#718096', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#718096', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid var(--border)', fontFamily: "'Baloo 2'" }} />
                    <Line type="monotone" dataKey="enrollments" stroke="#FF6B35" strokeWidth={3} dot={{ r: 5, fill: '#FF6B35' }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>📭 No enrollment data yet</div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {/* COURSE PERFORMANCE */}
              <div className="animate-fadeUp delay-300" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>
                  🏫 Course Performance
                </h2>
                {stats?.coursePerformance && stats.coursePerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats.coursePerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" />
                      <XAxis dataKey="title" tick={{ fill: '#718096', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#718096', fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid var(--border)', fontFamily: "'Baloo 2'" }} />
                      <Legend />
                      <Bar dataKey="enrolled" fill="#1A73E8" name="Enrolled" radius={[4,4,0,0]} />
                      <Bar dataKey="completed" fill="#00C896" name="Completed" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>📭 No course data yet</div>
                )}
              </div>

              {/* PAYMENT METHODS */}
              <div className="animate-fadeUp delay-400" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>
                  💳 Payment Methods
                </h2>
                {stats?.paymentMethods && stats.paymentMethods.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={stats.paymentMethods} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {stats.paymentMethods.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid var(--border)', fontFamily: "'Baloo 2'" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>📭 No payment data yet</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
