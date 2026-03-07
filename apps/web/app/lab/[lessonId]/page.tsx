'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const AUTOSAVE_INTERVAL = 30; // seconds
const STORAGE_KEY = (id: string) => `iotlearn_lab_${id}`;
const HISTORY_KEY = (id: string) => `iotlearn_lab_history_${id}`;

type SaveEntry = { ts: number; code: string; label: string };

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatCountdown(s: number) {
  return `${s}s`;
}

const DEFAULT_CODE = `// Arduino Blink Lab
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Lab Started!");
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
  Serial.println("Blink!");
}`;

export default function LabPage() {
  const router = useRouter();
  const { lessonId } = useParams<{ lessonId: string }>();
  const lessonIdParam = Array.isArray(lessonId) ? lessonId[0] : lessonId;
  const sessionStarted = useRef(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [countdown, setCountdown] = useState(AUTOSAVE_INTERVAL);
  const [history, setHistory] = useState<SaveEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const codeRef = useRef(code);
  codeRef.current = code;

  // ── Load saved code on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (!lessonIdParam) return;
    const saved = localStorage.getItem(STORAGE_KEY(lessonIdParam));
    if (saved) setCode(saved);
    const hist = localStorage.getItem(HISTORY_KEY(lessonIdParam));
    if (hist) { try { setHistory(JSON.parse(hist)); } catch {} }
  }, [lessonIdParam]);

  // ── Start lab session ────────────────────────────────────────────────────
  useEffect(() => {
    if (!lessonIdParam || sessionStarted.current) return;
    sessionStarted.current = true;
    fetch('http://localhost:3001/api/lab-sessions/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'student-1', lesson_id: lessonIdParam }),
    }).then(r => r.json()).then(d => setSessionId(d.id)).catch(() => {});
  }, [lessonIdParam]);

  // ── End session on leave ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (sessionId) {
        navigator.sendBeacon(`http://localhost:3001/api/lab-sessions/${sessionId}/end`,
          JSON.stringify({ status: 'abandoned' }));
      }
    };
  }, [sessionId]);

  // ── Save to localStorage ─────────────────────────────────────────────────
  const saveCode = useCallback((label = 'Auto-save') => {
    if (!lessonIdParam) return;
    setSaveStatus('saving');
    const ts = Date.now();
    localStorage.setItem(STORAGE_KEY(lessonIdParam), codeRef.current);
    const entry: SaveEntry = { ts, code: codeRef.current, label };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 10); // keep last 10
      localStorage.setItem(HISTORY_KEY(lessonIdParam), JSON.stringify(next));
      return next;
    });
    setLastSaved(ts);
    setTimeout(() => setSaveStatus('saved'), 300);
    setTimeout(() => setSaveStatus('idle'), 2500);
  }, [lessonIdParam]);

  // ── 30s autosave countdown ───────────────────────────────────────────────
  useEffect(() => {
    setCountdown(AUTOSAVE_INTERVAL);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          saveCode('Auto-save');
          return AUTOSAVE_INTERVAL;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [saveCode]);

  // ── Complete lab ─────────────────────────────────────────────────────────
  const handleComplete = async () => {
    saveCode('Final save');
    if (sessionId) {
      await fetch(`http://localhost:3001/api/lab-sessions/${sessionId}/end`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      }).catch(() => {});
    }
    setCompleted(true);
    setTimeout(() => router.back(), 1800);
  };

  // ── Restore a history snapshot ───────────────────────────────────────────
  const restoreSnapshot = (entry: SaveEntry) => {
    setCode(entry.code);
    setHistoryOpen(false);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const countdownColor = countdown <= 5 ? '#ef4444' : countdown <= 10 ? '#FF6B35' : '#00C896';

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column', fontFamily: "'Baloo 2', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ background: '#1a1a2e', borderBottom: '1px solid #2a2a4a', padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 20 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#888', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Baloo 2'" }}>
          ← Back to Lesson
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 800, color: '#FF6B35', fontSize: '1rem' }}>⚡ IoTLearn Lab</span>
          <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(0,200,150,0.15)', color: '#00C896', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>Arduino UNO</span>
          {sessionId && <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(26,115,232,0.15)', color: '#1A73E8', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>● Session Active</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Autosave countdown ring */}
          <div title={`Next auto-save in ${countdown}s`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'default' }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="11" fill="none" stroke="#2a2a4a" strokeWidth="3" />
              <circle cx="15" cy="15" r="11" fill="none" stroke={countdownColor} strokeWidth="3"
                strokeDasharray={2 * Math.PI * 11}
                strokeDashoffset={2 * Math.PI * 11 * (1 - countdown / AUTOSAVE_INTERVAL)}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '15px 15px', transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }} />
              <text x="15" y="19" textAnchor="middle" fontSize="8" fontWeight="800" fill={countdownColor}>{countdown}</text>
            </svg>
            <span style={{ fontSize: '0.68rem', color: '#666', fontWeight: 600 }}>
              {saveStatus === 'saving' ? '💾 Saving…' : saveStatus === 'saved' ? '✅ Saved!' : `Auto-save`}
            </span>
          </div>

          {/* Manual save */}
          <button onClick={() => saveCode('Manual save')}
            style={{ padding: '0.35rem 0.875rem', borderRadius: '999px', border: '1.5px solid', borderColor: saveStatus === 'saved' ? '#00C896' : '#FF6B35', background: saveStatus === 'saved' ? 'rgba(0,200,150,0.12)' : 'rgba(255,107,53,0.12)', color: saveStatus === 'saved' ? '#00C896' : '#FF6B35', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            {saveStatus === 'saved' ? '✅ Saved' : '💾 Save'}
          </button>

          {/* History */}
          <button onClick={() => setHistoryOpen(o => !o)}
            style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', border: '1.5px solid', borderColor: historyOpen ? '#A855F7' : '#2a2a4a', background: historyOpen ? 'rgba(168,85,247,0.12)' : 'transparent', color: historyOpen ? '#A855F7' : '#888', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            🕐 History {history.length > 0 && `(${history.length})`}
          </button>
        </div>
      </nav>

      {/* SAVE STATUS BAR */}
      {lastSaved && (
        <div style={{ background: '#12122a', borderBottom: '1px solid #2a2a4a', padding: '0.3rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ fontSize: '0.7rem', color: '#555' }}>Last saved:</span>
          <span style={{ fontSize: '0.7rem', color: '#00C896', fontWeight: 600 }}>{formatTime(lastSaved)}</span>
          <span style={{ fontSize: '0.7rem', color: '#555' }}>•</span>
          <span style={{ fontSize: '0.7rem', color: '#555' }}>Next auto-save in <span style={{ color: countdownColor, fontWeight: 700 }}>{formatCountdown(countdown)}</span></span>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* HISTORY PANEL */}
        {historyOpen && (
          <div style={{ position: 'absolute', top: 0, right: 0, width: '280px', height: '100%', background: '#1a1a2e', borderLeft: '1px solid #2a2a4a', zIndex: 30, display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.2s ease' }}>
            <style>{`@keyframes slideInRight { from { transform:translateX(100%); } to { transform:translateX(0); } }`}</style>
            <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #2a2a4a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: '#A855F7', fontSize: '0.85rem' }}>🕐 Save History</span>
              <button onClick={() => setHistoryOpen(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#555', fontSize: '0.8rem' }}>No saves yet</div>
              ) : history.map((entry, i) => (
                <div key={entry.ts}
                  style={{ padding: '0.75rem', borderRadius: '0.75rem', background: i === 0 ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${i === 0 ? 'rgba(168,85,247,0.25)' : '#2a2a4a'}`, marginBottom: '0.4rem', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#A855F7')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = i === 0 ? 'rgba(168,85,247,0.25)' : '#2a2a4a')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: i === 0 ? '#A855F7' : '#888' }}>{entry.label}</span>
                    {i === 0 && <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(168,85,247,0.2)', color: '#A855F7', fontWeight: 700 }}>Latest</span>}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#666', marginBottom: '0.5rem' }}>{formatTime(entry.ts)}</div>
                  <pre style={{ fontSize: '0.62rem', color: '#00C896', background: '#0f0f1a', borderRadius: '0.4rem', padding: '0.35rem 0.5rem', overflow: 'hidden', maxHeight: '50px', margin: 0 }}>
                    {entry.code.slice(0, 120)}…
                  </pre>
                  <button onClick={() => restoreSnapshot(entry)}
                    style={{ marginTop: '0.5rem', width: '100%', padding: '0.3rem', borderRadius: '0.4rem', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#A855F7', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer' }}>
                    ↩ Restore this version
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MONACO EDITOR PANE */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #2a2a4a' }}>
          <div style={{ background: '#1a1a2e', padding: '0.4rem 1rem', borderBottom: '1px solid #2a2a4a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#FF6B35', fontWeight: 700 }}>📄 sketch.ino</span>
              <span style={{ fontSize: '0.65rem', color: '#555' }}>C++ / Arduino</span>
            </div>
            <span style={{ fontSize: '0.65rem', color: '#555' }}>{code.split('\n').length} lines</span>
          </div>
          <div style={{ flex: 1 }}>
            <MonacoEditor
              height="100%"
              language="cpp"
              theme="vs-dark"
              value={code}
              onChange={val => setCode(val ?? '')}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: 'on',
                tabSize: 2,
                automaticLayout: true,
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                renderLineHighlight: 'gutter',
                cursorBlinking: 'smooth',
              }}
            />
          </div>
          {/* Serial Monitor */}
          <div style={{ height: '110px', background: '#0a0a14', borderTop: '1px solid #2a2a4a', padding: '0.6rem 1rem', flexShrink: 0 }}>
            <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Serial Monitor</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', lineHeight: 1.6 }}>
              <div style={{ color: '#00C896' }}>&gt; Lab Started!</div>
              <div style={{ color: '#00C896' }}>&gt; Blink!</div>
              <div style={{ color: '#00C896', animation: 'pulse 1s ease-in-out infinite' }}>&gt; _</div>
            </div>
          </div>
        </div>

        {/* WOKWI PANE */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#1a1a2e', padding: '0.4rem 1rem', borderBottom: '1px solid #2a2a4a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: '0.75rem', color: '#1A73E8', fontWeight: 700 }}>🔬 Circuit Simulator</span>
            <a href="https://wokwi.com/projects/new/arduino-uno" target="_blank" rel="noreferrer"
              style={{ fontSize: '0.68rem', color: '#1A73E8', textDecoration: 'none', fontWeight: 600 }}>
              Open in Wokwi ↗
            </a>
          </div>
          <iframe src="https://wokwi.com/projects/new/arduino-uno" style={{ flex: 1, width: '100%', border: 'none' }} title="Wokwi Simulator" />
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#1a1a2e', borderTop: '1px solid #2a2a4a', padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: '0.72rem', color: '#555' }}>💡 Hint: Connect LED to pin 13 — GND to resistor then LED</span>
        <button onClick={handleComplete}
          style={{ padding: '0.5rem 1.25rem', borderRadius: '999px', background: completed ? 'rgba(0,200,150,0.2)' : 'linear-gradient(135deg,#00C896,#00a87a)', color: completed ? '#00C896' : '#fff', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.82rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: completed ? 'none' : '0 4px 14px rgba(0,200,150,0.3)' }}>
          {completed ? '✅ Complete! Going back…' : '✅ Mark Complete & Exit'}
        </button>
      </div>
    </div>
  );
}
