import { useState } from 'react';
import { Search } from 'lucide-react';
import { LabCard } from '../components/LabCard';
import { TopicChip } from '../components/TopicChip';

export default function Labs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const topics = ['Arduino', 'ARM', 'RISC-V', '8051', 'Raspberry Pi', 'IoT', 'Edge AI'] as const;
  
  const allLabs = [
    {
      id: 1,
      title: 'LED Blinking with Arduino',
      duration: '30 mins',
      level: 'Beginner' as const,
      topic: 'Arduino' as const,
      thumbnail: 'https://images.unsplash.com/photo-1754572861240-5b3f5a5959ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwY2lyY3VpdCUyMGJvYXJkJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzI0NjA1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: 'IoT Sensor Integration',
      duration: '45 mins',
      level: 'Intermediate' as const,
      topic: 'IoT' as const,
      thumbnail: 'https://images.unsplash.com/photo-1746893737268-81fe686e6a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpb3QlMjBzZW5zb3JzJTIwY29ubmVjdGVkJTIwZGV2aWNlc3xlbnwxfHx8fDE3NzI1MDQ5NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Raspberry Pi GPIO Control',
      duration: '40 mins',
      level: 'Beginner' as const,
      topic: 'Raspberry Pi' as const,
      thumbnail: 'https://images.unsplash.com/photo-1587919057555-d728ff5beac3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXNwYmVycnklMjBwaSUyMGNvbXB1dGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzI1MDQ5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      title: 'ARM Assembly Programming Lab',
      duration: '60 mins',
      level: 'Advanced' as const,
      topic: 'ARM' as const,
      thumbnail: 'https://images.unsplash.com/photo-1686195165991-74af7c2918d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb2NvbnRyb2xsZXIlMjBhcm0lMjBwcm9jZXNzb3J8ZW58MXx8fHwxNzcyNTA0OTY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 5,
      title: 'RISC-V Instruction Set Simulator',
      duration: '75 mins',
      level: 'Advanced' as const,
      topic: 'RISC-V' as const,
      thumbnail: 'https://images.unsplash.com/photo-1771189957050-76f13238f858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb2NoaXAlMjBzZW1pY29uZHVjdG9yJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzI1MDQ5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 6,
      title: 'Edge AI Image Classification',
      duration: '90 mins',
      level: 'Advanced' as const,
      topic: 'Edge AI' as const,
      thumbnail: 'https://images.unsplash.com/photo-1737505599159-5ffc1dcbc08f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3NzI0ODQyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      title: '8051 Timer and Counter Programming',
      duration: '35 mins',
      level: 'Intermediate' as const,
      topic: '8051' as const,
      thumbnail: 'https://images.unsplash.com/photo-1580893204811-169d1d19a4ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGhhcmR3YXJlJTIwZW5naW5lZXJpbmd8ZW58MXx8fHwxNzcyNTA0OTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 8,
      title: 'Build a Smart Home System',
      duration: '60 mins',
      level: 'Intermediate' as const,
      topic: 'IoT' as const,
      thumbnail: 'https://images.unsplash.com/photo-1717444308827-d0f206a4de1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJlZGRlZCUyMHN5c3RlbXMlMjBwcm9ncmFtbWluZ3xlbnwxfHx8fDE3NzI1MDQ5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 9,
      title: 'Robotics Control with Arduino',
      duration: '55 mins',
      level: 'Intermediate' as const,
      topic: 'Arduino' as const,
      thumbnail: 'https://images.unsplash.com/photo-1761195696590-3490ea770aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGF1dG9tYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MjUwNDk3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];
  
  const filteredLabs = allLabs.filter((lab) => {
    const matchesSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = !selectedTopic || lab.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Virtual Labs</h1>
        <p className="text-body text-[var(--color-text-secondary)]">
          Practice with interactive hardware simulators
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
        <input
          type="text"
          placeholder="Search labs..."
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

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredLabs.map((lab) => (
          <LabCard key={lab.id} {...lab} />
        ))}
      </div>

      {filteredLabs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-body text-[var(--color-text-secondary)]">
            No labs found. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
