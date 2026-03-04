'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CoursePage() {
  const { id } = useParams();
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/lessons/course/${id}`)
      .then(r => r.json())
      .then(data => {
        setLessons(data);
        if (data.length > 0) setActiveLesson(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const completeLesson = (lessonId: string) => {
    setCompleted(prev => new Set([...prev, lessonId]));
    const currentIndex = lessons.findIndex(l => l.id === lessonId);
    if (currentIndex < lessons.length - 1) {
      setActiveLesson(lessons[currentIndex + 1]);
    }
  };

  const progress = lessons.length > 0
    ? Math.round((completed.size / lessons.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/courses" className="text-blue-600 hover:underline text-sm">
          ← Back to Courses
        </Link>
        <h1 className="text-lg font-bold text-blue-600">IoTLearn</h1>
        <div className="text-sm text-gray-500">{progress}% complete</div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-1 bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading lessons...</div>
      ) : (
        <div className="flex h-[calc(100vh-57px)]">
          {/* Lesson Sidebar */}
          <div className="w-72 bg-white border-r overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-800">Lessons</h2>
              <p className="text-xs text-gray-500 mt-1">
                {completed.size}/{lessons.length} completed
              </p>
            </div>
            {lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left px-4 py-3 border-b flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                  activeLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  completed.has(lesson.id)
                    ? 'bg-green-500 text-white'
                    : activeLesson?.id === lesson.id
                    ? 'bg-blue-600 text-white'
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

          {/* Lesson Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeLesson ? (
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs capitalize">
                    {activeLesson.type}
                  </span>
                  {completed.has(activeLesson.id) && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      ✅ Completed
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {activeLesson.title}
                </h2>

                {/* Lesson Content Area */}
                <div className="bg-white rounded-xl border p-8 mb-6 min-h-64">
                  <div className="text-gray-500 text-center py-8">
                    <p className="text-4xl mb-4">📖</p>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {activeLesson.title}
                    </p>
                    <p className="text-sm">
                      Lesson content will be added via the CMS in Sprint 3.
                    </p>
                  </div>
                </div>

                {/* Complete Button */}
                {!completed.has(activeLesson.id) ? (
                  <button
                    onClick={() => completeLesson(activeLesson.id)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Mark as Complete →
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="px-6 py-3 bg-green-100 text-green-700 rounded-xl font-medium">
                      ✅ Lesson Complete!
                    </span>
                    {lessons.findIndex(l => l.id === activeLesson.id) < lessons.length - 1 && (
                      <button
                        onClick={() => {
                          const next = lessons[lessons.findIndex(l => l.id === activeLesson.id) + 1];
                          setActiveLesson(next);
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                      >
                        Next Lesson →
                      </button>
                    )}
                    {progress === 100 && (
                      <span className="px-6 py-3 bg-purple-100 text-purple-700 rounded-xl font-medium">
                        🎉 Course Complete!
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                No lessons yet.
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
