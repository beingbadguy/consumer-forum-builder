import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Providers } from './components/Providers';

export const metadata: Metadata = {
  title: 'Consumer Mitra - Legal Case Management SaaS | उपभोक्ता केस ड्राफ्टिंग समाधान',
  description:
    'Consumer Mitra - Professional Legal Case Management & Consumer Court Drafting SaaS Platform under Consumer Protection Act, 2019',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Hind:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F9FAFB] text-[#171717] font-sans antialiased">
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
          strategy="afterInteractive"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
