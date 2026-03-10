'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { apiFetch, getUser } from '../../lib/auth';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const AUTOSAVE_INTERVAL = 30;
const STORAGE_KEY  = (id: string) => `iotlearn_lab_${id}`;
const HISTORY_KEY  = (id: string) => `iotlearn_lab_history_${id}`;

type SaveEntry = { ts: number; code: string; label: string };

// Map of lesson IDs → known Wokwi project IDs for demo lessons
// For real courses each lesson would have its own Wokwi project
const WOKWI_PROJECTS: Record<string, string> = {
  'lesson-006': '305568977727930434', // Blink LED
  'lesson-014': '305568977727930434', // Blink & Fade
  'lesson-024': '347755822648156754', // ESP32 WiFi (fallback to blink)
  'lesson-033': '305568977727930434', // Pi camera (fallback)
  'lesson-043': '347755822648156754', // Multi-sensor
  default:      '305568977727930434', // Default: Arduino Blink
};

const DEFAULT_CODE = `// Arduino Lab — IoTLearn
// Edit the code below, then click ▶ Run Simulation

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Lab Started! 🚀");
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);   // LED ON
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);    // LED OFF
  delay(1000);
  Serial.println("Blink! 💡");
}`;

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function LabPage() {
  const router = useRouter();
  const { lessonId } = useParams<{ lessonId: string }>();
  const lessonIdParam = Array.isArray(lessonId) ? lessonId[0] : lessonId;
  const sessionStarted = useRef(false);

  const [sessionId,    setSessionId]    = useState<string | null>(null);
  const [code,         setCode]         = useState(DEFAULT_CODE);
  const [lastSaved,    setLastSaved]    = useState<number | null>(null);
  const [saveStatus,   setSaveStatus]   = useState<'idle' | 'saving' | 'saved'>('idle');
  const [countdown,    setCountdown]    = useState(AUTOSAVE_INTERVAL);
  const [history,      setHistory]      = useState<SaveEntry[]>([]);
  const [historyOpen,  setHistoryOpen]  = useState(false);
  const [completed,    setCompleted]    = useState(false);
  const [simRunning,   setSimRunning]   = useState(true);
  const [panelWidth,   setPanelWidth]   = useState(45); // Monaco % width

  const countdownRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const codeRef       = useRef(code);
  const iframeRef     = useRef<HTMLIFrameElement>(null);
  const dragging      = useRef(false);
  const containerRef  = useRef<HTMLDivElement>(null);
  codeRef.current = code;

  // Wokwi project for this lesson
  const wokwiProjectId = (lessonIdParam && WOKWI_PROJECTS[lessonIdParam]) || WOKWI_PROJECTS.default;
  const wokwiUrl = `https://wokwi.com/projects/${wokwiProjectId}?embed=1&editor=0&theme=dark`;

  // ── Load saved code ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!lessonIdParam) return;
    const saved = localStorage.getItem(STORAGE_KEY(lessonIdParam));
    if (saved) setCode(saved);
    try {
      const hist = localStorage.getItem(HISTORY_KEY(lessonIdParam));
      if (hist) setHistory(JSON.parse(hist));
    } catch {}
  }, [lessonIdParam]);

  // ── Start lab session ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!lessonIdParam || sessionStarted.current) return;
    sessionStarted.current = true;
    const user = getUser();
    apiFetch('/api/lab-sessions/start', {
      method: 'POST',
      body: JSON.stringify({ user_id: user?.id ?? '', lesson_id: lessonIdParam }),
    }).then(r => r.json()).then(d => setSessionId(d.id)).catch(() => {});
  }, [lessonIdParam]);

  // ── End session on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (sessionId) {
        navigator.sendBeacon(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/lab-sessions/${sessionId}/end`,
          JSON.stringify({})
        );
      }
    };
  }, [sessionId]);

  // ── Autosave countdown ────────────────────────────────────────────────────
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          autoSave();
          return AUTOSAVE_INTERVAL;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, []);

  const autoSave = useCallback(() => {
    if (!lessonIdParam) return;
    setSaveStatus('saving');
    localStorage.setItem(STORAGE_KEY(lessonIdParam), codeRef.current);
    const entry: SaveEntry = { ts: Date.now(), code: codeRef.current, label: `Auto ${formatTime(Date.now())}` };
    setHistory(h => {
      const updated = [entry, ...h].slice(0, 20);
      localStorage.setItem(HISTORY_KEY(lessonIdParam), JSON.stringify(updated));
      return updated;
    });
    setLastSaved(Date.now());
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [lessonIdParam]);

  const manualSave = () => {
    if (!lessonIdParam) return;
    setSaveStatus('saving');
    localStorage.setItem(STORAGE_KEY(lessonIdParam), code);
    const entry: SaveEntry = { ts: Date.now(), code, label: `Saved ${formatTime(Date.now())}` };
    setHistory(h => {
      const updated = [entry, ...h].slice(0, 20);
      localStorage.setItem(HISTORY_KEY(lessonIdParam), JSON.stringify(updated));
      return updated;
    });
    setLastSaved(Date.now());
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  // ── Run simulation (open Wokwi with code) ─────────────────────────────────
  const runInWokwi = () => {
    // Reload the Wokwi iframe to restart the simulation
    if (iframeRef.current) {
      iframeRef.current.src = wokwiUrl + `&t=${Date.now()}`;
      setSimRunning(true);
    }
  };

  // ── Mark complete ─────────────────────────────────────────────────────────
  const markComplete = async () => {
    manualSave();
    setCompleted(true);
    if (sessionId) {
      await apiFetch(`/api/lab-sessions/${sessionId}/end`, { method: 'PATCH' }).catch(() => {});
    }
    const user = getUser();
    if (user?.id) {
      await apiFetch('/api/gamification/activity', {
        method: 'POST',
        body: JSON.stringify({ activity_type: 'lab_complete', entity_id: lessonIdParam }),
      }).catch(() => {});
    }
    setTimeout(() => router.back(), 1200);
  };

  // ── Drag-to-resize divider ────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setPanelWidth(Math.min(75, Math.max(25, pct)));
    };
    const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const saveLabel = saveStatus === 'saving' ? '⏳ Saving...' : saveStatus === 'saved' ? '✅ Saved' : lastSaved ? `💾 Saved ${formatTime(lastSaved)}` : '💾 Save';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f0f1a', fontFamily: "'Baloo 2', sans-serif" }}>

      {/* TOP BAR */}
      <div style={{ height: '50px', background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.75rem', flexShrink: 0 }}>
        <button onClick={() => router.back()}
          style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '6px', padding: '0.3rem 0.75rem', color: '#aaa', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit' }}>
          ← Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <span style={{ fontSize: '1rem' }}>🔬</span>
          <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>Arduino Lab Simulator</span>
          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.55rem', borderRadius: '999px', background: 'rgba(168,85,247,0.2)', color: '#A855F7', fontWeight: 700 }}>
            Powered by Wokwi
          </span>
        </div>

        {/* Countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#666' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#A855F7', fontWeight: 700 }}>{countdown}</div>
          <span>auto</span>
        </div>

        {/* History */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setHistoryOpen(o => !o)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '0.3rem 0.7rem', color: '#aaa', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit' }}>
            🕓 History ({history.length})
          </button>
          {historyOpen && (
            <div style={{ position: 'absolute', top: '120%', right: 0, width: '240px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', zIndex: 50, boxShadow: '0 8px 30px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
              <div style={{ padding: '0.6rem 0.875rem', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Code History</div>
              {history.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#555', fontSize: '0.8rem' }}>No saves yet</div>
              ) : history.map((h, i) => (
                <button key={i} onClick={() => { setCode(h.code); setHistoryOpen(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '0.6rem 0.875rem', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#ccc', fontSize: '0.78rem', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                  <div style={{ fontWeight: 600 }}>{h.label}</div>
                  <div style={{ color: '#555', fontSize: '0.7rem', marginTop: '0.1rem' }}>{h.code.slice(0, 50)}...</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Save */}
        <button onClick={manualSave}
          style={{ background: saveStatus === 'saved' ? 'rgba(0,200,150,0.15)' : 'rgba(255,255,255,0.05)', border: '1px solid', borderColor: saveStatus === 'saved' ? 'rgba(0,200,150,0.3)' : 'rgba(255,255,255,0.1)', borderRadius: '6px', padding: '0.3rem 0.875rem', color: saveStatus === 'saved' ? '#00C896' : '#aaa', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit', transition: 'all 0.2s' }}>
          {saveLabel}
        </button>

        {/* Run Simulation */}
        <button onClick={runInWokwi}
          style={{ background: 'linear-gradient(135deg, #A855F7, #7c3aed)', border: 'none', borderRadius: '6px', padding: '0.35rem 1rem', color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: 700, boxShadow: '0 2px 10px rgba(168,85,247,0.4)' }}>
          ▶ Run Simulation
        </button>

        {/* Complete */}
        <button onClick={markComplete} disabled={completed}
          style={{ background: completed ? 'rgba(0,200,150,0.2)' : 'rgba(26,115,232,0.15)', border: '1px solid', borderColor: completed ? 'rgba(0,200,150,0.3)' : 'rgba(26,115,232,0.2)', borderRadius: '6px', padding: '0.3rem 0.875rem', color: completed ? '#00C896' : '#1A73E8', cursor: completed ? 'default' : 'pointer', fontSize: '0.78rem', fontFamily: 'inherit', fontWeight: 700, transition: 'all 0.2s' }}>
          {completed ? '✅ Done!' : '✓ Complete Lab'}
        </button>
      </div>

      {/* MAIN SPLIT PANEL */}
      <div ref={containerRef} style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', cursor: dragging.current ? 'col-resize' : 'default' }}>

        {/* MONACO EDITOR */}
        <div style={{ width: `${panelWidth}%`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Editor header */}
          <div style={{ height: '36px', background: '#12122a', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28CA42' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#555', fontFamily: 'monospace' }}>sketch.ino</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#444', fontFamily: 'monospace' }}>Arduino C++</span>
          </div>
          <div style={{ flex: 1 }}>
            <MonacoEditor
              language="cpp"
              value={code}
              onChange={v => v && setCode(v)}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                fontLigatures: true,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                renderLineHighlight: 'gutter',
                folding: true,
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                formatOnPaste: true,
                suggestOnTriggerCharacters: true,
              }}
            />
          </div>

          {/* Tips bar */}
          <div style={{ height: '30px', background: '#12122a', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '1rem', overflow: 'hidden' }}>
            {[
              '💡 Ctrl+S to save',
              '⚡ Click ▶ Run Simulation to see your code run live',
              '🔬 Wokwi simulates real Arduino hardware',
            ].map((tip, i) => (
              <span key={i} style={{ fontSize: '0.68rem', color: '#444', whiteSpace: 'nowrap' }}>{tip}</span>
            ))}
          </div>
        </div>

        {/* DRAG DIVIDER */}
        <div
          onMouseDown={onMouseDown}
          style={{ width: '4px', background: 'rgba(168,85,247,0.15)', cursor: 'col-resize', flexShrink: 0, transition: 'background 0.2s', position: 'relative', zIndex: 10 }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.15)')}
        />

        {/* WOKWI SIMULATOR */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Sim header */}
          <div style={{ height: '36px', background: '#12122a', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#A855F7', fontWeight: 700 }}>⚡ Wokwi Simulator</span>
            <span style={{ fontSize: '0.65rem', color: '#444' }}>Interactive Arduino hardware simulation</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: simRunning ? '#00C896' : '#555', animation: simRunning ? 'pulse 2s infinite' : 'none' }} />
              <span style={{ fontSize: '0.65rem', color: simRunning ? '#00C896' : '#555' }}>{simRunning ? 'Running' : 'Stopped'}</span>
            </div>
            <button
              onClick={() => window.open(`https://wokwi.com/projects/${wokwiProjectId}`, '_blank')}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px', padding: '0.2rem 0.6rem', color: '#888', cursor: 'pointer', fontSize: '0.68rem', fontFamily: 'inherit' }}>
              Open Full ↗
            </button>
          </div>

          {/* Wokwi iframe */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <style>{`
              @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
            `}</style>
            <iframe
              ref={iframeRef}
              src={wokwiUrl}
              style={{ width: '100%', height: '100%', border: 'none', background: '#0f0f1a' }}
              allow="clipboard-read; clipboard-write"
              title="Wokwi Arduino Simulator"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />

            {/* Overlay hint (shows briefly then fades) */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#aaa', fontSize: '0.72rem', padding: '0.4rem 0.875rem', borderRadius: '999px', pointerEvents: 'none', whiteSpace: 'nowrap', backdropFilter: 'blur(4px)' }}>
              📟 Click ▶ in the simulator to start — or click ▶ Run Simulation above
            </div>
          </div>

          {/* Serial monitor strip */}
          <div style={{ height: '60px', background: '#08080f', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '0.5rem 1rem', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.65rem', color: '#555', fontFamily: 'monospace', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Serial Monitor</div>
            <div style={{ fontSize: '0.75rem', color: '#00C896', fontFamily: "'JetBrains Mono', monospace" }}>
              {simRunning ? '> Lab simulation running in Wokwi above...' : '> Click ▶ Run Simulation to start'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
