import Link from 'next/link';
import { Header, Footer, CtaBlock } from '@/components/shared';
import { howToArticles } from '@/data/seo-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://seo-programmatic-main.vercel.app';

export const metadata = {
  title: 'Блог о заработке на нейросетях — статьи и гайды 2026',
  description: 'Бесплатные статьи о заработке на AI: ChatGPT, Midjourney, нейросетевые профессии, удалённая работа, автоматизация. От команды 1MB3.',
  alternates: { canonical: `${SITE_URL}/blog` },
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
