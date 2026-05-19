import type { Metadata } from 'next';
import './globals.css';
import { bakedContent } from '@/lib/content';
import { ContentProvider } from '@/components/ContentProvider';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { EditorRoot } from '@/components/editor/EditorRoot';
import { ThemeProvider, THEME_INIT_SCRIPT } from '@/components/ThemeProvider';

const { site } = bakedContent;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  metadataBase: new URL(`https://aristidisg.github.io${basePath || ''}`),
  title: { default: site.title, template: `%s — ${site.title}` },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise">
        <ThemeProvider>
          <ContentProvider initial={bakedContent}>
            <Nav />
            <main className="relative z-10 pt-24">{children}</main>
            <Footer />
            <EditorRoot />
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
