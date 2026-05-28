'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, getUser, logout } from '../lib/auth';

type Tenant = {
  id: string; name: string; slug: string;
  plan_id: string | null; is_active: boolean; created_at: string;
  _count: { students: number; courses: number; certs: number };
};
type Stats = { tenants: number; students: number; courses: number; certs: number };

const PLAN_COLORS: Record<string, { bg: string; color: string }> = {
  free:    { bg: '#F1F5F9', color: '#64748B' },
  starter: { bg: '#EFF6FF', color: '#1D4ED8' },
  pro:     { bg: '#F5F3FF', color: '#7C3AED' },
};

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  const colors = ['#1A73E8', '#A855F7', '#00C896', '#1A73E8', '#D97706'];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: colors[hash % colors.length], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function EditSchoolModal({ tenant, onClose, onSaved }: { tenant: Tenant; onClose: () => void; onSaved: (t: Tenant) => void }) {
  const [form, setForm] = useState({ name: tenant.name, plan_id: tenant.plan_id || 'free', is_active: tenant.is_active });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function save() {
    setSaving(true); setErr('');
    const res = await apiFetch(`/api/tenants/${tenant.id}`, { method: 'PATCH', body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { const d = await res.json(); onSaved({ ...tenant, ...d }); onClose(); }
    else setErr('Failed to update school.');
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E3A5F)', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Edit School</div>
            <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginTop: 2 }}>{tenant.slug}.simulearning.in</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
        <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
          {err && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.6rem 1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600 }}>❌ {err}</div>}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>School Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.65rem 0.875rem', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</label>
            <button onClick={() => setForm({ ...form, is_active: !form.is_active })}
              style={{ padding: '6px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', background: form.is_active ? '#DCFCE7' : '#FEE2E2', color: form.is_active ? '#15803D' : '#DC2626' }}>
              {form.is_active ? '✅ Active' : '❌ Inactive'}
            </button>
          </div>
          <button onClick={save} disabled={saving}
            style={{ padding: '0.75rem', borderRadius: 10, background: '#1A73E8', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function deleteSchool(tenant: Tenant) {
    if (!confirm(`DELETE "${tenant.name}"?\n\nThis permanently deletes ALL students, courses and data for this school. Cannot be undone.`)) return;
    setDeletingId(tenant.id);
    const res = await apiFetch(`/api/tenants/${tenant.id}`, { method: 'DELETE' });
    setDeletingId(null);
    if (res.ok) setTenants(prev => prev.filter(t => t.id !== tenant.id));
    else alert('Failed to delete school. Please try again.');
  }
  const [superUser, setSuperUser] = useState<any>(null);
  const [showSuperAdmins, setShowSuperAdmins] = useState(false);
  const [superAdmins, setSuperAdmins] = useState<any[]>([]);
  const [saLoading, setSaLoading] = useState(false);
  const [saForm, setSaForm] = useState({ name: '', email: '', password: '' });
  const [saEditId, setSaEditId] = useState<string|null>(null);
  const [saEditForm, setSaEditForm] = useState({ name: '', email: '', password: '' });
  const [saMsg, setSaMsg] = useState('');
  const [saErr, setSaErr] = useState('');
  const [saSaving, setSaSaving] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'super_admin') { router.push('/login'); return; }
    setSuperUser(user);
    Promise.all([
      apiFetch('/api/tenants').then(r => r.json()),
      apiFetch('/api/tenants/stats').then(r => r.json()),
    ]).then(([t, s]) => {
      setTenants(Array.isArray(t) ? t : []);
      setStats(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  async function loadSuperAdmins() {
    setSaLoading(true);
    const res = await apiFetch('/api/users/super-admins');
    if (res.ok) setSuperAdmins(await res.json());
    setSaLoading(false);
  }

  async function createSuperAdmin() {
    if (!saForm.name || !saForm.email || !saForm.password) { setSaErr('All fields required.'); return; }
    if (saForm.password.length < 8) { setSaErr('Password min 8 characters.'); return; }
    setSaSaving(true); setSaErr(''); setSaMsg('');
    const res = await apiFetch('/api/users/super-admins', { method: 'POST', body: JSON.stringify(saForm) });
    setSaSaving(false);
    if (res.ok) { setSaMsg('Super admin created!'); setSaForm({ name: '', email: '', password: '' }); loadSuperAdmins(); setTimeout(() => setSaMsg(''), 3000); }
    else setSaErr('Failed — email may already exist.');
  }

  async function updateSuperAdmin(id: string) {
    setSaSaving(true); setSaErr(''); setSaMsg('');
    const payload: any = { name: saEditForm.name, email: saEditForm.email };
    if (saEditForm.password.length >= 8) payload.password = saEditForm.password;
    const res = await apiFetch(`/api/users/super-admins/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    setSaSaving(false);
    if (res.ok) { setSaMsg('Updated!'); setSaEditId(null); loadSuperAdmins(); setTimeout(() => setSaMsg(''), 2500); }
    else setSaErr('Failed to update.');
  }

  async function removeSuperAdmin(id: string, name: string) {
    if (!confirm(`Remove super admin "${name}"? This cannot be undone.`)) return;
    await apiFetch(`/api/users/super-admins/${id}`, { method: 'DELETE' });
    setSuperAdmins(prev => prev.filter(a => a.id !== id));
  }

  const filtered = tenants.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'active' ? t.is_active : !t.is_active);
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'DM Sans, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: '#0F172A', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/super-admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#1A73E8,#00C896)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🚀</div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>SimuLearning</span>
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <span style={{ padding: '3px 10px', background: 'rgba(26,115,232,0.2)', color: '#1A73E8', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Super Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => router.push('/super-admin/profile')}
            style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            👤 My Profile
          </button>
          <button onClick={logout}
            style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.15)', color: '#F87171', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E3A5F 60%,#0E7490 100%)', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#1A73E8,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: '#fff', border: '3px solid rgba(255,255,255,0.2)' }}>
                {superUser?.name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'SA'}
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Platform Administrator</div>
                <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginTop: 2 }}>{superUser?.name || 'Super Admin'}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', marginTop: 3 }}>🌐 SimuLearning Platform · All Schools</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Schools', value: stats?.tenants ?? '—', icon: '🏫', color: '#60A5FA' },
                { label: 'Students', value: stats?.students ?? '—', icon: '👨‍🎓', color: '#34D399' },
                { label: 'Courses', value: stats?.courses ?? '—', icon: '📚', color: '#C084FC' },
                { label: 'Certificates', value: stats?.certs ?? '—', icon: '🏆', color: '#FCD34D' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '0.875rem 1.25rem', textAlign: 'center', minWidth: 90 }}>
                  <div style={{ fontSize: '1rem', marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontWeight: 900, fontSize: '1.5rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#0F172A' }}>All Schools</h2>
            <p style={{ color: '#64748B', marginTop: 4, fontSize: '0.85rem' }}>{tenants.length} schools on platform</p>
          </div>
          <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
            <Link href="/super-admin/courses" style={{ padding:"10px 22px", background:"linear-gradient(135deg,#1A73E8,#00C896)", color:"#fff", textDecoration:"none", borderRadius:10, fontWeight:700, fontSize:"0.9rem", boxShadow:"0 4px 12px rgba(0,200,150,0.3)" }}>📚 Manage Courses</Link>
            <button onClick={() => router.push("/super-admin/schools/new")} style={{ padding:"10px 22px", background:"linear-gradient(135deg,#1A73E8,#0EA5E9)", color:"#fff", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:"0.9rem", boxShadow:"0 4px 12px rgba(26,115,232,0.3)" }}>+ Add New School</button>
            <button onClick={() => { setShowSuperAdmins(true); loadSuperAdmins(); }} style={{ padding:"10px 22px", background:"linear-gradient(135deg,#7C3AED,#A855F7)", color:"#fff", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:"0.9rem", boxShadow:"0 4px 12px rgba(124,58,237,0.3)" }}>👑 Manage Super Admins</button>
          </div>



        </div>

        {/* Search + filter */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schools…"
              style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: 999, border: '1.5px solid #E2E8F0', background: '#fff', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {(['all','active','inactive'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '0.5rem 1rem', borderRadius: 999, border: '1.5px solid', borderColor: filter === f ? '#1A73E8' : '#E2E8F0', background: filter === f ? '#1A73E8' : '#fff', color: filter === f ? '#fff' : '#64748B', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                {f} {f !== 'all' && `(${tenants.filter(t => f === 'active' ? t.is_active : !t.is_active).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Schools grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>Loading schools…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>No schools found</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map(tenant => {
              const plan = PLAN_COLORS[tenant.plan_id ?? 'free'] || PLAN_COLORS.free;
              return (
                <div key={tenant.id} style={{ background: '#fff', borderRadius: 18, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer' }}
                  onClick={() => router.push(`/super-admin/schools/${tenant.id}`)}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>

                  {/* Status bar */}
                  <div style={{ height: 4, background: tenant.is_active ? 'linear-gradient(90deg,#00C896,#1A73E8)' : '#E2E8F0' }} />

                  <div style={{ padding: '1.25rem' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: 14 }}>
                      <Avatar name={tenant.name} size={44} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', lineHeight: 1.3 }}>{tenant.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'monospace', marginTop: 2 }}>{tenant.slug}.simulearning.in</div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>

                          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: tenant.is_active ? '#DCFCE7' : '#F1F5F9', color: tenant.is_active ? '#15803D' : '#64748B', fontWeight: 700 }}>
                            {tenant.is_active ? '● Active' : '○ Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
                      {[
                        { label: 'Students', value: tenant._count.students, icon: '👨‍🎓', color: '#1A73E8', bg: '#EFF6FF' },
                        { label: 'Courses', value: tenant._count.courses, icon: '📚', color: '#7C3AED', bg: '#F5F3FF' },
                        { label: 'Certs', value: tenant._count.certs, icon: '🏆', color: '#D97706', bg: '#FFFBEB' },
                      ].map(s => (
                        <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '0.6rem 0.4rem', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.9rem', marginBottom: 2 }}>{s.icon}</div>
                          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                        Since {new Date(tenant.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setEditing(tenant)}
                          style={{ padding: '6px 14px', borderRadius: 8, background: '#EFF6FF', color: '#1A73E8', border: 'none', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                          ✏️ Edit
                        </button>
                        <button onClick={() => deleteSchool(tenant)} disabled={deletingId === tenant.id}
                          style={{ padding: '6px 14px', borderRadius: 8, background: '#FFF5F5', color: '#DC2626', border: 'none', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', opacity: deletingId === tenant.id ? 0.6 : 1 }}>
                          {deletingId === tenant.id ? '...' : '🗑️ Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showSuperAdmins && (
        <div style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
          onClick={e => e.target===e.currentTarget && setShowSuperAdmins(false)}>
          <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:580, maxHeight:'85vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 80px rgba(0,0,0,0.25)' }}>
            <div style={{ background:'linear-gradient(135deg,#4C1D95,#7C3AED)', padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
              <div>
                <div style={{ fontWeight:800, color:'#fff', fontSize:'1rem' }}>👑 Super Admin Management</div>
                <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.78rem', marginTop:2 }}>Create and manage platform administrators</div>
              </div>
              <button onClick={() => setShowSuperAdmins(false)} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'#fff', width:32, height:32, borderRadius:'50%', cursor:'pointer', fontSize:'1rem' }}>✕</button>
            </div>
            <div style={{ overflowY:'auto', flex:1 }}>
              {saMsg && <div style={{ background:'#DCFCE7', color:'#15803D', padding:'0.75rem 1.5rem', fontWeight:600, fontSize:'0.85rem' }}>✅ {saMsg}</div>}
              {saErr && <div style={{ background:'#FEE2E2', color:'#DC2626', padding:'0.75rem 1.5rem', fontWeight:600, fontSize:'0.85rem' }}>❌ {saErr}</div>}

              {/* Create new super admin */}
              <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid #E2E8F0' }}>
                <div style={{ fontWeight:700, fontSize:'0.85rem', color:'#4C1D95', marginBottom:'0.875rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>➕ Create New Super Admin</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
                  {[{label:'Full Name', key:'name', type:'text', placeholder:'Admin name'},{label:'Email', key:'email', type:'email', placeholder:'admin@iotlearn.in'}].map(({label,key,type,placeholder}) => (
                    <div key={key}>
                      <label style={{ fontSize:'0.7rem', fontWeight:700, color:'#6b7280', textTransform:'uppercase', display:'block', marginBottom:3 }}>{label}</label>
                      <input type={type} placeholder={placeholder} value={(saForm as any)[key]}
                        onChange={e => setSaForm(f => ({...f, [key]:e.target.value}))}
                        style={{ display:'block', width:'100%', padding:'0.6rem 0.75rem', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:'0.875rem', fontFamily:'inherit', boxSizing:'border-box' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'0.75rem', alignItems:'end' }}>
                  <div>
                    <label style={{ fontSize:'0.7rem', fontWeight:700, color:'#6b7280', textTransform:'uppercase', display:'block', marginBottom:3 }}>Password</label>
                    <input type="password" placeholder="Min 8 characters" value={saForm.password}
                      onChange={e => setSaForm(f => ({...f, password:e.target.value}))}
                      style={{ display:'block', width:'100%', padding:'0.6rem 0.75rem', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:'0.875rem', fontFamily:'inherit', boxSizing:'border-box' }} />
                  </div>
                  <button onClick={createSuperAdmin} disabled={saSaving}
                    style={{ padding:'0.6rem 1.25rem', borderRadius:8, background:'#7C3AED', color:'#fff', border:'none', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', whiteSpace:'nowrap', opacity:saSaving?0.7:1 }}>
                    {saSaving ? 'Creating…' : '+ Create'}
                  </button>
                </div>
              </div>

              {/* List of super admins */}
              <div style={{ padding:'1.25rem 1.5rem' }}>
                <div style={{ fontWeight:700, fontSize:'0.85rem', color:'#4C1D95', marginBottom:'0.875rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Current Super Admins ({superAdmins.length})</div>
                {saLoading ? (
                  <div style={{ textAlign:'center', padding:'2rem', color:'#94A3B8' }}>Loading…</div>
                ) : superAdmins.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'2rem', color:'#94A3B8', fontSize:'0.85rem' }}>No super admins found</div>
                ) : superAdmins.map(admin => (
                  <div key={admin.id} style={{ marginBottom:'0.75rem', border:'1.5px solid #E2E8F0', borderRadius:12, overflow:'hidden' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', padding:'0.875rem 1rem' }}>
                      <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#A855F7)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.85rem', flexShrink:0 }}>
                        {admin.name?.split(' ').map((w:string)=>w[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:'0.875rem', color:'#0F172A' }}>{admin.name}</div>
                        <div style={{ fontSize:'0.75rem', color:'#64748B' }}>{admin.email}</div>
                      </div>
                      <div style={{ display:'flex', gap:'0.4rem', flexShrink:0 }}>
                        <button onClick={() => { setSaEditId(admin.id); setSaEditForm({name:admin.name,email:admin.email||'',password:''}); setSaErr(''); setSaMsg(''); }}
                          style={{ padding:'5px 12px', borderRadius:7, background:'#EFF6FF', color:'#1A73E8', border:'1.5px solid #BFDBFE', fontSize:'0.75rem', fontWeight:700, cursor:'pointer' }}>Edit</button>
                        <button onClick={() => removeSuperAdmin(admin.id, admin.name)}
                          style={{ padding:'5px 12px', borderRadius:7, background:'#FFF5F5', color:'#DC2626', border:'1.5px solid #FECACA', fontSize:'0.75rem', fontWeight:700, cursor:'pointer' }}>Remove</button>
                      </div>
                    </div>
                    {saEditId === admin.id && (
                      <div style={{ borderTop:'1px solid #E2E8F0', padding:'0.875rem 1rem', background:'#F8FAFC', display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:'0.6rem', alignItems:'end' }}>
                        {[{label:'Name',key:'name',type:'text'},{label:'Email',key:'email',type:'email'},{label:'New Password',key:'password',type:'password'}].map(({label,key,type}) => (
                          <div key={key}>
                            <label style={{ fontSize:'0.65rem', fontWeight:700, color:'#6b7280', textTransform:'uppercase', display:'block', marginBottom:3 }}>{label}</label>
                            <input type={type} value={(saEditForm as any)[key]}
                              onChange={e => setSaEditForm(f=>({...f,[key]:e.target.value}))}
                              placeholder={key==='password'?'Leave blank to keep':''}
                              style={{ display:'block', width:'100%', padding:'0.5rem 0.65rem', borderRadius:6, border:'1.5px solid #D1D5DB', fontSize:'0.82rem', fontFamily:'inherit', boxSizing:'border-box' }} />
                          </div>
                        ))}
                        <div style={{ display:'flex', gap:'0.35rem' }}>
                          <button onClick={() => updateSuperAdmin(admin.id)} disabled={saSaving}
                            style={{ padding:'0.5rem 1rem', borderRadius:6, background:'#7C3AED', color:'#fff', border:'none', fontWeight:700, fontSize:'0.78rem', cursor:'pointer' }}>{saSaving?'…':'Save'}</button>
                          <button onClick={() => setSaEditId(null)}
                            style={{ padding:'0.5rem 0.75rem', borderRadius:6, border:'1.5px solid #E2E8F0', background:'#fff', color:'#6b7280', fontSize:'0.78rem', cursor:'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && <EditSchoolModal tenant={editing} onClose={() => setEditing(null)} onSaved={t => { setTenants(prev => prev.map(x => x.id === t.id ? t : x)); setEditing(null); }} />}
    </div>
  );
}
