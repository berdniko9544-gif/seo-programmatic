import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer, CtaBlock, Breadcrumbs, InternalLinks } from '@/components/shared';
import { directions, yearMonths } from '@/data/seo-data';
import { SITE_URL } from '@/config/site';

export async function generateStaticParams() {
  return yearMonths.map(ym => ({ period: ym.slug }));
}

export async function generateMetadata({ params }) {
  const { period } = await params;
  const ym = yearMonths.find(y => y.slug === period);
  if (!ym) return {};

  return {
    title: `Заработок на ИИ ${ym.name} — Актуальные способы`,
    description: `Актуальные способы заработка на нейросетях в ${ym.name}. 12 направлений с инструментами и ценами. Гайд 1MB3.`,
    alternates: { canonical: `${SITE_URL}/zarabotok-na-ii/${ym.slug}` },
  };
}

export default async function TimePeriodPage({ params }) {
  const { period } = await params;
  const ym = yearMonths.find(y => y.slug === period);
  if (!ym) return notFound();

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: `Заработок на ИИ ${ym.name}` }]} />

      <section className="hero">
        <div className="container">
          <h1>Заработок на нейросетях: что работает в {ym.name}</h1>
          <p>Актуальные направления, инструменты и стратегии монетизации AI</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="article-content" style={{ maxWidth: '100%' }}>

            <h2>Топ направлений в {ym.name}</h2>
            <p>На основе рыночного спроса и обратной связи от покупателей гайда мы выделяем самые перспективные направления:</p>

            <div className="cards-grid">
              {directions.slice(0, 6).map(dir => (
                <Link key={dir.id} href={`/napravleniya/${dir.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card">
                    <span className="card-icon">{dir.icon}</span>
                    <h3>{dir.name}</h3>
                    <p>{dir.description}</p>
                    <div className="card-meta">
                      <span className="card-tag green">{dir.priceRange}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <h2>Что изменилось</h2>
            <p>AI-инструменты развиваются стремительно. В {ym.name} появились новые возможности: улучшенное качество генерации, новые модели, более доступные цены. Гайд 1MB3 регулярно обновляется, чтобы отражать актуальную ситуацию.</p>

            <h2>Все 12 направлений</h2>
            <InternalLinks links={directions.map(d => ({
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
