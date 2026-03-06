'use client';
import { useState } from 'react';
import Link from 'next/link';

type BrandKit = {
  primaryColor: string;
  secondaryColor: string;
  schoolName: string;
  schoolNameHi: string;
  schoolNameMr: string;
  logoUrl: string;
};

const STEPS = [
  { n: 1, label: 'School Name', emoji: '🏫' },
  { n: 2, label: 'Colors',      emoji: '🎨' },
  { n: 3, label: 'Logo',        emoji: '🖼️' },
  { n: 4, label: 'Preview',     emoji: '✨' },
];

const PRESET_COLORS = ['#FF6B35','#1A73E8','#A855F7','#00C896','#E53E3E','#D97706','#0D9488'];

export default function BrandingPage() {
  const [brand, setBrand] = useState<BrandKit>({
    primaryColor: '#FF6B35',
    secondaryColor: '#1A73E8',
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
        colors_json: { primary: brand.primaryColor, secondary: brand.secondaryColor },
        fonts_json: { body: 'Baloo 2' },
        logo_url: brand.logoUrl || null,
      }),
    }).catch(() => {});
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '1.5px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontSize: '0.9rem',
    fontFamily: "'Baloo 2', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const btnNext = (label: string, onClick: () => void) => (
    <button onClick={onClick} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
      {label} →
    </button>
  );

  const btnBack = (onClick: () => void) => (
    <button onClick={onClick} className="btn-secondary" style={{ flex: 1 }}>
      ← Back
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>⚡ IoTLearn</Link>
          <Link href="/admin" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>← Admin Panel</Link>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save Brand Kit'}
        </button>
      </nav>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, var(--text) 0%, #2d2d4e 100%)', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        {['🎨','✨','🏫','🖼️','🎯'].map((em, i) => (
          <div key={i} className="animate-float" style={{ position: 'absolute', fontSize: '1.8rem', opacity: 0.07, left: `${i * 22 + 4}%`, top: `${(i * 19) % 60 + 10}%`, animationDelay: `${i * 0.5}s` }}>{em}</div>
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="animate-fadeUp" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            🎨 Brand Kit Wizard
          </h1>
          <p className="animate-fadeUp delay-100" style={{ color: '#aaa', fontSize: '0.95rem' }}>
            Customise your school's look across all pages
          </p>
        </div>
      </div>

      {/* STEP INDICATOR */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '0' }}>
          {STEPS.map((s, i) => (
            <button key={s.n} onClick={() => setStep(s.n)}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '1rem 0.5rem', background: 'transparent', border: 'none', borderBottom: step === s.n ? '3px solid var(--primary)' : '3px solid transparent', color: step === s.n ? 'var(--primary)' : step > s.n ? 'var(--accent)' : 'var(--text3)', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-1px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, background: step >= s.n ? (step > s.n ? 'var(--accent)' : 'var(--primary)') : 'var(--border)', color: step >= s.n ? '#fff' : 'var(--text3)', transition: 'all 0.2s' }}>
                {step > s.n ? '✓' : s.n}
              </span>
              <span style={{ display: 'none', ...(typeof window !== 'undefined' && window.innerWidth > 500 ? { display: 'inline' } : {}) }}>{s.emoji} {s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

        {/* FORM PANEL */}
        <div>
          {/* Step 1: School Name */}
          {step === 1 && (
            <div className="animate-popIn" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>🏫 School Name</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text3)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>🇬🇧 English</label>
                  <input value={brand.schoolName} onChange={e => setBrand(p => ({ ...p, schoolName: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text3)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>🇮🇳 हिन्दी</label>
                  <input value={brand.schoolNameHi} onChange={e => setBrand(p => ({ ...p, schoolNameHi: e.target.value }))}
                    style={{ ...inputStyle, fontFamily: 'Noto Sans Devanagari' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text3)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>🇮🇳 मराठी</label>
                  <input value={brand.schoolNameMr} onChange={e => setBrand(p => ({ ...p, schoolNameMr: e.target.value }))}
                    style={{ ...inputStyle, fontFamily: 'Noto Sans Devanagari' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                </div>
                <div style={{ paddingTop: '0.5rem' }}>{btnNext('Next: Colors', () => setStep(2))}</div>
              </div>
            </div>
          )}

          {/* Step 2: Colors */}
          {step === 2 && (
            <div className="animate-popIn" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>🎨 Brand Colors</h2>
              {(['primaryColor', 'secondaryColor'] as const).map(key => (
                <div key={key} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text3)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                    {key === 'primaryColor' ? 'Primary Color (CTAs, buttons)' : 'Secondary Color (accents, badges)'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <input type="color" value={brand[key]} onChange={e => setBrand(p => ({ ...p, [key]: e.target.value }))}
                      style={{ width: '44px', height: '44px', borderRadius: '0.5rem', border: '1.5px solid var(--border)', cursor: 'pointer', padding: '2px' }} />
                    <input value={brand[key]} onChange={e => setBrand(p => ({ ...p, [key]: e.target.value }))}
                      style={{ ...inputStyle, fontFamily: 'monospace', width: 'auto', flex: 1 }}
                      onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                  </div>
                  {/* Preset swatches */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {PRESET_COLORS.map(c => (
                      <button key={c} onClick={() => setBrand(p => ({ ...p, [key]: c }))}
                        title={c}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', background: c, border: brand[key] === c ? '3px solid var(--text)' : '2px solid transparent', cursor: 'pointer', transition: 'transform 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.25)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                {btnBack(() => setStep(1))}
                <button onClick={() => setStep(3)} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Next: Logo →</button>
              </div>
            </div>
          )}

          {/* Step 3: Logo */}
          {step === 3 && (
            <div className="animate-popIn" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>🖼️ School Logo</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: '1rem' }}>Paste a public URL to your school logo (PNG or SVG, min 512px)</p>
              <input value={brand.logoUrl} onChange={e => setBrand(p => ({ ...p, logoUrl: e.target.value }))}
                placeholder="https://your-school.in/logo.png"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              {brand.logoUrl && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: '0.75rem', border: '1px dashed var(--border)', textAlign: 'center' }}>
                  <img src={brand.logoUrl} alt="Logo preview" style={{ maxHeight: '64px', objectFit: 'contain' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1.25rem' }}>
                {btnBack(() => setStep(2))}
                <button onClick={() => setStep(4)} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Preview →</button>
              </div>
            </div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <div className="animate-popIn" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>✨ Ready to Save</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { label: 'School (EN)', value: brand.schoolName },
                  { label: 'School (HI)', value: brand.schoolNameHi, deva: true },
                  { label: 'School (MR)', value: brand.schoolNameMr, deva: true },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>{row.label}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: (row as any).deva ? 'Noto Sans Devanagari' : undefined }}>{row.value}</span>
                  </div>
                ))}
                {[
                  { label: 'Primary', color: brand.primaryColor },
                  { label: 'Secondary', color: brand.secondaryColor },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>{row.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: row.color, border: '2px solid var(--border)' }} />
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text2)' }}>{row.color}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1.25rem' }}>
                {btnBack(() => setStep(3))}
                <button onClick={handleSave} disabled={saving}
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem', background: 'linear-gradient(135deg, var(--accent), #00a87d)', color: '#fff', border: 'none', borderRadius: '999px', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', opacity: saving ? 0.7 : 1, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 12px rgba(0,200,150,0.3)' }}>
                  {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save Brand Kit'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LIVE PREVIEW */}
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text3)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview</h3>
          <div className="animate-fadeUp" style={{ background: 'var(--card)', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', border: '1.5px solid var(--border)' }}>
            {/* Top accent bar */}
            <div style={{ height: '4px', background: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.secondaryColor})` }} />
            {/* Fake nav */}
            <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt="logo" style={{ height: '28px', objectFit: 'contain' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: brand.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 800 }}>⚡</div>
                )}
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: brand.primaryColor }}>{brand.schoolName}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {['EN', 'हिं', 'मरा'].map(l => (
                  <span key={l} style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, color: '#fff', background: brand.secondaryColor }}>{l}</span>
                ))}
              </div>
            </div>
            {/* Fake hero */}
            <div style={{ padding: '1.5rem 1rem', textAlign: 'center', background: `linear-gradient(135deg, ${brand.primaryColor}11, ${brand.secondaryColor}11)` }}>
              <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, color: '#fff', background: brand.primaryColor, marginBottom: '0.75rem' }}>
                🚀 Welcome to {brand.schoolName}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.4rem' }}>Learn IoT in Your Language</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: '0.85rem' }}>Arduino · ARM · RISC-V · Raspberry Pi</p>
              <button style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: brand.primaryColor, color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                Browse Courses →
              </button>
            </div>
            {/* Fake course card */}
            <div style={{ margin: '0 0.75rem 0.75rem', padding: '0.85rem', border: '1.5px solid var(--border)', borderRadius: '0.75rem', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, color: '#fff', background: brand.secondaryColor }}>Arduino</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 700 }}>LIVE</span>
              </div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>Introduction to Arduino</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>8 lessons · Beginner</p>
              <div style={{ marginTop: '0.5rem', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: brand.primaryColor, borderRadius: '2px', transition: 'width 0.5s' }} />
              </div>
            </div>
          </div>

          {/* Color chips */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            {[{ label: 'Primary', color: brand.primaryColor }, { label: 'Secondary', color: brand.secondaryColor }].map(c => (
              <div key={c.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', background: 'var(--card)', borderRadius: '0.75rem', border: '1.5px solid var(--border)' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text3)', fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text2)' }}>{c.color}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
