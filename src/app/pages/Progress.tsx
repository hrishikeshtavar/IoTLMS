import { ProgressRing } from '../components/ProgressRing';
import { TopicChip } from '../components/TopicChip';
import { CheckCircle2, Clock, Trophy, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Progress() {
  const weeklyData = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 3 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 4 },
    { day: 'Fri', hours: 2.5 },
    { day: 'Sat', hours: 5 },
    { day: 'Sun', hours: 3 },
  ];

  const courses = [
    {
      title: 'Arduino Fundamentals',
      topic: 'Arduino' as const,
      progress: 85,
      completed: 17,
      total: 20,
    },
    {
      title: 'ARM Processor Architecture',
      topic: 'ARM' as const,
      progress: 60,
      completed: 12,
      total: 20,
    },
    {
      title: 'Raspberry Pi Projects',
      topic: 'Raspberry Pi' as const,
      progress: 45,
      completed: 9,
      total: 20,
    },
    {
      title: 'IoT Systems Design',
      topic: 'IoT' as const,
      progress: 30,
      completed: 6,
      total: 20,
    },
  ];

  const achievements = [
    { id: 1, title: 'First Course Completed', date: 'Feb 15, 2026', icon: Trophy },
    { id: 2, title: '7 Day Streak', date: 'Mar 3, 2026', icon: Flame },
    { id: 3, title: '10 Labs Completed', date: 'Feb 28, 2026', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2">Your Progress</h1>
        <p className="text-body text-[var(--color-text-secondary)]">
          Track your learning journey
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-6 flex flex-col items-center">
          <ProgressRing percentage={68} size={100} />
          <h3 className="mt-4">Overall Progress</h3>
          <p className="text-caption text-[var(--color-text-secondary)]">Across all courses</p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-[var(--color-success)]/10">
              <Clock className="w-6 h-6 text-[var(--color-success)]" />
            </div>
            <div>
              <div className="text-[28px] font-bold text-[var(--color-text-primary)]">21h</div>
              <p className="text-caption text-[var(--color-text-secondary)]">This Week</p>
            </div>
          </div>
          <div className="text-caption text-[var(--color-success)]">+5h from last week</div>
        </div>

        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-[var(--color-accent)]/10">
              <Flame className="w-6 h-6 text-[var(--color-accent)]" />
            </div>
            <div>
              <div className="text-[28px] font-bold text-[var(--color-text-primary)]">7</div>
              <p className="text-caption text-[var(--color-text-secondary)]">Day Streak</p>
            </div>
          </div>
          <div className="text-caption text-[var(--color-text-secondary)]">Keep it up!</div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-6">
        <h2 className="mb-6">Weekly Activity</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" stroke="var(--color-text-secondary)" />
            <YAxis stroke="var(--color-text-secondary)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-surface)', 
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)'
              }} 
            />
            <Bar dataKey="hours" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Course Progress */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-6">
        <h2 className="mb-6">Course Progress</h2>
        <div className="space-y-6">
          {courses.map((course, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <TopicChip topic={course.topic} size="small" />
                  <h3 className="text-body font-medium truncate">{course.title}</h3>
                </div>
                <span className="text-caption text-[var(--color-text-secondary)] ml-4">
                  {course.completed}/{course.total} lessons
                </span>
              </div>
              <div className="h-2 bg-[var(--color-surface-alt)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-6">
        <h2 className="mb-6">Recent Achievements</h2>
        <div className="space-y-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div key={achievement.id} className="flex items-center gap-4 p-4 bg-[var(--color-surface-alt)] rounded-[var(--radius-md)]">
                <div className="p-3 rounded-lg bg-[var(--color-warning)]/20">
                  <Icon className="w-6 h-6 text-[var(--color-warning)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-body font-medium">{achievement.title}</h3>
                  <p className="text-caption text-[var(--color-text-secondary)]">{achievement.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
