import {
  WifiOff,
  Cloud,
  CloudOff,
  Lock,
  Download,
  RefreshCw,
  Check,
} from 'lucide-react';

export default function OfflineMode() {
  const downloadedCourses = [
    {
      id: 1,
      title: 'Arduino Fundamentals',
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400',
      progress: 65,
      downloaded: true,
      lessons: 12,
    },
    {
      id: 2,
      title: 'Raspberry Pi Basics',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
      progress: 30,
      downloaded: true,
      lessons: 8,
    },
    {
      id: 3,
      title: 'IoT Security',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400',
      progress: 10,
      downloaded: false,
      lessons: 0,
    },
  ];

  const lessons = [
    { id: 1, title: '01. What is Arduino?', cached: true, type: 'video' },
    { id: 2, title: '02. Setting Up IDE', cached: true, type: 'video' },
    { id: 3, title: '03. GPIO Pins', cached: true, type: 'text' },
    { id: 4, title: '04. LED Lab', cached: false, type: 'lab', onlineOnly: true },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] max-w-[375px] mx-auto">
      {/* Top Bar */}
      <div className="bg-white border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="w-8" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm">
            I
          </div>
          <span className="font-bold">IoTLearn</span>
        </div>
        <div className="flex items-center gap-1.5 text-red-600 text-xs font-medium">
          <div className="w-2 h-2 rounded-full bg-red-600" />
          Offline
        </div>
      </div>

      {/* Offline Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 px-4 py-3">
        <div className="flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 mb-1">
              You're offline. Showing downloaded content.
            </p>
            <p className="text-sm text-amber-700">Last synced: Today at 10:23 AM</p>
          </div>
        </div>
      </div>

      {/* Downloaded Courses */}
      <div className="p-4">
        <h2 className="font-bold mb-3">My Courses</h2>
        <div className="space-y-3">
          {downloadedCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-1 ${
                !course.downloaded ? 'opacity-50' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-32 object-cover"
                />
                {course.downloaded ? (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1.5">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 bg-gray-500 text-white rounded-full p-1.5">
                    <CloudOff className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold mb-2">{course.title}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {course.progress}% Complete
                  </span>
                  {course.downloaded && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {course.lessons} lessons
                    </span>
                  )}
                </div>
                <div className="h-1.5 bg-[var(--color-surface-alt)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-primary)] rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                {!course.downloaded && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <Lock className="w-3 h-3" />
                    Available when online
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson List */}
      <div className="px-4 pb-20">
        <h3 className="font-bold mb-3">Arduino Fundamentals - Lessons</h3>
        <div className="bg-white rounded-[var(--radius-lg)] shadow-1 overflow-hidden">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`p-4 border-b border-[var(--color-border)] last:border-0 flex items-center gap-3 ${
                lesson.onlineOnly ? 'opacity-50' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  lesson.cached
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {lesson.cached ? (
                  <Download className="w-4 h-4" />
                ) : (
                  <CloudOff className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{lesson.title}</p>
                {lesson.onlineOnly && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full mt-1">
                    <Lock className="w-3 h-3" />
                    Online Only
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sync Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-50 border-t border-blue-200 px-4 py-3 max-w-[375px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-900">3 lessons ready to sync when online</span>
          </div>
        </div>
      </div>
    </div>
  );
}