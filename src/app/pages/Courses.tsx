import { useState } from 'react';
import { Search } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { TopicChip } from '../components/TopicChip';

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const topics = ['Arduino', 'ARM', 'RISC-V', '8051', 'Raspberry Pi', 'IoT', 'Edge AI'] as const;
  
  const allCourses = [
    {
      id: 1,
      title: 'Arduino Fundamentals: Build Your First Circuit',
      instructor: 'Dr. Rajesh Kumar',
      duration: '4 weeks',
      level: 'Beginner' as const,
      topic: 'Arduino' as const,
      thumbnail: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwY2lyY3VpdCUyMGJvYXJkJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzcyNTA0OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: 'ARM Processor Architecture and Programming',
      instructor: 'Prof. Anjali Desai',
      duration: '6 weeks',
      level: 'Intermediate' as const,
      topic: 'ARM' as const,
      thumbnail: 'https://images.unsplash.com/photo-1686195165991-74af7c2918d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb2NvbnRyb2xsZXIlMjBhcm0lMjBwcm9jZXNzb3J8ZW58MXx8fHwxNzcyNTA0OTY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Raspberry Pi Projects for Beginners',
      instructor: 'Amit Patel',
      duration: '5 weeks',
      level: 'Beginner' as const,
      topic: 'Raspberry Pi' as const,
      thumbnail: 'https://images.unsplash.com/photo-1587919057555-d728ff5beac3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXNwYmVycnklMjBwaSUyMGNvbXB1dGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzI1MDQ5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      title: 'Introduction to RISC-V Architecture',
      instructor: 'Dr. Suresh Iyer',
      duration: '8 weeks',
      level: 'Advanced' as const,
      topic: 'RISC-V' as const,
      thumbnail: 'https://images.unsplash.com/photo-1771189957050-76f13238f858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb2NoaXAlMjBzZW1pY29uZHVjdG9yJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzI1MDQ5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 5,
      title: 'IoT Systems Design and Implementation',
      instructor: 'Neha Sharma',
      duration: '6 weeks',
      level: 'Intermediate' as const,
      topic: 'IoT' as const,
      thumbnail: 'https://images.unsplash.com/photo-1746893737268-81fe686e6a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpb3QlMjBzZW5zb3JzJTIwY29ubmVjdGVkJTIwZGV2aWNlc3xlbnwxfHx8fDE3NzI1MDQ5NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 6,
      title: 'Edge AI: Machine Learning on Embedded Devices',
      instructor: 'Dr. Vikram Singh',
      duration: '10 weeks',
      level: 'Advanced' as const,
      topic: 'Edge AI' as const,
      thumbnail: 'https://images.unsplash.com/photo-1737505599159-5ffc1dcbc08f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3NzI0ODQyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      title: '8051 Microcontroller Programming Essentials',
      instructor: 'Prof. Kiran Joshi',
      duration: '5 weeks',
      level: 'Beginner' as const,
      topic: '8051' as const,
      thumbnail: 'https://images.unsplash.com/photo-1580893204811-169d1d19a4ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGhhcmR3YXJlJTIwZW5naW5lZXJpbmd8ZW58MXx8fHwxNzcyNTA0OTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 8,
      title: 'Advanced Arduino: Robotics and Automation',
      instructor: 'Ravi Menon',
      duration: '7 weeks',
      level: 'Advanced' as const,
      topic: 'Arduino' as const,
      thumbnail: 'https://images.unsplash.com/photo-1761195696590-3490ea770aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGF1dG9tYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MjUwNDk3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];
  
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = !selectedTopic || course.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Explore Courses</h1>
        <p className="text-body text-[var(--color-text-secondary)]">
          Learn IoT and embedded systems from industry experts
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:border-[var(--color-border-focus)] focus:outline-none bg-[var(--color-surface)] text-body"
        />
      </div>

      {/* Topic Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setSelectedTopic(null)}
          className={`px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium whitespace-nowrap transition-colors ${
            !selectedTopic
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
          }`}
        >
          All Topics
        </button>
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`flex-shrink-0 transition-opacity ${
              selectedTopic === topic ? 'opacity-100' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <TopicChip topic={topic} />
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-body text-[var(--color-text-secondary)]">
            No courses found. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
