'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, apiFetch, logout } from '../../../app/lib/auth';

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', language_pref: 'en' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState<'profile' | 'password'>('profile');

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/login'); return; }
    apiFetch('/api/users')
      .then(r => r.json())
      .then((users: any[]) => {
        const me = users.find((x: any) => x.id === u.id) || u;
        setProfile(me);
        setForm({ name: me.name || '', phone: me.phone || '', language_pref: me.language_pref || 'en' });
      })
      .catch(() => {
        setProfile(u);
        setForm({ name: u.name || '', phone: '', language_pref: 'en' });
      });
  }, []);

  async function handleSave() {
    setErr(''); setMsg('');
    const res = await apiFetch(`/api/users/${profile.id}`, {
      method: 'PATCH',
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setProfile({ ...profile, ...form });
      setEditing(false);
      setMsg('Profile updated successfully.');
    } else {
      setErr('Failed to update profile.');
    }
  }

  async function handlePasswordChange() {
    setErr(''); setMsg('');
    if (pwForm.next !== pwForm.confirm) { setErr('Passwords do not match.'); return; }
    if (pwForm.next.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    const res = await apiFetch(`/api/users/${profile.id}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password: pwForm.next }),
    });
    if (res.ok) {
      setMsg('Password changed successfully.');
      setPwForm({ current: '', next: '', confirm: '' });
    } else {
      setErr('Failed to change password.');
    }
  }

  if (!profile) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#6b7280' }}>
      Loading profile…
    </div>
  );

  const initials = profile.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || 'AD';
  const roleColors: Record<string, { bg: string; color: string }> = {
    admin: { bg: '#DBEAFE', color: '#1D4ED8' },
    super_admin: { bg: '#EDE9FE', color: '#6D28D9' },
    student: { bg: '#DCFCE7', color: '#15803D' },
    teacher: { bg: '#FEF3C7', color: '#92400E' },
  };
  const rc = roleColors[profile.role] || { bg: '#F3F4F6', color: '#374151' };

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 24px' }}>

      {/* Back */}
      <button onClick={() => router.push('/super-admin')} style={{ marginBottom: 24, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        ← Back to Admin Panel
      </button>

      {/* Header Card */}
      <div style={{ background: 'linear-gradient(135deg, #1A73E8, #00C896)', borderRadius: 20, padding: '2rem', marginBottom: 24, color: '#fff', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{profile.name}</h1>
          <p style={{ margin: '4px 0 8px', opacity: 0.85, fontSize: '0.95rem' }}>{profile.email}</p>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            {profile.role?.replace('_', ' ')}
          </span>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.75, marginBottom: 4 }}>Member since</div>
          <div style={{ fontWeight: 700 }}>{profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['profile', 'password'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setMsg(''); setErr(''); }}
            style={{ padding: '0.6rem 1.5rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', background: tab === t ? '#1A73E8' : '#F3F4F6', color: tab === t ? '#fff' : '#374151' }}>
            {t === 'profile' ? '👤 Profile' : '🔒 Password'}
          </button>
        ))}
      </div>

      {/* Messages */}
      {msg && <div style={{ background: '#DCFCE7', color: '#15803D', padding: '0.75rem 1rem', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>✅ {msg}</div>}
      {err && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>❌ {err}</div>}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Profile Information</h2>
            <button onClick={() => { setEditing(!editing); setMsg(''); setErr(''); }}
              style={{ padding: '0.5rem 1.25rem', borderRadius: 8, border: editing ? '1.5px solid #e5e7eb' : 'none', background: editing ? '#fff' : '#EFF6FF', color: editing ? '#6b7280' : '#1A73E8', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
              {editing ? 'Cancel' : '✏️ Edit'}
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {/* Name */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Full Name</label>
              {editing ? (
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ display: 'block', width: '100%', marginTop: 6, padding: '0.7rem 1rem', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              ) : (
                <p style={{ margin: '6px 0 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{profile.name || '—'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Email Address</label>
              <p style={{ margin: '6px 0 0', fontSize: '1rem', color: '#111827' }}>{profile.email || '—'}
                {profile.email_verified && <span style={{ marginLeft: 8, fontSize: '0.75rem', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>✓ Verified</span>}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone Number</label>
              {editing ? (
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  style={{ display: 'block', width: '100%', marginTop: 6, padding: '0.7rem 1rem', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              ) : (
                <p style={{ margin: '6px 0 0', fontSize: '1rem', color: '#111827' }}>{profile.phone || <span style={{ color: '#9ca3af' }}>Not set</span>}</p>
              )}
            </div>

            {/* Language */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Language Preference</label>
              {editing ? (
                <select value={form.language_pref} onChange={e => setForm({ ...form, language_pref: e.target.value })}
                  style={{ display: 'block', width: '100%', marginTop: 6, padding: '0.7rem 1rem', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="mr">मराठी</option>
                </select>
              ) : (
                <p style={{ margin: '6px 0 0', fontSize: '1rem', color: '#111827' }}>
                  {{ en: 'English', hi: 'हिंदी', mr: 'मराठी' }[profile.language_pref] || 'English'}
                </p>
              )}
            </div>

            {/* Role & Last Login (read-only) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Role</label>
                <p style={{ margin: '6px 0 0' }}>
                  <span style={{ ...rc, padding: '3px 12px', borderRadius: 999, fontSize: '0.85rem', fontWeight: 700 }}>
                    {profile.role?.replace('_', ' ')}
                  </span>
                </p>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Last Login</label>
                <p style={{ margin: '6px 0 0', fontSize: '0.95rem', color: '#111827' }}>
                  {profile.last_login ? new Date(profile.last_login).toLocaleString('en-IN') : 'First time'}
                </p>
              </div>
            </div>
          </div>

          {editing && (
            <button onClick={handleSave}
              style={{ marginTop: 24, width: '100%', padding: '0.85rem', borderRadius: 10, background: '#1A73E8', color: '#fff', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              Save Changes
            </button>
          )}
        </div>
      )}

      {/* Password Tab */}
      {tab === 'password' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: '0 0 24px', fontSize: '1.1rem', fontWeight: 700 }}>Change Password</h2>
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {[
              { label: 'New Password', key: 'next', placeholder: 'Min. 8 characters' },
              { label: 'Confirm New Password', key: 'confirm', placeholder: 'Repeat new password' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                <input type="password" placeholder={placeholder}
                  value={pwForm[key as keyof typeof pwForm]}
                  onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                  style={{ display: 'block', width: '100%', marginTop: 6, padding: '0.7rem 1rem', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <button onClick={handlePasswordChange}
            style={{ marginTop: 24, width: '100%', padding: '0.85rem', borderRadius: 10, background: '#1A73E8', color: '#fff', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
            Update Password
          </button>
        </div>
      )}

      {/* Logout */}
      <button onClick={logout}
        style={{ marginTop: 16, width: '100%', padding: '0.85rem', borderRadius: 10, background: '#FEF2F2', color: '#DC2626', border: '1.5px solid #FECACA', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
        🚪 Sign Out
      </button>
    </div>
  );
}
