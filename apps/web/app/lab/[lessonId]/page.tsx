'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, getUser } from '../../lib/auth';

type Lesson = {
  id: string;
  title: string;
  type: string;
  course_id: string;
  description?: string;
  content_url?: string;
};

type LessonContent = {
  id: string;
  locale?: string;
  content_json: {
    type: string;
    content: { type: string; text?: string; content?: { type: string; text: string }[] }[];
  };
  status: string;
};

const DEFAULT_CODE = `// Arduino IoT Lab — Edit and simulate below
// Wokwi simulator is embedded on the right

#include <Arduino.h>

const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
  Serial.println("IoTLearn Lab Started!");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED ON");
  delay(1000);

  digitalWrite(LED_PIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}
`;

// ─── Simple code editor (textarea-based, no heavy Monaco dep needed) ──────────
function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab inserts 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = ta.value.substring(0, start) + '  ' + ta.value.substring(end);
      onChange(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  return (
    <textarea
      ref={taRef}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      style={{
        flex: 1,
        width: '100%',
        background: '#0d1117',
        color: '#e6edf3',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: '0.82rem',
        lineHeight: 1.7,
        border: 'none',
        outline: 'none',
        resize: 'none',
        padding: '1.25rem 1rem 1.25rem 1.5rem',
        tabSize: 2,
      }}
    />
  );
}

// ─── Wokwi project templates by lesson type ──────────────────────────────────
function getWokwiUrl(lessonTitle: string): string {
  const t = lessonTitle.toLowerCase();
  // Map lesson topic to a relevant Wokwi starter project
  if (t.includes('blink') || t.includes('led'))
    return 'https://wokwi.com/projects/new/arduino-uno';
  if (t.includes('sensor') || t.includes('temperature') || t.includes('dht'))
    return 'https://wokwi.com/projects/322410731508073042'; // DHT22 sensor
  if (t.includes('servo') || t.includes('motor'))
    return 'https://wokwi.com/projects/305568533069177409'; // Servo
  if (t.includes('lcd') || t.includes('display'))
    return 'https://wokwi.com/projects/305569599605719617'; // LCD
  if (t.includes('ultrasonic') || t.includes('distance'))
    return 'https://wokwi.com/projects/304192771901137473'; // HC-SR04
  if (t.includes('esp32') || t.includes('wifi'))
    return 'https://wokwi.com/projects/new/esp32';
  if (t.includes('traffic') || t.includes('light'))
    return 'https://wokwi.com/projects/305567932292882000'; // Traffic lights
  // Default: blank Arduino Uno
  return 'https://wokwi.com/projects/new/arduino-uno';
}

