import type { Metadata } from 'next';
import './globals.css';
import { bakedContent } from '@/lib/content';
import { ContentProvider } from '@/components/ContentProvider';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { EditorRoot } from '@/components/editor/EditorRoot';

const { site } = bakedContent;

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise">
        <ContentProvider initial={bakedContent}>
          <Nav />
          <main className="relative z-10 pt-24">{children}</main>
          <Footer />
          <EditorRoot />
        </ContentProvider>
      </body>
    </html>
  );
}
