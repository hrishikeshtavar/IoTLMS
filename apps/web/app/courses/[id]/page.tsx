'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Lesson = {
  id: string;
  title: string;
  type: 'lab' | 'quiz' | 'lesson' | 'video' | 'text' | string;
  content_url?: string;
};

type LessonContent = {
  id: string;
  content_json: { type: string; content: { type: string; text?: string; content?: { type: string; text: string }[] }[] };
  status: string;
};

function renderContent(content: LessonContent['content_json'] | null) {
  if (!content || !content.content) return null;
  return content.content.map((node, i) => {
    if (node.type === 'paragraph') {
      return (
        <p key={i} className="mb-4 text-gray-700 leading-relaxed">
          {node.content?.map((c, j) => <span key={j}>{c.text}</span>)}
        </p>
      );
    }
    if (node.type === 'heading') {
      return <h2 key={i} className="text-xl font-bold text-gray-800 mb-3 mt-6">{node.content?.map(c => c.text).join('')}</h2>;
    }
    if (node.type === 'bulletList') {
      return (
        <ul key={i} className="list-disc pl-6 mb-4 space-y-1">
          {node.content?.map((item, j) => (
            <li key={j} className="text-gray-700">
              {(item as any).content?.map((c: any) => c.content?.map((t: any) => t.text).join('')).join('')}
            </li>
          ))}
        </ul>
      );
    }
    if (node.type === 'codeBlock') {
      return (
        <pre key={i} className="bg-gray-900 text-green-400 rounded-lg p-4 mb-4 overflow-x-auto font-mono text-sm">
          {node.content?.map(c => c.text).join('')}
        </pre>
      );
    }
    return null;
  });
}

export default function CoursePage() {
  const { id } = useParams<{ id: string | string[] }>();
  const courseId = Array.isArray(id) ? id[0] : id;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    if (!courseId) { setLoading(false); return; }
    fetch(`http://localhost:3001/api/lessons/course/${courseId}`)
      .then(r => r.json())
      .then((data: Lesson[]) => {
        setLessons(data);
        if (data.length > 0) setActiveLesson(data[0] ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (!activeLesson) return;
    setContentLoading(true);
    setLessonContent(null);
    fetch(`http://localhost:3001/api/lesson-content/lesson/${activeLesson.id}`)
      .then(r => r.json())
      .then((data: LessonContent[]) => {
        const en = data.find(c => c.locale === 'en') ?? data[0] ?? null;
        setLessonContent(en);
        setContentLoading(false);
      })
      .catch(() => setContentLoading(false));
  }, [activeLesson]);

  const completeLesson = async (lessonId: string) => {
    const newCompleted = new Set([...completed, lessonId]);
    setCompleted(newCompleted);
    const progressPct = Math.round((newCompleted.size / lessons.length) * 100);
    await fetch(`http://localhost:3001/api/enrollments/${courseId}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'student-1', progress_pct: progressPct }),
    }).catch(() => {});
    const currentIndex = lessons.findIndex(l => l.id === lessonId);
    if (currentIndex < lessons.length - 1) {
      setActiveLesson(lessons[currentIndex + 1] ?? null);
    }
  };

  const progress = lessons.length > 0 ? Math.round((completed.size / lessons.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/courses" className="text-blue-600 hover:underline text-sm">← Back to Courses</Link>
        <h1 className="text-lg font-bold text-blue-600">IoTLearn</h1>
        <div className="text-sm text-gray-500">{progress}% complete</div>
      </div>

      <div className="h-1 bg-gray-200">
        <div className="h-1 bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading lessons...</div>
      ) : (
        <div className="flex h-[calc(100vh-57px)]">
          {/* Sidebar */}
          <div className="w-72 bg-white border-r overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-800">Lessons</h2>
              <p className="text-xs text-gray-500 mt-1">{completed.size}/{lessons.length} completed</p>
            </div>
            {lessons.map((lesson, i) => (
              <button key={lesson.id} onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left px-4 py-3 border-b flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                  activeLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  completed.has(lesson.id) ? 'bg-green-500 text-white'
                  : activeLesson?.id === lesson.id ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
                }`}>
                  {completed.has(lesson.id) ? '✓' : i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{lesson.title}</p>
                  <p className="text-xs text-gray-500 capitalize">{lesson.type}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeLesson ? (
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs capitalize">{activeLesson.type}</span>
                  {completed.has(activeLesson.id) && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✅ Completed</span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">{activeLesson.title}</h2>

                {/* Video Player */}
                {(activeLesson.type === 'video') && activeLesson.content_url && (
                  <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video">
                    <video
                      src={activeLesson.content_url}
                      controls
                      className="w-full h-full"
                      onEnded={() => completeLesson(activeLesson.id)}
                    />
                  </div>
                )}

                {/* Text / Rich Content */}
                {(activeLesson.type === 'text' || activeLesson.type === 'lesson') && (
                  <div className="bg-white rounded-xl border p-8 mb-6">
                    {contentLoading ? (
                      <div className="text-center py-8 text-gray-400">Loading content...</div>
                    ) : lessonContent ? (
                      <div className="prose max-w-none">
                        {renderContent(lessonContent.content_json)}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-4xl mb-4">📖</p>
                        <p className="text-sm">No content yet. Add it via the <Link href={`/admin/courses/${courseId}/lessons/${activeLesson.id}/content`} className="text-blue-600 underline">Content Editor</Link>.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Lab */}
                {activeLesson.type === 'lab' && (
                  <div className="bg-white rounded-xl border p-8 mb-6 text-center">
                    <p className="text-4xl mb-4">🔬</p>
                    <p className="text-lg font-medium text-gray-700 mb-4">{activeLesson.title}</p>
                    <Link href={`/lab/${activeLesson.id}`}
                      className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
                      Open Lab Simulator →
                    </Link>
                  </div>
                )}

                {/* Quiz */}
                {activeLesson.type === 'quiz' && (
                  <div className="bg-white rounded-xl border p-8 mb-6 text-center">
                    <p className="text-4xl mb-4">📝</p>
                    <p className="text-lg font-medium text-gray-700 mb-4">{activeLesson.title}</p>
                    <Link href={`/quiz/${activeLesson.id}`}
                      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                      Start Quiz →
                    </Link>
                  </div>
                )}

                {/* Complete Button */}
                {activeLesson.type !== 'video' && (
                  !completed.has(activeLesson.id) ? (
                    <button onClick={() => completeLesson(activeLesson.id)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                      Mark as Complete →
                    </button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="px-6 py-3 bg-green-100 text-green-700 rounded-xl font-medium">✅ Lesson Complete!</span>
                      {lessons.findIndex(l => l.id === activeLesson.id) < lessons.length - 1 && (
                        <button onClick={() => {
                          const next = lessons[lessons.findIndex(l => l.id === activeLesson.id) + 1];
                          if (next) setActiveLesson(next);
                        }} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                          Next Lesson →
                        </button>
                      )}
                      {progress === 100 && (
                        <Link href={`/certificate/${courseId}`}
                          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
                          🏆 Get Certificate →
                        </Link>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">No lessons yet.</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
