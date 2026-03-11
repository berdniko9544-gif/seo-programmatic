import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer, CtaBlock, Breadcrumbs, PageJsonLd, InternalLinks } from '@/components/shared';
import { comparisonPairs } from '@/data/seo-data';

export async function generateStaticParams() {
  return comparisonPairs.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const pair = comparisonPairs.find(p => p.slug === params.slug);
  if (!pair) return {};
  return {
    title: `${pair.a} vs ${pair.b} — Сравнение 2026`,
    description: `Подробное сравнение ${pair.a} и ${pair.b}: функции, цены, плюсы и минусы. Что выбрать для заработка в 2026?`,
    alternates: { canonical: `https://1mb3-seo.vercel.app/sravnenie/${pair.slug}` },
  };
}

export default function ComparisonPage({ params }) {
  const pair = comparisonPairs.find(p => p.slug === params.slug);
  if (!pair) return notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${pair.a} vs ${pair.b}: что выбрать в 2026`,
    "author": { "@type": "Organization", "name": "1MB3" },
    "datePublished": "2026-02-14",
  };

  return (
    <>
      <PageJsonLd data={schema} />
      <Header />
      <Breadcrumbs items={[
        { label: 'Сравнения', href: '/sravnenie' },
        { label: `${pair.a} vs ${pair.b}` }
      ]} />

      <section className="hero">
        <div className="container">
          <h1>{pair.a} vs {pair.b}: подробное сравнение 2026</h1>
          <p>Разбираем ключевые отличия, плюсы и минусы для заработка на AI</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="article-content" style={{ maxWidth: '100%' }}>

            <h2>Краткое сравнение</h2>
            <table className="tools-table">
              <thead>
                <tr><th>Критерий</th><th>{pair.a}</th><th>{pair.b}</th></tr>
              </thead>
              <tbody>
                <tr><td style={{ fontWeight: 600, color: '#fff' }}>Качество результата</td><td style={{ color: '#8b8b99' }}>Высокое</td><td style={{ color: '#8b8b99' }}>Высокое</td></tr>
                <tr><td style={{ fontWeight: 600, color: '#fff' }}>Русский язык</td><td style={{ color: '#8b8b99' }}>Хорошо</td><td style={{ color: '#8b8b99' }}>Хорошо</td></tr>
                <tr><td style={{ fontWeight: 600, color: '#fff' }}>Бесплатный тариф</td><td style={{ color: '#8b8b99' }}>Есть</td><td style={{ color: '#8b8b99' }}>Есть</td></tr>
                <tr><td style={{ fontWeight: 600, color: '#fff' }}>Лучше для</td><td style={{ color: '#8b8b99' }}>Продвинутых задач</td><td style={{ color: '#8b8b99' }}>Базовых задач</td></tr>
              </tbody>
            </table>

            <h2>Когда выбрать {pair.a}</h2>
            <p>{pair.a} лучше подходит для сложных, многоступенчатых задач, где требуется высокая точность и кастомизация. Рекомендуется для профессионального использования.</p>

            <h2>Когда выбрать {pair.b}</h2>
            <p>{pair.b} оптимален для быстрого старта и типовых задач. Хороший выбор для новичков и небольших проектов.</p>

            <h2>Вердикт</h2>
            <p>Оба инструмента достойны использования. В гайде 1MB3 мы описываем конкретные связки: какой инструмент для какой задачи даёт лучший результат, и как их комбинировать для максимальной эффективности.</p>

            <h2>Другие сравнения</h2>
            <InternalLinks links={comparisonPairs.filter(p => p.slug !== pair.slug).map(p => ({
              href: `/sravnenie/${p.slug}`,
              label: `${p.a} vs ${p.b}`
            }))} />

            <CtaBlock />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
