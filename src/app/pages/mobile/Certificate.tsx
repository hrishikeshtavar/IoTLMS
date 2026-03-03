import { Share2, Download, Linkedin } from 'lucide-react';

export default function Certificate() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] max-w-[375px] mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-[var(--color-border)] px-4 py-4">
        <h1 className="font-bold text-xl text-center">Your Certificate</h1>
      </div>

      {/* Certificate Container */}
      <div className="p-6">
        {/* Certificate Card */}
        <div
          className="bg-white rounded-[var(--radius-lg)] p-6 shadow-2xl border-2 border-amber-400"
          style={{
            transform: 'rotate(-1.5deg)',
            width: '90%',
            margin: '0 auto',
          }}
        >
          {/* Top Logos */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-xs">
                DY
              </div>
              <span className="text-xs font-medium">DY Patil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-xs">
                I
              </div>
              <span className="text-xs font-medium">IoTLearn</span>
            </div>
          </div>

          {/* Gold Star Seal */}
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>

          {/* Certificate Content */}
          <div className="text-center space-y-2">
            <h2
              className="text-lg font-serif text-[var(--color-text-primary)] mb-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Certificate of Completion
            </h2>
            
            <p className="text-xs text-[var(--color-text-secondary)]">This certifies that</p>
            
            <div className="my-3">
              <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-1">
                Riya Sharma
              </h3>
              <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
            </div>
            
            <p className="text-xs text-[var(--color-text-secondary)]">
              has successfully completed
            </p>
            
            <h4 className="text-lg font-semibold text-[var(--color-text-primary)] my-2">
              Arduino Fundamentals
            </h4>
            
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              with a score of <span className="font-semibold text-[var(--color-primary)]">92%</span>
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)] mt-4">
              <div className="text-left">
                <p className="text-xs text-[var(--color-text-secondary)]">November 2024</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">DY Patil Institute</p>
              </div>
            </div>

            {/* Signature Lines */}
            <div className="flex items-end justify-between pt-4">
              <div className="text-center">
                <div className="h-px w-16 bg-[var(--color-border)] mb-1" />
                <p className="text-xs text-[var(--color-text-secondary)]">Instructor</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-amber-400 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-amber-600" />
              </div>
              <div className="text-center">
                <div className="h-px w-16 bg-[var(--color-border)] mb-1" />
                <p className="text-xs text-[var(--color-text-secondary)]">Director</p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-8 space-y-3">
          <h3 className="font-semibold text-center mb-4">Share Certificate</h3>
          
          <button className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] px-4 py-3 flex items-center justify-center gap-3 hover:bg-[var(--color-surface-alt)] transition-colors">
            <div className="w-8 h-8 rounded bg-[#0A66C2] flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">Share on LinkedIn</span>
          </button>
          
          <button className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] px-4 py-3 flex items-center justify-center gap-3 hover:bg-[var(--color-surface-alt)] transition-colors">
            <div className="w-8 h-8 rounded bg-[#25D366] flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">Share on WhatsApp</span>
          </button>
          
          <button className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] px-4 py-3 flex items-center justify-center gap-3 hover:bg-[var(--color-surface-alt)] transition-colors">
            <div className="w-8 h-8 rounded bg-[var(--color-primary)] flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">Download PDF</span>
          </button>
        </div>

        {/* Certificate ID */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--color-text-secondary)]">
            Certificate ID: <span className="font-mono">IOTL-2024-AF-92-RS</span>
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Verify at iotlearn.in/verify
          </p>
        </div>
      </div>
    </div>
  );
}
