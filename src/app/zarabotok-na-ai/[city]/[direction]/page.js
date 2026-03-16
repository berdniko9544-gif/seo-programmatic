import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer, CtaBlock, Breadcrumbs, PageJsonLd, InternalLinks } from '@/components/shared';
import { directions, cities } from '@/data/seo-data';
import { SITE_URL } from '@/config/site';
import { getContentDates } from '@/config/content';

// ISR optimization: pre-render only top 50 city+direction combinations
export async function generateStaticParams() {
  const params = [];
  
  // Prioritize: top 5 cities × top 10 directions = 50 pages
  const topCities = cities.slice(0, 5);
  const topDirections = directions.slice(0, 10);
  
  for (const city of topCities) {
    for (const dir of topDirections) {
      params.push({ city: city.slug, direction: dir.id });
    }
  }
  
  return params;
}

// Revalidate every 6 hours
export const revalidate = 21600;

export async function generateMetadata({ params }) {
  const { city: citySlug, direction: directionSlug } = await params;
  const city = cities.find(c => c.slug === citySlug);
  const dir = directions.find(d => d.id === directionSlug);
  if (!city || !dir) return {};

  return {
    title: `${dir.nameShort} в ${city.name} — Заработок на AI 2026`,
    description: `Как начать зарабатывать на ${dir.nameShort.toLowerCase()} в ${city.name}. Инструменты, клиенты, цены. Гайд 1MB3.`,
    alternates: { canonical: `${SITE_URL}/zarabotok-na-ai/${city.slug}/${dir.id}` },
  };
}

export default async function CityDirectionPage({ params }) {
  const { city: citySlug, direction: directionSlug } = await params;
  const city = cities.find(c => c.slug === citySlug);
  const dir = directions.find(d => d.id === directionSlug);
  if (!city || !dir) return notFound();
  const { publishedAt } = getContentDates();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${dir.nameShort} в ${city.name}: как начать в 2026`,
    "description": `Заработок на ${dir.nameShort.toLowerCase()} в ${city.name}`,
    "author": { "@type": "Organization", "name": "1MB3" },
    "datePublished": publishedAt,
  };

  const otherCities = cities.filter(c => c.slug !== city.slug);
  const otherDirs = directions.filter(d => d.id !== dir.id);

  return (
    <>
      <PageJsonLd data={schema} />
      <Header />
      <Breadcrumbs items={[
        { label: 'Направления', href: '/napravleniya' },
        { label: dir.nameShort, href: `/napravleniya/${dir.id}` },
        { label: city.name }
      ]} />

      <section className="hero">
        <div className="container">
          <h1>{dir.icon} {dir.nameShort} в {city.name}: старт в 2026</h1>
          <p>Как начать зарабатывать на {dir.nameShort.toLowerCase()} в {city.name} и регионе. Инструменты, клиенты, средние чеки.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="article-content" style={{ maxWidth: '100%' }}>

            <h2>Рынок {dir.nameShort.toLowerCase()} в {city.name}</h2>
            <p>{dir.description}. В {city.name} спрос на эти услуги {dir.demand === 'Высокий' || dir.demand === 'Очень высокий' ? 'стабильно высокий' : 'растёт'} благодаря развитию бизнес-среды и росту количества малых и средних предприятий.</p>
            <p>Средний чек: <strong>{dir.priceRange}</strong>. Сложность входа: <strong>{dir.difficulty}</strong>. Время до первого заказа: <strong>{dir.timeToStart}</strong>.</p>

            <h2>Как найти клиентов в {city.name}</h2>
            <p><strong>Локальные площадки:</strong> Telegram-чаты {city.name}, местные бизнес-сообщества, коворкинги.</p>
            <p><strong>Фриланс-биржи:</strong> Kwork, FL.ru, Freelance.ru — фильтр по городу.</p>
            <p><strong>Прямые продажи:</strong> Обход локальных бизнесов с готовым оффером и примерами работ.</p>
            <p><strong>Нетворкинг:</strong> Бизнес-мероприятия и митапы в {city.name}.</p>

            <h2>Инструменты</h2>
            <p>Основные сервисы для {dir.nameShort.toLowerCase()}: <strong>{dir.tools.join(', ')}</strong>.</p>
            <p>Подробные описания и цены — в <Link href={`/napravleniya/${dir.id}`}>полном гайде по направлению</Link>.</p>

            <h2>Часто задаваемые вопросы</h2>
            <div className="faq-list">
              {dir.faq.map((f, i) => (
                <div key={i} className="faq-item">
                  <div className="faq-q">{f.q}</div>
                  <div className="faq-a">{f.a}</div>
                </div>
              ))}
            </div>

            <h2>{dir.nameShort} в других городах</h2>
            <InternalLinks links={otherCities.map(c => ({
              href: `/zarabotok-na-ai/${c.slug}/${dir.id}`,
              label: `${c.name}`
            }))} />

            <h2>Другие направления в {city.name}</h2>
            <InternalLinks links={otherDirs.slice(0, 6).map(d => ({
              href: `/zarabotok-na-ai/${city.slug}/${d.id}`,
              label: `${d.icon} ${d.nameShort}`
            }))} />

            <CtaBlock />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
