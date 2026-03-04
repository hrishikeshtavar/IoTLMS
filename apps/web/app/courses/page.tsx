'use client';
import { useEffect, useState } from 'react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/courses')
      .then(r => r.json())
      .then(data => { setCourses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId: string) => {
    const res = await fetch('http://localhost:3001/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'student-1', course_id: courseId }),
    });
    if (res.ok) {
      setEnrolled(prev => new Set([...prev, courseId]));
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">IoTLearn</h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">EN</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">हिं</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">मरा</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Course Catalog</h2>
        <p className="text-gray-500 mb-8">Learn IoT, Embedded Systems & Processor Architecture</p>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📚</p>
            <p>No courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {course.category ?? 'General'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    course.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{course.lessons?.length ?? 0} lessons</p>
                <div className="flex gap-2">
  <button
    onClick={() => handleEnroll(course.id)}
    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
      enrolled.has(course.id)
        ? 'bg-green-100 text-green-700 cursor-default'
        : 'bg-blue-600 text-white hover:bg-blue-700'
    }`}
  >
    {enrolled.has(course.id) ? '✅ Enrolled!' : 'Enroll Now'}
  </button>
  <a href={`/courses/${course.id}`}
    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
    View →
  </a>
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
