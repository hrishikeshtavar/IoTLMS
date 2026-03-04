'use client';
import { useParams } from 'next/navigation';
import { useRef } from 'react';

export default function CertificatePage() {
  const { courseId } = useParams();
  const certRef = useRef<HTMLDivElement>(null);

  const cert = {
    studentName: 'Rahul Sharma',
    courseName: 'Introduction to Arduino',
    completedDate: new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    }),
    certId: `IOTL-${courseId?.toString().slice(0, 8).toUpperCase()}`,
    school: 'Dev School',
    score: '90%',
  };

  const handlePrint = () => window.print();

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      {/* Actions */}
      <div className="mb-6 flex gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
        >
          🖨️ Print / Save PDF
        </button>
        <a href="/courses"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">
          ← Back to Courses
        </a>
      </div>

      {/* Certificate */}
      <div ref={certRef}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden print:shadow-none">

        {/* Top Border */}
        <div className="h-3 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500" />

        <div className="p-12 text-center">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
              ⚡
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-blue-600">IoTLearn LMS</div>
              <div className="text-xs text-gray-500">{cert.school}</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
            Certificate of Completion
          </div>
          <div className="text-sm text-gray-500 mb-8">
            This is to certify that
          </div>

          {/* Student Name */}
          <div className="text-5xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}>
            {cert.studentName}
          </div>
          <div className="w-48 h-0.5 bg-blue-600 mx-auto mb-8" />

          {/* Course */}
          <div className="text-sm text-gray-500 mb-3">
            has successfully completed the course
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {cert.courseName}
          </div>
          <div className="text-sm text-gray-500 mb-8">
            with a score of <span className="font-bold text-green-600">{cert.score}</span>
          </div>

          {/* Date and Signatures */}
          <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
                IoTLearn
              </div>
              <div className="w-32 h-0.5 bg-gray-300 mx-auto mt-1 mb-1" />
              <div className="text-xs text-gray-500">Platform Director</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Certificate ID</div>
              <div className="font-mono text-sm font-bold text-gray-600">{cert.certId}</div>
              <div className="text-xs text-gray-400 mt-2">{cert.completedDate}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
                {cert.school}
              </div>
              <div className="w-32 h-0.5 bg-gray-300 mx-auto mt-1 mb-1" />
              <div className="text-xs text-gray-500">School Principal</div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="h-3 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600" />
      </div>

      {/* Hindi/Marathi note */}
      <p className="mt-6 text-xs text-gray-400 print:hidden">
        प्रमाणपत्र — IoTLearn द्वारा जारी किया गया ✅
      </p>
    </main>
  );
}
