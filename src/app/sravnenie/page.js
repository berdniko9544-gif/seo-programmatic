import Link from 'next/link';
import { Header, Footer, CtaBlock, PageJsonLd } from '@/components/shared';
import { comparisonPairs } from '@/data/seo-data';

export const metadata = {
  title: 'Сравнение AI-инструментов — Что выбрать в 2026 | 1MB3',
  description: 'Детальные сравнения популярных нейросетей: ChatGPT vs Claude, Midjourney vs DALL-E, n8n vs Make и другие.',
  alternates: { canonical: 'https://1mb3-seo.vercel.app/sravnenie' },
};

export default function ComparisonsIndex() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Сравнения AI-инструментов",
    "itemListElement": comparisonPairs.map((pair, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": `${pair.a} vs ${pair.b}`,
      "url": `https://1mb3-seo.vercel.app/sravnenie/${pair.slug}`
    }))
  };

  return (
    <>
      <PageJsonLd data={itemListSchema} />
      <Header />
      <section className="hero">
        <div className="container">
          <h1>Сравнение AI-инструментов</h1>
          <p>Детальные сравнения популярных нейросетей и сервисов</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cards-grid">
            {comparisonPairs.map(pair => (
              <Link key={pair.slug} href={`/sravnenie/${pair.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <h3>{pair.a} vs {pair.b}</h3>
                  <p>Детальное сравнение функций, цен и возможностей</p>
                  <div className="card-meta">
                    <span className="card-tag">{pair.a}</span>
                    <span className="card-tag">{pair.b}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <CtaBlock />
        </div>
      </section>
      <Footer />
    </>
  );
}
