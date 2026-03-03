import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Edit2,
  Plus,
  GripVertical,
  Check,
  Lock,
  Video,
  FileText,
  FlaskConical,
  FileQuestion,
  Upload,
  Eye,
  Save,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link2,
  Code,
  Image as ImageIcon,
  Table,
  Undo,
  Redo,
  Clock,
  User,
  MessageSquare,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/Button';

type LessonType = 'video' | 'text' | 'lab' | 'quiz';
type LessonStatus = 'draft' | 'review' | 'approved' | 'published';
type Language = 'en' | 'hi' | 'mr';

export default function LessonEditor() {
  const [activeLanguage, setActiveLanguage] = useState<Language>('en');
  const [lessonType, setLessonType] = useState<LessonType>('video');
  const [lessonStatus, setLessonStatus] = useState<LessonStatus>('draft');
  const [lessonTitle, setLessonTitle] = useState('03. Digital I/O and GPIO Pins');
  const [expandedModules, setExpandedModules] = useState<number[]>([1]);
  const [videoUploaded, setVideoUploaded] = useState(true);
  const [subtitlesUploaded, setSubtitlesUploaded] = useState({ en: true, hi: false, mr: false });

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const modules = [
    {
      id: 1,
      name: 'Module 1: Getting Started',
      lessons: [
        { id: 1, title: '01. What is Arduino?', type: 'text', status: 'published' },
        { id: 2, title: '02. Setting Up IDE', type: 'video', status: 'published' },
        { id: 3, title: '03. GPIO Pins', type: 'video', status: 'draft', active: true },
      ],
    },
    {
      id: 2,
      name: 'Module 2: I/O and Sensors',
      lessons: [
        { id: 4, title: '04. Analog Inputs', type: 'video', status: 'draft' },
        { id: 5, title: '05. Sensor Lab', type: 'lab', status: 'draft' },
      ],
    },
  ];

  const versionHistory = [
    { version: 'v3.1', author: 'You', time: '2 min ago', message: '', current: true },
    { version: 'v3.0', author: 'Priya M.', time: 'Oct 14', message: 'Added Hindi subtitle' },
    { version: 'v2.1', author: 'Admin', time: 'Oct 10', message: 'Approved for review' },
    { version: 'v2.0', author: 'You', time: 'Oct 8', message: 'Initial upload' },
  ];

  const comments = [
    {
      id: 1,
      author: 'Priya Mehta',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      text: 'Please add more examples in the code section',
      time: '2 hours ago',
      resolved: false,
    },
    {
      id: 2,
      author: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      text: 'Video quality looks good, approved!',
      time: '1 day ago',
      resolved: true,
    },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--color-surface-alt)]">
      {/* Left Panel - Course Structure */}
      <aside className="w-[260px] bg-[#F8FAFF] border-r border-[var(--color-border)] flex flex-col">
        {/* Breadcrumb */}
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] mb-3">
            <span>Courses</span>
            <ChevronRight className="w-3 h-3" />
            <span>Arduino Fundamentals</span>
            <ChevronRight className="w-3 h-3" />
            <span>Lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold flex-1">Arduino Fundamentals</h3>
            <button className="p-1 hover:bg-white rounded">
              <Edit2 className="w-4 h-4 text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Lesson Tree */}
        <div className="flex-1 overflow-y-auto p-4">
          {modules.map((module) => (
            <div key={module.id} className="mb-4">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center gap-2 p-2 rounded hover:bg-white/50 transition-colors mb-1"
              >
                {expandedModules.includes(module.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="text-sm font-medium flex-1 text-left">{module.name}</span>
              </button>

              {/* Lessons */}
              {expandedModules.includes(module.id) && (
                <div className="ml-2 space-y-1">
                  {module.lessons.map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center gap-2 p-2 pl-6 rounded cursor-pointer transition-colors ${
                        lesson.active
                          ? 'bg-[#EEF5FF] text-[var(--color-primary)]'
                          : 'hover:bg-white/50'
                      }`}
                    >
                      <GripVertical className="w-3 h-3 text-[var(--color-text-secondary)]" />
                      {lesson.status === 'published' && (
                        <Check className="w-4 h-4 text-[var(--color-success)]" />
                      )}
                      {lesson.status === 'draft' && lesson.active && (
                        <Edit2 className="w-4 h-4" />
                      )}
                      {lesson.status === 'draft' && !lesson.active && (
                        <Lock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                      )}
                      <span className="text-sm flex-1">{lesson.title}</span>
                    </div>
                  ))}
                  <button className="flex items-center gap-2 p-2 pl-6 text-sm text-[var(--color-primary)] hover:bg-white/50 rounded transition-colors w-full">
                    <Plus className="w-4 h-4" />
                    Add Lesson
                  </button>
                </div>
              )}
            </div>
          ))}
          <button className="flex items-center gap-2 p-2 text-sm text-[var(--color-primary)] hover:bg-white rounded transition-colors w-full">
            <Plus className="w-4 h-4" />
            Add Module
          </button>
        </div>
      </aside>

      {/* Center Panel - Main Editor */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Bar */}
        <div className="border-b border-[var(--color-border)] p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="text-2xl font-bold border-none outline-none flex-1 mr-4"
            />
            <div className="flex items-center gap-3">
              <select
                value={lessonStatus}
                onChange={(e) => setLessonStatus(e.target.value as LessonStatus)}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium border ${
                  lessonStatus === 'draft'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : lessonStatus === 'review'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-green-50 text-green-700 border-green-200'
                }`}
              >
                <option value="draft">DRAFT</option>
                <option value="review">IN REVIEW</option>
                <option value="approved">APPROVED</option>
              </select>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Save className="w-4 h-4" />
                Saved 2m ago
              </div>
              <Button variant="ghost" size="small">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button variant="primary" size="small">
                Submit for Review
              </Button>
            </div>
          </div>

          {/* Language Tabs */}
          <div className="flex gap-4 mb-4">
            {[
              { code: 'en', label: 'English', complete: true },
              { code: 'hi', label: 'हिंदी', complete: false },
              { code: 'mr', label: 'मराठी', complete: false },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveLanguage(lang.code as Language)}
                className={`pb-2 border-b-2 transition-colors ${
                  activeLanguage === lang.code
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)] font-medium'
                    : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <span className="mr-2">{lang.label}</span>
                {lang.complete ? (
                  <Check className="w-4 h-4 inline text-[var(--color-success)]" />
                ) : (
                  <AlertCircle className="w-4 h-4 inline text-amber-500" />
                )}
              </button>
            ))}
          </div>

          {/* Lesson Type Selector */}
          <div className="flex gap-2">
            {[
              { type: 'video', icon: Video, label: 'Video' },
              { type: 'text', icon: FileText, label: 'Text' },
              { type: 'lab', icon: FlaskConical, label: 'Lab' },
              { type: 'quiz', icon: FileQuestion, label: 'Quiz' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => setLessonType(item.type as LessonType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] transition-colors ${
                  lessonType === item.type
                    ? 'bg-[#EEF5FF] text-[var(--color-primary)] border-2 border-[var(--color-primary)]'
                    : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] border-2 border-transparent hover:border-[var(--color-border)]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {lessonType === 'video' && (
            <VideoLessonEditor
              videoUploaded={videoUploaded}
              setVideoUploaded={setVideoUploaded}
              subtitlesUploaded={subtitlesUploaded}
              setSubtitlesUploaded={setSubtitlesUploaded}
            />
          )}
        </div>
      </main>

      {/* Right Panel - Tools & Meta */}
      <aside className="w-[280px] bg-[#F8FAFF] border-l border-[var(--color-border)] overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Lesson Info */}
          <div className="bg-white rounded-[var(--radius-lg)] p-4">
            <h4 className="font-semibold mb-3 text-sm">Lesson Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-[var(--color-text-secondary)] mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)]">Created</p>
                  <p>Oct 12, 2024 by Priya Mehta</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[var(--color-text-secondary)] mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)]">Last edited</p>
                  <p>2 min ago</p>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Version:</span>
                <span className="font-medium">v3.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Views:</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </div>

          {/* Version History */}
          <div className="bg-white rounded-[var(--radius-lg)] p-4">
            <h4 className="font-semibold mb-3 text-sm">Version History</h4>
            <div className="space-y-3">
              {versionHistory.map((version) => (
                <div
                  key={version.version}
                  className="group hover:bg-[var(--color-surface-alt)] p-2 -mx-2 rounded transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{version.version}</span>
                      {version.current && (
                        <span className="px-1.5 py-0.5 bg-[var(--color-primary)] text-white text-xs rounded">
                          Current
                        </span>
                      )}
                    </div>
                    {!version.current && (
                      <button className="text-xs text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                        Restore
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {version.author} · {version.time}
                  </p>
                  {version.message && (
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      "{version.message}"
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button className="text-sm text-[var(--color-primary)] hover:underline mt-3">
              View all versions →
            </button>
          </div>

          {/* Translation Status */}
          <div className="bg-white rounded-[var(--radius-lg)] p-4">
            <h4 className="font-semibold mb-3 text-sm">Translation Status</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">EN</span>
                  <Check className="w-4 h-4 text-[var(--color-success)]" />
                </div>
                <p className="text-xs text-[var(--color-success)]">Complete (Published)</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">HI</span>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="mb-1">
                  <div className="h-1.5 bg-[var(--color-surface-alt)] rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
                <p className="text-xs text-amber-600">In Progress (70%)</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">MR</span>
                  <AlertCircle className="w-4 h-4 text-[var(--color-error)]" />
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mb-2">Not Started</p>
                <Button variant="outline" size="small" className="w-full text-xs">
                  Assign Translator
                </Button>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-[var(--radius-lg)] p-4">
            <h4 className="font-semibold mb-3 text-sm">Comments</h4>
            <div className="space-y-3 mb-3">
              {comments.map((comment) => (
                <div key={comment.id} className="pb-3 border-b border-[var(--color-border)] last:border-0">
                  <div className="flex items-start gap-2 mb-2">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{comment.author}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{comment.time}</p>
                    </div>
                    {comment.resolved && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">
                        RESOLVED
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
            <textarea
              placeholder="Add a comment..."
              className="w-full p-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              rows={2}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

function VideoLessonEditor({ videoUploaded, setVideoUploaded, subtitlesUploaded, setSubtitlesUploaded }: any) {
  return (
    <div className="max-w-4xl space-y-6">
      {/* Video Upload */}
      <div>
        <label className="block font-semibold mb-2">Lesson Video</label>
        {videoUploaded ? (
          <div className="border-2 border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex items-center gap-4">
            <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">arduino_gpio_lesson.mp4</p>
              <p className="text-sm text-[var(--color-text-secondary)]">18:45 · 245 MB</p>
            </div>
            <Button variant="outline" size="small">
              Replace
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] h-[400px] flex flex-col items-center justify-center gap-3 hover:border-[var(--color-primary)] hover:bg-[#EEF5FF]/30 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-[var(--color-text-secondary)]" />
            <p className="text-[var(--color-text-secondary)]">
              Drag MP4 video here or click to upload
            </p>
            <Button variant="primary" size="small">
              Choose File
            </Button>
          </div>
        )}
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block font-semibold mb-2">Thumbnail</label>
        <div className="border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] h-[140px] w-[250px] flex flex-col items-center justify-center gap-2 hover:border-[var(--color-primary)] hover:bg-[#EEF5FF]/30 transition-colors cursor-pointer">
          <ImageIcon className="w-8 h-8 text-[var(--color-text-secondary)]" />
          <p className="text-sm text-[var(--color-text-secondary)]">Upload thumbnail</p>
          <p className="text-xs text-[var(--color-text-secondary)]">16:9 aspect ratio</p>
        </div>
      </div>

      {/* Subtitles */}
      <div>
        <label className="block font-semibold mb-2">Subtitles</label>
        <div className="flex gap-3">
          {[
            { code: 'en', label: 'Add EN .vtt' },
            { code: 'hi', label: 'Add HI .vtt' },
            { code: 'mr', label: 'Add MR .vtt' },
          ].map((sub) => (
            <button
              key={sub.code}
              className={`px-4 py-2 rounded-[var(--radius-md)] border-2 transition-colors ${
                subtitlesUploaded[sub.code as keyof typeof subtitlesUploaded]
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}
            >
              {subtitlesUploaded[sub.code as keyof typeof subtitlesUploaded] ? (
                <>
                  <Check className="w-4 h-4 inline mr-2" />
                  {sub.code.toUpperCase()} Uploaded
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 inline mr-2" />
                  {sub.label}
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="block font-semibold mb-2">Lesson Description</label>
        <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
          {/* Toolbar */}
          <div className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] p-2 flex items-center gap-1 flex-wrap">
            <EditorButton icon={Bold} />
            <EditorButton icon={Italic} />
            <EditorButton icon={Underline} />
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            <EditorButton icon={Heading1} />
            <EditorButton icon={Heading2} />
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            <EditorButton icon={List} />
            <EditorButton icon={ListOrdered} />
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            <EditorButton icon={Link2} />
            <EditorButton icon={Code} />
            <EditorButton icon={ImageIcon} />
            <EditorButton icon={Table} />
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            <EditorButton icon={Undo} />
            <EditorButton icon={Redo} />
          </div>

          {/* Editor Body */}
          <div className="p-4 min-h-[300px] bg-white">
            <p className="mb-4">
              In this lesson, we'll explore the Digital I/O pins on the Arduino board and learn
              how to control them using code.
            </p>
            <h3 className="text-lg font-bold mb-2">Key Concepts:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Digital pins can be configured as INPUT or OUTPUT</li>
              <li>Using pinMode() to set pin direction</li>
              <li>digitalWrite() to set pin state (HIGH/LOW)</li>
            </ul>
            <div className="bg-[#1E1E1E] text-[#D4D4D4] p-4 rounded-lg font-mono text-sm">
              <pre>{`void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Settings */}
      <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4">
        <h4 className="font-semibold mb-4">Lesson Settings</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prerequisites</label>
            <select className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              <option>01. What is Arduino?</option>
              <option>02. Setting Up IDE</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Duration (min)</label>
              <input
                type="number"
                defaultValue={18}
                className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Points</label>
              <input
                type="number"
                defaultValue={100}
                className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Must Cache for Offline</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {['GPIO', 'Digital', 'Arduino', 'Beginner'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[var(--color-surface-alt)] rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tag..."
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorButton({ icon: Icon }: any) {
  return (
    <button className="p-2 hover:bg-white rounded transition-colors">
      <Icon className="w-4 h-4 text-[var(--color-text-secondary)]" />
    </button>
  );
}
