'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type BrandKit = {
  primaryColor: string;
  secondaryColor: string;
  schoolName: string;
  schoolNameHi: string;
  schoolNameMr: string;
  logoUrl: string;
};

export default function BrandingPage() {
  const [brand, setBrand] = useState<BrandKit>({
    primaryColor: '#2563eb',
    secondaryColor: '#9333ea',
    schoolName: 'My IoT School',
    schoolNameHi: 'मेरी IoT स्कूल',
    schoolNameMr: 'माझी IoT शाळा',
    logoUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState(1);

  const handleSave = async () => {
    setSaving(true);
    await fetch('http://localhost:3001/api/branding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        colors_json: {
          primary: brand.primaryColor,
          secondary: brand.secondaryColor,
        },
        fonts_json: { body: 'Inter' },
        logo_url: brand.logoUrl || null,
      }),
    }).catch(() => {});
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-blue-600 text-sm hover:underline">← Admin Panel</Link>
        <h1 className="text-lg font-bold text-blue-600">Brand Kit Wizard</h1>
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Brand Kit'}
        </button>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b px-6 py-3 flex gap-6">
        {[
          { n: 1, label: 'School Name' },
          { n: 2, label: 'Colors' },
          { n: 3, label: 'Logo' },
          { n: 4, label: 'Preview' },
        ].map(s => (
          <button key={s.n} onClick={() => setStep(s.n)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              step === s.n ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= s.n ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>{s.n}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          {step === 1 && (
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <h2 className="font-semibold text-gray-800">School Name</h2>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">English</label>
                <input value={brand.schoolName}
                  onChange={e => setBrand(p => ({ ...p, schoolName: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">हिन्दी</label>
                <input value={brand.schoolNameHi}
                  onChange={e => setBrand(p => ({ ...p, schoolNameHi: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Noto Sans Devanagari' }} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">मराठी</label>
                <input value={brand.schoolNameMr}
                  onChange={e => setBrand(p => ({ ...p, schoolNameMr: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Noto Sans Devanagari' }} />
              </div>
              <button onClick={() => setStep(2)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Next: Colors →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <h2 className="font-semibold text-gray-800">Brand Colors</h2>
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={brand.primaryColor}
                    onChange={e => setBrand(p => ({ ...p, primaryColor: e.target.value }))}
                    className="w-12 h-10 rounded border cursor-pointer" />
                  <input value={brand.primaryColor}
                    onChange={e => setBrand(p => ({ ...p, primaryColor: e.target.value }))}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={brand.secondaryColor}
                    onChange={e => setBrand(p => ({ ...p, secondaryColor: e.target.value }))}
                    className="w-12 h-10 rounded border cursor-pointer" />
                  <input value={brand.secondaryColor}
                    onChange={e => setBrand(p => ({ ...p, secondaryColor: e.target.value }))}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                  ← Back
                </button>
                <button onClick={() => setStep(3)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Next: Logo →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <h2 className="font-semibold text-gray-800">Logo URL</h2>
              <p className="text-xs text-gray-500">Paste a public URL to your school logo (PNG or SVG, min 512px)</p>
              <input value={brand.logoUrl}
                onChange={e => setBrand(p => ({ ...p, logoUrl: e.target.value }))}
                placeholder="https://your-school.in/logo.png"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {brand.logoUrl && (
                <img src={brand.logoUrl} alt="Logo preview"
                  className="h-16 object-contain rounded border p-2"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                  ← Back
                </button>
                <button onClick={() => setStep(4)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Preview →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <h2 className="font-semibold text-gray-800">Ready to Save</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">School (EN)</span>
                  <span className="font-medium">{brand.schoolName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">School (HI)</span>
                  <span className="font-medium" style={{ fontFamily: 'Noto Sans Devanagari' }}>{brand.schoolNameHi}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Primary</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ background: brand.primaryColor }} />
                    <span className="font-mono text-xs">{brand.primaryColor}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Secondary</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ background: brand.secondaryColor }} />
                    <span className="font-mono text-xs">{brand.secondaryColor}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(3)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  ← Back
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                  {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save Brand Kit'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm">Live Preview</h2>
          <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
            {/* Fake nav */}
            <div className="px-4 py-3 flex items-center justify-between border-b"
              style={{ borderTopColor: brand.primaryColor, borderTopWidth: 3 }}>
              <div className="flex items-center gap-2">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt="logo" className="h-7 w-auto object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-7 h-7 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: brand.primaryColor }}>⚡</div>
                )}
                <span className="font-bold text-sm" style={{ color: brand.primaryColor }}>
                  {brand.schoolName}
                </span>
              </div>
              <div className="flex gap-1">
                {['EN', 'हिं', 'मरा'].map(l => (
                  <span key={l} className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ background: brand.secondaryColor }}>{l}</span>
                ))}
              </div>
            </div>
            {/* Fake hero */}
            <div className="p-6 text-center">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-3"
                style={{ background: brand.primaryColor }}>
                🚀 Welcome to {brand.schoolName}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Learn IoT in Your Language</h3>
              <p className="text-xs text-gray-500 mb-4">Arduino · ARM · RISC-V · Raspberry Pi</p>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: brand.primaryColor }}>
                Browse Courses →
              </button>
            </div>
            {/* Fake course card */}
            <div className="mx-4 mb-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-medium text-white"
                  style={{ background: brand.secondaryColor }}>Arduino</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">Introduction to Arduino</p>
              <p className="text-xs text-gray-500 mt-1">8 lessons · Beginner</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-1.5 rounded-full w-2/3" style={{ background: brand.primaryColor }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
