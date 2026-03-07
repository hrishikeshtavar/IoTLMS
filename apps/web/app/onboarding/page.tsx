'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'language' | 'interests' | 'done';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🟠' },
];

const INTERESTS = [
  { id: 'arduino',     emoji: '🤖', label: 'Arduino' },
  { id: 'esp32',       emoji: '📡', label: 'ESP32 / WiFi' },
  { id: 'raspi',       emoji: '🍓', label: 'Raspberry Pi' },
  { id: 'sensors',     emoji: '🔌', label: 'Sensors' },
  { id: 'arm',         emoji: '💪', label: 'ARM Processors' },
  { id: 'riscv',       emoji: '⚡', label: 'RISC-V' },
  { id: 'iot',         emoji: '🌐', label: 'IoT Protocols' },
  { id: 'electronics', emoji: '🔋', label: 'Electronics' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('language');
  const [language, setLanguage] = useState('en');
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  if (typeof window !== 'undefined' && !name) {
    try { setName(JSON.parse(localStorage.getItem('iotlearn_user') || '{}')?.name || 'Student'); } catch {}
  }

  function toggleInterest(id: string) {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  async function finish() {
    setLoading(true);
    localStorage.setItem('iotlearn_locale', language);
    localStorage.setItem('iotlearn_interests', JSON.stringify(interests));
    localStorage.setItem('iotlearn_onboarded', 'true');
    setStep('done');
    setTimeout(() => router.push('/courses'), 1800);
    setLoading(false);
  }

  const S: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1.5rem', fontFamily: "'Baloo 2', sans-serif" },
    card: { background: 'var(--card)', borderRadius: '1.5rem', padding: '2.5rem', width: '100%', maxWidth: '440px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid var(--border)' },
    title: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem', textAlign: 'center' },
    sub: { color: 'var(--text3)', marginBottom: '1.75rem', fontSize: '0.9rem', textAlign: 'center' },
    optionBtn: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '1rem', border: '2px solid', cursor: 'pointer', fontFamily: "'Baloo 2'", transition: 'all 0.15s', width: '100%', background: 'var(--bg)' },
  };

  return (
    <div style={S.page}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {(['language','interests'] as Step[]).map((s, i) => (
          <div key={s} style={{ width: '10px', height: '10px', borderRadius: '50%', background: step === s ? 'var(--primary)' : step === 'done' ? 'var(--primary)' : i === 0 && step === 'interests' ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {step === 'language' && (
        <div style={S.card}>
          <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>🌐</div>
          <h1 style={S.title}>Choose your language</h1>
          <p style={S.sub}>अपनी भाषा चुनें • आपली भाषा निवडा</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setLanguage(l.code)}
                style={{ ...S.optionBtn, borderColor: language === l.code ? 'var(--primary)' : 'var(--border)', background: language === l.code ? 'rgba(255,107,53,0.07)' : 'var(--bg)' }}>
                <span style={{ fontSize: '1.5rem' }}>{l.flag}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)' }}>{l.label}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{l.native}</div>
                </div>
                {language === l.code && <span style={{ marginLeft: 'auto', color: 'var(--primary)' }}>✓</span>}
              </button>
            ))}
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep('interests')}>
            Continue →
          </button>
        </div>
      )}

      {step === 'interests' && (
        <div style={S.card}>
          <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>🎯</div>
          <h1 style={S.title}>What interests you?</h1>
          <p style={S.sub}>Pick topics you want to learn (choose any)</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '2rem' }}>
            {INTERESTS.map(item => {
              const sel = interests.includes(item.id);
              return (
                <button key={item.id} onClick={() => toggleInterest(item.id)}
                  style={{ padding: '0.875rem', borderRadius: '1rem', border: '2px solid', borderColor: sel ? 'var(--primary)' : 'var(--border)', background: sel ? 'rgba(255,107,53,0.07)' : 'var(--bg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', transition: 'all 0.15s', transform: sel ? 'scale(1.03)' : 'scale(1)', fontFamily: "'Baloo 2'" }}>
                  <span style={{ fontSize: '1.75rem' }}>{item.emoji}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: sel ? 'var(--primary)' : 'var(--text2)' }}>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep('language')}>← Back</button>
            <button className="btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={finish} disabled={loading}>
              {loading ? 'Saving…' : "Let's Go! 🚀"}
            </button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div style={{ ...S.card, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={S.title}>You're all set, {name.split(' ')[0]}!</h1>
          <p style={S.sub}>Taking you to the courses…</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: `bounce 0.8s ${i*0.15}s infinite alternate` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
