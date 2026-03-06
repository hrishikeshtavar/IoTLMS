'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type CertData = {
  studentName: string;
  courseName: string;
  completedDate: string;
  score: string;
  certId: string;
  school: string;
  primaryColor: string;
  logoUrl: string | null;
};

export default function CertificatePage() {
  const { courseId } = useParams();
  const courseIdParam = Array.isArray(courseId) ? courseId[0] : courseId;
  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseIdParam) return;
    fetch(`http://localhost:3001/api/analytics/certificate/${courseIdParam}/student-1`)
      .then(r => r.json())
      .then(data => { setCert(data); setLoading(false); })
      .catch(() => {
        // Fallback to defaults if API fails
        setCert({
          studentName: 'Student',
          courseName: 'IoT Course',
          completedDate: new Date().toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric',
          }),
          score: '100%',
          certId: `IOTL-${courseIdParam?.slice(0, 8).toUpperCase()}`,
          school: 'IoTLearn',
          primaryColor: '#2563eb',
          logoUrl: null,
        });
        setLoading(false);
      });
  }, [courseIdParam]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Generating certificate...
    </div>
  );

  if (!cert) return null;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      {/* Actions */}
      <div className="mb-6 flex gap-4 print:hidden">
        <button onClick={() => window.print()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          🖨️ Print / Save PDF
        </button>
        <Link href="/courses"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">
          ← Back to Courses
        </Link>
      </div>

      {/* Certificate */}
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden print:shadow-none">
        {/* Top Border */}
        <div className="h-3" style={{ background: `linear-gradient(to right, ${cert.primaryColor}, #9333ea, #f97316)` }} />

        <div className="p-12 text-center">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {cert.logoUrl ? (
              <img src={cert.logoUrl} alt="School logo" className="h-12 w-auto object-contain" />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: cert.primaryColor }}>
                ⚡
              </div>
            )}
            <div className="text-left">
              <div className="text-xl font-bold" style={{ color: cert.primaryColor }}>IoTLearn LMS</div>
              <div className="text-xs text-gray-500">{cert.school}</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
            Certificate of Completion
          </div>
          <div className="text-sm text-gray-500 mb-8">This is to certify that</div>

          {/* Student Name */}
          <div className="text-5xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {cert.studentName}
          </div>
          <div className="w-48 h-0.5 mx-auto mb-8" style={{ background: cert.primaryColor }} />

          {/* Course */}
          <div className="text-sm text-gray-500 mb-3">has successfully completed the course</div>
          <div className="text-2xl font-bold mb-2" style={{ color: cert.primaryColor }}>
            {cert.courseName}
          </div>
          <div className="text-sm text-gray-500 mb-8">
            with a score of <span className="font-bold text-green-600">{cert.score}</span>
          </div>

          {/* Footer */}
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
        <div className="h-3" style={{ background: `linear-gradient(to right, #f97316, #9333ea, ${cert.primaryColor})` }} />
      </div>

      <p className="mt-6 text-xs text-gray-400 print:hidden">
        प्रमाणपत्र — IoTLearn द्वारा जारी किया गया ✅
      </p>
    </main>
  );
}
