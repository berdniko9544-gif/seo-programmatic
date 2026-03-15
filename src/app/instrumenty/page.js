import Link from 'next/link';
import { Header, Footer, CtaBlock, PageJsonLd } from '@/components/shared';
import { toolCategories } from '@/data/seo-data';
import { SITE_URL } from '@/config/site';

export const metadata = {
  title: 'Каталог 200+ AI-инструментов для заработка 2026 | 1MB3',
  description: 'Полный каталог нейросетей и AI-сервисов с ценами, рейтингами и описаниями. Инструменты для текста, изображений, видео, аудио, кода.',
  alternates: { canonical: `${SITE_URL}/instrumenty` },
};

export default function ToolsIndex() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Каталог AI-инструментов",
    "itemListElement": toolCategories.map((cat, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": cat.name,
      "url": `${SITE_URL}/instrumenty/${cat.id}`
    }))
  };

  return (
    <>
      <PageJsonLd data={itemListSchema} />
      <Header />
      <section className="hero">
        <div className="container">
          <h1>Каталог 200+ AI-инструментов</h1>
          <p>Нейросети и сервисы для каждого направления заработка</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cards-grid">
            {toolCategories.map(cat => (
              <Link key={cat.id} href={`/instrumenty/${cat.id}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <span className="card-icon">{cat.icon}</span>
                  <h3>{cat.name}</h3>
                  <p>{cat.tools.length} сервисов с ценами и рейтингами</p>
                  <div className="card-meta">
                    {cat.tools.slice(0, 3).map(t => (
                      <span key={t.name} className="card-tag">{t.name}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: '60px' }}>
            <h2 className="section-title">Как выбрать инструмент</h2>
            <div className="article-content">
              <p><strong>Бесплатные:</strong> ChatGPT, Claude, Stable Diffusion, CapCut — для старта без вложений.</p>
              <p><strong>Платные:</strong> Midjourney ($10/мес), GitHub Copilot ($10/мес), Cursor ($20/мес) — для профессиональной работы.</p>
              <p><strong>Российские:</strong> YandexGPT, GigaChat — работают без VPN, поддерживают русский язык.</p>
            </div>
          </div>

          <CtaBlock />
        </div>
      </section>
      <Footer />
    </>
  );
}
