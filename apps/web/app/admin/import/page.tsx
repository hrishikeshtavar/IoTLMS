'use client';
import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/auth';

type PreviewRow = Record<string, string>;

export default function ImportStudents() {
  const [csv, setCsv] = useState('');
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; failed: number; total: number } | null>(null);

  const handleCSVChange = (text: string) => {
    setCsv(text);
    const lines = text.trim().split('\n').filter(l => l.trim());
    const [headerLine, ...dataLines] = lines;
    if (!headerLine || dataLines.length === 0) { setPreview([]); return; }
    const headers = headerLine.split(',').map(h => h.trim());
    const rows = dataLines.map(line => {
      const vals = line.split(',').map(v => v.trim());
      const obj: PreviewRow = {};
      headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
      return obj;
    });
    setPreview(rows);
  };

  const loadSample = () => {
    handleCSVChange(`name,email,role,language
Rahul Sharma,rahul@school.in,student,hi
Priya Patil,priya@school.in,student,mr
Amit Kumar,amit@school.in,student,en
Ms. Desai,desai@school.in,teacher,en`);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    setImporting(true);
    const res = await apiFetch('/api/users/bulk-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: preview }),
    });
    const data = await res.json();
    setResult(data);
    setImporting(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-blue-600 text-sm hover:underline">← Admin Panel</Link>
        <h1 className="text-lg font-bold text-blue-600">Bulk Import Students</h1>
        <span className="text-xs text-gray-400">CSV Upload</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
          <strong>CSV Format:</strong> name, email, role (student/teacher), language (en/hi/mr)
        </div>

        {/* CSV Input */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Paste CSV Data</h2>
            <button onClick={loadSample}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
              Load Sample
            </button>
          </div>
          <textarea
            value={csv}
            onChange={e => handleCSVChange(e.target.value)}
            placeholder="name,email,role,language&#10;Rahul Sharma,rahul@school.in,student,hi"
            className="w-full h-36 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-3 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Preview ({preview.length} rows)</h2>
              <button onClick={handleImport} disabled={importing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                {importing ? 'Importing...' : `Import ${preview.length} Users`}
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {Object.keys(preview[0] ?? {}).map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-4 py-2 text-gray-700">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`rounded-xl border p-6 text-center ${
            result.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="text-4xl mb-3">{result.failed === 0 ? '✅' : '⚠️'}</div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Import Complete</h2>
            <p className="text-gray-600 text-sm">
              {result.imported} imported successfully
              {result.failed > 0 && `, ${result.failed} failed`}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
