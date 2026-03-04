'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([
    { id: 'RCP001', student: 'Rahul Sharma', amount: 2999, method: 'UPI', status: 'paid', date: '2026-03-01' },
    { id: 'RCP002', student: 'Priya Patil', amount: 2999, method: 'Cash', status: 'paid', date: '2026-03-02' },
    { id: 'RCP003', student: 'Amit Kumar', amount: 2999, method: 'UPI', status: 'pending', date: '2026-03-03' },
  ]);
  const [form, setForm] = useState({ student: '', amount: '2999', method: 'UPI' });
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!form.student) return;
    setPayments(prev => [{
      id: `RCP00${prev.length + 1}`,
      student: form.student,
      amount: parseInt(form.amount),
      method: form.method,
      status: 'paid',
      date: new Date().toISOString().split('T')[0],
    }, ...prev]);
    setForm({ student: '', amount: '2999', method: 'UPI' });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const total = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-blue-600 text-sm hover:underline">← Admin</Link>
        <h1 className="text-lg font-bold text-blue-600">Payments</h1>
        <span className="text-sm text-gray-500">Cash / UPI</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-green-600">₹{total.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Total Collected</div>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{payments.filter(p => p.status === 'paid').length}</div>
            <div className="text-xs text-gray-500 mt-1">Paid</div>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === 'pending').length}</div>
            <div className="text-xs text-gray-500 mt-1">Pending</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Record New Payment</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              value={form.student}
              onChange={e => setForm(f => ({ ...f, student: e.target.value }))}
              placeholder="Student name"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="Amount"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={form.method}
              onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
              <option>DD</option>
            </select>
          </div>
          <button onClick={handleAdd}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${added ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            {added ? '✅ Recorded!' : 'Record Payment'}
          </button>
        </div>

        <div className="bg-white rounded-xl border">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-800">Payment Records</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Receipt</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-800">{p.student}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">₹{p.amount.toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{p.method}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}