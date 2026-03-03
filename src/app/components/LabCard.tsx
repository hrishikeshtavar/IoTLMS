import { Clock, Cpu } from 'lucide-react';
import { TopicChip } from './TopicChip';
import { DifficultyBadge } from './DifficultyBadge';
import { Button } from './Button';

interface LabCardProps {
  title: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topic: 'Arduino' | 'ARM' | 'RISC-V' | '8051' | 'Raspberry Pi' | 'IoT' | 'Edge AI';
  thumbnail: string;
  onStart?: () => void;
}

export function LabCard({ title, duration, level, topic, thumbnail, onStart }: LabCardProps) {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 hover:shadow-2 transition-shadow duration-200 overflow-hidden w-full md:w-[280px]">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <TopicChip topic={topic} />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white text-caption font-medium">
            <Cpu className="w-3 h-3" />
            SIMULATOR
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-semibold text-[var(--color-text-primary)] line-clamp-2 min-h-[56px]">
          {title}
        </h3>
        
        {/* Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <Clock className="w-4 h-4" />
            <span className="text-caption">{duration}</span>
          </div>
          <DifficultyBadge level={level} />
        </div>
        
        {/* CTA */}
        <Button variant="primary" size="medium" className="w-full mt-2" onClick={onStart}>
          Start Lab
        </Button>
      </div>
    </div>
  );
}
