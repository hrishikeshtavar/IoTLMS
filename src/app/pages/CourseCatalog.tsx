import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { TopicChip } from '../components/TopicChip';
import { DifficultyBadge } from '../components/DifficultyBadge';

export default function CourseCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState('Any');
  const [labIncluded, setLabIncluded] = useState(false);
  const [sortBy, setSortBy] = useState('Most Popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const topicFilters = [
    { name: 'Arduino', count: 12 },
    { name: 'Raspberry Pi', count: 8 },
    { name: 'ARM', count: 6 },
    { name: 'RISC-V', count: 4 },
    { name: '8051', count: 7 },
    { name: 'IoT', count: 5 },
    { name: 'Edge AI', count: 2 },
  ];

  const courses = [
    {
      id: 1,
      title: 'Arduino Fundamentals: Build Your First Circuit',
      instructor: 'Dr. Rajesh Kumar',
      instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      duration: '4.5 hrs',
      level: 'Beginner' as const,
      topic: 'Arduino' as const,
      languages: ['EN', 'HI', 'MR'],
      rating: 4.8,
      students: 234,
      thumbnail: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwY2lyY3VpdCUyMGJvYXJkJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzcyNTA0OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      badge: 'ENROLLED',
    },
    {
      id: 2,
      title: 'ARM Processor Architecture and Programming',
      instructor: 'Prof. Anjali Desai',
      instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      duration: '8 hrs',
      level: 'Intermediate' as const,
      topic: 'ARM' as const,
      languages: ['EN', 'HI'],
      rating: 4.9,
      students: 189,
      thumbnail: 'https://images.unsplash.com/photo-1686195165991-74af7c2918d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb2NvbnRyb2xsZXIlMjBhcm0lMjBwcm9jZXNzb3J8ZW58MXx8fHwxNzcyNTA0OTY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Raspberry Pi Projects for Beginners',
      instructor: 'Amit Patel',
      instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      duration: '6 hrs',
      level: 'Beginner' as const,
      topic: 'Raspberry Pi' as const,
      languages: ['EN'],
      rating: 4.7,
      students: 312,
      thumbnail: 'https://images.unsplash.com/photo-1587919057555-d728ff5beac3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXNwYmVycnklMjBwaSUyMGNvbXB1dGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzI1MDQ5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      badge: 'NEW',
      freePreview: true,
    },
    {
      id: 4,
      title: 'RISC-V Architecture Essentials',
      instructor: 'Dr. Priya Menon',
      instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      duration: '10 hrs',
      level: 'Advanced' as const,
      topic: 'RISC-V' as const,
      languages: ['EN', 'HI', 'MR'],
      rating: 4.9,
      students: 145,
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9jZXNzb3IlMjBjaGlwJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NDA2ODEyNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 5,
      title: '8051 Microcontroller Programming',
      instructor: 'Suresh Kumar',
      instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      duration: '5.5 hrs',
      level: 'Intermediate' as const,
      topic: '8051' as const,
      languages: ['EN', 'HI'],
      rating: 4.6,
      students: 267,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb2NvbnRyb2xsZXIlMjBjaXJjdWl0JTIwYm9hcmR8ZW58MXx8fHwxNzQwNjgxMjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 6,
      title: 'IoT Communication Protocols Deep Dive',
      instructor: 'Dr. Anjali Singh',
      instructorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100',
      duration: '7 hrs',
      level: 'Intermediate' as const,
      topic: 'IoT' as const,
      languages: ['EN', 'HI', 'MR'],
      rating: 4.8,
      students: 198,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpb3QlMjBuZXR3b3JrJTIwY29ubmVjdGlvbnxlbnwxfHx8fDE3NDA2ODEyNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      title: 'Edge AI for IoT Devices',
      instructor: 'Vikram Reddy',
      instructorAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100',
      duration: '12 hrs',
      level: 'Advanced' as const,
      topic: 'Edge AI' as const,
      languages: ['EN'],
      rating: 4.9,
      students: 156,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MXx8fHwxNzQwNjgxMjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 8,
      title: 'Embedded C for ARM Processors',
      instructor: 'Prof. Rajesh Nair',
      instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
      duration: '9 hrs',
      level: 'Intermediate' as const,
      topic: 'ARM' as const,
      languages: ['EN', 'HI'],
      rating: 4.7,
      students: 203,
      thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9ncmFtbWluZyUyMGNvbXB1dGVyfGVufDF8fHx8MTc0MDY4MTI0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 9,
      title: 'Sensor Integration with Arduino',
      instructor: 'Karan Mehta',
      instructorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
      duration: '4 hrs',
      level: 'Beginner' as const,
      topic: 'Arduino' as const,
      languages: ['EN', 'HI', 'MR'],
      rating: 4.6,
      students: 289,
      thumbnail: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5zb3IlMjB0ZWNobm9sb2d5JTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzQwNjgxMjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const clearAllFilters = () => {
    setSelectedTopics([]);
    setSelectedDifficulty('All Levels');
    setSelectedLanguages([]);
    setSelectedDuration('Any');
    setLabIncluded(false);
  };

  const activeFilterCount = selectedTopics.length + selectedLanguages.length + 
    (selectedDifficulty !== 'All Levels' ? 1 : 0) + 
    (selectedDuration !== 'Any' ? 1 : 0) + 
    (labIncluded ? 1 : 0);

  return (
    <div className="lg:flex lg:gap-6">
      {/* Desktop Filter Sidebar */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0">
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-6 sticky top-20">
          <div className="flex items-center justify-between mb-6">
            <h3>Filters</h3>
            <button 
              onClick={clearAllFilters}
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              Clear all
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:border-[var(--color-border-focus)] focus:outline-none"
            />
          </div>

          <div className="space-y-6">
            {/* Topic Filter */}
            <FilterSection title="Topic">
              <div className="space-y-2">
                {topicFilters.map((topic) => (
                  <label key={topic.name} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(topic.name)}
                        onChange={() => toggleTopic(topic.name)}
                        className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
                      />
                      <span className="text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                        {topic.name}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface-alt)] px-2 py-0.5 rounded-[var(--radius-sm)]">
                      {topic.count}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Difficulty Filter */}
            <FilterSection title="Difficulty">
              <div className="space-y-2">
                {['All Levels', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="difficulty"
                      checked={selectedDifficulty === level}
                      onChange={() => setSelectedDifficulty(level)}
                      className="w-4 h-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Language Filter */}
            <FilterSection title="Language">
              <div className="space-y-2">
                {[
                  { code: 'EN', label: 'English' },
                  { code: 'HI', label: 'हिंदी (Hindi)' },
                  { code: 'MR', label: 'मराठी (Marathi)' },
                ].map((lang) => (
                  <label key={lang.code} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang.code)}
                      onChange={() => toggleLanguage(lang.code)}
                      className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                      {lang.label}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Duration Filter */}
            <FilterSection title="Duration">
              <div className="space-y-2">
                {['Any', 'Under 2 hrs', '2–5 hrs', '5–10 hrs', '10+ hrs'].map((duration) => (
                  <label key={duration} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="duration"
                      checked={selectedDuration === duration}
                      onChange={() => setSelectedDuration(duration)}
                      className="w-4 h-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                      {duration}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Lab Included Toggle */}
            <FilterSection title="Lab Included">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-[var(--color-text-primary)]">Include lab sessions</span>
                <button
                  onClick={() => setLabIncluded(!labIncluded)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    labIncluded ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      labIncluded ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </label>
            </FilterSection>
          </div>

          <Button variant="primary" size="medium" className="w-full mt-6">
            Apply Filters
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2>Course Catalog</h2>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="relative p-2 hover:bg-[var(--color-surface-alt)] rounded-lg"
            >
              <SlidersHorizontal className="w-6 h-6" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-primary)] text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:border-[var(--color-border-focus)] focus:outline-none"
            />
          </div>

          {/* Mobile Topic Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {topicFilters.map((topic) => (
              <button
                key={topic.name}
                onClick={() => toggleTopic(topic.name)}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTopics.includes(topic.name)
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
                }`}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-body text-[var(--color-text-secondary)]">
            Showing {courses.length} courses
          </p>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none h-10 pl-4 pr-10 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:border-[var(--color-border-focus)] focus:outline-none bg-[var(--color-surface)] text-sm"
            >
              <option>Most Popular</option>
              <option>Highest Rated</option>
              <option>Newest</option>
              <option>A to Z</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)] pointer-events-none" />
          </div>
        </div>

        {/* Course Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Course List - Mobile */}
        <div className="md:hidden space-y-4 mb-8">
          {courses.map((course) => (
            <MobileCourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button className="p-2 hover:bg-[var(--color-surface-alt)] rounded-lg disabled:opacity-50" disabled>
            <ChevronLeft className="w-5 h-5" />
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'hover:bg-[var(--color-surface-alt)] text-[var(--color-text-primary)]'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="p-2 hover:bg-[var(--color-surface-alt)] rounded-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Mobile Filter Bottom Sheet */}
      {showMobileFilters && (
        <MobileFilterSheet
          selectedTopics={selectedTopics}
          selectedDifficulty={selectedDifficulty}
          selectedLanguages={selectedLanguages}
          selectedDuration={selectedDuration}
          labIncluded={labIncluded}
          onToggleTopic={toggleTopic}
          onSelectDifficulty={setSelectedDifficulty}
          onToggleLanguage={toggleLanguage}
          onSelectDuration={setSelectedDuration}
          onToggleLabIncluded={() => setLabIncluded(!labIncluded)}
          onClearAll={clearAllFilters}
          onClose={() => setShowMobileFilters(false)}
          resultCount={courses.length}
        />
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[var(--color-border)] pt-4">
      <h4 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">{title}</h4>
      {children}
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 overflow-hidden hover:shadow-2 transition-shadow group relative">
      {/* Badge Ribbons */}
      {course.badge === 'ENROLLED' && (
        <div className="absolute top-0 right-0 z-10 bg-[var(--color-success)] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          ENROLLED
        </div>
      )}
      {course.badge === 'NEW' && (
        <div className="absolute top-3 right-3 z-10 bg-[#FFA726] text-white text-xs font-bold px-2 py-1 rounded-[var(--radius-sm)]">
          NEW
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <TopicChip topic={course.topic} size="small" />
        </div>
        {course.freePreview && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-[var(--radius-sm)] text-xs font-medium text-[var(--color-primary)]">
            FREE PREVIEW
          </div>
        )}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-[var(--radius-sm)] text-xs text-white">
          {course.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="mb-3 line-clamp-2">{course.title}</h4>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={course.instructorAvatar}
            alt={course.instructor}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-[var(--color-text-secondary)]">{course.instructor}</span>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-1 mb-3">
          {course.languages.map((lang: string) => (
            <span key={lang} className="text-xs text-[var(--color-text-secondary)] px-2 py-0.5 bg-[var(--color-surface-alt)] rounded-[var(--radius-sm)]">
              {lang}
            </span>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mb-4">
          <DifficultyBadge level={course.level} />
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-[#FFA726] text-[#FFA726]" />
            <span className="font-medium">{course.rating}</span>
            <span className="text-[var(--color-text-secondary)]">· {course.students}</span>
          </div>
        </div>

        {/* CTA */}
        <Button
          variant={course.badge === 'ENROLLED' ? 'primary' : 'accent'}
          size="medium"
          className="w-full"
        >
          {course.badge === 'ENROLLED' ? 'Continue' : course.freePreview ? 'Preview' : 'Enroll Now'}
        </Button>
      </div>
    </div>
  );
}

function MobileCourseCard({ course }: { course: any }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 overflow-hidden flex">
      {/* Thumbnail */}
      <div className="relative w-32 flex-shrink-0">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.badge === 'NEW' && (
          <div className="absolute top-2 left-2 bg-[#FFA726] text-white text-xs font-bold px-2 py-0.5 rounded">
            NEW
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-3">
        <TopicChip topic={course.topic} size="small" className="mb-2" />
        <h4 className="text-sm font-semibold mb-1 line-clamp-2">{course.title}</h4>
        <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] mb-2">
          <Star className="w-3 h-3 fill-[#FFA726] text-[#FFA726]" />
          <span>{course.rating}</span>
          <span>·</span>
          <span>{course.duration}</span>
        </div>
        <Button variant="accent" size="small" className="w-full">
          {course.badge === 'ENROLLED' ? 'Continue' : 'Enroll'}
        </Button>
      </div>
    </div>
  );
}

function MobileFilterSheet({
  selectedTopics,
  selectedDifficulty,
  selectedLanguages,
  selectedDuration,
  labIncluded,
  onToggleTopic,
  onSelectDifficulty,
  onToggleLanguage,
  onSelectDuration,
  onToggleLabIncluded,
  onClearAll,
  onClose,
  resultCount,
}: any) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-surface)] rounded-t-[var(--radius-xl)] max-h-[90vh] flex flex-col">
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-[var(--color-border)] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-[var(--color-border)]">
          <h3>Filters</h3>
          <button onClick={onClearAll} className="text-sm text-[var(--color-primary)]">
            Clear all
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Topics */}
            <div>
              <h4 className="mb-3">Topic</h4>
              <div className="flex flex-wrap gap-2">
                {['Arduino', 'Raspberry Pi', 'ARM', 'RISC-V', '8051', 'IoT', 'Edge AI'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => onToggleTopic(topic)}
                    className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm transition-colors ${
                      selectedTopics.includes(topic)
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <h4 className="mb-3">Difficulty</h4>
              <div className="space-y-2">
                {['All Levels', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <label key={level} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="difficulty-mobile"
                      checked={selectedDifficulty === level}
                      onChange={() => onSelectDifficulty(level)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <h4 className="mb-3">Language</h4>
              <div className="space-y-2">
                {[
                  { code: 'EN', label: 'English' },
                  { code: 'HI', label: 'हिंदी' },
                  { code: 'MR', label: 'मराठी' },
                ].map((lang) => (
                  <label key={lang.code} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang.code)}
                      onChange={() => onToggleLanguage(lang.code)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{lang.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <h4 className="mb-3">Duration</h4>
              <div className="space-y-2">
                {['Any', 'Under 2 hrs', '2–5 hrs', '5–10 hrs', '10+ hrs'].map((duration) => (
                  <label key={duration} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="duration-mobile"
                      checked={selectedDuration === duration}
                      onChange={() => onSelectDuration(duration)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{duration}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lab Included */}
            <div>
              <label className="flex items-center justify-between">
                <span className="font-medium">Lab Included</span>
                <button
                  onClick={onToggleLabIncluded}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    labIncluded ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      labIncluded ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-6 border-t border-[var(--color-border)]">
          <Button variant="primary" size="large" className="w-full" onClick={onClose}>
            Show {resultCount} Results
          </Button>
        </div>
      </div>
    </div>
  );
}