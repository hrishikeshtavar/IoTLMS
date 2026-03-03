import { Cpu, Clock } from 'lucide-react';
import { TopicChip, type TopicType } from './TopicChip';
import { DifficultyBadge, type DifficultyLevel } from './DifficultyBadge';

interface LabCardProps {
  title: string;
  thumbnail: string;
  topic: TopicType;
  duration: string;
  level: DifficultyLevel;
  onLaunch?: () => void;
}

export function LabCard({
  title,
  thumbnail,
  topic,
  duration,
  level,
  onLaunch,
}: LabCardProps) {
  return (
    <div className="w-full max-w-[280px] bg-white rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(26,115,232,0.06)] hover:shadow-[0_4px_16px_rgba(26,115,232,0.12)] transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[#EEF2FB]">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-[#00BCD4] rounded-full">
            <Cpu className="w-3 h-3" />
            SIMULATOR
          </span>
          <TopicChip topic={topic} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-base font-semibold text-[#0F1626] line-clamp-2 leading-6">
          {title}
        </h3>

        {/* Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#5C6880]">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{duration}</span>
          </div>
          <DifficultyBadge level={level} />
        </div>

        {/* CTA Button */}
        <button
          onClick={onLaunch}
          className="w-full h-10 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-medium rounded-lg transition-colors"
        >
          Launch Lab
        </button>
      </div>
    </div>
  );
}
