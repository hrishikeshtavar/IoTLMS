async function getCourses(locale: string = 'en') {
  try {
    const res = await fetch(
      `http://localhost:3001/api/courses?locale=${locale}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses('en');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">IoTLearn</h1>
        <div className="flex gap-2">
          <a href="/?lang=en" className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">EN</a>
          <a href="/?lang=hi" className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">हिं</a>
          <a href="/?lang=mr" className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">मरा</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Course Catalog</h2>
        <p className="text-gray-500 mb-8">Learn IoT, Embedded Systems & Processor Architecture</p>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-lg">No courses yet. Add one via the API!</p>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {course.lessons?.length ?? 0} lessons
                </p>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add more courses hint */}
        <div className="mt-12 p-4 bg-blue-50 rounded-lg text-blue-700 text-sm text-center">
          💡 Add more courses via: <code className="bg-blue-100 px-2 py-1 rounded">POST http://localhost:3001/api/courses</code>
        </div>
      </div>
    </main>
  );
}
