'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, getUser } from '../lib/auth';

type Tenant = {
  id: string; name: string; slug: string;
  plan_id: string | null; is_active: boolean; created_at: string;
  _count: { students: number; courses: number; certs: number };
};

type Stats = { tenants: number; students: number; courses: number; certs: number };

const PLAN_COLORS: Record<string, string> = {
  free: '#718096', starter: '#1A73E8', pro: '#A855F7',
};

const STAT_CARDS = [
  { key: 'tenants',  label: 'Schools',      emoji: '🏫', color: '#1A73E8' },
  { key: 'students', label: 'Students',     emoji: '👨‍🎓', color: '#FF6B35' },
  { key: 'courses',  label: 'Courses',      emoji: '📚', color: '#A855F7' },
  { key: 'certs',    label: 'Certificates', emoji: '🏆', color: '#00C896' },
];

export default function SuperAdminPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toggling, setToggling] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'super_admin') {
      router.push('/admin');
      return;
    }
    Promise.all([
      apiFetch('/api/tenants').then(r => r.json()),
      apiFetch('/api/tenants/stats').then(r => r.json()),
    ]).then(([t, s]) => {
      setTenants(Array.isArray(t) ? t : []);
      setStats(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  async function toggleActive(tenant: Tenant) {
    setToggling(tenant.id);
    try {
      const updated = await apiFetch(`/api/tenants/${tenant.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !tenant.is_active }),
      }).then(r => r.json());
      setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, is_active: updated.is_active } : t));
    } finally {
      setToggling(null);
    }
  }

  const filtered = tenants.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'active' ? t.is_active : !t.is_active);
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(26,26,46,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin" style={{ color: '#aaa', fontSize: '0.85rem' }}>← Admin</Link>
          <span style={{ color: '#444' }}>|</span>
          <span style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>⚡ Super Admin</span>
          <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,107,53,0.2)', color: '#FF6B35', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>PLATFORM</span>
        </div>
        <Link href="/admin/schools/new" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem' }}>
          + New School
        </Link>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {STAT_CARDS.map(s => (
            <div key={s.key} style={{ background: 'var(--card)', borderRadius: '1.25rem', padding: '1.25rem', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '0.875rem', background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{s.emoji}</div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                  {loading ? '—' : stats?.[s.key as keyof Stats] ?? 0}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600, marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Search schools…"
            style={{ flex: 1, minWidth: '200px', padding: '0.65rem 1rem', borderRadius: '0.875rem', border: '1.5px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontSize: '0.9rem', fontFamily: "'Baloo 2'", outline: 'none' }}
          />
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '0.5rem 1rem', borderRadius: '999px', border: '1.5px solid', borderColor: filter === f ? 'var(--primary)' : 'var(--border)', background: filter === f ? 'var(--primary)' : 'transparent', color: filter === f ? '#fff' : 'var(--text2)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Baloo 2'", textTransform: 'capitalize' }}>
              {f} {f !== 'all' && `(${tenants.filter(t => f === 'active' ? t.is_active : !t.is_active).length})`}
            </button>
          ))}
        </div>

        {/* SCHOOLS TABLE */}
        <div style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: '1rem', padding: '0.75rem 1.25rem', background: 'var(--bg)', borderBottom: '1px solid var(--border)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>School</span><span>Plan</span><span>Students</span><span>Courses</span><span>Certs</span><span>Status</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚙️</div>
              Loading schools…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏫</div>
              {search ? 'No schools match your search' : 'No schools yet'}
            </div>
          ) : filtered.map((tenant, i) => (
            <div key={tenant.id}
              style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: '1rem', padding: '1rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

              {/* Name + slug */}
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>{tenant.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontFamily: 'monospace' }}>{tenant.slug}.iotlearn.in</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginTop: '0.15rem' }}>
                  Since {new Date(tenant.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </div>
              </div>

              {/* Plan badge */}
              <div>
                <span style={{ padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: (PLAN_COLORS[tenant.plan_id ?? 'free'] ?? '#718096') + '20', color: PLAN_COLORS[tenant.plan_id ?? 'free'] ?? '#718096', textTransform: 'capitalize' }}>
                  {tenant.plan_id ?? 'free'}
                </span>
              </div>

              {/* Counts */}
              <div style={{ fontWeight: 700, color: 'var(--text2)', fontSize: '0.9rem' }}>{tenant._count.students}</div>
              <div style={{ fontWeight: 700, color: 'var(--text2)', fontSize: '0.9rem' }}>{tenant._count.courses}</div>
              <div style={{ fontWeight: 700, color: 'var(--text2)', fontSize: '0.9rem' }}>{tenant._count.certs}</div>

              {/* Toggle */}
              <button
                onClick={() => toggleActive(tenant)}
                disabled={toggling === tenant.id}
                style={{ padding: '0.35rem 0.875rem', borderRadius: '999px', border: '1.5px solid', borderColor: tenant.is_active ? 'rgba(0,200,150,0.3)' : 'rgba(255,107,53,0.3)', background: tenant.is_active ? 'rgba(0,200,150,0.1)' : 'rgba(255,107,53,0.1)', color: tenant.is_active ? '#00C896' : '#FF6B35', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Baloo 2'", whiteSpace: 'nowrap', opacity: toggling === tenant.id ? 0.5 : 1 }}>
                {toggling === tenant.id ? '…' : tenant.is_active ? '✅ Active' : '⏸ Inactive'}
              </button>
            </div>
          ))}
        </div>

        {filtered.length > 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '0.8rem', marginTop: '1rem' }}>
            Showing {filtered.length} of {tenants.length} schools
          </p>
        )}
      </div>
    </div>
  );
}
