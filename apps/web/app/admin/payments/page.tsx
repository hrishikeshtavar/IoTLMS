'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Payment = {
  id: string;
  student: string;
  amount: number;
  method: string;
  status: string;
  receipt_no?: string;
  created_at: string;
};

declare global {
  interface Window { Razorpay: any; }
}

const METHOD_COLORS: Record<string, string> = {
  UPI:      '#00C896',
  Cash:     '#FFD93D',
  Card:     '#1A73E8',
  DD:       '#A855F7',
  Razorpay: '#FF6B35',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [form, setForm] = useState({ student: '', amount: '2999', method: 'UPI' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [added, setAdded] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/payments')
      .then(r => r.json())
      .then(data => { setPayments(data); setLoading(false); })
      .catch(() => setLoading(false));

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleOfflineAdd = async () => {
    if (!form.student) return;
    setSaving(true);
    const res = await fetch('http://localhost:3001/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: parseInt(form.amount) }),
    });
    const newPayment = await res.json();
    setPayments(prev => [newPayment, ...prev]);
    setForm({ student: '', amount: '2999', method: 'UPI' });
    setSaving(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleRazorpayPayment = async () => {
    if (!form.student || !razorpayLoaded) return;
    setSaving(true);
    const orderRes = await fetch('http://localhost:3001/api/payments/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseInt(form.amount), student: form.student }),
    });
    const order = await orderRes.json();
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'IoTLearn LMS',
      description: 'Course Enrollment Fee',
      order_id: order.orderId,
      handler: async (response: any) => {
        const verifyRes = await fetch('http://localhost:3001/api/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...response, student: form.student, amount: parseInt(form.amount) }),
        });
        const result = await verifyRes.json();
        if (result.success) {
          setPayments(prev => [result.payment, ...prev]);
          setForm({ student: '', amount: '2999', method: 'UPI' });
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
        }
      },
      prefill: { name: form.student },
      theme: { color: '#FF6B35' },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setSaving(false);
  };

  const total = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  const inputStyle = {
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
            Record offline payments or collect online via Razorpay
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
            <input value={form.student}
              onChange={e => setForm(p => ({ ...p, student: e.target.value }))}
              placeholder="Student name"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            <input value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              placeholder="Amount ₹" type="number"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            <select value={form.method}
              onChange={e => setForm(p => ({ ...p, method: e.target.value }))}
              style={inputStyle}>
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
              <option>DD</option>
            </select>
            <button onClick={handleOfflineAdd} disabled={saving || !form.student}
              className="btn-primary"
              style={{ opacity: saving || !form.student ? 0.5 : 1 }}>
              {added ? '✅ Added!' : '+ Record'}
            </button>
          </div>

          {/* Razorpay */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '0.75rem' }}>
              Or collect online payment via Razorpay:
            </p>
            <button onClick={handleRazorpayPayment}
              disabled={saving || !form.student || !razorpayLoaded}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg, #00C896, #00a87d)', color: '#fff', border: 'none', borderRadius: '999px', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', opacity: saving || !form.student || !razorpayLoaded ? 0.5 : 1, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 12px rgba(0,200,150,0.3)' }}
              onMouseEnter={e => { (e.currentTarget.style.transform = 'translateY(-2px)'); }}
              onMouseLeave={e => { (e.currentTarget.style.transform = 'translateY(0)'); }}>
              💳 Pay via Razorpay ₹{form.amount}
            </button>
            {!razorpayLoaded && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.4rem' }}>Loading Razorpay...</p>
            )}
          </div>
        </div>

        {/* PAYMENTS TABLE */}
        <div className="animate-fadeUp delay-200" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>🧾 Payment History</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{payments.length} records</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Receipt', 'Student', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
                    <div className="animate-spin" style={{ fontSize: '2rem', display: 'inline-block' }}>⚙️</div>
                  </td></tr>
                ) : payments.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>💸 No payments recorded yet</td></tr>
                ) : payments.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
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
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text3)', fontSize: '0.8rem' }}>
                      {new Date(p.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INFO BOX */}
        <div className="animate-fadeUp delay-300" style={{ background: 'rgba(26,115,232,0.08)', border: '1.5px solid rgba(26,115,232,0.2)', borderRadius: '1rem', padding: '1rem 1.25rem', fontSize: '0.82rem', color: 'var(--secondary)' }}>
          <strong>💡 Go live with Razorpay:</strong> Add <code style={{ background: 'rgba(26,115,232,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>RAZORPAY_KEY_ID</code> and <code style={{ background: 'rgba(26,115,232,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>RAZORPAY_KEY_SECRET</code> to <code style={{ background: 'rgba(26,115,232,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>apps/api/.env</code> from your{' '}
          <a href="https://dashboard.razorpay.com" target="_blank" rel="noreferrer" style={{ color: 'var(--secondary)', textDecoration: 'underline' }}>Razorpay dashboard</a>.
        </div>
      </div>
    </div>
  );
}
