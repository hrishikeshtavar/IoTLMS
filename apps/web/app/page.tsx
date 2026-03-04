import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-6">
          🚀 Now Live — IoTLearn LMS v1.0
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Learn IoT & Embedded Systems
          <span className="text-blue-600"> in Your Language</span>
        </h1>
        <p className="text-xl text-gray-500 mb-4 max-w-2xl mx-auto">
          White-labeled, mobile-first LMS for schools teaching IoT, Arduino, ARM, RISC-V and more.
        </p>
        <div className="flex gap-2 justify-center mb-10">
          <span className="px-3 py-1 bg-white border rounded-full text-sm text-gray-600">🇮🇳 English</span>
          <span className="px-3 py-1 bg-white border rounded-full text-sm text-gray-600"
            style={{ fontFamily: 'Noto Sans Devanagari' }}>हिन्दी</span>
          <span className="px-3 py-1 bg-white border rounded-full text-sm text-gray-600"
            style={{ fontFamily: 'Noto Sans Devanagari' }}>मराठी</span>
        </div>

        <div className="flex gap-4 justify-center mb-20">
          <Link href="/courses"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-lg">
            Browse Courses →
          </Link>
          <Link href="/admin"
            className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-blue-300 transition-colors text-lg">
            Admin Panel
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🔬</div>
            <h3 className="font-bold text-gray-800 mb-2">Interactive Labs</h3>
            <p className="text-sm text-gray-500">Browser-based Arduino & ESP32 simulator with Wokwi. No hardware needed.</p>
          </div>
          <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-bold text-gray-800 mb-2">Mobile + Offline</h3>
            <p className="text-sm text-gray-500">PWA app works offline. Students in low-bandwidth areas can still learn.</p>
          </div>
          <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🏫</div>
            <h3 className="font-bold text-gray-800 mb-2">White-Labeled</h3>
            <p className="text-sm text-gray-500">Your school's logo, colors, and domain. Students see your brand.</p>
          </div>
          <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-bold text-gray-800 mb-2">Auto-Graded Quizzes</h3>
            <p className="text-sm text-gray-500">MCQ quiz engine with instant results, scores and pass/fail tracking.</p>
          </div>
          <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-bold text-gray-800 mb-2">Certificates</h3>
            <p className="text-sm text-gray-500">Auto-generated completion certificates with school branding.</p>
          </div>
          <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-bold text-gray-800 mb-2">Cash & UPI Payments</h3>
            <p className="text-sm text-gray-500">Record offline payments. Works for rural schools with no card access.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white px-6 py-8 text-center text-sm text-gray-500">
        <p>IoTLearn LMS — Built for Indian IoT Education 🇮🇳</p>
        <p className="mt-1 text-xs">Sprint 5 — Launch Ready ✅</p>
      </div>
    </main>
  );
}