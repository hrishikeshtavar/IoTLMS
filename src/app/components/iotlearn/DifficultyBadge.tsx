import { Circle } from 'lucide-react';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
}

const difficultyColors = {
  Beginner: { color: '#1DB954', label: 'Beginner' },
  Intermediate: { color: '#FFC107', label: 'Intermediate' },
  Advanced: { color: '#E53935', label: 'Advanced' },
};

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const config = difficultyColors[level];
  
  return (
    <div className="inline-flex items-center gap-1.5">
      <Circle 
        className="w-2 h-2" 
        style={{ fill: config.color, color: config.color }}
      />
      <span className="text-sm text-[#5C6880]">{config.label}</span>
    </div>
  );
}
