import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer, CtaBlock, Breadcrumbs, PageJsonLd, InternalLinks } from '@/components/shared';
import { directions, cities } from '@/data/seo-data';

export async function generateStaticParams() {
  return directions.map(d => ({ slug: d.id }));
}

export async function generateMetadata({ params }) {
  const dir = directions.find(d => d.id === params.slug);
  if (!dir) return {};
  return {
    title: `${dir.name} — Заработок на ИИ в 2026`,
    description: `${dir.description}. Инструменты: ${dir.tools.join(', ')}. Цены: ${dir.priceRange}. Гайд 1MB3.`,
    alternates: { canonical: `https://1mb3-seo.vercel.app/napravleniya/${dir.id}` },
    openGraph: {
      title: `${dir.name} — Заработок 2026 | 1MB3`,
      description: dir.description,
      url: `https://1mb3-seo.vercel.app/napravleniya/${dir.id}`,
    },
  };
}

export default function DirectionPage({ params }) {
  const dir = directions.find(d => d.id === params.slug);
  if (!dir) return notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${dir.name}: как заработать в 2026`,
    "description": dir.description,
    "author": { "@type": "Organization", "name": "1MB3" },
    "publisher": { "@type": "Organization", "name": "1MB3" },
    "datePublished": "2026-02-14",
    "dateModified": "2026-03-01",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": dir.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  const otherDirs = directions.filter(d => d.id !== dir.id);

  return (
    <>
      <PageJsonLd data={schema} />
      <PageJsonLd data={faqSchema} />
      <Header />
      <Breadcrumbs items={[
        { label: 'Направления', href: '/napravleniya' },
        { label: dir.name }
      ]} />

      <section className="hero">
        <div className="container">
          <h1>{dir.icon} {dir.name}: как заработать в 2026</h1>
          <p>{dir.description}</p>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">{dir.priceRange.split('–')[0]}</div>
              <div className="stat-label">мин. чек</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{dir.timeToStart}</div>
              <div className="stat-label">до старта</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{dir.tools.length}</div>
              <div className="stat-label">инструментов</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="article-content" style={{ maxWidth: '100%' }}>

            <h2>Что такое {dir.nameShort.toLowerCase()}</h2>
            <p>{dir.description}. Это направление подходит {dir.difficulty === 'Начальный' ? 'даже новичкам' : 'специалистам со средним уровнем подготовки'} и позволяет выйти на первый доход за {dir.timeToStart}.</p>
            <p>Спрос на рынке: <strong>{dir.demand}</strong>. Средний чек проекта: <strong>{dir.priceRange}</strong>.</p>

            <h2>Инструменты для {dir.nameShort.toLowerCase()}</h2>
            <table className="tools-table">
              <thead>
                <tr>
                  <th>Сервис</th>
                  <th>Для чего</th>
                </tr>
              </thead>
              <tbody>
                {dir.tools.map(tool => (
                  <tr key={tool}>
                    <td className="tool-name">{tool}</td>
                    <td style={{ color: '#8b8b99' }}>Ключевой инструмент для {dir.nameShort.toLowerCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2>Как начать зарабатывать</h2>
            <p><strong>Шаг 1:</strong> Изучите инструменты и выберите 2–3 основных.</p>
            <p><strong>Шаг 2:</strong> Соберите портфолио из 3–5 работ (можно на вымышленных проектах).</p>
            <p><strong>Шаг 3:</strong> Определите целевую аудиторию и сформулируйте оффер.</p>
            <p><strong>Шаг 4:</strong> Разместите объявления на Kwork, FL.ru, в Telegram-чатах и группах.</p>
            <p><strong>Шаг 5:</strong> Обработайте первые заявки и получите кейсы для масштабирования.</p>

            <h2>Часто задаваемые вопросы</h2>
            <div className="faq-list">
              {dir.faq.map((f, i) => (
                <div key={i} className="faq-item">
                  <div className="faq-q">{f.q}</div>
                  <div className="faq-a">{f.a}</div>
                </div>
              ))}
            </div>

            <h2>{dir.nameShort} по городам</h2>
            <InternalLinks links={cities.map(c => ({
              href: `/zarabotok-na-ai/${c.slug}/${dir.id}`,
              label: `${dir.nameShort} в ${c.name}`
            }))} />

            <h2>Другие направления</h2>
            <InternalLinks links={otherDirs.map(d => ({
              href: `/napravleniya/${d.id}`,
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
