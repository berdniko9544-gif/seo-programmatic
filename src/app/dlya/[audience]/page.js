import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer, CtaBlock, Breadcrumbs, PageJsonLd, InternalLinks } from '@/components/shared';
import { directions, audiences } from '@/data/seo-data';

export async function generateStaticParams() {
  return audiences.map(a => ({ audience: a.slug }));
}

export async function generateMetadata({ params }) {
  const aud = audiences.find(a => a.slug === params.audience);
  if (!aud) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://seo-programmatic-main.vercel.app';

  return {
    title: `Гайд по заработку на ИИ для ${aud.name} 2026`,
    description: `${aud.desc} Подробный PDF-гайд от 1MB3 с планом на 30 дней.`,
    alternates: { canonical: `${siteUrl}/dlya/${aud.slug}` },
  };
}

export default function AudiencePage({ params }) {
  const aud = audiences.find(a => a.slug === params.audience);
  if (!aud) return notFound();

  const bestDirs = {
    freelancer: ['ai-copywriting', 'ai-photo', 'ai-design', 'ai-bots'],
    business: ['ai-bots', 'ai-automation', 'ai-marketing', 'ai-analytics'],
    student: ['ai-copywriting', 'ai-photo', 'ai-voice', 'ai-translation'],
    mama: ['ai-copywriting', 'ai-photo', 'ai-voice', 'ai-education'],
    designer: ['ai-design', 'ai-photo', 'ai-video', 'ai-sites'],
    marketer: ['ai-marketing', 'ai-copywriting', 'ai-video', 'ai-analytics'],
    developer: ['ai-bots', 'ai-automation', 'ai-sites', 'ai-analytics'],
    copywriter: ['ai-copywriting', 'ai-marketing', 'ai-education', 'ai-translation'],
  };

  const recommended = (bestDirs[aud.slug] || []).map(id => directions.find(d => d.id === id)).filter(Boolean);

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: `Для ${aud.name}` }]} />

      <section className="hero">
        <div className="container">
          <h1>Гайд по заработку на ИИ для {aud.name}</h1>
          <p>{aud.desc}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="article-content" style={{ maxWidth: '100%' }}>

            <h2>Почему {aud.name} зарабатывают на AI в 2026</h2>
            <p>Нейросети открыли новые возможности для {aud.name}. Можно начать с минимальными вложениями, работать удалённо и выйти на доход уже через 2–4 недели. Главное — выбрать подходящее направление и следовать плану.</p>

            <h2>Рекомендованные направления</h2>
            <div className="cards-grid">
              {recommended.map(dir => (
                <Link key={dir.id} href={`/napravleniya/${dir.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card">
                    <span className="card-icon">{dir.icon}</span>
                    <h3>{dir.name}</h3>
                    <p>{dir.description}</p>
                    <div className="card-meta">
                      <span className="card-tag green">{dir.priceRange}</span>
                      <span className="card-tag accent">Старт: {dir.timeToStart}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <h2>План действий для {aud.name}</h2>
            <p><strong>Неделя 1:</strong> Выберите 1 направление из рекомендованных. Изучите инструменты.</p>
            <p><strong>Неделя 2:</strong> Создайте портфолио из 3–5 работ. Оформите профиль на фриланс-бирже.</p>
            <p><strong>Неделя 3:</strong> Начните активный поиск клиентов. Отправьте 20–30 предложений.</p>
            <p><strong>Неделя 4:</strong> Закройте первые заказы. Соберите отзывы. Масштабируйте.</p>

            <h2>Все направления</h2>
            <InternalLinks links={directions.map(d => ({
              href: `/napravleniya/${d.id}`,
              label: `${d.icon} ${d.nameShort}`
            }))} />

            <h2>Для кого ещё подходит гайд</h2>
            <InternalLinks links={audiences.filter(a => a.slug !== aud.slug).map(a => ({
              href: `/dlya/${a.slug}`,
              label: `Для ${a.name}`
            }))} />

            <CtaBlock />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
