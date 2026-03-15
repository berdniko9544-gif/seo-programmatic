import Link from 'next/link';
import { Header, Footer, CtaBlock, PageJsonLd } from '@/components/shared';
import { directions } from '@/data/seo-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://seo-programmatic-main.vercel.app';

export const metadata = {
  title: '12 направлений заработка на AI — Каталог 2026 | 1MB3',
  description: 'Полный каталог направлений заработка на нейросетях: от AI-фото до автоматизации. Инструменты, цены, сложность, план старта.',
  alternates: { canonical: `${SITE_URL}/napravleniya` },
};

export default function DirectionsIndex() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Направления заработка на AI",
    "itemListElement": directions.map((dir, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": dir.name,
      "url": `${SITE_URL}/napravleniya/${dir.id}`
    }))
  };

  return (
    <>
      <PageJsonLd data={itemListSchema} />
      <Header />
      <section className="hero">
        <div className="container">
          <h1>12 направлений заработка на AI</h1>
          <p>Выберите направление, изучите инструменты и начните зарабатывать</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
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

          <div style={{ marginTop: '60px' }}>
            <h2 className="section-title">Как выбрать направление</h2>
            <div className="article-content">
              <p><strong>Для новичков:</strong> AI-фото, AI-копирайтинг, AI-озвучка — низкий порог входа, быстрый старт.</p>
              <p><strong>Для специалистов:</strong> AI-боты, AI-автоматизация, AI-аналитика — высокие чеки, нужны технические навыки.</p>
              <p><strong>Для креативных:</strong> AI-дизайн, AI-видео, AI-обучение — творческая работа с хорошей монетизацией.</p>
            </div>
          </div>

          <CtaBlock />
        </div>
      </section>
      <Footer />
    </>
  );
}
