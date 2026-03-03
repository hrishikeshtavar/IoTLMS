import { Flame, Award, Trophy, Star, Microscope, Brain, Lock } from 'lucide-react';

export default function StudentProgress() {
  const streakDays = [
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: true },
    { day: 'T', active: true },
    { day: 'F', active: true },
    { day: 'S', active: true },
    { day: 'S', active: true },
    { day: 'M', active: false },
    { day: 'T', active: false },
    { day: 'W', active: false },
    { day: 'T', active: false },
    { day: 'F', active: false },
    { day: 'S', active: false },
    { day: 'S', active: false },
  ];

  const stats = [
    { label: 'Courses Enrolled', value: '6' },
    { label: 'Lessons Done', value: '34' },
    { label: 'Labs Completed', value: '12' },
    { label: 'Quiz Avg Score', value: '84%' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Arduino Fundamentals',
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=200',
      progress: 100,
      certificateReady: true,
    },
    {
      id: 2,
      title: 'Raspberry Pi Basics',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200',
      progress: 65,
    },
    {
      id: 3,
      title: 'IoT Security',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200',
      progress: 30,
    },
    {
      id: 4,
      title: 'Edge AI Computing',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200',
      progress: 8,
    },
  ];

  const badges = [
    {
      id: 1,
      name: 'First Login',
      icon: Star,
      gradient: 'from-yellow-400 to-orange-500',
      unlocked: true,
    },
    {
      id: 2,
      name: '3-Day Streak',
      icon: Flame,
      gradient: 'from-orange-500 to-red-600',
      unlocked: true,
    },
    {
      id: 3,
      name: 'Quiz Master',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-600',
      unlocked: true,
    },
    {
      id: 4,
      name: 'Lab Rat',
      icon: Microscope,
      gradient: 'from-blue-500 to-cyan-600',
      unlocked: true,
    },
    {
      id: 5,
      name: 'Locked',
      icon: Lock,
      gradient: 'from-gray-300 to-gray-400',
      unlocked: false,
    },
  ];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] max-w-[375px] mx-auto pb-6">
      {/* Header */}
      <div className="bg-white border-b border-[var(--color-border)] px-4 py-4">
        <h1 className="font-bold text-xl mb-1">My Progress</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">{today}</p>
      </div>

      {/* Streak Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[var(--radius-xl)] p-6 shadow-2 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-10 h-10" />
            <h2 className="text-3xl font-bold">7 Day Streak!</h2>
          </div>
          
          {/* Calendar Grid */}
          <div className="flex gap-2 mb-4 justify-between">
            {streakDays.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <span className="text-xs opacity-90">{item.day}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                    item.active ? 'bg-white' : 'bg-transparent'
                  }`}
                >
                  {item.active && <div className="w-3 h-3 rounded-full bg-green-500" />}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-white/90">Keep it up! Come back tomorrow</p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-[var(--radius-lg)] p-4 shadow-1">
              <p className="text-sm text-[var(--color-text-secondary)] mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-[var(--color-primary)]">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Course Progress */}
      <div className="px-4 mb-6">
        <h3 className="font-bold mb-3">My Courses</h3>
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-[var(--radius-lg)] p-3 shadow-1">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-0.5">{course.title}</h4>
                  {course.certificateReady && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      🎓 Certificate Ready
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-[var(--color-primary)]">
                  {course.progress}%
                </span>
              </div>
              <div className="h-1.5 bg-[var(--color-surface-alt)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="px-4">
        <h3 className="font-bold mb-3">Achievements</h3>
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-4 pb-2">
            {badges.map((badge) => (
              <div key={badge.id} className="flex-shrink-0 text-center">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.gradient} flex items-center justify-center mb-2 ${
                    !badge.unlocked ? 'opacity-40' : 'shadow-lg'
                  }`}
                >
                  <badge.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-[64px]">
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
