import { Outlet } from 'react-router';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { TopBar } from './components/TopBar';

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <TopBar />
      
      <main className="md:ml-60 md:pt-16 pt-14 pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}