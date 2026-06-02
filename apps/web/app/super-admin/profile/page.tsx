'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUser, apiFetch, logout } from '../../lib/auth';
import Logo from '@/components/ui/Logo';

export default function SuperAdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', language_pref: 'en' });
  const [pw, setPw] = useState({ next: '', confirm: '' });
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== 'super_admin') { router.push('/login'); return; }
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

  async function saveInfo() {
    setSaving(true); setErr(''); setMsg('');
    const res = await apiFetch(`/api/users/${profile.id}`, { method: 'PATCH', body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { setProfile({ ...profile, ...form }); setEditing(false); setMsg('Profile updated.'); }
    else setErr('Failed to update profile.');
  }

  async function savePassword() {
    if (pw.next !== pw.confirm) { setErr('Passwords do not match.'); return; }
    if (pw.next.length < 8) { setErr('Min. 8 characters.'); return; }
    setSaving(true); setErr(''); setMsg('');
    const res = await apiFetch(`/api/users/${profile.id}/password`, { method: 'PATCH', body: JSON.stringify({ password: pw.next }) });
    setSaving(false);
    if (res.ok) { setMsg('Password changed.'); setPw({ next: '', confirm: '' }); }
    else setErr('Failed to change password.');
  }

  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ color: '#64748B', fontWeight: 600 }}>Loading…</div>
    </div>
  );

  const initials = profile.name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'SA';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAVBAR */}
      <nav className="sl-nav" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.15)' }}>
        <div className="sl-nav-inner" style={{ gap: 20 }}>
          <Link href="/super-admin" className="sl-logo">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Logo width={72} />
              <div style={{ width: 1, height: 42, background: 'rgba(0,0,0,0.06)', margin: '0 8px' }} />
              <div>
                <div className="sl-logo-name">SimuLearning</div>
                <div className="sl-logo-sub">by SimuSoft Technologies</div>
              </div>
            </div>
          </Link>
          <button onClick={() => router.push('/super-admin')} className="sl-nav-link">← Super Admin</button>
          <span style={{ padding: '3px 10px', background: 'rgba(26,115,232,0.12)', color: '#1A73E8', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Super Admin</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => router.push('/super-admin/profile')} className="sl-nav-link">My Profile</button>
            <button onClick={logout} className="sl-nav-cta" style={{ border: 'none' }}>Sign Out</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 24px' }}>

        {/* Header card */}
        <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E3A5F,#0E7490)', borderRadius: 20, padding: '2rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B35,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, color: '#fff', border: '3px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Platform Administrator</div>
            <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>{profile.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginTop: 4 }}>{profile.email}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', marginBottom: 4 }}>Member since</div>
            <div style={{ color: '#fff', fontWeight: 700 }}>{profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</div>
            <div style={{ marginTop: 8 }}>
              <span style={{ padding: '3px 12px', background: 'rgba(255,107,53,0.25)', color: '#FF6B35', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Super Admin</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['profile', 'password'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setMsg(''); setErr(''); }}
              style={{ padding: '0.6rem 1.5rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', background: tab === t ? '#0F172A' : '#F1F5F9', color: tab === t ? '#fff' : '#374151' }}>
              {t === 'profile' ? '👤 Profile' : '🔒 Password'}
            </button>
          ))}
        </div>

        {msg && <div style={{ background: '#DCFCE7', color: '#15803D', padding: '0.75rem 1rem', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>✅ {msg}</div>}
        {err && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>❌ {err}</div>}

        {tab === 'profile' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>Profile Information</h2>
              <button onClick={() => { setEditing(!editing); setMsg(''); setErr(''); }}
                style={{ padding: '6px 16px', borderRadius: 8, border: editing ? '1.5px solid #E2E8F0' : 'none', background: editing ? '#fff' : '#EFF6FF', color: editing ? '#64748B' : '#1A73E8', cursor: 'pointer', fontWeight: 700, fontSize: '0.825rem' }}>
                {editing ? 'Cancel' : '✏️ Edit'}
              </button>
            </div>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {[
                { label: 'Full Name', key: 'name', value: profile.name, placeholder: 'Your name' },
                { label: 'Phone Number', key: 'phone', value: profile.phone || '', placeholder: '+91 9876543210' },
              ].map(({ label, key, value, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                  {editing ? (
                    <input value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      style={{ display: 'block', width: '100%', marginTop: 6, padding: '0.7rem 1rem', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  ) : (
                    <p style={{ margin: '6px 0 0', fontSize: '0.95rem', fontWeight: 600, color: '#0F172A' }}>{value || <span style={{ color: '#94A3B8' }}>Not set</span>}</p>
                  )}
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Email Address</label>
                <p style={{ margin: '6px 0 0', fontSize: '0.95rem', color: '#0F172A' }}>{profile.email}
                  {profile.email_verified && <span style={{ marginLeft: 8, fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>✓ Verified</span>}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Language</label>
                {editing ? (
                  <select value={form.language_pref} onChange={e => setForm({ ...form, language_pref: e.target.value })}
                    style={{ display: 'block', width: '100%', marginTop: 6, padding: '0.7rem 1rem', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="mr">मराठी</option>
                  </select>
                ) : (
                  <p style={{ margin: '6px 0 0', fontSize: '0.95rem', fontWeight: 600, color: '#0F172A' }}>{{ en: 'English', hi: 'हिंदी', mr: 'मराठी' }[profile.language_pref] || 'English'}</p>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Role</label>
                  <p style={{ margin: '6px 0 0' }}>
                    <span style={{ padding: '3px 12px', background: 'rgba(255,107,53,0.1)', color: '#FF6B35', borderRadius: 999, fontSize: '0.82rem', fontWeight: 800 }}>Super Admin</span>
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Last Login</label>
                  <p style={{ margin: '6px 0 0', fontSize: '0.875rem', color: '#0F172A' }}>{profile.last_login ? new Date(profile.last_login).toLocaleString('en-IN') : 'First time'}</p>
                </div>
              </div>
            </div>
            {editing && (
              <button onClick={saveInfo} disabled={saving}
                style={{ marginTop: 20, width: '100%', padding: '0.85rem', borderRadius: 10, background: '#0F172A', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            )}
          </div>
        )}

        {tab === 'password' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', border: '1px solid #E2E8F0' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>Change Password</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { label: 'New Password', key: 'next', placeholder: 'Min. 8 characters' },
                { label: 'Confirm Password', key: 'confirm', placeholder: 'Repeat new password' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                  <input type="password" placeholder={placeholder} value={pw[key as keyof typeof pw]}
                    onChange={e => setPw({ ...pw, [key]: e.target.value })}
                    style={{ display: 'block', width: '100%', marginTop: 6, padding: '0.7rem 1rem', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              ))}
              <button onClick={savePassword} disabled={saving}
                style={{ padding: '0.85rem', borderRadius: 10, background: '#0F172A', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Change Password'}
              </button>
            </div>
          </div>
        )}

        <button onClick={logout}
          style={{ marginTop: 16, width: '100%', padding: '0.85rem', borderRadius: 10, background: '#FEF2F2', color: '#DC2626', border: '1.5px solid #FECACA', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}
