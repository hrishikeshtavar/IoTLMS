import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  value: string | number;
  label: string;
  icon: LucideIcon;
}

export function StatCard({ value, label, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-4 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-primary)]" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[32px] font-bold text-[var(--color-text-primary)]">
            {value}
          </div>
          <div className="text-caption text-[var(--color-text-secondary)]">
            {label}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-[var(--color-primary)]/10">
          <Icon className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
      </div>
    </div>
  );
}
