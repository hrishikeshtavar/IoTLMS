import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  title: 'SimuLearning LMS',
  description: 'IoT & Processor Education Platform',
};

async function getBrandKit(slug: string) {
  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${apiUrl}/api/branding/${slug}`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch { return null; }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let brand = null;
  try {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    const slug = host.split('.')[0].replace('localhost:3000', 'demo');
    if (slug && slug !== 'www' && slug !== 'io-tlms-web') {
      brand = await getBrandKit(slug);
    }
  } catch { brand = null; }

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
