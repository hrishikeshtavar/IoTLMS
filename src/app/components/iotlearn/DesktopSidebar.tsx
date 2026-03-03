import { Home, BookOpen, FlaskConical, TrendingUp, User, ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useState } from 'react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'courses', label: 'Courses', icon: BookOpen, path: '/courses' },
  { id: 'labs', label: 'Labs', icon: FlaskConical, path: '/labs' },
  { id: 'progress', label: 'Progress', icon: TrendingUp, path: '/progress' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export function DesktopSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className="hidden md:flex flex-col bg-white border-r border-[#DDE3EF] h-screen sticky top-0 transition-all"
      style={{ width: collapsed ? '80px' : '240px' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#DDE3EF]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IoT</span>
            </div>
            <span className="font-bold text-[#0F1626]">IoTLearn</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">IoT</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              className="relative flex items-center gap-3 h-12 px-6 transition-colors"
              style={{
                backgroundColor: isActive ? '#EEF2FB' : 'transparent',
                color: isActive ? '#1A73E8' : '#5C6880',
              }}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1A73E8]" />
              )}
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[#DDE3EF]">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <Avatar className="w-10 h-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[#1A73E8] text-white">
              SP
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#0F1626] truncate">
                Student Name
              </div>
              <div className="text-xs text-[#5C6880] truncate">
                student@school.edu
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 flex items-center justify-center border-t border-[#DDE3EF] hover:bg-[#EEF2FB] transition-colors"
      >
        <ChevronLeft 
          className={`w-5 h-5 text-[#5C6880] transition-transform ${collapsed ? 'rotate-180' : ''}`}
        />
      </button>
    </aside>
  );
}
