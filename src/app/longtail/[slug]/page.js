import { notFound } from 'next/navigation';
import {
  Header,
  Footer,
  CtaBlock,
  Breadcrumbs,
  InternalLinks,
  MainSiteResourceLinks,
  PageJsonLd,
} from '@/components/shared';
import { SITE_URL } from '@/config/site';
import { getFreshnessBadgeText } from '@/utils/safe-html';
import { directions } from '@/data/directions';
import { toolCategories } from '@/data/tools';
import { howToArticles } from '@/data/content';

let longTailPages = [];
try {
  const data = require('@/data/longtail-pages');
  longTailPages = data.longTailPages || [];
} catch (error) {
  console.warn('Long-tail pages data not found - will be generated');
}

// ISR optimization: pre-render only top 50 pages, rest on-demand
export async function generateStaticParams() {
  // Sort by priority/popularity and take top 50
  const topPages = longTailPages
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, 50);
  
  return topPages.map(page => ({
    slug: page.slug,
  }));
}

// Revalidate every 1 hour - pages built on-demand are cached
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = longTailPages.find(item => item.slug === slug);

  if (!page) {
    return {
      title: 'Страница не найдена',
    };
  }

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: `${SITE_URL}/longtail/${slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'article',
      publishedTime: page.datePublished,
      modifiedTime: page.dateModified,
    },
  };
}

function normalize(value = '') {
  return String(value).toLowerCase();
}

function buildHaystack(page) {
  return normalize([
    page?.keyword,
    page?.title,
    page?.description,
    ...(page?.keywords || []),
  ].join(' '));
}

function includesAny(haystack, values) {
  return values.filter(Boolean).some(value => haystack.includes(normalize(value)));
}

function getRelatedDirectionLinks(page) {
  const haystack = buildHaystack(page);
  const matched = directions.filter(direction =>
    includesAny(haystack, [direction.id, direction.name, direction.nameShort, ...(direction.keywords || [])])
  );

  const selected = (matched.length ? matched : directions.slice(0, 6)).slice(0, 6);
  return selected.map(direction => ({
    href: `/napravleniya/${direction.id}`,
    label: `${direction.icon} ${direction.nameShort}`,
  }));
}

function getRelatedToolLinks(page) {
  const haystack = buildHaystack(page);
  const matched = toolCategories.filter(category =>
    includesAny(haystack, [category.name, ...(category.tools || []).slice(0, 8).map(tool => tool.name)])
  );

  const selected = (matched.length ? matched : toolCategories.slice(0, 4)).slice(0, 4);
  return selected.map(category => ({
    href: `/instrumenty/${category.id}`,
    label: `${category.icon} ${category.name}`,
  }));
}

function getRelatedArticleLinks(page) {
  const haystack = buildHaystack(page);
  const matched = howToArticles.filter(article =>
    article.slug !== page?.slug &&
    includesAny(haystack, [article.title, article.h1, article.desc])
  );

  const selected = (matched.length ? matched : howToArticles.filter(article => article.slug !== page?.slug).slice(0, 4)).slice(0, 4);
  return selected.map(article => ({
    href: `/blog/${article.slug}`,
    label: article.h1,
  }));
}

export default async function LongTailPage({ params }) {
  const { slug } = await params;
  const page = longTailPages.find(item => item.slug === slug);

  if (!page) {
    notFound();
  }

  const freshnessBadgeText = getFreshnessBadgeText(page.freshnessBadge);
  const relatedDirectionLinks = getRelatedDirectionLinks(page);
  const relatedToolLinks = getRelatedToolLinks(page);
  const relatedArticleLinks = getRelatedArticleLinks(page);
  const primaryTopic = page.keywords?.[1] || 'AI-услуг';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    datePublished: page.datePublished,
    dateModified: page.dateModified,
    author: {
      '@type': 'Person',
      name: '1MB3',
    },
  };

  return (
    <>
      <PageJsonLd data={articleSchema} />
      <Header />
      <Breadcrumbs items={[{ label: page.h1 }]} />

      <article className="article-container">
        <div className="container">
          <header className="article-header">
            {freshnessBadgeText && <div className="freshness-badge">{freshnessBadgeText}</div>}
            <h1>{page.h1}</h1>
            <div className="article-meta">
              <span>📅 {page.lastUpdated}</span>
              {page.readTime && <span>⏱️ {page.readTime}</span>}
            </div>
          </header>

          <div className="article-content">
            <p className="lead">{page.description}</p>

            <section>
              <h2>Что такое {page.keyword}?</h2>
              <p>
                {page.keyword} — это актуальная тема в сфере {primaryTopic}, которая набирает спрос в 2026 году.
                На этой странице собран быстрый вход в тему, базовый контекст и маршруты к более сильным хабам.
              </p>
            </section>

            <section>
              <h2>Почему этот запрос важен</h2>
              <ul>
                <li>Высокий long-tail интент и понятная потребность пользователя</li>
                <li>Хороший вход в кластер по AI-услугам и инструментам</li>
                <li>Возможность провести читателя к офферу и хабовым страницам</li>
                <li>Подходит для регулярного расширения семантики и обновлений</li>
              </ul>
            </section>

            <section>
              <h2>Как начать движение по теме</h2>
              <p>
                Определите задачу пользователя, выберите релевантное направление, затем перейдите к инструментам
                и коммерческому предложению. Такой путь не оставляет long-tail страницу тупиковой и усиливает
                внутреннюю SEO-перелинковку всего кластера.
              </p>
            </section>

            <section>
              <h2>Куда идти дальше по теме</h2>
              <InternalLinks links={relatedDirectionLinks} />
            </section>

            <section>
              <h2>Подходящие инструменты</h2>
              <InternalLinks links={relatedToolLinks} />
            </section>

            <section>
              <h2>Большие разборы и гайды</h2>
              <InternalLinks links={relatedArticleLinks} />
            </section>

            <section>
              <h2>Хабовые маршруты в 1MB3</h2>
              <MainSiteResourceLinks />
            </section>
          </div>

          <CtaBlock />
        </div>
      </article>

      <Footer />
    </>
  );
}

// Moved to top with generateStaticParams
