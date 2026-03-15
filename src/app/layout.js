import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, SITE_VERTICAL } from '@/config/site';
import { siteProfile } from '@/config/site-profile';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-primary',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-code',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Programmatic SEO site.',
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/rss.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: 'Programmatic SEO site.',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Programmatic SEO site.',
    images: [DEFAULT_OG_IMAGE],
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
  const themeStyle = Object.fromEntries(
    Object.entries(siteProfile.theme).map(([key, value]) => [`--${key}`, value])
  );

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      'https://t.me/Inside1mb3',
      'https://www.instagram.com/inside1mb3',
    ],
    description: `${siteProfile.nicheLabel}: инструменты, кейсы и сценарии монетизации AI для РФ и СНГ`,
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="ru">
      <head>
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} RSS`} href={`${SITE_URL}/rss.xml`} />
        <meta name="theme-color" content={siteProfile.theme.accent} />
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable}`}
        data-template-family={siteProfile.id}
        data-site-vertical={SITE_VERTICAL}
        style={themeStyle}
      >
        <PerformanceMonitor />
        {children}
      </body>
    </html>
  );
}
