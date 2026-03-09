import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  title: 'IoTLearn LMS',
  description: 'IoT & Processor Education Platform',
};

async function getBrandKit(slug: string) {
  try {
    const res = await fetch('http://localhost:3001/api/branding/' + slug, { next: { revalidate: 3600 } });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const slug = host.split('.')[0].replace('localhost:3000', 'demo');
  const brand = await getBrandKit(slug);

  const cssVars = brand?.colors_json ? `
    :root {
      --primary: ${brand.colors_json.primary || '#1A73E8'};
      --secondary: ${brand.colors_json.secondary || '#FF6B35'};
      --accent: ${brand.colors_json.accent || '#00C896'};
    }
  ` : '';

  return (
    <html lang="en">
      <head>
        {cssVars ? <style dangerouslySetInnerHTML={{ __html: cssVars }} /> : null}
        {brand?.favicon_url ? <link rel="icon" href={brand.favicon_url} /> : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
