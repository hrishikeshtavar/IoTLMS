import { useState } from 'react';
import { ChevronRight, Flame, BookOpen, CheckCircle, FlaskConical, Award } from 'lucide-react';
import { Button } from '../components/Button';
import { TopicChip } from '../components/TopicChip';
import { ProgressRing } from '../components/ProgressRing';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { Link } from 'react-router';

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Arduino', 'Raspberry Pi', 'ARM', 'RISC-V', '8051', 'Protocols', 'Edge AI'];

  const continueLearningCourses = [
    {
      id: 1,
      title: 'Arduino Fundamentals',
      topic: 'Arduino' as const,
      progress: 65,
      lastLesson: 'Digital I/O Pins',
      thumbnail: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwY2lyY3VpdCUyMGJvYXJkJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzcyNTA0OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: 'ARM Cortex-M4 Deep Dive',
      topic: 'ARM' as const,
      progress: 30,
      lastLesson: 'Memory Architecture',
      thumbnail: 'https://images.unsplash.com/photo-1686195165991-74af7c2918d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb2NvbnRyb2xsZXIlMjBhcm0lMjBwcm9jZXNzb3J8ZW58MXx8fHwxNzcyNTA0OTY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'IoT Security Basics',
      topic: 'IoT' as const,
      progress: 10,
      lastLesson: 'Introduction to IoT Security',
      thumbnail: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpb3QlMjBzZWN1cml0eSUyMGN5YmVyc2VjdXJpdHl8ZW58MXx8fHwxNzQwNjgxMjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const allCourses = [
    {
      id: 4,
      title: 'Raspberry Pi Projects for Beginners',
      instructor: 'Amit Patel',
      duration: '5 weeks',
      level: 'Beginner' as const,
      topic: 'Raspberry Pi' as const,
      thumbnail: 'https://images.unsplash.com/photo-1587919057555-d728ff5beac3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXNwYmVycnklMjBwaSUyMGNvbXB1dGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzI1MDQ5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 5,
      title: 'RISC-V Architecture Essentials',
      instructor: 'Dr. Priya Menon',
      duration: '6 weeks',
      level: 'Advanced' as const,
      topic: 'RISC-V' as const,
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9jZXNzb3IlMjBjaGlwJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NDA2ODEyNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 6,
      title: '8051 Microcontroller Programming',
      instructor: 'Suresh Kumar',
      duration: '4 weeks',
      level: 'Intermediate' as const,
      topic: '8051' as const,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb2NvbnRyb2xsZXIlMjBjaXJjdWl0JTIwYm9hcmR8ZW58MXx8fHwxNzQwNjgxMjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      title: 'IoT Communication Protocols',
      instructor: 'Dr. Anjali Singh',
      duration: '5 weeks',
      level: 'Intermediate' as const,
      topic: 'IoT' as const,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpb3QlMjBuZXR3b3JrJTIwY29ubmVjdGlvbnxlbnwxfHx8fDE3NDA2ODEyNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 8,
      title: 'Edge AI for IoT Devices',
      instructor: 'Vikram Reddy',
      duration: '8 weeks',
      level: 'Advanced' as const,
      topic: 'Edge AI' as const,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MXx8fHwxNzQwNjgxMjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 9,
      title: 'Embedded C for ARM Processors',
      instructor: 'Prof. Rajesh Nair',
      duration: '7 weeks',
      level: 'Intermediate' as const,
      topic: 'ARM' as const,
      thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9ncmFtbWluZyUyMGNvbXB1dGVyfGVufDF8fHx8MTc0MDY4MTI0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 10,
      title: 'PCB Design Fundamentals',
      instructor: 'Meera Iyer',
      duration: '6 weeks',
      level: 'Beginner' as const,
      topic: 'Arduino' as const,
      thumbnail: 'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwY2IlMjBjaXJjdWl0JTIwYm9hcmR8ZW58MXx8fHwxNzQwNjgxMjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 11,
      title: 'Sensor Integration with Arduino',
      instructor: 'Karan Mehta',
      duration: '4 weeks',
      level: 'Beginner' as const,
      topic: 'Arduino' as const,
      thumbnail: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5zb3IlMjB0ZWNobm9sb2d5JTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzQwNjgxMjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const filteredCourses = selectedFilter === 'All' 
    ? allCourses 
    : allCourses.filter(course => course.topic === selectedFilter);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] h-[120px] md:h-[140px]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[#0D47A1]" />
        
        {/* Circuit pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, white 2px, transparent 2px),
              radial-gradient(circle at 60% 80%, white 2px, transparent 2px),
              radial-gradient(circle at 80% 30%, white 2px, transparent 2px),
              linear-gradient(45deg, transparent 45%, white 45%, white 55%, transparent 55%)
            `,
            backgroundSize: '80px 80px, 100px 100px, 90px 90px, 40px 40px',
          }}
        />
        
        <div className="relative h-full flex items-center justify-between px-6 md:px-8">
          <div>
            <h2 className="text-white text-[24px] md:text-[28px] mb-1">
              Good morning, Riya 👋
            </h2>
            <p className="text-white/80 text-body mb-3">You have 2 lessons pending today</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[#FF6F00]/20 backdrop-blur-sm">
              <Flame className="w-4 h-4 text-[#FF6F00]" />
              <span className="text-sm font-medium text-white">7 Day Streak</span>
            </div>
          </div>
          
          {/* IoT Illustration - Hidden on mobile */}
          <div className="hidden md:block opacity-10">
            <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="40" y="30" width="80" height="60" rx="4" stroke="white" strokeWidth="2"/>
              <circle cx="50" cy="45" r="3" fill="white"/>
              <circle cx="60" cy="45" r="3" fill="white"/>
              <circle cx="70" cy="45" r="3" fill="white"/>
              <line x1="30" y1="60" x2="40" y2="60" stroke="white" strokeWidth="2"/>
              <line x1="120" y1="60" x2="130" y2="60" stroke="white" strokeWidth="2"/>
              <line x1="80" y1="20" x2="80" y2="30" stroke="white" strokeWidth="2"/>
              <line x1="80" y1="90" x2="80" y2="100" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="📚" value="6" label="Courses Enrolled" color="primary" />
        <StatCard icon="✅" value="34" label="Lessons Completed" color="success" />
        <StatCard icon="🧪" value="12" label="Lab Sessions" color="accent" />
        <StatCard icon="🏅" value="5" label="Badges Earned" color="warning" />
      </div>

      {/* Continue Learning */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3>Continue Learning</h3>
          <Link to="/courses" className="text-body text-[var(--color-primary)] hover:underline flex items-center gap-1">
            See all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {continueLearningCourses.map((course) => (
            <ContinueLearningCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Explore Courses */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3>Explore Courses</h3>
          <Link to="/catalog" className="text-body text-[var(--color-primary)] hover:underline flex items-center gap-1">
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium whitespace-nowrap transition-colors ${
                selectedFilter === filter
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredCourses.map((course) => (
            <ExploreCourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ 
  icon, 
  value, 
  label, 
  color 
}: { 
  icon: string; 
  value: string; 
  label: string; 
  color: 'primary' | 'success' | 'accent' | 'warning';
}) {
  const colorMap = {
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    accent: 'var(--color-accent)',
    warning: '#FFA726',
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-4 md:p-5">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-[28px] md:text-[32px] font-bold mb-1" style={{ color: colorMap[color] }}>
        {value}
      </div>
      <div className="text-caption text-[var(--color-text-secondary)]">{label}</div>
    </div>
  );
}

function ContinueLearningCard({ course }: { course: any }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 overflow-hidden hover:shadow-2 transition-shadow">
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <TopicChip topic={course.topic} size="small" />
        </div>
        <div className="absolute top-3 right-3">
          <ProgressRing progress={course.progress} size={48} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="mb-2 line-clamp-1">{course.title}</h4>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          Last: {course.lastLesson}
        </p>
        <Link to="/lesson" className="block">
          <Button variant="primary" size="small" className="w-full">
            Continue
          </Button>
        </Link>
      </div>
    </div>
  );
}

function ExploreCourseCard({ course }: { course: any }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 overflow-hidden hover:shadow-2 transition-shadow group">
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <TopicChip topic={course.topic} size="small" />
        </div>
        <div className="absolute top-3 right-3">
          <DifficultyBadge level={course.level} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="mb-2 line-clamp-2">{course.title}</h4>
        <p className="text-sm text-[var(--color-text-secondary)] mb-1">
          {course.instructor}
        </p>
        <p className="text-caption text-[var(--color-text-secondary)]">
          {course.duration}
        </p>
      </div>
    </div>
  );
}