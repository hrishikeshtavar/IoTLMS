'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const path = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: '📚 Courses' },
    { href: '/admin', label: '⚙️ Admin' },
  ];

  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          ⚡
        </div>
        <span className="text-lg font-bold text-blue-600">IoTLearn</span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              path === link.href
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">EN</button>
          <button className="px-2 py-1 text-gray-500 rounded text-xs hover:bg-gray-100"
            style={{ fontFamily: 'Noto Sans Devanagari' }}>हिं</button>
          <button className="px-2 py-1 text-gray-500 rounded text-xs hover:bg-gray-100"
            style={{ fontFamily: 'Noto Sans Devanagari' }}>मरा</button>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
          S
        </div>
      </div>
    </nav>
  );
}