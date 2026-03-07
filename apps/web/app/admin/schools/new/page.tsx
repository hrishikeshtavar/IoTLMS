'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PLANS = [
  { id: 'free',    label: 'Free',    desc: 'Up to 50 students, 5 courses',   price: '₹0/mo',    color: '#718096' },
  { id: 'starter', label: 'Starter', desc: 'Up to 200 students, 20 courses', price: '₹999/mo',  color: '#1A73E8' },
  { id: 'pro',     label: 'Pro',     desc: 'Unlimited students & courses',    price: '₹2499/mo', color: '#A855F7' },
];

export default function SchoolSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name_en: '', slug: '', email: '', plan_id: 'free' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const API = 'http://localhost:3001';

  function update(field: string, value: string) {
    setForm(f => {
      const updated = { ...f, [field]: value };
      if (field === 'name_en' && !f.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      return updated;
    });
  }

  async function handleSubmit() {
    setError('');
    if (!form.name_en || !form.slug || !form.email) { setError('Name, slug and email are required'); return; }
    if (!/^[a-z0-9-]+$/.test(form.slug)) { setError('Slug must be lowercase letters, numbers and hyphens only'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name_en, slug: form.slug, plan_id: form.plan_id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to create school'); return; }
      setDone(true);
      setTimeout(() => router.push('/admin'), 2500);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }

  const S: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'var(--bg)', padding: '2rem 1rem', fontFamily: "'Baloo 2', sans-serif" },
    card: { background: 'var(--card)', borderRadius: '1.5rem', padding: '2rem', width: '100%', maxWidth: '520px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid var(--border)' },
    section: { background: 'var(--bg)', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem' },
    label: { fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: '0.35rem' },
    input: { width: '100%', padding: '0.7rem 0.875rem', borderRadius: '0.75rem', border: '1.5px solid var(--border)', fontSize: '0.95rem', fontFamily: "'Baloo 2'", background: 'var(--card)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' },
  };

  if (done) return (
    <div style={S.page}>
      <div style={{ ...S.card, textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏫</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>School Created!</h1>
        <p style={{ color: 'var(--text3)' }}><strong>{form.name_en}</strong> is ready at</p>
        <code style={{ background: 'var(--bg)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', color: 'var(--primary)', fontWeight: 700 }}>{form.slug}.iotlearn.in</code>
        <p style={{ color: 'var(--text3)', marginTop: '1rem', fontSize: '0.85rem' }}>Redirecting to admin panel…</p>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Link href="/admin" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>← Admin</Link>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>🏫 New School</span>
        </div>

        {error && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <div style={S.section}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>School Name</p>
          <label style={S.label}>English *</label>
          <input value={form.name_en} onChange={e => update('name_en', e.target.value)} placeholder="Delhi Public School" style={{ ...S.input, marginBottom: '0.65rem' }} />
        </div>

        <div style={S.section}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Access Details</p>
          <label style={S.label}>School Slug *</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <input value={form.slug} onChange={e => update('slug', e.target.value.toLowerCase())} placeholder="delhi-public" style={{ ...S.input, flex: 1 }} />
            <span style={{ color: 'var(--text3)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>.iotlearn.in</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: '0.65rem' }}>Lowercase letters, numbers and hyphens only</p>
          <label style={S.label}>Admin Email *</label>
          <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="principal@school.edu.in" style={S.input} />
        </div>

        <div style={S.section}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Plan</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {PLANS.map(plan => (
              <button type="button" key={plan.id} onClick={() => update('plan_id', plan.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderRadius: '0.875rem', border: '2px solid', borderColor: form.plan_id === plan.id ? plan.color : 'var(--border)', background: form.plan_id === plan.id ? plan.color + '10' : 'var(--bg)', cursor: 'pointer', fontFamily: "'Baloo 2'", transition: 'all 0.15s' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: form.plan_id === plan.id ? plan.color : 'var(--text)', fontSize: '0.9rem' }}>{plan.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{plan.desc}</div>
                </div>
                <div style={{ fontWeight: 800, color: form.plan_id === plan.id ? plan.color : 'var(--text3)', fontSize: '0.9rem' }}>{plan.price}</div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
          {loading ? 'Creating school…' : '🏫 Create School'}
        </button>
      </div>
    </div>
  );
}
