interface DifficultyBadgeProps {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const colors = {
    Beginner: 'var(--color-success)',
    Intermediate: 'var(--color-warning)',
    Advanced: 'var(--color-error)',
  };
  
  return (
    <div className="inline-flex items-center gap-1.5">
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: colors[level] }}
      />
      <span className="text-caption text-[var(--color-text-secondary)]">{level}</span>
    </div>
  );
}
