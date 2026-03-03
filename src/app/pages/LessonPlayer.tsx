import { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Download, 
  Share2, 
  Play, 
  Pause,
  Volume2,
  Maximize,
  Check,
  Lock,
  FileText,
  FlaskConical,
  Clock,
  Lightbulb,
  Menu
} from 'lucide-react';
import { Button } from '../components/Button';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Link } from 'react-router';

type LessonType = 'video' | 'lab' | 'quiz';

export default function LessonPlayer() {
  const [lessonType, setLessonType] = useState<LessonType>('video');
  const [activeTab, setActiveTab] = useState('Transcript');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:04:23');
  const [totalTime] = useState('00:18:45');
  const [progress, setProgress] = useState(23);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showMobileLessons, setShowMobileLessons] = useState(false);

  const lessons = [
    { id: 1, title: '01. Introduction to Arduino', type: 'video', status: 'completed' },
    { id: 2, title: '02. Setting Up the IDE', type: 'video', status: 'completed' },
    { id: 3, title: '03. Digital I/O and GPIO Pins', type: 'video', status: 'current' },
    { id: 4, title: '04. Analog Inputs', type: 'video', status: 'locked' },
    { id: 5, title: '05. PWM and Motors', type: 'video', status: 'locked' },
    { id: 6, title: '06. Quiz: GPIO Basics', type: 'quiz', status: 'locked' },
    { id: 7, title: '07. Lab: Blink LED', type: 'lab', status: 'locked' },
    { id: 8, title: '08. Serial Communication', type: 'video', status: 'locked' },
    { id: 9, title: '09. Sensors and Input', type: 'video', status: 'locked' },
    { id: 10, title: '10. Quiz: Basic Concepts', type: 'quiz', status: 'locked' },
    { id: 11, title: '11. Lab: Traffic Light', type: 'lab', status: 'locked' },
    { id: 12, title: '12. Final Project', type: 'video', status: 'locked' },
  ];

  const transcript = [
    { time: '00:00:15', text: 'नमस्ते, इस पाठ में हम Arduino के Digital I/O पिन के बारे में सीखेंगे।' },
    { time: '00:00:45', text: 'Digital pins को हम input या output के रूप में configure कर सकते हैं।' },
    { time: '00:01:20', text: 'pinMode() function का उपयोग करके हम pin mode सेट करते हैं।' },
    { time: '00:02:00', text: 'digitalWrite() से हम HIGH या LOW value लिख सकते हैं।' },
    { time: '00:03:15', text: 'digitalRead() function input pin की value पढ़ने के लिए use होता है।' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-alt)]">
      {/* Top Navigation */}
      <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border)] h-14 md:h-14 flex items-center px-4 md:px-6">
        <div className="flex items-center justify-between w-full">
          {/* Left - Back */}
          <Link to="/courses" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline text-sm">Back to <span className="font-medium">Arduino Fundamentals</span></span>
            <span className="md:hidden text-sm">Back</span>
          </Link>

          {/* Center - Lesson Title */}
          <h3 className="hidden md:block text-sm md:text-base font-semibold absolute left-1/2 -translate-x-1/2">
            03. Digital I/O and GPIO Pins
          </h3>

          {/* Right - Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <div className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-surface-alt)] text-sm font-medium">
              3/12
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Lesson Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {lessonType === 'video' && <VideoLesson 
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
            totalTime={totalTime}
            progress={progress}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            transcript={transcript}
          />}
          
          {lessonType === 'lab' && <LabLesson />}
          
          {lessonType === 'quiz' && <QuizLesson />}
        </div>

        {/* Right Column - Course Navigation (Desktop) */}
        <aside className="hidden lg:block w-[280px] bg-[var(--color-surface)] border-l border-[var(--color-border)] flex flex-col">
          <div className="p-4 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Course Content</h3>
              <span className="text-sm text-[var(--color-text-secondary)]">3 of 12 complete</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-surface-alt)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--color-primary)] transition-all"
                style={{ width: '25%' }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {lessons.map((lesson) => (
              <LessonItem key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </aside>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-[var(--color-surface)] border-t border-[var(--color-border)] h-16 flex items-center justify-between px-4 md:px-6">
        <Button variant="ghost" size="medium" className="hidden md:inline-flex">
          <ChevronLeft className="w-4 h-4" />
          Previous Lesson
        </Button>
        
        {/* Mobile - Three Buttons */}
        <div className="flex lg:hidden items-center gap-2 w-full">
          <Button variant="ghost" size="small" className="flex-1">
            <ChevronLeft className="w-4 h-4" />
            Prev
          </Button>
          <Button 
            variant="ghost" 
            size="small" 
            className="flex-1"
            onClick={() => setShowMobileLessons(true)}
          >
            <Menu className="w-4 h-4" />
            Contents
          </Button>
          <Button variant="primary" size="small" className="flex-1">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Desktop - Mark Complete */}
        <Button 
          variant={isCompleted ? 'secondary' : 'primary'} 
          size="medium"
          className="hidden lg:inline-flex"
          onClick={() => setIsCompleted(!isCompleted)}
        >
          {isCompleted ? (
            <>
              <Check className="w-4 h-4" />
              Completed
            </>
          ) : (
            'Mark as Complete'
          )}
        </Button>

        <Button variant="primary" size="medium" className="hidden md:inline-flex">
          Next Lesson
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Lesson Drawer */}
      {showMobileLessons && (
        <MobileLessonDrawer 
          lessons={lessons} 
          onClose={() => setShowMobileLessons(false)} 
        />
      )}
    </div>
  );
}

