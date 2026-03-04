'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LabPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
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

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white text-sm">
          ← Back to Lesson
        </button>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">⚡ IoTLearn Lab</span>
          <span className="px-2 py-1 bg-green-900 text-green-400 rounded text-xs">Arduino UNO</span>
        </div>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {saved ? '✅ Saved!' : 'Save Progress'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 110px)' }}>
        <div className="w-1/2 flex flex-col border-r border-gray-700">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <span className="text-gray-400 text-xs">sketch.ino</span>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none outline-none"
            spellCheck={false}
          />
          <div className="h-32 bg-black border-t border-gray-700 p-3">
            <div className="text-xs text-gray-500 mb-2">Serial Monitor</div>
            <div className="text-green-400 font-mono text-xs space-y-1">
              <div>{'>'} Lab Started!</div>
              <div>{'>'} Blink!</div>
              <div className="animate-pulse">{'>'} _</div>
            </div>
          </div>
        </div>

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

      <div className="bg-gray-800 border-t border-gray-700 px-6 py-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">💡 Hint: Connect LED to pin 13</span>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
        >
          ✅ Mark Complete
        </button>
      </div>
    </main>
  );
}
