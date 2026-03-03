import { Home, BookOpen, FlaskConical, TrendingUp, User, Menu, Award, Settings, MoreVertical } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Avatar } from './Avatar';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useState } from 'react';

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/courses', icon: BookOpen, label: 'My Courses' },
    { path: '/labs', icon: FlaskConical, label: 'Labs' },
    { path: '/progress', icon: TrendingUp, label: 'Assessments' },
    { path: '/profile', icon: Award, label: 'Certificates' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];
  
  return (
    <aside 
      className={`hidden md:flex fixed left-0 top-0 bottom-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[var(--color-border)]">
        {!collapsed && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold">
              I
            </div>
            <span className="font-bold text-[var(--color-text-primary)]">IoTLearn</span>
          </div>
        )}
        {!collapsed && (
          <p className="text-xs text-[var(--color-text-secondary)] ml-10">DY Patil Institute</p>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-4 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 h-12 rounded-lg transition-colors relative mb-1 ${
                isActive 
                  ? 'text-[var(--color-primary)] bg-[#EEF5FF]' 
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
              }`}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-accent)] rounded-r" />}
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      
      {/* Language Switcher & User */}
      <div className="border-t border-[var(--color-border)]">
        {!collapsed && (
          <div className="p-4 pb-2">
            <LanguageSwitcher />
          </div>
        )}
        
        <div className="p-4">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <Avatar name="Riya Sharma" size={40} />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[var(--color-text-primary)] text-sm truncate">
                  Riya Sharma
                </div>
                <div className="text-caption text-[var(--color-text-secondary)] truncate">
                  Student
                </div>
              </div>
            )}
            {!collapsed && (
              <button className="p-1 hover:bg-[var(--color-surface-alt)] rounded transition-colors">
                <MoreVertical className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}