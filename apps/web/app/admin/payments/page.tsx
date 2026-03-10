'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/auth';

type Payment = {
  id: string;
  student: string;
  amount: number;
  method: string;
  status: string;
  receipt_no?: string;
  created_at: string;
};

const METHOD_COLORS: Record<string, string> = {
  UPI:      '#00C896',
  Cash:     '#FFD93D',
  Card:     '#1A73E8',
  DD:       '#A855F7',
  Razorpay: '#FF6B35',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  border: '1.5px solid var(--border)',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontSize: '0.9rem',
  fontFamily: "'Baloo 2', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default function PaymentsPage() {
  const [payments, setPayments]   = useState<Payment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [added, setAdded]         = useState(false);
  const [form, setForm]           = useState({ student: '', amount: '2999', method: 'UPI' });

  // Edit modal
  const [editTarget, setEditTarget] = useState<Payment | null>(null);
  const [editForm, setEditForm]     = useState({ student: '', amount: '', method: '', status: '' });
  const [editSaving, setEditSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const total = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  useEffect(() => {
    apiFetch('/api/payments')
      .then(r => r.json())
      .then(data => { setPayments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // ── Record new payment ───────────────────────────────────────────────────
  const handleRecord = async () => {
    if (!form.student.trim()) return;
    setSaving(true);
    try {
      const res = await apiFetch('/api/payments', {
        method: 'POST',
        body: JSON.stringify({
          student: form.student.trim(),
          amount: parseInt(form.amount) || 0,
          method: form.method,
        }),
      });
      if (res.ok) {
        const newPayment = await res.json();
        setPayments(prev => [newPayment, ...prev]);
        setForm({ student: '', amount: '2999', method: 'UPI' });
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
      } else {
        const err = await res.json();
        alert(`Error: ${err.message || 'Failed to record payment'}`);
      }
    } catch (e) {
      alert('Network error — is the API running?');
    } finally {
      setSaving(false);
    }
  };

  // ── Open edit modal ──────────────────────────────────────────────────────
  const openEdit = (p: Payment) => {
    setEditTarget(p);
    setEditForm({ student: p.student, amount: String(p.amount), method: p.method, status: p.status });
  };

  // ── Save edit ────────────────────────────────────────────────────────────
  const saveEdit = async () => {
    if (!editTarget) return;
    setEditSaving(true);
    try {
      const res = await apiFetch(`/api/payments/${editTarget.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          student: editForm.student,
          amount: parseInt(editForm.amount) || editTarget.amount,
          method: editForm.method,
          status: editForm.status,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPayments(prev => prev.map(p => p.id === updated.id ? updated : p));
        setEditTarget(null);
      }
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete payment ────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await apiFetch(`/api/payments/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPayments(prev => prev.filter(p => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>⚡ IoTLearn</Link>
          <Link href="/admin" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>← Admin Panel</Link>
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)' }}>
          ₹{total.toLocaleString('en-IN')} collected
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, var(--text) 0%, #2d2d4e 100%)', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        {['💳','💰','🧾','📊','💵'].map((em, i) => (
          <div key={i} className="animate-float" style={{ position: 'absolute', fontSize: '1.8rem', opacity: 0.07, left: `${i * 22 + 4}%`, top: `${(i * 19) % 60 + 10}%`, animationDelay: `${i * 0.5}s` }}>{em}</div>
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="animate-fadeUp" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            💳 Payments
          </h1>
          <p className="animate-fadeUp delay-100" style={{ color: '#aaa', fontSize: '0.95rem' }}>
            Record offline payments, edit or delete entries
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* RECORD PAYMENT FORM */}
        <div className="animate-fadeUp" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.75rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>
            ➕ Record Payment
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            <input
              value={form.student}
              onChange={e => setForm(p => ({ ...p, student: e.target.value }))}
              placeholder="Student name"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              onKeyDown={e => e.key === 'Enter' && handleRecord()}
            />
            <input
              value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              placeholder="Amount ₹"
              type="number"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
            <select
              value={form.method}
              onChange={e => setForm(p => ({ ...p, method: e.target.value }))}
              style={inputStyle}>
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
              <option>DD</option>
            </select>
            <button
              onClick={handleRecord}
              disabled={saving || !form.student.trim()}
              className="btn-primary"
              style={{ opacity: saving || !form.student.trim() ? 0.5 : 1, cursor: saving || !form.student.trim() ? 'not-allowed' : 'pointer' }}>
              {saving ? '⏳ Saving...' : added ? '✅ Added!' : '+ Record'}
            </button>
          </div>
          {added && (
            <div style={{ padding: '0.6rem 1rem', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.25)', borderRadius: '0.75rem', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
              ✅ Payment recorded successfully!
            </div>
          )}
        </div>

        {/* PAYMENTS TABLE */}
        <div className="animate-fadeUp delay-100" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>🧾 Payment History</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{payments.length} records</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Receipt', 'Student', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
                    <div className="animate-spin" style={{ fontSize: '2rem', display: 'inline-block' }}>⚙️</div>
                  </td></tr>
                ) : payments.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>💸 No payments recorded yet</td></tr>
                ) : payments.map(p => (
                  <tr key={p.id}
                    style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text3)' }}>{p.receipt_no ?? '—'}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text)' }}>{p.student}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--accent)', fontSize: '0.95rem' }}>₹{p.amount.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: (METHOD_COLORS[p.method] || '#718096') + '22', color: METHOD_COLORS[p.method] || '#718096' }}>
                        {p.method}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: p.status === 'paid' ? 'rgba(0,200,150,0.15)' : 'rgba(255,211,61,0.2)', color: p.status === 'paid' ? '#00C896' : '#b45309' }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text3)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(p.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => openEdit(p)}
                          style={{ padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Baloo 2'", transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,115,232,0.08)'; e.currentTarget.style.borderColor = 'var(--secondary)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          style={{ padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1.5px solid var(--border)', background: 'transparent', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Baloo 2'", transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = '#ef4444'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── EDIT MODAL ──────────────────────────────────────────────────────── */}
      {editTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => e.target === e.currentTarget && setEditTarget(null)}>
          <div style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '2rem', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'fadeIn 0.2s ease' }}>
            <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>✏️ Edit Payment</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: '0.35rem' }}>STUDENT NAME</label>
                <input value={editForm.student} onChange={e => setEditForm(p => ({ ...p, student: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: '0.35rem' }}>AMOUNT (₹)</label>
                <input value={editForm.amount} onChange={e => setEditForm(p => ({ ...p, amount: e.target.value }))}
                  type="number" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: '0.35rem' }}>METHOD</label>
                  <select value={editForm.method} onChange={e => setEditForm(p => ({ ...p, method: e.target.value }))} style={inputStyle}>
                    <option>UPI</option><option>Cash</option><option>Card</option><option>DD</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: '0.35rem' }}>STATUS</label>
                  <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                    <option value="paid">paid</option>
                    <option value="pending">pending</option>
                    <option value="failed">failed</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditTarget(null)}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '999px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text3)', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={saveEdit} disabled={editSaving}
                className="btn-primary"
                style={{ opacity: editSaving ? 0.6 : 1 }}>
                {editSaving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '2rem', width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🗑️</div>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Delete Payment?</h3>
            <p style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              This will permanently delete the payment record for <strong style={{ color: 'var(--text)' }}>{deleteTarget.student}</strong> (₹{deleteTarget.amount.toLocaleString('en-IN')}).
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setDeleteTarget(null)}
                style={{ padding: '0.6rem 1.5rem', borderRadius: '999px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text3)', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                style={{ padding: '0.6rem 1.5rem', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.85rem', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.6 : 1, boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
                {deleting ? '⏳ Deleting...' : '🗑️ Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
