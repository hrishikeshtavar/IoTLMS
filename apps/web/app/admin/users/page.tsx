'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch, getUser, logout } from '../../../app/lib/auth';

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  language_pref: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  last_login?: string;
  last_active?: string;
  class_grade?: number;
  division?: string;
};

type Enrollment = {
  course_id: string;
  progress_pct: number;
  completed_at: string | null;
  course: { title_en: string; category: string };
};

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  const colors = ['#1A73E8', '#1A73E8', '#A855F7', '#00C896', '#00C896', '#ff4d6d', '#06d6a0'];
  const bg = colors[hash % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: `${size * 0.38}px`, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

// ── Edit Modal ──────────────────────────────────────────────
function EditModal({ user, onClose, onSaved }: { user: User; onClose: () => void; onSaved: (u: User) => void }) {
  const [tab, setTab] = useState<'info' | 'password'>('info');
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    language_pref: user.language_pref || 'en',
    class_grade: user.class_grade?.toString() || '',
    division: user.division || '',
  });
  const [pw, setPw] = useState({ next: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  async function saveInfo() {
    setSaving(true); setErr(''); setMsg('');
    const payload: any = { name: form.name, email: form.email, phone: form.phone, language_pref: form.language_pref, division: form.division };
    if (form.class_grade) payload.class_grade = parseInt(form.class_grade);
    const res = await apiFetch(`/api/users/${user.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) { setMsg('Saved!'); onSaved({ ...user, ...payload }); }
    else setErr('Failed to save.');
  }

  async function savePassword() {
    if (pw.next !== pw.confirm) { setErr('Passwords do not match.'); return; }
    if (pw.next.length < 8) { setErr('Min. 8 characters.'); return; }
    setSaving(true); setErr(''); setMsg('');
    const res = await apiFetch(`/api/users/${user.id}/password`, { method: 'PATCH', body: JSON.stringify({ password: pw.next }) });
    setSaving(false);
    if (res.ok) { setMsg('Password changed!'); setPw({ next: '', confirm: '' }); }
    else setErr('Failed to change password.');
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1A73E8,#00C896)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Avatar name={user.name} size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{user.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>{user.email}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          {(['info', 'password'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setMsg(''); setErr(''); }}
              style={{ flex: 1, padding: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', background: tab === t ? '#EFF6FF' : '#fff', color: tab === t ? '#1A73E8' : '#6b7280', borderBottom: tab === t ? '2px solid #1A73E8' : '2px solid transparent' }}>
              {t === 'info' ? '👤 Info' : '🔒 Password'}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem' }}>
          {msg && <div style={{ background: '#DCFCE7', color: '#15803D', padding: '0.6rem 1rem', borderRadius: 8, marginBottom: 12, fontWeight: 600, fontSize: '0.875rem' }}>✅ {msg}</div>}
          {err && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.6rem 1rem', borderRadius: 8, marginBottom: 12, fontWeight: 600, fontSize: '0.875rem' }}>❌ {err}</div>}

          {tab === 'info' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { label: 'Full Name', key: 'name', placeholder: 'Student name' },
                { label: 'Email', key: 'email', placeholder: 'student@school.edu' },
                { label: 'Phone', key: 'phone', placeholder: '+91 9876543210' },
                { label: 'Division', key: 'division', placeholder: 'A, B, C...' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                  <input value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.65rem 0.875rem', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Class</label>
                  <select value={form.class_grade} onChange={e => setForm({ ...form, class_grade: e.target.value })}
                    style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.65rem 0.875rem', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                    <option value="">Select</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => <option key={g} value={g}>Class {g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Language</label>
                  <select value={form.language_pref} onChange={e => setForm({ ...form, language_pref: e.target.value })}
                    style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.65rem 0.875rem', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="mr">मराठी</option>
                  </select>
                </div>
              </div>
              <button onClick={saveInfo} disabled={saving}
                style={{ padding: '0.75rem', borderRadius: 10, background: '#1A73E8', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}

          {tab === 'password' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { label: 'New Password', key: 'next', placeholder: 'Min. 8 characters' },
                { label: 'Confirm Password', key: 'confirm', placeholder: 'Repeat password' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                  <input type="password" placeholder={placeholder}
                    value={pw[key as keyof typeof pw]}
                    onChange={e => setPw({ ...pw, [key]: e.target.value })}
                    style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.65rem 0.875rem', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              ))}
              <button onClick={savePassword} disabled={saving}
                style={{ padding: '0.75rem', borderRadius: 10, background: '#1A73E8', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Change Password'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── View Drawer ─────────────────────────────────────────────
function StudentDrawer({ user, onClose, onEdit }: { user: User; onClose: () => void; onEdit: () => void }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    apiFetch(`/api/enrollments/user/${user.id}`)
      .then(r => r.json())
      .then(data => { setEnrollments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
    apiFetch(`/api/certificates/student/${user.id}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCerts(data); })
      .catch(() => {});
  }, [user.id]);

  const completed = enrollments.filter(e => e.completed_at);
  const username = user.email?.split('@')[0] || '—';

  function downloadCert(courseId: string, courseName: string) {
    window.open(`/certificate/${courseId}`, '_blank');
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', width: 'min(440px,100vw)', height: '100%', borderLeft: '1.5px solid #e5e7eb', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1A73E8,#00C896)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Avatar name={user.name} size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>{user.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', marginTop: 2 }}>@{username}</div>
            {(user.class_grade || user.division) && (
              <div style={{ marginTop: 6 }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
                  {user.class_grade ? `Class ${user.class_grade}` : ''}{user.division ? ` – Div ${user.division}` : ''}
                </span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button onClick={onEdit} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>✏️ Edit</button>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>✕ Close</button>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { label: 'Email', value: user.email || '—' },
            { label: 'Phone', value: user.phone || 'Not set' },
            { label: 'Username', value: `@${username}` },
            { label: 'Language', value: { en: 'English', hi: 'हिंदी', mr: 'मराठी' }[user.language_pref] || 'English' },
            { label: 'Status', value: user.is_active ? '✅ Active' : '❌ Inactive' },
            { label: 'Last Login', value: user.last_login ? new Date(user.last_login).toLocaleDateString('en-IN') : 'Never' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#f9fafb', borderRadius: 8, padding: '0.6rem 0.875rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827', marginTop: 2, wordBreak: 'break-all' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Enrolled', value: enrollments.length, emoji: '📚', color: '#1A73E8' },
            { label: 'Completed', value: completed.length, emoji: '✅', color: '#00C896' },
            { label: 'Avg Progress', value: `${enrollments.length > 0 ? Math.round(enrollments.reduce((s, e) => s + e.progress_pct, 0) / enrollments.length) : 0}%`, emoji: '📈', color: '#1A73E8' },
          ].map(s => (
            <div key={s.label} style={{ background: '#f9fafb', borderRadius: 10, padding: '0.875rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 2 }}>{s.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div style={{ padding: '1rem 1.5rem', flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Course Progress</div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>Loading…</div>
          ) : enrollments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '0.85rem' }}>No enrollments yet</div>
          ) : enrollments.map(e => {
            const pct = Math.round(e.progress_pct);
            const isDone = !!e.completed_at;
            return (
              <div key={e.course_id} style={{ marginBottom: '0.875rem', padding: '0.875rem', background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>{e.course.title_en}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: 2 }}>{e.course.category}</div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.875rem', color: isDone ? '#00C896' : '#1A73E8', marginLeft: 8 }}>{pct}%</span>
                </div>
                <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ height: '100%', background: isDone ? '#00C896' : '#1A73E8', width: `${pct}%`, borderRadius: 3 }} />
                </div>
                {isDone && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.7rem', color: '#00C896', fontWeight: 600 }}>✅ Completed {new Date(e.completed_at!).toLocaleDateString('en-IN')}</span>
                    <button onClick={() => downloadCert(e.course_id, e.course.title_en)}
                      style={{ padding: '4px 10px', borderRadius: 6, background: '#DCFCE7', color: '#15803D', border: 'none', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                      📄 Certificate
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Certificates */}
        {certs.length > 0 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>🏆 Certificates ({certs.length})</div>
            {certs.map((c: any) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.875rem', background: '#F0FDF4', borderRadius: 10, border: '1px solid #BBF7D0', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803D' }}>{c.course?.title_en}</div>
                  <div style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: 2 }}>{new Date(c.issued_at).toLocaleDateString('en-IN')} · {c.cert_code}</div>
                </div>
                <button onClick={() => window.open(`/verify/${c.cert_code}`, '_blank')}
                  style={{ padding: '4px 10px', borderRadius: 6, background: '#DCFCE7', color: '#15803D', border: 'none', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenantIdParam = searchParams.get('tenantId');
  const schoolNameParam = searchParams.get('schoolName');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'verified'>('all');
  const [viewing, setViewing] = useState<User | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  useEffect(() => { setAdminUser(getUser()); }, []);

  useEffect(() => {
    apiFetch(tenantIdParam ? `/api/users?tenantId=${tenantIdParam}` : '/api/users')
      .then(r => r.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data.filter((u: User) => u.role === 'student') : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleSaved(updated: User) {
    setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, ...updated } : u));
    setViewing(prev => prev?.id === updated.id ? { ...prev, ...updated } : prev);
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'active' ? u.is_active : u.email_verified;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'DM Sans, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#1A73E8,#00C896)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🚀</div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A73E8' }}>SimuLearning</span>
          </Link>
          <span style={{ color: '#d1d5db' }}>|</span>
          <Link href={adminUser?.role === 'super_admin' ? '/super-admin' : '/admin'} style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>← {adminUser?.role === 'super_admin' ? 'Super Admin' : 'Admin Panel'}</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>{users.length} students</span>
          <button onClick={() => router.push(adminUser?.role === 'super_admin' ? '/super-admin/profile' : '/admin/profile')}
            style={{ padding: '6px 14px', borderRadius: 8, background: '#EFF6FF', color: '#1A73E8', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
            👤 {adminUser?.name?.split(' ')[0] || 'Profile'}
          </button>
          <button onClick={logout}
            style={{ padding: '6px 14px', borderRadius: 8, background: '#FEF2F2', color: '#DC2626', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg,#1e1e3f,#2d2d5e)', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '3px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
              {adminUser?.name || 'Admin'} · {schoolNameParam || adminUser?.schoolName || 'School'}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, color: '#fff', margin: '0.5rem 0 0.25rem' }}>👨‍🎓 Students</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Manage students, track progress, and view enrollments</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Total', value: users.length, color: '#1A73E8' },
              { label: 'Active', value: users.filter(u => u.is_active).length, color: '#00C896' },
              { label: 'Verified', value: users.filter(u => u.email_verified).length, color: '#A855F7' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '0.875rem 1.25rem', border: '1px solid rgba(255,255,255,0.1)', minWidth: 110 }}>
                <div style={{ fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Search + filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
              style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: 999, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {(['all','active','verified'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '0.5rem 1rem', borderRadius: 999, border: '1.5px solid', borderColor: filter === f ? '#1A73E8' : '#e5e7eb', background: filter === f ? '#1A73E8' : '#fff', color: filter === f ? '#fff' : '#6b7280', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 120px', padding: '0.75rem 1.5rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <div>Name</div>
            <div>Username</div>
            <div>Class / Div</div>
            <div>Status</div>
            <div>Joined</div>
            <div></div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Loading students…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>No students found</div>
          ) : filtered.map(user => (
            <div key={user.id}
              style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 120px', padding: '0.875rem 1.5rem', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Avatar name={user.name} size={34} />
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{user.name}</div>
              </div>

              {/* Username */}
              <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>@{user.email?.split('@')[0] || '—'}</div>

              {/* Class / Division */}
              <div style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>
                {user.class_grade ? `Class ${user.class_grade}` : '—'}
                {user.division ? ` / ${user.division}` : ''}
              </div>

              {/* Status */}
              <div>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, fontWeight: 700, background: user.is_active ? '#DCFCE7' : '#F3F4F6', color: user.is_active ? '#15803D' : '#6b7280' }}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Joined */}
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => setViewing(user)}
                  style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid #e5e7eb', background: '#fff', color: '#1A73E8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                  View
                </button>
                <button onClick={() => setEditing(user)}
                  style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid #e5e7eb', background: '#FFF7ED', color: '#EA580C', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewing && !editing && <StudentDrawer user={viewing} onClose={() => setViewing(null)} onEdit={() => { setEditing(viewing); setViewing(null); }} />}
      {editing && <EditModal user={editing} onClose={() => setEditing(null)} onSaved={u => { handleSaved(u); setEditing(null); }} />}
    </div>
  );
}

export default function UsersPageWrapper() {
  return (
    <Suspense fallback={<div style={{padding:'2rem'}}>Loading...</div>}>
      <AdminUsersPage />
    </Suspense>
  );
}
