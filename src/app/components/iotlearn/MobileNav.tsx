import { Home, BookOpen, FlaskConical, TrendingUp, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'courses', label: 'Courses', icon: BookOpen, path: '/courses' },
  { id: 'labs', label: 'Labs', icon: FlaskConical, path: '/labs' },
  { id: 'progress', label: 'Progress', icon: TrendingUp, path: '/progress' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#DDE3EF] md:hidden z-50">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            >
              <Icon 
                className="w-5 h-5"
                style={{ color: isActive ? '#1A73E8' : '#5C6880' }}
              />
              <span 
                className="text-xs"
                style={{ color: isActive ? '#1A73E8' : '#5C6880' }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
