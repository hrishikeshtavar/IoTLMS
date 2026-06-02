'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, logout } from '../../lib/auth';

type Tenant = { id: string; slug: string; name: string };
type Course = {
  id: string; title_en: string; title_hi?: string; title_mr?: string;
  description_en?: string; description_hi?: string; description_mr?: string;
  slug: string; category?: string; level?: string; duration_hours?: number;
  price?: number; status: string; target_grade?: string; stream?: string;
  playlist_url?: string; tenant_id: string;
  _count?: { lessons: number; enrollments: number }; created_at: string;
};

const CATEGORIES = ['Arduino','Raspberry Pi','ARM','RISC-V','ESP32','Sensors','Electronics','IoT','General'];
const LEVELS = ['beginner','intermediate','advanced'];
const STREAMS = ['GENERAL','SCIENCE','COMMERCE','ARTS'];
const CAT_COLORS: Record<string,string> = { Arduino:'#00C896','Raspberry Pi':'#A855F7',ARM:'#1A73E8','RISC-V':'#FF6B35',ESP32:'#FFD93D',IoT:'#1A73E8',General:'#718096' };
const labelStyle: React.CSSProperties = { display:'block', fontSize:'0.72rem', fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 };
const inputStyle: React.CSSProperties = { display:'block', width:'100%', padding:'0.65rem 0.875rem', borderRadius:8, border:'1.5px solid #d1d5db', fontSize:'0.9rem', fontFamily:'inherit', boxSizing:'border-box', outline:'none' };

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

