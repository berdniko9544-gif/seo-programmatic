import Link from 'next/link';
import { Header, Footer, CtaBlock, PageJsonLd } from '@/components/shared';
import { directions, toolCategories, audiences } from '@/data/seo-data';

export const metadata = {
  title: '1MB3 — Заработок на нейросетях 2026: 12 направлений, 200+ инструментов',
  description: 'Полный гайд по заработку на AI и нейросетях в 2026 году. 12 направлений монетизации, каталог 200+ сервисов, план на 30 дней. Для РФ/СНГ.',
  alternates: { canonical: 'https://1mb3-seo.vercel.app' },
};

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Как заработать на нейросетях в 2026 году?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Существует 12 основных направлений: AI-фото для бизнеса, AI-копирайтинг, чат-боты, AI-видео, AI-дизайн, AI-озвучка, инфопродукты, AI-маркетинг, создание сайтов, аналитика, переводы и автоматизация процессов."
        }
      },
      {
        "@type": "Question",
        "name": "Сколько можно заработать на AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Доход зависит от направления и опыта. Средние чеки: AI-фото от 5 000 ₽/проект, AI-боты от 10 000 ₽, AI-автоматизация от 30 000 ₽. Опытные специалисты зарабатывают от 100 000 ₽/мес."
        }
      },
      {
        "@type": "Question",
        "name": "С чего начать заработок на нейросетях?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "1. Выберите одно направление из 12. 2. Изучите инструменты (каталог 200+ сервисов). 3. Соберите портфолио из 3-5 работ. 4. Найдите первого клиента за 7 дней по нашему чек-листу."
        }
      }
    ]
  };

  return (
    <>
      <PageJsonLd data={faqSchema} />
      <Header />

      <section className="hero">
        <div className="container">
          <h1>Заработок на нейросетях в 2026 году: полный гайд</h1>
          <p>12 направлений монетизации AI, каталог 200+ инструментов, план действий на 30 дней и шаблоны для старта. Для РФ/СНГ.</p>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">12</div>
              <div className="stat-label">направлений</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">инструментов</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">30</div>
              <div className="stat-label">дней план</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1 200+</div>
              <div className="stat-label">покупателей</div>
            </div>
          </div>
          <a href="https://1mb3-guide-2026.vercel.app#offer" className="cta-btn" target="_blank" rel="noopener">
            Купить гайд — ₽ 1 990 →
          </a>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">12 направлений заработка на AI</h2>
          <p className="section-subtitle">Каждое направление — отдельная ниша с инструментами, ценами и планом старта</p>
          <div className="cards-grid">
            {directions.map(dir => (
              <Link key={dir.id} href={`/napravleniya/${dir.id}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <span className="card-icon">{dir.icon}</span>
                  <h3>{dir.name}</h3>
                  <p>{dir.description}</p>
                  <div className="card-meta">
                    <span className="card-tag green">{dir.priceRange}</span>
                    <span className="card-tag">{dir.difficulty}</span>
                    <span className="card-tag accent">Старт: {dir.timeToStart}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TOOL CATEGORIES */}
      <section className="section" style={{ background: 'rgba(17,17,21,0.5)' }}>
        <div className="container">
          <h2 className="section-title">Каталог 200+ AI-инструментов</h2>
          <p className="section-subtitle">Сервисы для каждого направления с ценами и рейтингами</p>
          <div className="cards-grid">
            {toolCategories.map(cat => (
              <Link key={cat.id} href={`/instrumenty/${cat.id}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <span className="card-icon">{cat.icon}</span>
                  <h3>{cat.name}</h3>
                  <p>{cat.tools.length} сервисов с ценами и описаниями</p>
                  <div className="card-meta">
                    {cat.tools.slice(0, 3).map(t => (
                      <span key={t.name} className="card-tag">{t.name}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCES */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Для кого этот гайд</h2>
          <p className="section-subtitle">Выберите вашу ситуацию — мы покажем, что внутри</p>
          <div className="cards-grid">
            {audiences.map(a => (
              <Link key={a.slug} href={`/dlya/${a.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <h3>Для {a.name}</h3>
                  <p>{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR ARTICLES */}
      <section className="section" style={{ background: 'rgba(17,17,21,0.5)' }}>
        <div className="container">
          <h2 className="section-title">Популярные статьи</h2>
          <p className="section-subtitle">Бесплатные материалы по заработку на нейросетях</p>
          <div className="cards-grid">
            {[
              { slug: "kak-zarabotat-na-neirosetiah", title: "Как заработать на нейросетях в 2026 году", desc: "12 проверенных способов с примерами и ценами" },
              { slug: "zarabotok-na-chatgpt", title: "Заработок на ChatGPT — 10 способов", desc: "От копирайтинга до AI-агентов" },
              { slug: "luchshie-neiroset-dlya-zarabotka", title: "Лучшие нейросети для заработка", desc: "Рейтинг инструментов по категориям" },
              { slug: "pervyy-zakazchik-za-7-dney", title: "Первый клиент за 7 дней", desc: "Пошаговый чек-лист для быстрого старта" },
              { slug: "udalennaya-rabota-na-ai", title: "Удалённая работа на AI", desc: "Где искать заказы и клиентов" },
              { slug: "neirosetvye-professii-2026", title: "Нейросетевые профессии 2026", desc: "Новые специальности и вакансии" },
            ].map(article => (
              <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <h3>{article.title}</h3>
                  <p>{article.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <CtaBlock />
        </div>
      </section>

      <Footer />
    </>
  );
}
