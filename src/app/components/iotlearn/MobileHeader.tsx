import { Menu, Bell, Search } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MobileHeaderProps {
  onMenuClick?: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-[#DDE3EF] flex items-center justify-between px-4 sticky top-0 z-40 md:hidden">
      <button 
        onClick={onMenuClick}
        className="w-10 h-10 flex items-center justify-center hover:bg-[#EEF2FB] rounded-lg transition-colors"
      >
        <Menu className="w-5 h-5 text-[#0F1626]" />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">IoT</span>
        </div>
        <span className="font-bold text-[#0F1626]">IoTLearn</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-10 h-10 flex items-center justify-center hover:bg-[#EEF2FB] rounded-lg transition-colors">
          <Search className="w-5 h-5 text-[#0F1626]" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-[#EEF2FB] rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-[#0F1626]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#E53935] rounded-full" />
        </button>
      </div>
    </header>
  );
}