function CourseForm({ course, tenants, onSave, onClose }: { course: Partial<Course>|null; tenants: Tenant[]; onSave:(c:Course)=>void; onClose:()=>void }) {
  const isEdit = !!course?.id;
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState<'en'|'hi'|'mr'>('en');
  const [form, setForm] = useState({
    tenant_id: course?.tenant_id || tenants[0]?.id || '',
    title_en: course?.title_en || '', title_hi: course?.title_hi || '', title_mr: course?.title_mr || '',
    description_en: course?.description_en || '', description_hi: course?.description_hi || '', description_mr: course?.description_mr || '',
    slug: course?.slug || '', category: course?.category || 'General', level: course?.level || 'beginner',
    duration_hours: course?.duration_hours?.toString() || '', price: course?.price?.toString() || '0',
    target_grade: course?.target_grade || '', stream: course?.stream || 'GENERAL',
    playlist_url: course?.playlist_url || '', status: course?.status || 'draft',
  });

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val, ...(key==='title_en' && !isEdit ? { slug: slugify(val) } : {}) }));
  }

  async function handleSave() {
    if (!form.title_en.trim()) { setErr('English title is required.'); return; }
    if (!form.slug.trim()) { setErr('Slug is required.'); return; }
    setSaving(true); setErr(''); setMsg('');
    const payload = {
      title_en: form.title_en, title_hi: form.title_hi||undefined, title_mr: form.title_mr||undefined,
      description_en: form.description_en||undefined, description_hi: form.description_hi||undefined, description_mr: form.description_mr||undefined,
      slug: form.slug, category: form.category, level: form.level,
      duration_hours: form.duration_hours ? parseInt(form.duration_hours) : undefined,
      price: parseInt(form.price||'0'), target_grade: form.target_grade||undefined,
      stream: form.stream, playlist_url: form.playlist_url||undefined, status: form.status,
    };
    try {
      const res = isEdit
        ? await apiFetch(`/api/courses/${course!.id}`, { method:'PATCH', body:JSON.stringify(payload) })
        : await apiFetch('/api/courses', { method:'POST', body:JSON.stringify(payload) });
      if (res.ok) { const data = await res.json(); setMsg(isEdit?'Updated!':'Created!'); setTimeout(()=>onSave(data),700); }
      else { const e = await res.json(); setErr(e.message||'Failed to save.'); }
    } catch { setErr('Network error.'); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.55)', display:'flex', justifyContent:'flex-end' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:'#fff', width:'min(600px,100vw)', height:'100vh', overflowY:'auto', boxShadow:'-8px 0 40px rgba(0,0,0,0.15)', display:'flex', flexDirection:'column' }}>
        <div style={{ background:'linear-gradient(135deg,#1A73E8,#00C896)', padding:'1.5rem', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.8rem', fontWeight:600, marginBottom:4 }}>{isEdit?'EDITING':'NEW COURSE'}</div>
              <h2 style={{ color:'#fff', fontWeight:800, fontSize:'1.2rem', margin:0 }}>{isEdit?form.title_en||'Untitled':'Create Course'}</h2>
            </div>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.2)', border:'none', color:'#fff', width:36, height:36, borderRadius:'50%', cursor:'pointer', fontSize:'1.1rem' }}>✕</button>
          </div>
        </div>
        <div style={{ padding:'1.5rem', flex:1, display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          {msg && <div style={{ background:'#DCFCE7', color:'#15803D', padding:'0.75rem 1rem', borderRadius:8, fontWeight:600, fontSize:'0.875rem' }}>✅ {msg}</div>}
          {err && <div style={{ background:'#FEE2E2', color:'#DC2626', padding:'0.75rem 1rem', borderRadius:8, fontWeight:600, fontSize:'0.875rem' }}>❌ {err}</div>}
          {!isEdit && (
            <div>
              <label style={labelStyle}>School</label>
              <select value={form.tenant_id} onChange={e=>set('tenant_id',e.target.value)} style={inputStyle}>
                {tenants.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={labelStyle}>Title & Description</label>
            <div style={{ display:'flex', borderBottom:'1px solid #e5e7eb', marginBottom:'0.75rem' }}>
              {(['en','hi','mr'] as const).map(l=>(
                <button key={l} onClick={()=>setTab(l)} style={{ flex:1, padding:'0.5rem', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.8rem', background:tab===l?'#EFF6FF':'#fff', color:tab===l?'#1A73E8':'#6b7280', borderBottom:tab===l?'2px solid #1A73E8':'2px solid transparent' }}>
                  {l==='en'?'🇬🇧 English':l==='hi'?'🇮🇳 हिंदी':'🇮🇳 मराठी'}
                </button>
              ))}
            </div>
            {tab==='en' && <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              <input value={form.title_en} onChange={e=>set('title_en',e.target.value)} placeholder="Course title in English *" style={inputStyle}/>
              <textarea value={form.description_en} onChange={e=>set('description_en',e.target.value)} placeholder="Course description..." rows={6} style={{ ...inputStyle, resize:'vertical', lineHeight:1.6 }}/>
            </div>}
            {tab==='hi' && <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              <input value={form.title_hi} onChange={e=>set('title_hi',e.target.value)} placeholder="हिंदी में शीर्षक" style={{ ...inputStyle, fontFamily:'Noto Sans Devanagari' }}/>
              <textarea value={form.description_hi} onChange={e=>set('description_hi',e.target.value)} placeholder="हिंदी में विवरण..." rows={6} style={{ ...inputStyle, resize:'vertical', fontFamily:'Noto Sans Devanagari', lineHeight:1.6 }}/>
            </div>}
            {tab==='mr' && <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              <input value={form.title_mr} onChange={e=>set('title_mr',e.target.value)} placeholder="मराठीत शीर्षक" style={{ ...inputStyle, fontFamily:'Noto Sans Devanagari' }}/>
              <textarea value={form.description_mr} onChange={e=>set('description_mr',e.target.value)} placeholder="मराठीत वर्णन..." rows={6} style={{ ...inputStyle, resize:'vertical', fontFamily:'Noto Sans Devanagari', lineHeight:1.6 }}/>
            </div>}
          </div>
          <div>
            <label style={labelStyle}>URL Slug</label>
            <input value={form.slug} onChange={e=>set('slug',e.target.value)} placeholder="course-url-slug" style={inputStyle}/>
            <div style={{ fontSize:'0.72rem', color:'#9ca3af', marginTop:4 }}>Auto-generated from English title.</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e=>set('category',e.target.value)} style={inputStyle}>
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Level</label>
              <select value={form.level} onChange={e=>set('level',e.target.value)} style={inputStyle}>
                {LEVELS.map(l=><option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={labelStyle}>Duration (hours)</label>
              <input type="number" value={form.duration_hours} onChange={e=>set('duration_hours',e.target.value)} placeholder="e.g. 12" style={inputStyle} min="0"/>
            </div>
            <div><label style={labelStyle}>Price (₹)</label>
              <input type="number" value={form.price} onChange={e=>set('price',e.target.value)} placeholder="0 for free" style={inputStyle} min="0"/>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={labelStyle}>Target Grade</label>
              <select value={form.target_grade} onChange={e=>set('target_grade',e.target.value)} style={inputStyle}>
                <option value="">All grades</option>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(g=><option key={g} value={String(g)}>Class {g}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Stream</label>
              <select value={form.stream} onChange={e=>set('stream',e.target.value)} style={inputStyle}>
                {STREAMS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>YouTube Playlist URL (optional)</label>
            <input value={form.playlist_url} onChange={e=>set('playlist_url',e.target.value)} placeholder="https://youtube.com/playlist?list=..." style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              {(['draft','published'] as const).map(s=>(
                <button key={s} onClick={()=>set('status',s)} style={{ flex:1, padding:'0.6rem', borderRadius:8, border:'1.5px solid', borderColor:form.status===s?'#1A73E8':'#e5e7eb', background:form.status===s?'#EFF6FF':'#fff', color:form.status===s?'#1A73E8':'#6b7280', fontWeight:700, fontSize:'0.85rem', cursor:'pointer' }}>
                  {s==='draft'?'📝 Draft':'🟢 Published'}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ padding:'0.875rem', borderRadius:12, background:saving?'#9ca3af':'linear-gradient(135deg,#1A73E8,#00C896)', color:'#fff', border:'none', fontWeight:800, fontSize:'1rem', cursor:saving?'not-allowed':'pointer', marginTop:'auto' }}>
            {saving?'Saving…':isEdit?'💾 Update Course':'🚀 Create Course'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'draft'|'published'>('all');
  const [tenantFilter, setTenantFilter] = useState('');
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Course|null>(null);
  const [deleting, setDeleting] = useState<string|null>(null);

  useEffect(() => {
    apiFetch('/api/tenants').then(r=>r.json()).then(d=>setTenants(Array.isArray(d)?d:[])).catch(()=>{});
    apiFetch('/api/courses').then(r=>r.json()).then(d=>{ setCourses(Array.isArray(d)?d:[]); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  async function deleteCourse(id: string) {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    setDeleting(id);
    await apiFetch(`/api/courses/${id}`, { method:'DELETE' });
    setCourses(p=>p.filter(c=>c.id!==id));
    setDeleting(null);
  }

  async function toggleStatus(course: Course) {
    const next = course.status==='published'?'draft':'published';
    await apiFetch(`/api/courses/${course.id}/status`, { method:'PATCH', body:JSON.stringify({ status:next }) });
    setCourses(p=>p.map(c=>c.id===course.id?{ ...c, status:next }:c));
  }

  function handleSaved(saved: Course) {
    setCourses(p=>{ const i=p.findIndex(c=>c.id===saved.id); if(i>=0){ const n=[...p]; n[i]=saved; return n; } return [saved,...p]; });
    setCreating(false); setEditing(null);
  }

  const filtered = courses.filter(c =>
    c.title_en.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter==='all' || c.status===statusFilter) &&
    (!tenantFilter || c.tenant_id===tenantFilter)
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', fontFamily:'system-ui,sans-serif' }}>
      <nav style={{ position:'sticky', top:0, zIndex:50, background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 1.5rem', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 1px 6px rgba(0,0,0,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <Link href="/super-admin" style={{ display:'flex', alignItems:'center', gap:'0.4rem', textDecoration:'none' }}>
            <div style={{ width:32, height:32, background:'linear-gradient(135deg,#1A73E8,#00C896)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>🚀</div>
            <span style={{ fontWeight:800, fontSize:'1.1rem', color:'#1A73E8' }}>SimuLearning</span>
          </Link>
          <span style={{ color:'#d1d5db' }}>|</span>
          <Link href="/super-admin" style={{ color:'#6b7280', fontSize:'0.875rem', textDecoration:'none', fontWeight:500 }}>← Super Admin</Link>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <span style={{ fontSize:'0.8rem', color:'#6b7280', fontWeight:600 }}>{courses.length} courses</span>
          <button onClick={()=>window.location.href='/super-admin/courses/new'} style={{ padding:'8px 18px', borderRadius:8, background:'linear-gradient(135deg,#1A73E8,#00C896)', color:'#fff', border:'none', fontWeight:700, fontSize:'0.875rem', cursor:'pointer' }}>+ New Course</button>
          <button onClick={logout} style={{ padding:'6px 14px', borderRadius:8, background:'#FEF2F2', color:'#DC2626', border:'none', fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}>Sign Out</button>
        </div>
      </nav>
      <div style={{ background:'linear-gradient(135deg,#1e1e3f,#2d2d5e)', padding:'2.5rem 2rem' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:800, color:'#fff', margin:'0 0 0.25rem' }}>📚 Manage Courses</h1>
          <p style={{ color:'#94a3b8', fontSize:'0.9rem', margin:'0 0 1.5rem' }}>Create and edit courses across all schools</p>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            {[{ label:'Total', value:courses.length, color:'#1A73E8' },{ label:'Published', value:courses.filter(c=>c.status==='published').length, color:'#00C896' },{ label:'Draft', value:courses.filter(c=>c.status==='draft').length, color:'#FFD93D' }].map(s=>(
              <div key={s.label} style={{ background:'rgba(255,255,255,0.07)', borderRadius:12, padding:'0.875rem 1.25rem', border:'1px solid rgba(255,255,255,0.1)', minWidth:100 }}>
                <div style={{ fontWeight:800, fontSize:'1.4rem', color:s.color }}>{s.value}</div>
                <div style={{ fontSize:'0.72rem', color:'#94a3b8', fontWeight:600, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2rem 1.5rem' }}>
        <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <span style={{ position:'absolute', left:'0.875rem', top:'50%', transform:'translateY(-50%)' }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses..." style={{ width:'100%', padding:'0.65rem 1rem 0.65rem 2.5rem', borderRadius:999, border:'1.5px solid #e5e7eb', fontSize:'0.9rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}/>
          </div>
          <select value={tenantFilter} onChange={e=>setTenantFilter(e.target.value)} style={{ padding:'0.65rem 1rem', borderRadius:999, border:'1.5px solid #e5e7eb', fontSize:'0.875rem', background:'#fff', cursor:'pointer' }}>
            <option value="">All Schools</option>
            {tenants.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <div style={{ display:'flex', gap:'0.4rem' }}>
            {(['all','published','draft'] as const).map(f=>(
              <button key={f} onClick={()=>setStatusFilter(f)} style={{ padding:'0.5rem 1rem', borderRadius:999, border:'1.5px solid', borderColor:statusFilter===f?'#1A73E8':'#e5e7eb', background:statusFilter===f?'#1A73E8':'#fff', color:statusFilter===f?'#fff':'#6b7280', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', textTransform:'capitalize' }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e5e7eb', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2.5fr 1fr 1fr 1fr 140px', padding:'0.75rem 1.5rem', background:'#f9fafb', borderBottom:'1px solid #e5e7eb', fontSize:'0.72rem', fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            <div>Course</div><div>Category</div><div>Level</div><div>Status</div><div></div>
          </div>
          {loading ? (
            <div style={{ textAlign:'center', padding:'4rem', color:'#9ca3af' }}>Loading courses…</div>
          ) : filtered.length===0 ? (
            <div style={{ textAlign:'center', padding:'4rem', color:'#9ca3af' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>📭</div>
              No courses found. <button onClick={()=>window.location.href='/super-admin/courses/new'} style={{ color:'#1A73E8', fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>Create one →</button>
            </div>
          ) : filtered.map(course=>{
            const cc = CAT_COLORS[course.category||'General']||'#718096';
            return (
              <div key={course.id}
                style={{ display:'grid', gridTemplateColumns:'2.5fr 1fr 1fr 1fr 140px', padding:'1rem 1.5rem', borderBottom:'1px solid #f3f4f6', alignItems:'center' }}
                onMouseEnter={e=>(e.currentTarget.style.background='#fafafa')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#111827', marginBottom:2 }}>{course.title_en}</div>
                  <div style={{ fontSize:'0.72rem', color:'#9ca3af' }}>{course._count?.lessons||0} lessons · {course._count?.enrollments||0} enrolled</div>
                </div>
                <div><span style={{ fontSize:'0.72rem', padding:'3px 8px', borderRadius:999, fontWeight:700, background:cc+'22', color:cc }}>{course.category||'General'}</span></div>
                <div style={{ fontSize:'0.82rem', color:'#6b7280', textTransform:'capitalize' }}>{course.level||'beginner'}</div>
                <div>
                  <button onClick={()=>toggleStatus(course)} style={{ fontSize:'0.72rem', padding:'3px 10px', borderRadius:999, fontWeight:700, cursor:'pointer', border:'none', background:course.status==='published'?'#DCFCE7':'#F3F4F6', color:course.status==='published'?'#15803D':'#6b7280' }}>
                    {course.status==='published'?'🟢 Live':'📝 Draft'}
                  </button>
                </div>
                <div style={{ display:'flex', gap:'0.4rem', justifyContent:'flex-end' }}>
                  <button onClick={()=>window.location.href=`/super-admin/courses/${course.id}`} style={{ padding:'4px 12px', borderRadius:6, border:'1.5px solid #e5e7eb', background:'#fff', color:'#1A73E8', fontSize:'0.75rem', fontWeight:700, cursor:'pointer' }}>Edit</button>
                  <button onClick={()=>deleteCourse(course.id)} disabled={deleting===course.id} style={{ padding:'4px 10px', borderRadius:6, border:'1.5px solid #fecaca', background:'#FFF5F5', color:'#DC2626', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', opacity:deleting===course.id?0.5:1 }}>
                    {deleting===course.id?'…':'Del'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {(creating||editing) && <CourseForm course={editing} tenants={tenants} onSave={handleSaved} onClose={()=>{ setCreating(false); setEditing(null); }}/>}
    </div>
  );
}
