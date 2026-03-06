'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/cms/RichTextEditor'), { ssr: false });

const LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
] as const;

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-700',
  in_review: 'bg-blue-100 text-blue-700',
  approved: 'bg-purple-100 text-purple-700',
  published: 'bg-green-100 text-green-700',
};

export default function LessonContentPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<'en' | 'hi' | 'mr'>('en');
  const [contents, setContents] = useState<Record<string, { id?: string; content_json: Record<string, unknown>; status: string }>>({
    en: { content_json: {}, status: 'draft' },
    hi: { content_json: {}, status: 'draft' },
    mr: { content_json: {}, status: 'draft' },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/lesson-content/lesson/${lessonId}`)
      .then(r => r.json())
      .then((data: Array<{ locale: string; id: string; content_json: Record<string, unknown>; status: string }>) => {
        const map = { ...contents };
        data.forEach(c => { map[c.locale] = { id: c.id, content_json: c.content_json, status: c.status }; });
        setContents(map);
      }).catch(() => {});
  }, [lessonId]);

  const handleSave = async () => {
    setSaving(true);
    const cur = contents[activeLocale];
    await fetch('http://localhost:3001/api/lesson-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lessonId, locale: activeLocale, content_json: cur.content_json }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleStatusChange = async (newStatus: string) => {
    const id = contents[activeLocale]?.id;
    if (!id) return;
    await fetch(`http://localhost:3001/api/lesson-content/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setContents(prev => ({ ...prev, [activeLocale]: { ...prev[activeLocale], status: newStatus } }));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-blue-600 text-sm hover:underline">← Back to Lessons</button>
        <h1 className="text-lg font-bold text-blue-600">Content Editor</h1>
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Saving…' : saved ? '✅ Saved' : 'Save Draft'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-3 mb-6">
          {LOCALES.map(loc => {
            const status = contents[loc.code]?.status ?? 'draft';
            return (
              <button key={loc.code} onClick={() => setActiveLocale(loc.code as 'en' | 'hi' | 'mr')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  activeLocale === loc.code ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}>
                <span>{loc.flag}</span> {loc.label}
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[status] ?? STATUS_COLORS.draft}`}>
                  {status}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RichTextEditor
              locale={activeLocale}
              content={contents[activeLocale]?.content_json}
              onChange={json => setContents(prev => ({ ...prev, [activeLocale]: { ...prev[activeLocale], content_json: json } }))}
            />
          </div>

          <div className="bg-white border rounded-xl p-5 space-y-4 h-fit">
            <h3 className="font-semibold text-gray-800">Approval Workflow</h3>
            <div className={`px-3 py-2 rounded-lg text-sm font-medium text-center ${STATUS_COLORS[contents[activeLocale]?.status ?? 'draft']}`}>
              {contents[activeLocale]?.status ?? 'draft'}
            </div>
            <div className="space-y-2">
              {[
                { label: 'Submit for Review', status: 'in_review', color: 'bg-blue-600' },
                { label: 'Approve', status: 'approved', color: 'bg-purple-600' },
                { label: 'Publish', status: 'published', color: 'bg-green-600' },
                { label: 'Back to Draft', status: 'draft', color: 'bg-gray-500' },
              ].map(btn => (
                <button key={btn.status} onClick={() => handleStatusChange(btn.status)}
                  className={`w-full py-2 rounded-lg text-white text-sm font-medium ${btn.color} hover:opacity-90`}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
