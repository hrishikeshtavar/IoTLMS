'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/auth';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  language_pref: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  last_login?: string;
};

type Enrollment = {
  course_id: string;
  progress_pct: number;
  completed_at: string | null;
  course: { title_en: string; category: string };
};

const LANG_FLAGS: Record<string, string> = { en: '🇬🇧', hi: '🇮🇳', mr: '🟠' };
const CATEGORY_COLORS: Record<string, string> = {
  Arduino: '#00C896', 'Raspberry Pi': '#A855F7', ARM: '#1A73E8',
  'RISC-V': '#FF6B35', ESP32: '#FFD93D', IoT: '#1A73E8', General: '#718096',
};

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  // Deterministic color from name
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  const colors = ['#FF6B35', '#1A73E8', '#A855F7', '#00C896', '#FFD93D', '#ff4d6d', '#06d6a0'];
  const bg = colors[hash % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: `${size * 0.38}px`, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function StudentDrawer({ userId, name, onClose }: { userId: string; name: string; onClose: () => void }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    apiFetch(`/api/enrollments/user/${userId}`)
      .then(r => r.json())
      .then(data => { setEnrollments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId]);

  const completed = enrollments.filter(e => e.completed_at).length;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--card)', width: 'min(420px, 100vw)', height: '100%', borderLeft: '1.5px solid var(--border)', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)', animation: 'slideInRight 0.25s cubic-bezier(0.34,1.56,0.64,1)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Avatar name={name} size={52} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>{name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: '0.15rem' }}>
              {enrollments.length} enrolled · {completed} completed
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text3)' }}>✕</button>
        </div>

        {/* Progress summary */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Enrolled', value: enrollments.length, emoji: '📚', color: '#1A73E8' },
            { label: 'Completed', value: completed, emoji: '✅', color: '#00C896' },
            { label: 'Avg Progress', value: `${enrollments.length > 0 ? Math.round(enrollments.reduce((s, e) => s + e.progress_pct, 0) / enrollments.length) : 0}%`, emoji: '📈', color: '#FF6B35' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg)', borderRadius: '0.75rem', padding: '0.875rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{s.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text3)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Course progress list */}
        <div style={{ padding: '1rem 1.5rem', flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Course Progress</div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
              <div style={{ fontSize: '1.5rem', display: 'inline-block', animation: 'spin 1s linear infinite' }}>⚙️</div>
            </div>
          ) : enrollments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)', fontSize: '0.85rem' }}>
              No enrollments yet
            </div>
          ) : enrollments.map(e => {
            const pct = Math.round(e.progress_pct);
            const cat = e.course.category || 'General';
            const color = CATEGORY_COLORS[cat] || '#718096';
            return (
              <div key={e.course_id} style={{ marginBottom: '1rem', padding: '0.875rem', background: 'var(--bg)', borderRadius: '0.875rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{e.course.title_en}</div>
                    <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: color + '22', color, fontWeight: 700 }}>{cat}</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: e.completed_at ? 'var(--accent)' : 'var(--primary)' }}>{pct}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: e.completed_at ? '#00C896' : color, width: `${pct}%`, borderRadius: '3px', transition: 'width 0.5s' }} />
                </div>
                {e.completed_at && (
                  <div style={{ fontSize: '0.65rem', color: 'var(--accent)', marginTop: '0.35rem', fontWeight: 600 }}>
                    ✅ Completed {new Date(e.completed_at).toLocaleDateString('en-IN')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users,    setUsers]    = useState<User[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState<'all' | 'active' | 'verified'>('all');
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    apiFetch('/api/users')
      .then(r => r.json())
      .then(data => {
        const students = Array.isArray(data) ? data.filter((u: User) => u.role === 'student') : [];
        setUsers(students);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'active' ? u.is_active : u.email_verified;
    return matchSearch && matchFilter;
  });

  const activeCount   = users.filter(u => u.is_active).length;
  const verifiedCount = users.filter(u => u.email_verified).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>⚡ IoTLearn</Link>
          <Link href="/admin" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>← Admin Panel</Link>
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text3)' }}>
          {users.length} students total
        </span>
      </nav>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, var(--text) 0%, #2d2d4e 100%)', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        {['👨‍🎓','👩‍💻','🎓','📊','🏆'].map((em, i) => (
          <div key={i} className="animate-float" style={{ position: 'absolute', fontSize: '1.8rem', opacity: 0.07, left: `${i * 22 + 4}%`, top: `${(i * 19) % 60 + 10}%`, animationDelay: `${i * 0.5}s` }}>{em}</div>
        ))}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
          <h1 className="animate-fadeUp" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            👨‍🎓 Students
          </h1>
          <p className="animate-fadeUp delay-100" style={{ color: '#aaa', fontSize: '0.95rem' }}>
            Manage students, track progress, and view enrollments
          </p>

          {/* Stats */}
          <div className="animate-fadeUp delay-200" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Total Students', value: users.length, emoji: '👥', color: '#1A73E8' },
              { label: 'Active',          value: activeCount,  emoji: '✅', color: '#00C896' },
              { label: 'Email Verified',  value: verifiedCount, emoji: '📧', color: '#A855F7' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', borderRadius: '1rem', padding: '0.875rem 1.25rem', border: '1px solid rgba(255,255,255,0.1)', minWidth: '140px' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{s.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: '1.4rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 600, marginTop: '0.15rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Search + filters */}
        <div className="animate-fadeUp" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', borderRadius: '999px', border: '1.5px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontSize: '0.9rem', fontFamily: "'Baloo 2'", outline: 'none' }}
              onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['all', 'active', 'verified'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '0.5rem 1rem', borderRadius: '999px', border: '1.5px solid', borderColor: filter === f ? 'var(--primary)' : 'var(--border)', background: filter === f ? 'var(--primary)' : 'transparent', color: filter === f ? '#fff' : 'var(--text3)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Baloo 2'", transition: 'all 0.2s', textTransform: 'capitalize' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="animate-fadeUp delay-100" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 80px', padding: '0.75rem 1.5rem', background: 'var(--bg)', borderBottom: '1px solid var(--border)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <div>Student</div>
            <div>Email</div>
            <div>Language</div>
            <div>Status</div>
            <div>Joined</div>
            <div></div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)' }}>
              <div className="animate-spin" style={{ fontSize: '2rem', display: 'inline-block', marginBottom: '1rem' }}>⚙️</div>
              <div>Loading students...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <div>No students found</div>
            </div>
          ) : filtered.map((user, i) => (
            <div key={user.id}
              style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 80px', padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--border)', alignItems: 'center', transition: 'background 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              onClick={() => setSelected(user)}>
              {/* Name + avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Avatar name={user.name} size={36} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '0.05rem' }}>
                    {user.role}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ fontSize: '0.82rem', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email || '—'}
              </div>

              {/* Language */}
              <div style={{ fontSize: '0.85rem' }}>
                {LANG_FLAGS[user.language_pref] || '🌐'} {user.language_pref?.toUpperCase()}
              </div>

              {/* Status badges */}
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '999px', fontWeight: 700, background: user.is_active ? 'rgba(0,200,150,0.15)' : 'rgba(113,128,150,0.15)', color: user.is_active ? '#00C896' : '#718096' }}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
                {user.email_verified && (
                  <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '999px', fontWeight: 700, background: 'rgba(26,115,232,0.15)', color: '#1A73E8' }}>
                    ✓ Verified
                  </span>
                )}
              </div>

              {/* Joined date */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
                {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>

              {/* View button */}
              <div>
                <button
                  style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Baloo 2'", transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,53,0.08)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  View →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state nudge */}
        {!loading && users.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '2rem', padding: '3rem', background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px dashed var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>No students yet</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text3)' }}>Run the demo seed to populate students for your demo.</div>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selected && <StudentDrawer userId={selected.id} name={selected.name} onClose={() => setSelected(null)} />}
    </div>
  );
}