// ─── Render TipTap JSON content ───────────────────────────────────────────────
function renderContent(content: LessonContent['content_json'] | null) {
  if (!content?.content) return null;
  return content.content.map((node, i) => {
    if (node.type === 'paragraph')
      return (
        <p key={i} style={{ marginBottom: '0.9rem', color: '#94a3b8', lineHeight: 1.7, fontSize: '0.88rem' }}>
          {node.content?.map((c, j) => <span key={j}>{c.text}</span>)}
        </p>
      );
    if (node.type === 'heading')
      return (
        <h3 key={i} style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem', marginTop: '1.25rem' }}>
          {node.content?.map(c => c.text).join('')}
        </h3>
      );
    if (node.type === 'bulletList')
      return (
        <ul key={i} style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
          {node.content?.map((item, j) => (
            <li key={j} style={{ color: '#94a3b8', marginBottom: '0.25rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
              {(item as any).content?.map((c: any) => c.content?.map((t: any) => t.text).join('')).join('')}
            </li>
          ))}
        </ul>
      );
    if (node.type === 'codeBlock')
      return (
        <pre key={i} style={{ background: '#0d1117', color: '#00C896', borderRadius: '0.5rem', padding: '0.875rem', marginBottom: '0.875rem', overflowX: 'auto', fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.6 }}>
          {node.content?.map(c => c.text).join('')}
        </pre>
      );
    return null;
  });
}

// ─── Main Lab Page ────────────────────────────────────────────────────────────
export default function LabPage() {
  const { lessonId } = useParams<{ lessonId: string | string[] }>();
  const id = Array.isArray(lessonId) ? lessonId[0] : lessonId;
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<'sim' | 'instructions'>('sim');
  const [wokwiKey, setWokwiKey] = useState(0); // force iframe reload
  const [codeSaved, setCodeSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load lesson details + any saved code
  useEffect(() => {
    if (!id) { setLoading(false); return; }

    const savedCode = localStorage.getItem(`lab_code_${id}`);
    if (savedCode) setCode(savedCode);

    apiFetch(`/api/lessons/${id}`)
      .then(r => r.json())
      .then((data: Lesson) => {
        setLesson(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    apiFetch(`/api/lesson-content/lesson/${id}`)
      .then(r => r.json())
      .then((data: LessonContent[]) => {
        setContent(data[0] ?? null);
      })
      .catch(() => {});
  }, [id]);

  // Auto-save code to localStorage
  const handleCodeChange = useCallback((val: string) => {
    setCode(val);
    setCodeSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (id) {
        localStorage.setItem(`lab_code_${id}`, val);
        setCodeSaved(true);
        setTimeout(() => setCodeSaved(false), 2000);
      }
    }, 800);
  }, [id]);

  const markComplete = async () => {
    if (completing || completed) return;
    setCompleting(true);
    const user = getUser();
    if (user?.id && lesson) {
      await apiFetch(`/api/lessons/${id}/complete`, { method: 'POST' }).catch(() => {});
    }
    setCompleted(true);
    setCompleting(false);
  };

  const resetCode = () => {
    if (confirm('Reset code to default template?')) {
      setCode(DEFAULT_CODE);
      if (id) localStorage.removeItem(`lab_code_${id}`);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#94a3b8' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
        <div style={{ fontFamily: "'Baloo 2'", fontWeight: 700 }}>Loading lab…</div>
      </div>
    </div>
  );

  const wokwiUrl = lesson ? getWokwiUrl(lesson.title) : 'https://wokwi.com/projects/new/arduino-uno';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f172a', fontFamily: "'Baloo 2', sans-serif", overflow: 'hidden' }}>

      {/* ── TOP BAR ── */}
      <div style={{ height: '48px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.75rem', flexShrink: 0, zIndex: 10 }}>
        <button onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: '#94a3b8', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
          ← Back
        </button>
        <div style={{ width: '1px', height: '20px', background: '#334155' }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A855F7', background: 'rgba(168,85,247,0.15)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
          🔬 Lab
        </span>
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {lesson?.title ?? 'Lab Simulator'}
        </span>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: '#0f172a', borderRadius: '0.5rem', padding: '0.2rem' }}>
          {(['sim', 'instructions'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '0.25rem 0.75rem', borderRadius: '0.35rem', border: 'none', background: activeTab === tab ? '#334155' : 'transparent', color: activeTab === tab ? '#e2e8f0' : '#64748b', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
              {tab === 'sim' ? '🖥️ Simulator' : '📋 Instructions'}
            </button>
          ))}
        </div>

        {/* Actions */}
        <button onClick={resetCode}
          style={{ padding: '0.3rem 0.75rem', borderRadius: '0.4rem', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
          ↺ Reset
        </button>
        {codeSaved && <span style={{ fontSize: '0.72rem', color: '#00C896', fontWeight: 700 }}>✅ Saved</span>}
        <button onClick={markComplete} disabled={completed || completing}
          style={{ padding: '0.35rem 1rem', borderRadius: '0.4rem', border: 'none', background: completed ? '#00C896' : completing ? '#334155' : 'linear-gradient(135deg, #A855F7, #7c3aed)', color: completed ? '#0f172a' : '#fff', fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: '0.78rem', cursor: completed ? 'default' : 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
          {completed ? '✅ Done!' : completing ? '⏳…' : '✓ Mark Complete'}
        </button>
      </div>

      {/* ── MAIN SPLIT PANE ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT: Code Editor */}
        <div style={{ width: '45%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #334155', overflow: 'hidden' }}>
          {/* Editor header */}
          <div style={{ height: '36px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.5rem', flexShrink: 0 }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>sketch.ino</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: '#475569' }}>Arduino C++</span>
          </div>
          {/* Editor */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <CodeEditor value={code} onChange={handleCodeChange} />
          </div>
          {/* Copy-code helper */}
          <div style={{ height: '36px', background: '#1e293b', borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.75rem', flexShrink: 0 }}>
            <span style={{ fontSize: '0.7rem', color: '#475569' }}>Copy code → paste into Wokwi editor →</span>
            <button
              onClick={() => navigator.clipboard.writeText(code).catch(() => {})}
              style={{ padding: '0.2rem 0.75rem', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '0.35rem', color: '#A855F7', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>
              📋 Copy Code
            </button>
          </div>
        </div>

        {/* RIGHT: Simulator / Instructions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {activeTab === 'sim' ? (
            <>
              {/* Wokwi toolbar */}
              <div style={{ height: '36px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.75rem', flexShrink: 0 }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Wokwi Arduino Simulator</span>
                <button onClick={() => setWokwiKey(k => k + 1)}
                  style={{ marginLeft: 'auto', padding: '0.2rem 0.7rem', background: 'transparent', border: '1px solid #334155', borderRadius: '0.35rem', color: '#94a3b8', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer' }}>
                  ↺ Reload
                </button>
                <a href={wokwiUrl} target="_blank" rel="noopener noreferrer"
                  style={{ padding: '0.2rem 0.7rem', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '0.35rem', color: '#A855F7', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.7rem', textDecoration: 'none' }}>
                  ↗ Open Full
                </a>
              </div>
              {/* Wokwi iframe */}
              <div style={{ flex: 1, position: 'relative', background: '#0f172a' }}>
                <iframe
                  key={wokwiKey}
                  src={wokwiUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="serial"
                  title="Wokwi Arduino Simulator"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
              </div>
            </>
          ) : (
            /* Instructions panel */
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔬 {lesson?.title}
              </h2>
              {lesson?.description && (
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.25rem', padding: '0.875rem', background: 'rgba(168,85,247,0.08)', borderRadius: '0.625rem', borderLeft: '3px solid #A855F7' }}>
                  {lesson.description}
                </p>
              )}

              {content ? (
                renderContent(content.content_json)
              ) : (
                /* Default instructions when no content is set */
                <>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem', marginTop: '1rem' }}>How to use this lab</h3>
                  <ol style={{ paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.8 }}>
                    <li>Write or edit your Arduino code in the <strong style={{ color: '#e2e8f0' }}>left panel</strong></li>
                    <li>Click <strong style={{ color: '#A855F7' }}>📋 Copy Code</strong> to copy it</li>
                    <li>In the Wokwi simulator (right), open the code editor and paste</li>
                    <li>Click the <strong style={{ color: '#22c55e' }}>▶ Play</strong> button in Wokwi to run the simulation</li>
                    <li>Observe the virtual circuit respond to your code</li>
                    <li>When done, click <strong style={{ color: '#A855F7' }}>✓ Mark Complete</strong></li>
                  </ol>

                  <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem', marginTop: '1.25rem' }}>Wokwi tips</h3>
                  <ul style={{ paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.8 }}>
                    <li>Use <strong style={{ color: '#e2e8f0' }}>↗ Open Full</strong> for a larger workspace</li>
                    <li>Add components from the <strong style={{ color: '#e2e8f0' }}>+</strong> button in Wokwi</li>
                    <li>The Serial Monitor shows <code style={{ color: '#00C896' }}>Serial.println()</code> output</li>
                    <li>Save your progress — Wokwi auto-saves to your account</li>
                  </ul>

                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,200,150,0.08)', borderRadius: '0.625rem', border: '1px solid rgba(0,200,150,0.2)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#00C896', marginBottom: '0.4rem' }}>💡 Default starter code</div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                      The editor starts with an LED blink sketch. Modify it to match this lab's goal, then simulate!
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
