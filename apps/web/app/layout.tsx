import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/ui/NavBar';

export const metadata: Metadata = {
  title: 'SimuLearning LMS',
  description: 'IoT & Processor Education Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