function VideoLesson({ 
  isPlaying, 
  setIsPlaying, 
  currentTime, 
  totalTime, 
  progress,
  activeTab,
  setActiveTab,
  transcript 
}: any) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Video Player */}
      <div className="relative bg-[#0F1626] aspect-video md:aspect-auto md:h-[500px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/20 text-6xl">📹</div>
        </div>

        {/* Subtitle */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center px-4">
          <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded max-w-3xl">
            <p className="text-white text-center">
              pinMode() function का उपयोग करके हम pin mode सेट करते हैं।
            </p>
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progress}
              onChange={(e) => {}}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--color-primary) ${progress}%, rgba(255,255,255,0.2) ${progress}%)`
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button>
                <Volume2 className="w-5 h-5" />
              </button>
              <span className="text-sm">
                {currentTime} / {totalTime}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-sm px-2 py-1 bg-white/10 rounded hover:bg-white/20">
                CC
              </button>
              <button className="text-sm px-2 py-1 bg-white/10 rounded hover:bg-white/20">
                720p
              </button>
              <button className="text-sm px-2 py-1 bg-white/10 rounded hover:bg-white/20">
                1x
              </button>
              <button>
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold">Digital I/O and GPIO Pins</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[var(--color-surface-alt)] rounded-lg">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[var(--color-surface-alt)] rounded-lg">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[var(--color-surface-alt)] rounded-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 md:px-6">
        <div className="flex gap-6">
          {['Notes', 'Transcript', 'Resources', 'Comments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-[var(--color-surface)] p-4 md:p-6">
        {activeTab === 'Transcript' && (
          <div className="space-y-4 max-w-3xl">
            {transcript.map((item: any, index: number) => (
              <div key={index} className="flex gap-4">
                <button className="text-sm text-[var(--color-primary)] font-mono shrink-0 hover:underline">
                  {item.time}
                </button>
                <p className="text-[var(--color-text-primary)] leading-relaxed" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Notes' && (
          <div className="max-w-3xl">
            <p className="text-[var(--color-text-secondary)]">No notes yet. Start taking notes while watching the video.</p>
          </div>
        )}

        {activeTab === 'Resources' && (
          <div className="space-y-3 max-w-3xl">
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors">
              <FileText className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <div className="font-medium">Arduino GPIO Pin Reference.pdf</div>
                <div className="text-sm text-[var(--color-text-secondary)]">2.3 MB</div>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors">
              <FileText className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <div className="font-medium">Sample Code - Digital I/O.ino</div>
                <div className="text-sm text-[var(--color-text-secondary)]">1.2 KB</div>
              </div>
            </a>
          </div>
        )}

        {activeTab === 'Comments' && (
          <div className="max-w-3xl">
            <p className="text-[var(--color-text-secondary)]">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LabLesson() {
  const [activeFile, setActiveFile] = useState('sketch.ino');
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="flex h-full">
      {/* Left - Code Editor */}
      <div className="flex-1 flex flex-col bg-[#1E1E1E]">
        {/* Editor Tabs */}
        <div className="bg-[#2D2D2D] border-b border-[#3E3E3E] flex">
          {['sketch.ino', 'wiring.cpp'].map((file) => (
            <button
              key={file}
              onClick={() => setActiveFile(file)}
              className={`px-4 py-2 text-sm ${
                activeFile === file
                  ? 'bg-[#1E1E1E] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {file}
            </button>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 p-4 text-[#D4D4D4] font-mono text-sm overflow-auto">
          <pre>
{`void setup() {
  pinMode(13, OUTPUT);  // Set pin 13 as output
  Serial.begin(9600);
}

void loop() {
  digitalWrite(13, HIGH);  // Turn LED on
  delay(1000);
  
  digitalWrite(13, LOW);   // Turn LED off
  delay(1000);
  
  Serial.println("LED blinked");
}`}
          </pre>
        </div>

        {/* Status Bar */}
        <div className="bg-[#007ACC] text-white px-4 py-1 text-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Line 24</span>
            <span>Arduino Uno</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Ready
            </span>
          </div>
        </div>
      </div>

      {/* Right - Simulator & Serial */}
      <div className="hidden lg:flex flex-col w-[40%] bg-[var(--color-surface)] border-l border-[var(--color-border)]">
        {/* Toolbar */}
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] p-3 flex gap-2">
          <Button variant="accent" size="small">
            <Play className="w-4 h-4" />
            Run
          </Button>
          <Button variant="ghost" size="small">
            Stop
          </Button>
          <Button variant="ghost" size="small">
            Reset
          </Button>
          <Button variant="ghost" size="small">
            <Download className="w-4 h-4" />
            Save
          </Button>
        </div>

        {/* Wokwi Simulator */}
        <div className="flex-1 bg-white p-4 flex items-center justify-center border-b border-[var(--color-border)]">
          <div className="text-center text-[var(--color-text-secondary)]">
            <FlaskConical className="w-16 h-16 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Circuit Simulator</p>
            <p className="text-xs">Arduino Uno + LED on Pin 13</p>
          </div>
        </div>

        {/* Serial Monitor */}
        <div className="h-48 bg-[#1E1E1E] p-4 overflow-auto">
          <div className="text-xs text-[#D4D4D4] font-mono space-y-1">
            <div>Serial Monitor - 9600 baud</div>
            <div className="text-[#4EC9B0]">LED blinked</div>
            <div className="text-[#4EC9B0]">LED blinked</div>
            <div className="text-[#4EC9B0]">LED blinked</div>
          </div>
        </div>

        {/* Hint Panel */}
        {showHint && (
          <div className="bg-[#FFF9E6] border-t border-[#FFE082] p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-[#FF6F00] shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">💡 Hint 1 of 3</div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Use pinMode() to set the pin direction before using digitalWrite().
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowHint(!showHint)}
          className="p-3 text-sm text-[var(--color-primary)] hover:bg-[var(--color-surface-alt)] transition-colors"
        >
          {showHint ? 'Hide Hint' : '💡 Show Hint (1 of 3)'}
        </button>
      </div>
    </div>
  );
}

