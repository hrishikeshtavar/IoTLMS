export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-600">IoTLearn LMS</h1>
        <p className="text-gray-500 text-lg">
          White-labeled IoT & Processor Education Platform
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">English</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">हिन्दी</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">मराठी</span>
        </div>
        <p className="text-xs text-gray-400 mt-8">Sprint 0 — Foundation ✅</p>
      </div>
    </main>
  );
}
