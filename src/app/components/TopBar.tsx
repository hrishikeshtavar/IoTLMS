import { Menu, Bell, Search, ChevronRight } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

export function TopBar() {
  return (
    <>
      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] z-40">
        <div className="flex items-center justify-between h-full px-4">
          <button className="p-2 -ml-2">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold">
              I
            </div>
            <span className="font-bold text-[var(--color-text-primary)]">IoTLearn</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-error)] rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-medium">
              R
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Top Bar */}
      <header className="hidden md:block fixed top-0 left-60 right-0 h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] z-30">
        <div className="flex items-center justify-between h-full px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-body text-[var(--color-text-secondary)]">
            <span className="text-[var(--color-text-primary)] font-medium">Home</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[var(--color-surface-alt)] rounded-lg transition-colors">
              <Search className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
            
            <button className="p-2 hover:bg-[var(--color-surface-alt)] rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-error)] rounded-full"></span>
              <span className="absolute -top-1 -right-1 bg-[var(--color-error)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                3
              </span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-surface-alt)]">
              <span className="w-2 h-2 bg-[var(--color-success)] rounded-full"></span>
              <span className="text-sm text-[var(--color-text-secondary)]">Online</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}