function QuizLesson() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(2);
  const totalQuestions = 5;
  const timeRemaining = '08:42';

  const question = {
    text: 'Which function is used to set a pin as OUTPUT in Arduino?',
    options: [
      { id: 'A', text: 'pinMode()', correct: true },
      { id: 'B', text: 'digitalWrite()', correct: false },
      { id: 'C', text: 'analogRead()', correct: false },
      { id: 'D', text: 'Serial.begin()', correct: false },
    ],
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-[var(--color-surface-alt)]">
      {/* Progress Dots */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < currentQuestion - 1
                ? 'bg-[var(--color-success)]'
                : i === currentQuestion - 1
                ? 'bg-[var(--color-primary)]'
                : 'bg-[var(--color-border)]'
            }`}
          />
        ))}
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[#FFF9E6] border border-[#FFE082] mb-6">
        <Clock className="w-4 h-4 text-[#FF6F00]" />
        <span className="text-sm font-medium text-[#FF6F00]">{timeRemaining}</span>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-2xl bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-2 p-6 md:p-8 mb-6">
        <div className="mb-2 text-sm text-[var(--color-text-secondary)]">
          Question {currentQuestion} of {totalQuestions}
        </div>
        <h2 className="text-xl md:text-2xl mb-8">{question.text}</h2>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.correct;
            const showResult = submitted;

            let bgClass = 'bg-[var(--color-surface)]';
            let borderClass = 'border-[var(--color-border)] hover:border-[var(--color-primary)]';
            let iconClass = '';

            if (showResult) {
              if (isCorrect) {
                bgClass = 'bg-[var(--color-success)]/10';
                borderClass = 'border-[var(--color-success)]';
                iconClass = 'text-[var(--color-success)]';
              } else if (isSelected && !isCorrect) {
                bgClass = 'bg-[var(--color-error)]/10';
                borderClass = 'border-[var(--color-error)]';
                iconClass = 'text-[var(--color-error)]';
              }
            } else if (isSelected) {
              bgClass = 'bg-[var(--color-primary)]/10';
              borderClass = 'border-[var(--color-primary)]';
            }

            return (
              <button
                key={option.id}
                onClick={() => !submitted && setSelectedAnswer(option.id)}
                disabled={submitted}
                className={`w-full h-16 px-4 rounded-[var(--radius-md)] border-2 ${borderClass} ${bgClass} flex items-center justify-between transition-all hover:shadow-1 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[var(--color-text-secondary)]">{option.id})</span>
                  <span className="font-medium">{option.text}</span>
                </div>
                {showResult && isCorrect && (
                  <Check className={`w-5 h-5 ${iconClass}`} />
                )}
                {showResult && isSelected && !isCorrect && (
                  <span className={`text-xl ${iconClass}`}>✗</span>
                )}
                {!showResult && isSelected && (
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <Button
        variant="accent"
        size="large"
        onClick={() => {
          if (!submitted) {
            setSubmitted(true);
          } else {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setSubmitted(false);
          }
        }}
        disabled={!selectedAnswer}
        className="w-full max-w-2xl"
      >
        {submitted ? (
          <>
            Next Question
            <ChevronRight className="w-5 h-5" />
          </>
        ) : (
          'Submit Answer'
        )}
      </Button>

      {/* Explanation (shown after submit) */}
      {submitted && (
        <div className="w-full max-w-2xl mt-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <h4 className="font-semibold mb-2">Explanation</h4>
          <p className="text-sm text-[var(--color-text-secondary)]">
            pinMode() is used to configure a specific pin to behave either as an input or an output. 
            digitalWrite() is used to write HIGH or LOW values to a digital pin.
          </p>
        </div>
      )}
    </div>
  );
}

function LessonItem({ lesson }: any) {
  const isCompleted = lesson.status === 'completed';
  const isCurrent = lesson.status === 'current';
  const isLocked = lesson.status === 'locked';

  return (
    <button
      className={`w-full h-14 px-4 flex items-center gap-3 border-b border-[var(--color-border)] transition-colors relative ${
        isCurrent 
          ? 'bg-[#EEF5FF] text-[var(--color-primary)]' 
          : isCompleted
          ? 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
          : 'text-[var(--color-text-secondary)] cursor-not-allowed'
      }`}
      disabled={isLocked}
    >
      {isCurrent && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-accent)]" />
      )}

      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        {isCompleted && <Check className="w-4 h-4 text-[var(--color-success)]" />}
        {isCurrent && <Play className="w-4 h-4" />}
        {isLocked && <Lock className="w-4 h-4" />}
      </div>

      <span className={`text-sm flex-1 text-left ${isCurrent ? 'font-semibold' : ''}`}>
        {lesson.title}
      </span>

      {lesson.type === 'quiz' && (
        <FileText className="w-4 h-4" />
      )}
      {lesson.type === 'lab' && (
        <FlaskConical className="w-4 h-4 text-[var(--color-success)]" />
      )}
    </button>
  );
}

function MobileLessonDrawer({ lessons, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-surface)] rounded-t-[var(--radius-xl)] max-h-[80vh] flex flex-col">
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-[var(--color-border)] rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <h3>Course Content</h3>
            <span className="text-sm text-[var(--color-text-secondary)]">3 of 12</span>
          </div>
          <div className="w-full h-2 bg-[var(--color-surface-alt)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-primary)]" style={{ width: '25%' }} />
          </div>
        </div>

        {/* Lesson List */}
        <div className="flex-1 overflow-y-auto">
          {lessons.map((lesson: any) => (
            <LessonItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </div>
    </div>
  );
}