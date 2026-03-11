import Link from 'next/link';
import { Header, Footer, CtaBlock } from '@/components/shared';
import { howToArticles } from '@/data/seo-data';

export const metadata = {
  title: 'Блог о заработке на нейросетях — статьи и гайды 2026',
  description: 'Бесплатные статьи о заработке на AI: ChatGPT, Midjourney, нейросетевые профессии, удалённая работа, автоматизация. От команды 1MB3.',
  alternates: { canonical: 'https://1mb3-seo.vercel.app/blog' },
};

export default function BlogIndex() {
  return (
    <>
      <Header />
      <section className="hero">
        <div className="container">
          <h1>Блог: заработок на нейросетях</h1>
          <p>Бесплатные статьи, гайды и разборы по монетизации AI</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="cards-grid">
            {howToArticles.map(a => (
              <Link key={a.slug} href={`/blog/${a.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                  <div className="card-meta">
                    <span className="card-tag">март 2026</span>
                    <span className="card-tag accent">{a.readTime}</span>
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
