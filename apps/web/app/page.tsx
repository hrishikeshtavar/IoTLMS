import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4 max-w-2xl px-4">
        <h1 className="text-4xl font-bold text-blue-600">IoTLearn LMS</h1>
        <p className="text-gray-500 text-lg">
          White-labeled IoT & Processor Education Platform
        </p>

        {/* Language Switcher */}
        <div className="flex gap-3 justify-center mt-6">
          <a href="/?lang=en" className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200">
            English
          </a>
          <a href="/?lang=hi" className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            हिन्दी
          </a>
          <a href="/?lang=mr" className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            मराठी
          </a>
        </div>

        {/* Course List Preview */}
        <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Available Courses
          </h2>
          <div className="text-left space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
              🔌 Introduction to Arduino
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-800 text-sm">
              🖥️ ARM Cortex-M Architecture
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-800 text-sm">
              🌐 IoT Protocols: MQTT & CoAP
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Sprint 1 — Course API + i18n ✅
        </p>
      </div>
    </main>
  );
}
