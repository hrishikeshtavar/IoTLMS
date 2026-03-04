import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4 max-w-2xl px-4">
        <h1 className="text-4xl font-bold text-blue-600">IoTLearn LMS</h1>
        <p className="text-gray-500 text-lg">
          White-labeled IoT & Processor Education Platform
        </p>

        <div className="flex gap-3 justify-center mt-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">English</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            हिन्दी
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            मराठी
          </span>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <Link href="/courses"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Browse Courses →
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">Sprint 2 — Student Experience 🚀</p>
      </div>
    </main>
  );
}
