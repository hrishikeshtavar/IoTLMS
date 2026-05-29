'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, getUser, getToken, logout } from '../../../lib/auth';

type Tenant = {
  id: string; name: string; slug: string;
  plan_id: string | null; is_active: boolean; created_at: string;
  _count: { students: number; courses: number; certs: number };
};
type User = {
  id: string; name: string; email: string; role: string;
  is_active: boolean; email_verified: boolean; created_at: string;
  last_login?: string; class_grade?: number; division?: string;
};
type Course = {
  id: string; title_en: string; category: string; status: string;
  _count: { enrollments: number; lessons: number };
};

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  const colors = ['#1A73E8', '#A855F7', '#00C896', '#FF6B35', '#D97706'];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: colors[hash % colors.length], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export default function SchoolDetailPage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = params.id as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'students' | 'courses' | 'branding' | 'admins'>('overview');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', is_active: true });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importTab, setImportTab] = useState<'single' | 'bulk'>('single');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{imported: number; failed: number; total: number} | null>(null);
  const [importError, setImportError] = useState('');
  const [singleForm, setSingleForm] = useState({ name: '', username: '', email: '', phone: '', password: '', class_grade: '', division: '', language_pref: 'en' });
  const [singleSaving, setSingleSaving] = useState(false);
  const [classFilter, setClassFilter] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('');
  const [brandKit, setBrandKit] = useState<any>(null);
  const [brandMsg, setBrandMsg] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [principalSigUploading, setPrincipalSigUploading] = useState(false);
  const [platformSigUploading, setPlatformSigUploading] = useState(false);
  const [principalSigProgress, setPrincipalSigProgress] = useState(0);
  const [platformSigProgress, setPlatformSigProgress] = useState(0);
  const [principalNameInput, setPrincipalNameInput] = useState('');
  const [platformDirectorInput, setPlatformDirectorInput] = useState('');
  const [certUploading, setCertUploading] = useState(false);
  const [admins, setAdmins] = useState<User[]>([]);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminMsg, setAdminMsg] = useState('');
  const [adminErr, setAdminErr] = useState('');
  const [editingAdminId, setEditingAdminId] = useState<string|null>(null);
  const [editAdminForm, setEditAdminForm] = useState({ name: '', email: '', password: '' });
  const [viewingStudent, setViewingStudent] = useState<User|null>(null);
  const [editingStudent, setEditingStudent] = useState<User|null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== 'super_admin') { router.push('/login'); return; }

    Promise.all([
      apiFetch('/api/tenants').then(r => r.json()),
      apiFetch(`/api/users?tenantId=${schoolId}`).then(r => r.json()),
      apiFetch(`/api/courses?tenantId=${schoolId}`).then(r => r.json()),
    ]).then(([tenants, allUsers, allCourses]) => {
      const t = Array.isArray(tenants) ? tenants.find((x: any) => x.id === schoolId) : null;
      if (t) {
        setTenant(t);
        setForm({ name: t.name, is_active: t.is_active });
      }
      setUsers(Array.isArray(allUsers) ? allUsers.filter((u: User) => u.role === 'student') : []);
      setAdmins(Array.isArray(allUsers) ? allUsers.filter((u: User) => u.role === 'admin') : []);
      setCourses(Array.isArray(allCourses) ? allCourses : []);
      setLoading(false);
      apiFetch(`/api/branding/tenant/${schoolId}`).then(r=>r.json()).then(d=>{if(d?.id){setBrandKit(d);setPrincipalNameInput(d.principal_name||'');setPlatformDirectorInput(d.platform_director_name||'');}}).catch(()=>{});
    }).catch(() => setLoading(false));
  }, [schoolId]);

  async function saveChanges() {
    setSaving(true); setErr(''); setMsg('');
    const res = await apiFetch(`/api/tenants/${schoolId}`, { method: 'PATCH', body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      setTenant(prev => prev ? { ...prev, ...updated } : prev);
      setEditing(false);
      setMsg('School updated successfully.');
    } else setErr('Failed to update school.');
  }

  async function saveSingleStudent() {
    if (!singleForm.name || !singleForm.email) { setImportError('Name and Email are required.'); return; }
    setSingleSaving(true); setImportError(''); setImportResult(null);
    const payload: any = { name: singleForm.name, username: singleForm.username, email: singleForm.email, role: 'student', language: singleForm.language_pref, password: singleForm.password || 'Student@1234' };
    if (singleForm.phone) payload.phone = singleForm.phone;
    if (singleForm.class_grade) payload.class_grade = parseInt(singleForm.class_grade);
    if (singleForm.division) payload.division = singleForm.division;
    const res = await apiFetch('/api/users/bulk-import', { method: 'POST', body: JSON.stringify({ tenantId: schoolId, rows: [payload] }) });
    const data = await res.json();
    setSingleSaving(false);
    if (data.imported > 0) {
      setImportResult({ imported: 1, failed: 0, total: 1 });
      setSingleForm({ name: '', username: '', email: '', phone: '', password: '', class_grade: '', division: '', language_pref: 'en' });
      const updated = await apiFetch(`/api/users?tenantId=${schoolId}`).then(r => r.json());
      setUsers(Array.isArray(updated) ? updated.filter((u: User) => u.role === 'student') : []);
    } else setImportError('Failed to add student. Email may already exist.');
  }

  async function handleBulkImport(file: File) {
    setImporting(true); setImportError(''); setImportResult(null);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(l => l.trim());
          if (lines.length < 2) { setImportError('File is empty or has no data rows.'); setImporting(false); return; }
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const nameIdx = headers.findIndex(h => h.toLowerCase().includes('name'));
          const emailIdx = headers.findIndex(h => h.toLowerCase().includes('email'));
          const langIdx = headers.findIndex(h => h.toLowerCase().includes('lang'));
          if (nameIdx === -1 || emailIdx === -1) { setImportError('Missing required columns: Name, Email'); setImporting(false); return; }
          const rows = lines.slice(1).map(line => {
            const cols = line.split(',').map(c => c.trim().replace(/"/g, ''));
            return { name: cols[nameIdx] || '', email: cols[emailIdx] || '', role: 'student', language: langIdx >= 0 ? cols[langIdx] || 'en' : 'en' };
          }).filter(r => r.name && r.email);
          const res = await apiFetch('/api/users/bulk-import', { method: 'POST', body: JSON.stringify({ tenantId: schoolId, rows }) });
          const data = await res.json();
          setImportResult(data);
          if (data.imported > 0) {
            const updated = await apiFetch(`/api/users?tenantId=${schoolId}`).then(r => r.json());
            setUsers(Array.isArray(updated) ? updated.filter((u: User) => u.role === 'student') : []);
          }
        } catch { setImportError('Failed to parse file.'); }
        setImporting(false);
      };
      reader.readAsText(file);
    } catch { setImportError('Failed to read file.'); setImporting(false); }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ color: '#64748B', fontWeight: 600 }}>Loading school…</div>
    </div>
  );

  if (!tenant) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏫</div>
        <div style={{ color: '#64748B', fontWeight: 600 }}>School not found</div>
        <button onClick={() => router.push('/super-admin')} style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, background: '#1A73E8', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>← Back</button>
      </div>
    </div>
  );

  const PLAN_COLORS: Record<string, { bg: string; color: string }> = {
    free:    { bg: '#F1F5F9', color: '#64748B' },
    starter: { bg: '#EFF6FF', color: '#1D4ED8' },
    pro:     { bg: '#F5F3FF', color: '#7C3AED' },
  };
  const plan = PLAN_COLORS[tenant.plan_id ?? 'free'] || PLAN_COLORS.free;
  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === '' || String(u.class_grade) === classFilter;
    const matchDiv = divisionFilter === '' || (u.division || '').toLowerCase() === divisionFilter.toLowerCase();
    return matchSearch && matchClass && matchDiv;
  });
  const uniqueClasses = [...new Set(users.map(u => u.class_grade).filter(Boolean))].sort((a,b) => (a||0)-(b||0));
  const uniqueDivisions = [...new Set(users.map(u => u.division).filter(Boolean))].sort();
  const totalEnrollments = courses.reduce((s, c) => s + (c._count?.enrollments || 0), 0);

  async function uploadAsset(file: File): Promise<string|null> {
    const fd=new FormData(); fd.append('file',file);
    const token=getToken();
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001'}/api/upload/file`,{method:'POST',headers:{Authorization:`Bearer ${token}`},body:fd});
    if(!res.ok)return null;
    return (await res.json()).url??null;
  }
  async function uploadLogo(file: File) {
    setLogoUploading(true);
    const url=await uploadAsset(file);
    if(url){await apiFetch('/api/branding',{method:'POST',body:JSON.stringify({tenantId:schoolId,logo_url:url})});setBrandKit((p:any)=>({...(p||{}),logo_url:url}));setBrandMsg('Logo uploaded!');setTimeout(()=>setBrandMsg(''),2500);}
    setLogoUploading(false);
  }
  async function uploadPrincipalSignature(file: File) {
    setPrincipalSigUploading(true); setPrincipalSigProgress(0);
    const interval = setInterval(()=>setPrincipalSigProgress(p=>p<85?p+12:p),200);
    const url=await uploadAsset(file);
    clearInterval(interval); setPrincipalSigProgress(100);
    if(url){await apiFetch('/api/branding',{method:'POST',body:JSON.stringify({tenantId:schoolId,principal_signature_url:url})});setBrandKit((p:any)=>({...(p||{}),principal_signature_url:url}));setBrandMsg('Principal signature uploaded!');setTimeout(()=>setBrandMsg(''),2500);}
    setTimeout(()=>{setPrincipalSigUploading(false);setPrincipalSigProgress(0);},600);
  }
  async function uploadPlatformSignature(file: File) {
    setPlatformSigUploading(true); setPlatformSigProgress(0);
    const interval = setInterval(()=>setPlatformSigProgress(p=>p<85?p+12:p),200);
    const url=await uploadAsset(file);
    clearInterval(interval); setPlatformSigProgress(100);
    if(url){await apiFetch('/api/branding',{method:'POST',body:JSON.stringify({tenantId:schoolId,platform_director_signature_url:url})});setBrandKit((p:any)=>({...(p||{}),platform_director_signature_url:url}));setBrandMsg('Platform director signature uploaded!');setTimeout(()=>setBrandMsg(''),2500);}
    setTimeout(()=>{setPlatformSigUploading(false);setPlatformSigProgress(0);},600);
  }
  async function savePrincipalName() {
    await apiFetch('/api/branding',{method:'POST',body:JSON.stringify({tenantId:schoolId,principal_name:principalNameInput})});
    setBrandKit((p:any)=>({...(p||{}),principal_name:principalNameInput}));setBrandMsg('Principal name saved!');setTimeout(()=>setBrandMsg(''),2500);
  }
  async function savePlatformDirectorName() {
    await apiFetch('/api/branding',{method:'POST',body:JSON.stringify({tenantId:schoolId,platform_director_name:platformDirectorInput})});
    setBrandKit((p:any)=>({...(p||{}),platform_director_name:platformDirectorInput}));setBrandMsg('Platform director name saved!');setTimeout(()=>setBrandMsg(''),2500);
  }
  async function uploadCertTemplate(file: File) {
    setCertUploading(true);
    const url=await uploadAsset(file);
    if(url){await apiFetch('/api/branding',{method:'POST',body:JSON.stringify({tenantId:schoolId,cert_template_url:url})});setBrandKit((p:any)=>({...(p||{}),cert_template_url:url}));setBrandMsg('Certificate template uploaded!');setTimeout(()=>setBrandMsg(''),2500);}
    setCertUploading(false);
  }
  async function removeCertTemplate() {
    await apiFetch('/api/branding',{method:'POST',body:JSON.stringify({tenantId:schoolId,cert_template_url:''})});
    setBrandKit((p:any)=>({...(p||{}),cert_template_url:null}));
    setBrandMsg('Template removed.');setTimeout(()=>setBrandMsg(''),2000);
  }
  async function createAdmin() {
    if(!adminForm.name||!adminForm.email||!adminForm.password){setAdminErr('Name, email and password required.');return;}
    setAdminSaving(true);setAdminErr('');setAdminMsg('');
    const res=await apiFetch('/api/users/bulk-import',{method:'POST',body:JSON.stringify({tenantId:schoolId,rows:[{name:adminForm.name,email:adminForm.email,password:adminForm.password,role:'admin'}]})});
    if(res.ok){setAdminMsg('Admin created!');setAdminForm({name:'',email:'',password:''});const u=await apiFetch(`/api/users?tenantId=${schoolId}`).then(r=>r.json());setAdmins(Array.isArray(u)?u.filter((x:User)=>x.role==='admin'):[]);}
    else setAdminErr('Failed to create admin.');
    setAdminSaving(false);setTimeout(()=>{setAdminMsg('');setAdminErr('');},3000);
  }
  async function deleteStudent(id: string) {
    if (!confirm('Permanently delete this student? This cannot be undone.')) return;
    const res = await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== id));
      setMsg('Student deleted.');
      setTimeout(() => setMsg(''), 3000);
    } else setErr('Failed to delete student.');
  }
  async function removeAdmin(id: string) {
    if(!confirm('Remove this admin?'))return;
    await apiFetch(`/api/users/${id}`,{method:'DELETE'});
    setAdmins(prev=>prev.filter(a=>a.id!==id));
  }
  function startEditAdmin(admin: User) {
    setEditingAdminId(admin.id);
    setEditAdminForm({ name: admin.name, email: admin.email||'', password: '' });
  }
  async function saveAdminEdit(id: string) {
    setAdminSaving(true); setAdminErr(''); setAdminMsg('');
    const updates: any[] = [];
    updates.push(apiFetch(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify({ name: editAdminForm.name, phone: undefined }) }));
    if (editAdminForm.password.length >= 8) {
      updates.push(apiFetch(`/api/users/${id}/password`, { method: 'PATCH', body: JSON.stringify({ password: editAdminForm.password }) }));
    }
    await Promise.all(updates);
    setAdmins(prev => prev.map(a => a.id===id ? { ...a, name: editAdminForm.name, email: editAdminForm.email } : a));
    setEditingAdminId(null);
    setAdminMsg('Admin updated!');
    setAdminSaving(false);
    setTimeout(() => setAdminMsg(''), 2500);
  }


  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: '#0F172A', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/super-admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#1A73E8,#00C896)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🚀</div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>SimuLearning</span>
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <button onClick={() => router.push('/super-admin')} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>← All Schools</button>
          <span style={{ color: '#334155' }}>|</span>
          <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 700 }}>{tenant.name}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(255,107,53,0.2)', color: '#FF6B35', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, alignSelf: 'center' }}>Super Admin</span>
          <button onClick={logout} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.15)', color: '#F87171', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E3A5F 60%,#0E7490 100%)', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Avatar name={tenant.name} size={64} />
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>School</div>
                <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>{tenant.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', marginTop: 3, fontFamily: 'monospace' }}>{tenant.slug}.simulearning.in</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <span style={{ padding: '3px 10px', background: plan.bg + '33', color: '#fff', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>{tenant.plan_id || 'free'}</span>
                  <span style={{ padding: '3px 10px', background: tenant.is_active ? 'rgba(0,200,150,0.2)' : 'rgba(255,255,255,0.1)', color: tenant.is_active ? '#34D399' : '#94A3B8', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>
                    {tenant.is_active ? '● Active' : '○ Inactive'}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Students', value: tenant._count.students, icon: '👨‍🎓', color: '#60A5FA' },
                { label: 'Courses', value: tenant._count.courses, icon: '📚', color: '#C084FC' },
                { label: 'Certificates', value: tenant._count.certs, icon: '🏆', color: '#FCD34D' },
                { label: 'Enrollments', value: totalEnrollments, icon: '📋', color: '#34D399' },
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

        {/* Messages */}
        {msg && <div style={{ background: '#DCFCE7', color: '#15803D', padding: '0.75rem 1rem', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>✅ {msg}</div>}
        {err && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: 10, marginBottom: 16, fontWeight: 600 }}>❌ {err}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['overview','students','courses','branding','admins'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '0.6rem 1.5rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', background: tab === t ? '#0F172A' : '#F1F5F9', color: tab === t ? '#fff' : '#374151', textTransform: 'capitalize' }}>
              {t==='overview'?'📋 Overview':t==='students'?`Students (${tenant._count.students})`:t==='courses'?`Courses (${tenant._count.courses})`:t==='branding'?'🎨 Branding':`Admins (${admins.length})`}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* School details */}
            <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>🏫 School Details</h3>
                <button onClick={() => { setEditing(!editing); setMsg(''); setErr(''); }}
                  style={{ padding: '6px 14px', borderRadius: 8, background: editing ? '#F1F5F9' : '#EFF6FF', color: editing ? '#64748B' : '#1A73E8', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                  {editing ? 'Cancel' : '✏️ Edit'}
                </button>
              </div>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>School Name</label>
                  {editing ? (
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      style={{ display: 'block', width: '100%', marginTop: 6, padding: '0.65rem 0.875rem', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  ) : <p style={{ margin: '6px 0 0', fontWeight: 700, color: '#0F172A' }}>{tenant.name}</p>}
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Slug / Domain</label>
                  <p style={{ margin: '6px 0 0', fontWeight: 600, color: '#0F172A', fontFamily: 'monospace', fontSize: '0.875rem' }}>{tenant.slug}.simulearning.in</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Plan</label>
                  <p style={{ margin: '6px 0 0' }}><span style={{ padding: '3px 12px', background: plan.bg, color: plan.color, borderRadius: 999, fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase' }}>{tenant.plan_id || 'free'}</span></p>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</label>
                  {editing ? (
                    <button onClick={() => setForm({ ...form, is_active: !form.is_active })}
                      style={{ display: 'block', marginTop: 6, padding: '6px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', background: form.is_active ? '#DCFCE7' : '#FEE2E2', color: form.is_active ? '#15803D' : '#DC2626' }}>
                      {form.is_active ? '✅ Active — click to deactivate' : '❌ Inactive — click to activate'}
                    </button>
                  ) : <p style={{ margin: '6px 0 0' }}><span style={{ padding: '3px 12px', background: tenant.is_active ? '#DCFCE7' : '#F1F5F9', color: tenant.is_active ? '#15803D' : '#64748B', borderRadius: 999, fontSize: '0.82rem', fontWeight: 700 }}>{tenant.is_active ? '● Active' : '○ Inactive'}</span></p>}
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Member Since</label>
                  <p style={{ margin: '6px 0 0', fontWeight: 600, color: '#0F172A' }}>{new Date(tenant.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                {editing && (
                  <button onClick={saveChanges} disabled={saving}
                    style={{ padding: '0.75rem', borderRadius: 10, background: '#0F172A', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>📊 Quick Stats</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Total Students', value: tenant._count.students, icon: '👨‍🎓', color: '#1A73E8', bg: '#EFF6FF' },
                    { label: 'Total Courses', value: tenant._count.courses, icon: '📚', color: '#7C3AED', bg: '#F5F3FF' },
                    { label: 'Certificates', value: tenant._count.certs, icon: '🏆', color: '#D97706', bg: '#FFFBEB' },
                    { label: 'Enrollments', value: totalEnrollments, icon: '📋', color: '#00C896', bg: '#F0FDF4' },
                  ].map(s => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>{s.icon}</div>
                      <div style={{ fontWeight: 900, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, marginTop: 3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>⚡ Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={() => setTab('students')} style={{ padding: '0.75rem', borderRadius: 10, background: '#EFF6FF', color: '#1A73E8', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left' }}>👨‍🎓 View all students →</button>
                  <button onClick={() => setTab('courses')} style={{ padding: '0.75rem', borderRadius: 10, background: '#F5F3FF', color: '#7C3AED', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left' }}>📚 View all courses →</button>
                  <button onClick={() => setForm({ ...form, is_active: !tenant.is_active })} style={{ padding: '0.75rem', borderRadius: 10, background: tenant.is_active ? '#FEF2F2' : '#F0FDF4', color: tenant.is_active ? '#DC2626' : '#15803D', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left' }}
                    onClick={async () => {
                      const res = await apiFetch(`/api/tenants/${schoolId}`, { method: 'PATCH', body: JSON.stringify({ is_active: !tenant.is_active }) });
                      if (res.ok) { const d = await res.json(); setTenant(prev => prev ? { ...prev, is_active: d.is_active } : prev); setMsg(`School ${d.is_active ? 'activated' : 'deactivated'}.`); }
                    }}>
                    {tenant.is_active ? '⏸ Deactivate School' : '▶️ Activate School'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {tab === 'students' && (
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            {/* Import Modal */}
            {showImport && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                onClick={e => e.target === e.currentTarget && setShowImport(false)}>
                <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                  <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E3A5F)', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>➕ Add Students</div>
                      <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginTop: 2 }}>Add a single student or bulk import via Excel</div>
                    </div>
                    <button onClick={() => { setShowImport(false); setImportResult(null); setImportError(''); }}
                      style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                  </div>
                  <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
                    {([['single', '👤 Single Student'], ['bulk', '📥 Bulk Import']] as const).map(([t, label]) => (
                      <button key={t} onClick={() => { setImportTab(t); setImportResult(null); setImportError(''); }}
                        style={{ flex: 1, padding: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', background: importTab === t ? '#EFF6FF' : '#fff', color: importTab === t ? '#1A73E8' : '#6b7280', borderBottom: importTab === t ? '2px solid #1A73E8' : '2px solid transparent' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    {importError && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.6rem 1rem', borderRadius: 8, marginBottom: 12, fontSize: '0.82rem', fontWeight: 600 }}>❌ {importError}</div>}
                    {importResult && (
                      <div style={{ background: '#DCFCE7', color: '#15803D', padding: '0.875rem 1rem', borderRadius: 10, marginBottom: 12, fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 800, marginBottom: 4 }}>✅ {importTab === 'single' ? 'Student Added!' : 'Import Complete!'}</div>
                        <div>Imported: <strong>{importResult.imported}</strong> · Failed: <strong>{importResult.failed}</strong> · Total: <strong>{importResult.total}</strong></div>
                      </div>
                    )}
                    {importTab === 'single' && (
                      <div style={{ display: 'grid', gap: '0.875rem' }}>
                        {[
                          { label: 'Full Name *', key: 'name', placeholder: 'Rahul Sharma', type: 'text' },
                          { label: 'Username *', key: 'username', placeholder: 'rahul.sharma', type: 'text' },
                          { label: 'Email Address *', key: 'email', placeholder: 'rahul@school.edu', type: 'email' },
                          { label: 'Phone Number', key: 'phone', placeholder: '+91 9876543210', type: 'text' },
                          { label: 'Password', key: 'password', placeholder: 'Default: Student@1234', type: 'password' },
                        ].map(({ label, key, placeholder, type }) => (
                          <div key={key}>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                            <input type={type} placeholder={placeholder} value={singleForm[key as keyof typeof singleForm]}
                              onChange={e => setSingleForm({ ...singleForm, [key]: e.target.value })}
                              style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.65rem 0.875rem', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: '0.875rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                          </div>
                        ))}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Class</label>
                            <select value={singleForm.class_grade} onChange={e => setSingleForm({ ...singleForm, class_grade: e.target.value })}
                              style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.65rem 0.5rem', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: '0.875rem', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                              <option value="">—</option>
                              {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => <option key={g} value={g}>Class {g}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Division</label>
                            <input placeholder="A" value={singleForm.division} onChange={e => setSingleForm({ ...singleForm, division: e.target.value })}
                              style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.65rem 0.5rem', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: '0.875rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Language</label>
                            <select value={singleForm.language_pref} onChange={e => setSingleForm({ ...singleForm, language_pref: e.target.value })}
                              style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.65rem 0.5rem', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: '0.875rem', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                              <option value="en">English</option>
                              <option value="hi">हिंदी</option>
                              <option value="mr">मराठी</option>
                            </select>
                          </div>
                        </div>
                        <button onClick={saveSingleStudent} disabled={singleSaving}
                          style={{ padding: '0.75rem', borderRadius: 10, background: 'linear-gradient(135deg,#1A73E8,#0EA5E9)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', opacity: singleSaving ? 0.7 : 1 }}>
                          {singleSaving ? 'Adding…' : '+ Add Student'}
                        </button>
                      </div>
                    )}
                    {importTab === 'bulk' && (
                      <div>
                        <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '0.875rem 1rem', marginBottom: 14, fontSize: '0.8rem', color: '#475569' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ fontWeight: 700, color: '#0F172A' }}>📋 Required CSV/Excel Columns:</div>
                            <button onClick={() => {
                              const rows = [
                                ['Name', 'Username', 'Email', 'Phone', 'Class', 'Division', 'Language', 'Password'],
                                ['Rahul Sharma', 'rahul.sharma', 'rahul@school.edu', '+91 9876543210', '7', 'A', 'en', 'Student@1234'],
                                ['Priya Patel', 'priya.patel', 'priya@school.edu', '+91 9123456780', '8', 'B', 'hi', 'Student@1234'],
                                ['Arjun Nair', 'arjun.nair', 'arjun@school.edu', '+91 9000012345', '9', 'A', 'mr', 'Student@1234'],
                              ];
                              const csv = rows.map(r => r.join(',')).join('\n');
                              const blob = new Blob([csv], { type: 'text/csv' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url; a.download = 'student_import_template.csv';
                              a.click(); URL.revokeObjectURL(url);
                            }}
                              style={{ padding: '5px 12px', borderRadius: 8, background: '#DCFCE7', color: '#15803D', border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                              ⬇️ Download Template
                            </button>
                          </div>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {[['Name', 'Required'], ['Email', 'Required'], ['Language', 'en/hi/mr']].map(([col, hint]) => (
                              <div key={col} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, color: '#1A73E8' }}>{col}</span>
                                <span style={{ color: '#94A3B8', fontSize: '0.7rem' }}>({hint})</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: 8, fontSize: '0.72rem', color: '#94A3B8' }}>💡 Download the template, fill in student data, and upload the CSV file.</div>
                        </div>
                        <label style={{ display: 'block', border: '2px dashed #CBD5E1', borderRadius: 12, padding: '2rem', textAlign: 'center', cursor: 'pointer', background: importing ? '#F8FAFC' : '#fff' }}
                          onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLLabelElement).style.borderColor = '#1A73E8'; }}
                          onDragLeave={e => { (e.currentTarget as HTMLLabelElement).style.borderColor = '#CBD5E1'; }}
                          onDrop={e => { e.preventDefault(); (e.currentTarget as HTMLLabelElement).style.borderColor = '#CBD5E1'; const f = e.dataTransfer.files[0]; if (f) handleBulkImport(f); }}>
                          <input type="file" accept=".csv" style={{ display: 'none' }}
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleBulkImport(f); }} />
                          {importing ? (
                            <div style={{ color: '#64748B' }}>
                              <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
                              <div style={{ fontWeight: 700 }}>Processing file…</div>
                            </div>
                          ) : (
                            <div style={{ color: '#64748B' }}>
                              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📂</div>
                              <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Drop CSV file here or click to browse</div>
                              <div style={{ fontSize: '0.78rem' }}>Supports .csv format · First row must be headers</div>
                            </div>
                          )}
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>👨‍🎓 Students ({users.length})</h3>
              <button onClick={() => { setShowImport(true); setImportResult(null); setImportError(''); }}
                style={{ padding: '7px 16px', borderRadius: 8, background: 'linear-gradient(135deg,#1A73E8,#0EA5E9)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(26,115,232,0.3)' }}>
                📥 Import / Add Student
              </button>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search students…"
                  style={{ padding: '0.5rem 1rem', borderRadius: 999, border: '1.5px solid #E2E8F0', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', width: 200 }} />
                <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
                  style={{ padding: '0.5rem 0.875rem', borderRadius: 999, border: '1.5px solid #E2E8F0', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none', background: classFilter ? '#EFF6FF' : '#fff', color: classFilter ? '#1A73E8' : '#64748B', fontWeight: classFilter ? 700 : 400, cursor: 'pointer' }}>
                  <option value="">All Classes</option>
                  {uniqueClasses.map(c => <option key={c} value={String(c)}>Class {c}</option>)}
                </select>
                <select value={divisionFilter} onChange={e => setDivisionFilter(e.target.value)}
                  style={{ padding: '0.5rem 0.875rem', borderRadius: 999, border: '1.5px solid #E2E8F0', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none', background: divisionFilter ? '#EFF6FF' : '#fff', color: divisionFilter ? '#1A73E8' : '#64748B', fontWeight: divisionFilter ? 700 : 400, cursor: 'pointer' }}>
                  <option value="">All Divisions</option>
                  {uniqueDivisions.map(d => <option key={d} value={d!}>Division {d}</option>)}
                </select>
                {(classFilter || divisionFilter || search) && (
                  <button onClick={() => { setSearch(''); setClassFilter(''); setDivisionFilter(''); }}
                    style={{ padding: '0.5rem 0.875rem', borderRadius: 999, border: '1.5px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                    ✕ Clear
                  </button>
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 180px', padding: '0.6rem 1.5rem', background: '#F8FAFC', fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <div>Name</div><div>Username</div><div>Class / Div</div><div>Status</div><div>Joined</div><div></div>
            </div>
            {filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>No students found</div>
            ) : filteredUsers.map((user, i) => (
              <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 180px', padding: '0.875rem 1.5rem', borderBottom: '1px solid #F8FAFC', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={user.name} size={32} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>{user.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>student</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>@{user.email?.split('@')[0] || '—'}</div>
                <div style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>
                  {user.class_grade ? `Class ${user.class_grade}` : '—'}{user.division ? ` / ${user.division}` : ''}
                </div>
                <div><span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, fontWeight: 700, background: user.is_active ? '#DCFCE7' : '#F1F5F9', color: user.is_active ? '#15803D' : '#64748B' }}>{user.is_active ? 'Active' : 'Inactive'}</span></div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setViewingStudent(user)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid #E2E8F0', background: '#fff', color: '#1A73E8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                    View
                  </button>
                  <button onClick={() => setEditingStudent(user)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid #E2E8F0', background: '#FFF7ED', color: '#EA580C', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => deleteStudent(user.id)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COURSES TAB */}
        {tab === 'courses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
            {courses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8', gridColumn: '1/-1' }}>No courses found</div>
            ) : courses.map(course => (
              <div key={course.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.4, flex: 1 }}>{course.title_en}</h3>
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 999, background: course.status === 'published' ? '#DCFCE7' : '#FEF9C3', color: course.status === 'published' ? '#15803D' : '#92400E', fontWeight: 800, flexShrink: 0, marginLeft: 8 }}>{course.status}</span>
                </div>
                {course.category && <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 999, background: '#EFF6FF', color: '#1D4ED8', fontWeight: 700 }}>{course.category}</span>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                  <div style={{ background: '#F0FDF4', borderRadius: 8, padding: '0.5rem', textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#00C896' }}>{course._count?.enrollments || 0}</div>
                    <div style={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 700 }}>Enrolled</div>
                  </div>
                  <div style={{ background: '#F5F3FF', borderRadius: 8, padding: '0.5rem', textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#7C3AED' }}>{course._count?.lessons || 0}</div>
                    <div style={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 700 }}>Lessons</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==='branding'&&(
          <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
            {brandMsg&&<div style={{background:'#DCFCE7',color:'#15803D',padding:'0.75rem 1rem',borderRadius:8,fontWeight:600,fontSize:'0.875rem'}}>✅ {brandMsg}</div>}
            <div style={{background:'#fff',borderRadius:16,border:'1px solid #e5e7eb',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #e5e7eb',fontWeight:700,color:'#111827'}}>🏫 School Logo</div>
              <div style={{padding:'1.5rem',display:'flex',alignItems:'center',gap:'2rem',flexWrap:'wrap'}}>
                <div style={{width:112,height:112,borderRadius:12,border:'2px solid #e5e7eb',display:'flex',alignItems:'center',justifyContent:'center',background:'#f9fafb',overflow:'hidden',flexShrink:0}}>
                  {brandKit?.logo_url?<img src={brandKit.logo_url} style={{width:'100%',height:'100%',objectFit:'contain'}} alt='Logo'/>:<span style={{fontSize:'2.5rem'}}>🏫</span>}
                </div>
                <div>
                  <p style={{color:'#6b7280',fontSize:'0.875rem',marginBottom:'0.75rem',maxWidth:340}}>Upload your school logo. Shown on certificates and the student portal. PNG/JPG, recommended 400×400px.</p>
                  <label htmlFor='logo-upload' style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'8px 18px',borderRadius:8,background:logoUploading?'#9ca3af':'#1A73E8',color:'#fff',fontWeight:700,fontSize:'0.875rem',cursor:'pointer'}}>
                    {logoUploading?'⏳ Uploading…':'⬆️ Upload Logo'}
                    <input id='logo-upload' type='file' accept='image/png,image/jpeg,image/webp' style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)uploadLogo(f);}}/>
                  </label>
                </div>
              </div>
            </div>
            <div style={{background:'#fff',borderRadius:16,border:'1px solid #e5e7eb',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #e5e7eb',fontWeight:700,color:'#111827'}}>🏆 Certificate Template</div>
              <div style={{padding:'1.5rem'}}>
                <p style={{color:'#6b7280',fontSize:'0.875rem',marginBottom:'1rem',maxWidth:540}}>Upload a background image for student certificates (PNG/JPG, A4 landscape 1123×794px recommended). Student name, course, date and certificate code will be overlaid automatically.</p>
                {brandKit?.cert_template_url?(
                  <div style={{marginBottom:'1rem'}}>
                    <div style={{position:'relative',borderRadius:10,overflow:'hidden',border:'1px solid #e5e7eb',background:'#f9fafb',maxWidth:560}}>
                      <img src={brandKit.cert_template_url} style={{width:'100%',display:'block',maxHeight:300,objectFit:'contain'}} alt='Certificate Template'/>
                      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center',background:'rgba(0,0,0,0.55)',borderRadius:8,padding:'0.6rem 1.25rem',color:'#fff',pointerEvents:'none'}}>
                        <div style={{fontWeight:800,fontSize:'1rem'}}>Student Name</div>
                        <div style={{fontSize:'0.78rem',opacity:0.85}}>Course · Date · Cert Code</div>
                      </div>
                    </div>
                    <button onClick={removeCertTemplate} style={{marginTop:'0.75rem',padding:'6px 14px',borderRadius:7,border:'1.5px solid #fecaca',background:'#FFF5F5',color:'#DC2626',fontSize:'0.8rem',fontWeight:700,cursor:'pointer'}}>🗑️ Remove Template</button>
                  </div>
                ):(
                  <div style={{marginBottom:'1rem',padding:'2rem',border:'2px dashed #e5e7eb',borderRadius:10,textAlign:'center',background:'#f9fafb',color:'#94a3b8',fontSize:'0.875rem'}}>No template uploaded — certificates will use the default SimuLearning design</div>
                )}
                <label htmlFor='cert-upload' style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'8px 18px',borderRadius:8,background:certUploading?'#9ca3af':'linear-gradient(135deg,#FFD93D,#f59e0b)',color:'#111827',fontWeight:700,fontSize:'0.875rem',cursor:'pointer'}}>
                  {certUploading?'⏳ Uploading…':'📄 Upload Certificate Template'}
                  <input id='cert-upload' type='file' accept='image/png,image/jpeg' style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)uploadCertTemplate(f);}}/>
                </label>
              </div>
            </div>
            <div style={{background:'#fff',borderRadius:16,border:'1px solid #e5e7eb',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #e5e7eb',fontWeight:700,color:'#111827'}}>🎓 School Principal</div>
              <div style={{padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div>
                  <label style={{display:'block',fontSize:'0.7rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>Principal Name</label>
                  <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
                    <input value={principalNameInput} onChange={e=>setPrincipalNameInput(e.target.value)} placeholder='Dr. Ramesh Sharma' style={{flex:1,padding:'0.6rem 0.875rem',borderRadius:8,border:'1.5px solid #d1d5db',fontSize:'0.875rem',fontFamily:'inherit'}}/>
                    <button onClick={savePrincipalName} style={{padding:'8px 16px',borderRadius:8,background:'#1A73E8',color:'#fff',border:'none',fontWeight:700,fontSize:'0.85rem',cursor:'pointer',whiteSpace:'nowrap'}}>💾 Save</button>
                  </div>
                </div>
                <div>
                  <label style={{display:'block',fontSize:'0.7rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>Principal Signature</label>
                  {brandKit?.principal_signature_url&&(
                    <div style={{marginBottom:10,padding:'0.75rem',background:'#f9fafb',borderRadius:10,border:'1px solid #e5e7eb',display:'inline-block'}}>
                      <div style={{fontSize:'0.65rem',color:'#9ca3af',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>Current Signature</div>
                      <img src={brandKit.principal_signature_url} alt='Principal Sig' style={{height:52,objectFit:'contain',display:'block'}}/>
                    </div>
                  )}
                  <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexWrap:'wrap'}}>
                    <label htmlFor='principal-sig-upload' style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'8px 18px',borderRadius:8,background:principalSigUploading?'#0d7a6a':'#0D9488',color:'#fff',fontWeight:700,fontSize:'0.875rem',cursor:principalSigUploading?'not-allowed':'pointer',transition:'background 0.2s'}}>
                      {principalSigUploading?'⏳ Uploading…':'✍️ Upload Signature'}
                      <input id='principal-sig-upload' type='file' accept='image/png,image/jpeg,image/webp' style={{display:'none'}} disabled={principalSigUploading} onChange={e=>{const f=e.target.files?.[0];if(f)uploadPrincipalSignature(f);}}/>
                    </label>
                  </div>
                  {principalSigUploading&&(
                    <div style={{marginTop:10,maxWidth:320}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{fontSize:'0.72rem',color:'#0D9488',fontWeight:700}}>Uploading…</span>
                        <span style={{fontSize:'0.72rem',color:'#0D9488',fontWeight:700}}>{principalSigProgress}%</span>
                      </div>
                      <div style={{height:6,background:'#e5e7eb',borderRadius:999,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${principalSigProgress}%`,background:'linear-gradient(90deg,#0D9488,#06b6d4)',borderRadius:999,transition:'width 0.2s ease'}}/>
                      </div>
                    </div>
                  )}
                  <p style={{color:'#9ca3af',fontSize:'0.75rem',marginTop:6}}>PNG with transparent background recommended. Max 600×200px.</p>
                </div>
              </div>
            </div>
            <div style={{background:'#fff',borderRadius:16,border:'1px solid #e5e7eb',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #e5e7eb',fontWeight:700,color:'#111827'}}>🏢 Platform Director</div>
              <div style={{padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div>
                  <label style={{display:'block',fontSize:'0.7rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>Platform Director Name</label>
                  <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
                    <input value={platformDirectorInput} onChange={e=>setPlatformDirectorInput(e.target.value)} placeholder='SimuLearning Director' style={{flex:1,padding:'0.6rem 0.875rem',borderRadius:8,border:'1.5px solid #d1d5db',fontSize:'0.875rem',fontFamily:'inherit'}}/>
                    <button onClick={savePlatformDirectorName} style={{padding:'8px 16px',borderRadius:8,background:'#1A73E8',color:'#fff',border:'none',fontWeight:700,fontSize:'0.85rem',cursor:'pointer',whiteSpace:'nowrap'}}>💾 Save</button>
                  </div>
                </div>
                <div>
                  <label style={{display:'block',fontSize:'0.7rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>Platform Director Signature</label>
                  {brandKit?.platform_director_signature_url&&(
                    <div style={{marginBottom:10,padding:'0.75rem',background:'#f9fafb',borderRadius:10,border:'1px solid #e5e7eb',display:'inline-block'}}>
                      <div style={{fontSize:'0.65rem',color:'#9ca3af',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>Current Signature</div>
                      <img src={brandKit.platform_director_signature_url} alt='Director Sig' style={{height:52,objectFit:'contain',display:'block'}}/>
                    </div>
                  )}
                  <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexWrap:'wrap'}}>
                    <label htmlFor='platform-sig-upload' style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'8px 18px',borderRadius:8,background:platformSigUploading?'#6d28d9':'#7C3AED',color:'#fff',fontWeight:700,fontSize:'0.875rem',cursor:platformSigUploading?'not-allowed':'pointer',transition:'background 0.2s'}}>
                      {platformSigUploading?'⏳ Uploading…':'✍️ Upload Signature'}
                      <input id='platform-sig-upload' type='file' accept='image/png,image/jpeg,image/webp' style={{display:'none'}} disabled={platformSigUploading} onChange={e=>{const f=e.target.files?.[0];if(f)uploadPlatformSignature(f);}}/>
                    </label>
                  </div>
                  {platformSigUploading&&(
                    <div style={{marginTop:10,maxWidth:320}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{fontSize:'0.72rem',color:'#7C3AED',fontWeight:700}}>Uploading…</span>
                        <span style={{fontSize:'0.72rem',color:'#7C3AED',fontWeight:700}}>{platformSigProgress}%</span>
                      </div>
                      <div style={{height:6,background:'#e5e7eb',borderRadius:999,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${platformSigProgress}%`,background:'linear-gradient(90deg,#7C3AED,#a78bfa)',borderRadius:999,transition:'width 0.2s ease'}}/>
                      </div>
                    </div>
                  )}
                  <p style={{color:'#9ca3af',fontSize:'0.75rem',marginTop:6}}>PNG with transparent background recommended. Max 600×200px.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab==='admins'&&(
          <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
            <div style={{background:'#fff',borderRadius:16,border:'1px solid #e5e7eb',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #e5e7eb',fontWeight:700,color:'#111827'}}>➕ Create School Admin</div>
              <div style={{padding:'1.5rem'}}>
                {adminMsg&&<div style={{background:'#DCFCE7',color:'#15803D',padding:'0.6rem 0.875rem',borderRadius:7,fontSize:'0.85rem',fontWeight:600,marginBottom:12}}>✅ {adminMsg}</div>}
                {adminErr&&<div style={{background:'#FEE2E2',color:'#DC2626',padding:'0.6rem 0.875rem',borderRadius:7,fontSize:'0.85rem',fontWeight:600,marginBottom:12}}>❌ {adminErr}</div>}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:'0.75rem',alignItems:'end',flexWrap:'wrap'}}>
                  <div>
                    <label style={{display:'block',fontSize:'0.7rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Full Name</label>
                    <input value={adminForm.name} onChange={e=>setAdminForm(f=>({...f,name:e.target.value}))} placeholder='Admin name' style={{display:'block',width:'100%',padding:'0.6rem 0.75rem',borderRadius:7,border:'1.5px solid #d1d5db',fontSize:'0.875rem',fontFamily:'inherit',boxSizing:'border-box'}}/>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'0.7rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Email</label>
                    <input value={adminForm.email} onChange={e=>setAdminForm(f=>({...f,email:e.target.value}))} placeholder='admin@school.in' type='email' style={{display:'block',width:'100%',padding:'0.6rem 0.75rem',borderRadius:7,border:'1.5px solid #d1d5db',fontSize:'0.875rem',fontFamily:'inherit',boxSizing:'border-box'}}/>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'0.7rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Password</label>
                    <input value={adminForm.password} onChange={e=>setAdminForm(f=>({...f,password:e.target.value}))} placeholder='Min 8 characters' type='password' style={{display:'block',width:'100%',padding:'0.6rem 0.75rem',borderRadius:7,border:'1.5px solid #d1d5db',fontSize:'0.875rem',fontFamily:'inherit',boxSizing:'border-box'}}/>
                  </div>
                  <button onClick={createAdmin} disabled={adminSaving} style={{padding:'0.6rem 1.25rem',borderRadius:8,background:adminSaving?'#9ca3af':'#1A73E8',color:'#fff',border:'none',fontWeight:700,fontSize:'0.875rem',cursor:'pointer',whiteSpace:'nowrap'}}>
                    {adminSaving?'Creating…':'+ Create Admin'}
                  </button>
                </div>
              </div>
            </div>
            <div style={{background:'#fff',borderRadius:16,border:'1px solid #e5e7eb',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #e5e7eb',fontWeight:700,color:'#111827'}}>School Admins ({admins.length})</div>
              {admins.length===0?(
                <div style={{textAlign:'center',padding:'3rem',color:'#9ca3af'}}>
                  <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>👤</div>
                  <div style={{fontSize:'0.875rem'}}>No admins yet. Create one above.</div>
                </div>
              ):(
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 140px',padding:'0.5rem 1.5rem',background:'#f9fafb',borderBottom:'1px solid #e5e7eb',fontSize:'0.68rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em'}}>
                    <div>Name</div><div>Email</div><div>Status</div><div></div>
                  </div>
                  {admins.map(admin=>(
                    <div key={admin.id}
                      style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 140px',padding:'0.875rem 1.5rem',borderBottom:'1px solid #f3f4f6',alignItems:'center'}}
                      onMouseEnter={e=>(e.currentTarget.style.background='#fafafa')}
                      onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                      <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                        <Avatar name={admin.name} size={32}/>
                        <div>
                          <div style={{fontWeight:700,fontSize:'0.875rem',color:'#111827'}}>{admin.name}</div>
                          <div style={{fontSize:'0.7rem',color:'#9ca3af'}}>{admin.email||'—'}</div>
                        </div>
                      </div>
                      <div style={{fontSize:'0.82rem',color:'#6b7280'}}>{admin.email||'—'}</div>
                      <div><span style={{fontSize:'0.7rem',padding:'2px 8px',borderRadius:999,fontWeight:700,background:admin.is_active?'#DCFCE7':'#F3F4F6',color:admin.is_active?'#15803D':'#6b7280'}}>{admin.is_active?'Active':'Inactive'}</span></div>
                      <div style={{display:'flex',gap:'0.35rem'}}>
                        <button onClick={()=>startEditAdmin(admin)} style={{padding:'4px 10px',borderRadius:6,border:'1.5px solid #bfdbfe',background:'#EFF6FF',color:'#1A73E8',fontSize:'0.72rem',fontWeight:700,cursor:'pointer'}}>Edit</button>
                        <button onClick={()=>removeAdmin(admin.id)} style={{padding:'4px 10px',borderRadius:6,border:'1.5px solid #fecaca',background:'#FFF5F5',color:'#DC2626',fontSize:'0.72rem',fontWeight:700,cursor:'pointer'}}>Remove</button>
                      </div>
                    {editingAdminId===admin.id&&(
                      <div style={{gridColumn:'1/-1',padding:'0.875rem 1rem',background:'#f8fafc',borderTop:'1px solid #e5e7eb',display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:'0.6rem',alignItems:'end'}}>
                        <div>
                          <label style={{display:'block',fontSize:'0.65rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',marginBottom:3}}>Name</label>
                          <input value={editAdminForm.name} onChange={e=>setEditAdminForm(f=>({...f,name:e.target.value}))} style={{display:'block',width:'100%',padding:'0.5rem 0.65rem',borderRadius:6,border:'1.5px solid #d1d5db',fontSize:'0.82rem',fontFamily:'inherit',boxSizing:'border-box'}}/>
                        </div>
                        <div>
                          <label style={{display:'block',fontSize:'0.65rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',marginBottom:3}}>Email</label>
                          <input value={editAdminForm.email} onChange={e=>setEditAdminForm(f=>({...f,email:e.target.value}))} style={{display:'block',width:'100%',padding:'0.5rem 0.65rem',borderRadius:6,border:'1.5px solid #d1d5db',fontSize:'0.82rem',fontFamily:'inherit',boxSizing:'border-box'}}/>
                        </div>
                        <div>
                          <label style={{display:'block',fontSize:'0.65rem',fontWeight:700,color:'#6b7280',textTransform:'uppercase',marginBottom:3}}>New Password <span style={{color:'#9ca3af',fontWeight:400}}>(leave blank to keep)</span></label>
                          <input type='password' value={editAdminForm.password} onChange={e=>setEditAdminForm(f=>({...f,password:e.target.value}))} placeholder='Min 8 chars to change' style={{display:'block',width:'100%',padding:'0.5rem 0.65rem',borderRadius:6,border:'1.5px solid #d1d5db',fontSize:'0.82rem',fontFamily:'inherit',boxSizing:'border-box'}}/>
                        </div>
                        <div style={{display:'flex',gap:'0.35rem'}}>
                          <button onClick={()=>saveAdminEdit(admin.id)} disabled={adminSaving} style={{padding:'0.5rem 1rem',borderRadius:6,background:'#1A73E8',color:'#fff',border:'none',fontWeight:700,fontSize:'0.78rem',cursor:'pointer'}}>{adminSaving?'…':'Save'}</button>
                          <button onClick={()=>setEditingAdminId(null)} style={{padding:'0.5rem 0.75rem',borderRadius:6,border:'1.5px solid #e5e7eb',background:'#fff',color:'#6b7280',fontSize:'0.78rem',cursor:'pointer'}}>Cancel</button>
                        </div>
                    </div>
                  )}
                  </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {viewingStudent && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
          onClick={e => e.target === e.currentTarget && setViewingStudent(null)}>
          <div style={{ background: '#fff', width: 'min(440px,100vw)', height: '100%', borderLeft: '1.5px solid #e5e7eb', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', overflowY: 'auto' }}>
            <div style={{ background: 'linear-gradient(135deg,#1A73E8,#00C896)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Avatar name={viewingStudent.name} size={56} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>{viewingStudent.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' }}>@{viewingStudent.email?.split('@')[0]}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', marginTop: 2 }}>{tenant?.name}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button onClick={() => { setEditingStudent(viewingStudent); setViewingStudent(null); }}
                  style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>✏️ Edit</button>
                <button onClick={() => setViewingStudent(null)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>✕ Close</button>
              </div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {([
                { label: 'Email', value: viewingStudent.email || '—' },
                { label: 'Class', value: viewingStudent.class_grade ? `Class ${viewingStudent.class_grade}` : '—' },
                { label: 'Division', value: viewingStudent.division || '—' },
                { label: 'Status', value: viewingStudent.is_active ? '✅ Active' : '❌ Inactive' },
                { label: 'Joined', value: new Date(viewingStudent.created_at).toLocaleDateString('en-IN') },
                { label: 'Last Login', value: viewingStudent.last_login ? new Date(viewingStudent.last_login).toLocaleDateString('en-IN') : 'Never' },
              ] as {label:string;value:string}[]).map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: '0.82rem', color: '#111827', fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {editingStudent && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => e.target === e.currentTarget && setEditingStudent(null)}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 420, padding: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>✏️ Edit {editingStudent.name}</div>
              <button onClick={() => setEditingStudent(null)} style={{ background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: '0.875rem' }}>
              {([
                { label: 'Full Name', id: 'es-name', defaultValue: editingStudent.name, type: 'text' },
                { label: 'Username', id: 'es-username', defaultValue: (editingStudent as any).username || editingStudent.email?.split('@')[0] || '', type: 'text' },
                { label: 'Phone', id: 'es-phone', defaultValue: (editingStudent as any).phone || '', type: 'text' },
                { label: 'Division', id: 'es-division', defaultValue: editingStudent.division || '', type: 'text' },
              ] as {label:string;id:string;defaultValue:string;type:string}[]).map(({ label, id, defaultValue, type }) => (
                <div key={id}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{label}</label>
                  <input id={id} type={type} defaultValue={defaultValue}
                    style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.65rem 0.875rem', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.875rem', marginTop: '0.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>New Password <span style={{ color: '#9ca3af', fontWeight: 400, textTransform: 'none' }}>(leave blank to keep current)</span></div>
                <input id="es-password" type="password" placeholder="Min. 8 characters"
                  style={{ display: 'block', width: '100%', padding: '0.65rem 0.875rem', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <button onClick={async () => {
                const name = (document.getElementById('es-name') as HTMLInputElement)?.value;
                const username = (document.getElementById('es-username') as HTMLInputElement)?.value;
                const phone = (document.getElementById('es-phone') as HTMLInputElement)?.value;
                const division = (document.getElementById('es-division') as HTMLInputElement)?.value;
                const password = (document.getElementById('es-password') as HTMLInputElement)?.value;
                const payload: any = { name, username, phone, division };
                await apiFetch(`/api/users/${editingStudent.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
                if (password && password.length >= 8) {
                  await apiFetch(`/api/users/${editingStudent.id}/password`, { method: 'PATCH', body: JSON.stringify({ password }) });
                }
                setUsers(prev => prev.map(u => u.id === editingStudent.id ? { ...u, ...payload } : u));
                setEditingStudent(null);
              }} style={{ padding: '0.75rem', borderRadius: 10, background: '#1A73E8', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
