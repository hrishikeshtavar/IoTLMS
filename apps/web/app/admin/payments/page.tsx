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
  interface Window {
    Razorpay: any;
  }
}

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

    // Load Razorpay script
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
          body: JSON.stringify({
            ...response,
            student: form.student,
            amount: parseInt(form.amount),
          }),
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
      theme: { color: '#2563eb' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setSaving(false);
  };

  const total = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-blue-600 text-sm hover:underline">← Admin Panel</Link>
        <h1 className="text-lg font-bold text-blue-600">Payments</h1>
        <span className="text-sm font-semibold text-green-600">₹{total.toLocaleString('en-IN')} collected</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Add Payment Form */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Record Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input value={form.student}
              onChange={e => setForm(p => ({ ...p, student: e.target.value }))}
              placeholder="Student name"
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              placeholder="Amount ₹" type="number"
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={form.method}
              onChange={e => setForm(p => ({ ...p, method: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
              <option>DD</option>
            </select>
            <button onClick={handleOfflineAdd} disabled={saving || !form.student}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {added ? '✅ Added!' : '+ Record'}
            </button>
          </div>

          {/* Razorpay Button */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 mb-3">Or collect online payment via Razorpay:</p>
            <button onClick={handleRazorpayPayment}
              disabled={saving || !form.student || !razorpayLoaded}
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
              💳 Pay via Razorpay ₹{form.amount}
            </button>
            {!razorpayLoaded && (
              <p className="text-xs text-gray-400 mt-1">Loading Razorpay...</p>
            )}
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Receipt', 'Student', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No payments yet</td></tr>
              ) : payments.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.receipt_no ?? '—'}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.student}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      p.method === 'Razorpay' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>{p.method}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(p.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
          <strong>Note:</strong> To go live with Razorpay, replace <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> in <code>apps/api/.env</code> with your keys from <a href="https://dashboard.razorpay.com" target="_blank" rel="noreferrer" className="underline">dashboard.razorpay.com</a>
        </div>
      </div>
    </main>
  );
}
