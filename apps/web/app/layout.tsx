import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SimuLearning LMS',
  description: 'IoT & Processor Education Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
