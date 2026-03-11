import { Metadata } from 'next';

interface SEOMetadataProps {
  title: string;
  description: string;
  keywords?: string[];
  url: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  url,
  image = '/og-image.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'SEO Programmatic',
}: SEOMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://seo-programmatic-main.vercel.app';
  const fullUrl = `${baseUrl}${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'SEO Programmatic',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'ru_RU',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      creator: '@seoprogrammatic',
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
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  };
}

export function generateJSONLD(data: {
  type: 'WebSite' | 'Article' | 'Organization' | 'BreadcrumbList';
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  headline?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  items?: Array<{ name: string; url: string }>;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://seo-programmatic-main.vercel.app';

  const commonProps = {
    '@context': 'https://schema.org',
    '@type': data.type,
  };

  switch (data.type) {
    case 'WebSite':
      return {
        ...commonProps,
        name: data.name || 'SEO Programmatic',
        description: data.description,
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };

    case 'Organization':
      return {
        ...commonProps,
        name: data.name || 'SEO Programmatic',
        url: baseUrl,
        logo: data.logo ? `${baseUrl}${data.logo}` : `${baseUrl}/logo.png`,
        description: data.description,
      };

    case 'Article':
      return {
        ...commonProps,
        headline: data.headline,
        description: data.description,
        url: data.url,
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        author: {
          '@type': 'Person',
          name: data.author || 'SEO Programmatic',
        },
        publisher: {
          '@type': 'Organization',
          name: 'SEO Programmatic',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
        },
      };

    case 'BreadcrumbList':
      return {
        ...commonProps,
        itemListElement: data.items?.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.url}`,
        })),
      };

    default:
      return commonProps;
  }
}
