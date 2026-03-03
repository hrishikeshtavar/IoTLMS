import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Clock } from 'lucide-react';
import { TopicChip, type TopicType } from './TopicChip';
import { DifficultyBadge, type DifficultyLevel } from './DifficultyBadge';

interface CourseCardProps {
  title: string;
  thumbnail: string;
  topic: TopicType;
  instructor: {
    name: string;
    avatar?: string;
  };
  duration: string;
  level: DifficultyLevel;
  onEnroll?: () => void;
}

export function CourseCard({
  title,
  thumbnail,
  topic,
  instructor,
  duration,
  level,
  onEnroll,
}: CourseCardProps) {
  return (
    <div className="w-full max-w-[280px] bg-white rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(26,115,232,0.06)] hover:shadow-[0_4px_16px_rgba(26,115,232,0.12)] transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[#EEF2FB]">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <TopicChip topic={topic} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-base font-semibold text-[#0F1626] line-clamp-2 leading-6">
          {title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            {instructor.avatar && <AvatarImage src={instructor.avatar} />}
            <AvatarFallback className="text-xs bg-[#1A73E8] text-white">
              {instructor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-[#5C6880]">{instructor.name}</span>
        </div>

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
          onClick={onEnroll}
          className="w-full h-10 bg-[#FF6F00] hover:bg-[#F76300] text-white font-medium rounded-lg transition-colors"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
}
