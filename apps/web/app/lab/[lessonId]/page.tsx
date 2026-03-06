'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function LabPage() {
  const router = useRouter();
  const { lessonId } = useParams<{ lessonId: string }>();
  const lessonIdParam = Array.isArray(lessonId) ? lessonId[0] : lessonId;
  const [saved, setSaved] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionStarted = useRef(false);
  const [code, setCode] = useState(`// Arduino Blink Lab
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
}`);

  // Start lab session on mount
  useEffect(() => {
    if (!lessonIdParam || sessionStarted.current) return;
    sessionStarted.current = true;
    fetch('http://localhost:3001/api/lab-sessions/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'student-1', lesson_id: lessonIdParam }),
    })
      .then(r => r.json())
      .then(data => setSessionId(data.id))
      .catch(() => {});
  }, [lessonIdParam]);

  // End session on page leave
  useEffect(() => {
    return () => {
      if (sessionId) {
        navigator.sendBeacon(
          `http://localhost:3001/api/lab-sessions/${sessionId}/end`,
          JSON.stringify({ status: 'abandoned' }),
        );
      }
    };
  }, [sessionId]);

  const handleComplete = async () => {
    if (sessionId) {
      await fetch(`http://localhost:3001/api/lab-sessions/${sessionId}/end`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      }).catch(() => {});
    }
    setSaved(true);
    setTimeout(() => router.back(), 1500);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white text-sm">
          ← Back to Lesson
        </button>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">⚡ IoTLearn Lab</span>
          <span className="px-2 py-1 bg-green-900 text-green-400 rounded text-xs">Arduino UNO</span>
          {sessionId && (
            <span className="px-2 py-1 bg-blue-900 text-blue-400 rounded text-xs">● Session Active</span>
          )}
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {saved ? '✅ Saved!' : 'Save Progress'}
        </button>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 110px)' }}>
        {/* Monaco Editor */}
        <div className="w-1/2 flex flex-col border-r border-gray-700">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
            <span className="text-gray-400 text-xs">sketch.ino</span>
            <span className="text-gray-500 text-xs">C++ / Arduino</span>
          </div>
          <div className="flex-1">
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
              }}
            />
          </div>
          {/* Serial Monitor */}
          <div className="h-32 bg-black border-t border-gray-700 p-3 flex-shrink-0">
            <div className="text-xs text-gray-500 mb-2">Serial Monitor</div>
            <div className="text-green-400 font-mono text-xs space-y-1">
              <div>{'>'} Lab Started!</div>
              <div>{'>'} Blink!</div>
              <div className="animate-pulse">{'>'} _</div>
            </div>
          </div>
        </div>

        {/* Wokwi Simulator */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <span className="text-gray-400 text-xs">Circuit Simulator</span>
            <a href="https://wokwi.com/projects/new/arduino-uno" target="_blank" rel="noreferrer"
              className="text-blue-400 text-xs hover:underline">
              Open in Wokwi ↗
            </a>
          </div>
          <iframe
            src="https://wokwi.com/projects/new/arduino-uno"
            className="flex-1 w-full"
            title="Wokwi Simulator"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-2 flex items-center justify-between flex-shrink-0">
        <span className="text-xs text-gray-500">💡 Hint: Connect LED to pin 13</span>
        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
        >
          ✅ Mark Complete & Exit
        </button>
      </div>
    </main>
  );
}
