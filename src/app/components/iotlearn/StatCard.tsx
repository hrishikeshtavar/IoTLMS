import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accentColor?: string;
}

export function StatCard({ label, value, icon: Icon, accentColor = '#1A73E8' }: StatCardProps) {
  return (
    <div className="relative bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(26,115,232,0.06)]">
      {/* Left accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-3xl font-bold text-[#0F1626]">{value}</div>
          <div className="text-sm text-[#5C6880]">{label}</div>
        </div>
        <Icon 
          className="w-6 h-6"
          style={{ color: accentColor }}
        />
      </div>
    </div>
  );
}
