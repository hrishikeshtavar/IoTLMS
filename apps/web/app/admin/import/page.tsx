'use client';
import { useState } from 'react';
import Link from 'next/link';

type PreviewRow = Record<string, string>;

export default function ImportStudents() {
  const [csv, setCsv] = useState('');
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [imported, setImported] = useState(false);

  const handleCSVChange = (text: string) => {
    setCsv(text);
    const lines = text.trim().split('\n').filter(l => l.trim());
    const [headerLine, ...dataLines] = lines;
    if (!headerLine || dataLines.length === 0) { setPreview([]); return; }
    const headers = headerLine.split(',').map(h => h.trim());
    const rows = dataLines.map(line => {
      const vals = line.split(',').map(v => v.trim());
      const obj: PreviewRow = {};
      headers.forEach((h, i) => obj[h] = vals[i] ?? '');
      return obj;
    });
    setPreview(rows);
  };

  const loadSample = () => {
    handleCSVChange(`name,email,role,language
Rahul Sharma,rahul@school.in,student,hi
Priya Patil,priya@school.in,student,mr
Amit Kumar,amit@school.in,student,en
Sneha Joshi,sneha@school.in,teacher,en`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-blue-600 text-sm hover:underline">← Admin</Link>
        <h1 className="text-lg font-bold text-blue-600">Import Students</h1>
        <span className="text-sm text-gray-500">CSV Upload</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Paste CSV Data</h2>
          <p className="text-sm text-gray-500 mb-3">
            Required columns: <code className="bg-gray-100 px-1 rounded">name, email, role, language</code>
          </p>
          <button onClick={loadSample}
            className="mb-3 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
            Load Sample Data
          </button>
          <textarea
            value={csv}
            onChange={e => handleCSVChange(e.target.value)}
            placeholder="name,email,role,language"
            className="w-full h-40 border rounded-lg p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {preview.length > 0 && (
          <div className="bg-white rounded-xl border mb-6">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Preview</h3>
              <span className="text-sm text-gray-500">{preview.length} students</span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0] ?? {}).map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-6 py-3 text-sm text-gray-700">{val}</td>
                    ))}
                    <td className="px-6 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Ready</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t">
              <button
                onClick={() => setImported(true)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  imported ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                {imported ? '✅ Imported Successfully!' : `Import ${preview.length} Students`}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
