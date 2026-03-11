import './globals.css';
import PerformanceMonitor from '@/components/PerformanceMonitor';

export const metadata = {
  metadataBase: new URL('https://1mb3-seo.vercel.app'),
  title: {
    default: '1MB3 — ГАЙД 2026: Заработок на нейросетях и AI | 12 направлений',
    template: '%s | 1MB3 ГАЙД 2026',
  },
  description: 'Полный гайд по заработку на нейросетях в 2026 году для РФ/СНГ. 12 направлений монетизации, 200+ инструментов, план на 30 дней. PDF + шаблоны.',
  keywords: ['заработок на нейросетях', 'заработок на ai', 'нейросети для заработка', 'гайд по ai 2026', 'монетизация нейросетей', 'chatgpt заработок', 'midjourney заработок', 'ai фриланс', 'удалённая работа ai', 'искусственный интеллект заработок'],
  authors: [{ name: '1MB3' }],
  creator: '1MB3',
  publisher: '1MB3',
  alternates: {
    canonical: 'https://1mb3-seo.vercel.app',
    types: {
      'application/rss+xml': 'https://1mb3-seo.vercel.app/rss.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://1mb3-seo.vercel.app',
    siteName: '1MB3 — ГАЙД 2026',
    title: '1MB3 — ГАЙД 2026: Полный цикл заработка на ИИ',
    description: '12 направлений монетизации AI, 200+ инструментов, план на 30 дней. Для РФ/СНГ.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '1MB3 ГАЙД 2026 — Заработок на нейросетях',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1MB3 — ГАЙД 2026: Заработок на нейросетях',
    description: '12 направлений монетизации AI для РФ/СНГ. PDF-гайд + шаблоны + каталог 200+ сервисов.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
};

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "1MB3",
    "url": "https://1mb3-guide-2026.vercel.app",
    "logo": "https://1mb3-guide-2026.vercel.app/logo.png",
    "sameAs": [
      "https://t.me/Inside1mb3",
      "https://www.instagram.com/inside1mb3"
    ],
    "description": "AI×Business: инструменты, кейсы, стратегии монетизации AI для РФ/СНГ"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "1MB3 — ГАЙД 2026",
    "url": "https://1mb3-guide-2026.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://1mb3-seo.vercel.app/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="alternate" type="application/rss+xml" title="1MB3 Blog RSS" href="https://1mb3-seo.vercel.app/rss.xml" />
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body>
        <PerformanceMonitor />
        {children}
      </body>
    </html>
  );
}
