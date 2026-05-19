'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/auth';

export default function NewSchoolPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', slug: '', plan_id: 'free' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  function toSlug(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.slug.trim()) { setErr('School name and slug are required.'); return; }
    setSaving(true); setErr('');
    const res = await apiFetch('/api/tenants', {
      method: 'POST',
      body: JSON.stringify({ name: form.name.trim(), slug: form.slug.trim(), plan_id: form.plan_id }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok && data.id) {
      router.push(`/super-admin/schools/${data.id}`);
    } else {
      setErr(data.message || 'Failed to create school. Slug may already be taken.');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E3A5F)', padding: '1.5rem 2rem' }}>
          <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.25rem' }}>🏫 Add New School</div>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: 4 }}>Create a new school tenant on SimuLearning</div>
        </div>

        <div style={{ padding: '2rem', display: 'grid', gap: '1.25rem' }}>
          {err && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: 10, fontWeight: 600, fontSize: '0.875rem' }}>❌ {err}</div>}

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>School Name *</label>
            <input value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value, slug: toSlug(e.target.value) })}
              placeholder="e.g. Greenfield IoT Academy"
              style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.7rem 1rem', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>School Slug * <span style={{ color: '#9ca3af', fontWeight: 400 }}>(subdomain)</span></label>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 4, border: '1.5px solid #d1d5db', borderRadius: 10, overflow: 'hidden' }}>
              <input value={form.slug}
                onChange={e => setForm({ ...form, slug: toSlug(e.target.value) })}
                placeholder="greenfield"
                style={{ flex: 1, padding: '0.7rem 1rem', border: 'none', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }} />
              <span style={{ padding: '0 1rem', color: '#9ca3af', fontSize: '0.82rem', fontWeight: 600, background: '#F9FAFB', borderLeft: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>.simulearning.in</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Plan</label>
            <select value={form.plan_id} onChange={e => setForm({ ...form, plan_id: e.target.value })}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.7rem 1rem', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box' }}>
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={() => router.push('/super-admin')}
              style={{ flex: 1, padding: '0.75rem', borderRadius: 10, background: '#F1F5F9', color: '#475569', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleCreate} disabled={saving}
              style={{ flex: 2, padding: '0.75rem', borderRadius: 10, background: 'linear-gradient(135deg,#1A73E8,#0EA5E9)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Creating…' : '🏫 Create School'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
