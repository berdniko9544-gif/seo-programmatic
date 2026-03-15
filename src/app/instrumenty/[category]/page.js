import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer, CtaBlock, Breadcrumbs, PageJsonLd, InternalLinks } from '@/components/shared';
import { toolCategories } from '@/data/seo-data';

export async function generateStaticParams() {
  return toolCategories.map(c => ({ category: c.id }));
}

export async function generateMetadata({ params }) {
  const cat = toolCategories.find(c => c.id === params.category);
  if (!cat) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://seo-programmatic-main.vercel.app';

  return {
    title: `${cat.name} — Каталог ИИ-сервисов 2026`,
    description: `Полный каталог ${cat.name.toLowerCase()} с ценами и описаниями. ${cat.tools.map(t=>t.name).join(', ')} и другие.`,
    alternates: { canonical: `${siteUrl}/instrumenty/${cat.id}` },
  };
}

export default function ToolCatalogPage({ params }) {
  const cat = toolCategories.find(c => c.id === params.category);
  if (!cat) return notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": cat.name,
    "numberOfItems": cat.tools.length,
    "itemListElement": cat.tools.map((t, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": t.name,
        "description": t.desc,
        "applicationCategory": t.category,
        "url": t.url,
      }
    }))
  };

  return (
    <>
      <PageJsonLd data={schema} />
      <Header />
      <Breadcrumbs items={[
        { label: 'Инструменты', href: '/instrumenty' },
        { label: cat.name }
      ]} />

      <section className="hero">
        <div className="container">
          <h1>{cat.icon} {cat.name}</h1>
          <p>Каталог {cat.tools.length} сервисов с ценами, описаниями и рейтингами. Обновлено: март 2026.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <table className="tools-table">
            <thead>
              <tr>
                <th>Сервис</th>
                <th>Описание</th>
                <th>Цена</th>
                <th>Рейтинг</th>
              </tr>
            </thead>
            <tbody>
              {cat.tools.map(tool => (
                <tr key={tool.name}>
                  <td className="tool-name">
                    <a href={tool.url} target="_blank" rel="noopener nofollow">{tool.name}</a>
                  </td>
                  <td style={{ color: '#8b8b99' }}>{tool.desc}</td>
                  <td style={{ color: '#8b8b99', whiteSpace: 'nowrap' }}>{tool.pricing}</td>
                  <td className="rating">{'★'.repeat(tool.rating)}{'☆'.repeat(5 - tool.rating)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="article-content" style={{ maxWidth: '100%' }}>
            <h2>Как выбрать сервис</h2>
            <p>При выборе AI-инструмента учитывайте: стоимость подписки, качество работы с русским языком, наличие бесплатного тарифа для тестирования, и коммерческую лицензию на использование результатов.</p>
            <p>В гайде 1MB3 подробно описаны связки инструментов под каждую задачу — чтобы вы не тратили время на подбор.</p>

            <h2>Другие категории</h2>
            <InternalLinks links={toolCategories.filter(c => c.id !== cat.id).map(c => ({
              href: `/instrumenty/${c.id}`,
              label: `${c.icon} ${c.name}`
            }))} />

            <CtaBlock />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
