import { getAllPages } from '@/data/seo-data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://seo-programmatic-main.vercel.app';

export default function sitemap() {
  const allPages = getAllPages();

  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${BASE_URL}/napravleniya`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/instrumenty`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/sravnenie`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
  ];

  const dynamicPages = allPages.map(page => {
    let priority = 0.7;
    let changeFreq = 'monthly';

    if (page.type === 'direction') {
      priority = 0.9;
      changeFreq = 'weekly';
    } else if (page.type === 'how-to') {
      priority = 0.85;
      changeFreq = 'weekly';
    } else if (page.type === 'tool-catalog') {
      priority = 0.8;
      changeFreq = 'weekly';
    } else if (page.type === 'comparison') {
      priority = 0.75;
      changeFreq = 'monthly';
    } else if (page.type === 'audience') {
      priority = 0.75;
      changeFreq = 'monthly';
    } else if (page.type === 'city-direction') {
      priority = 0.65;
      changeFreq = 'monthly';
    } else if (page.type === 'time-period') {
      priority = 0.7;
      changeFreq = 'weekly';
    }

    return {
      url: `${BASE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: changeFreq,
      priority: priority,
    };
  });

  return [...staticPages, ...dynamicPages];
}
