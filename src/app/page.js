import Link from 'next/link';
import {
  Header,
  Footer,
  CtaBlock,
  PageJsonLd,
  FamilyBrief,
  MainSiteResourceLinks,
} from '@/components/shared';
import { directions, toolCategories, audiences } from '@/data/seo-data';
import { SITE_URL, MAIN_SITE_URL, IS_SATELLITE } from '@/config/site';
import { siteProfile } from '@/config/site-profile';

const heroTitle = IS_SATELLITE
  ? `${siteProfile.nicheLabel}: рабочие AI-сценарии и точки монетизации`
  : 'Заработок на нейросетях в 2026 году: полный гайд';

const heroDescription = IS_SATELLITE
  ? `Этот кластер собирает страницы по теме "${siteProfile.nicheLabel.toLowerCase()}": long-tail запросы, маршруты по услугам, инструменты и переходы в основной сайт 1MB3.`
  : '12 направлений монетизации AI, каталог 200+ инструментов, план действий на 30 дней и шаблоны для старта в РФ и СНГ.';

export const metadata = {
  title: heroTitle,
  description: heroDescription,
  alternates: { canonical: SITE_URL },
};

export default function Home() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: IS_SATELLITE
          ? `Как использовать кластер "${siteProfile.nicheLabel}" для поиска клиентов?`
          : 'Как заработать на нейросетях в 2026 году?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: IS_SATELLITE
            ? 'Используйте long-tail страницы для захвата узких запросов, ведите читателя в хабовые страницы по направлениям и переводите коммерческий трафик в основной сайт 1MB3, где собраны офферы, инструменты и сценарии продаж.'
            : 'Сейчас лучше всего работают 12 направлений: AI-фото, копирайтинг, боты, видео, дизайн, озвучка, инфопродукты, маркетинг, сайты, аналитика, переводы и автоматизация процессов.',
        },
      },
      {
        '@type': 'Question',
        name: 'Есть ли перелинковка между страницами и главным хабом?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Да. Страницы связаны через тематические кластеры, внутренние подборки, CTA-блоки и ссылки на главный сайт 1MB3 по релевантным направлениям и инструментам.',
        },
      },
      {
        '@type': 'Question',
        name: 'Как расширяется семантика сайта?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Семантика расширяется за счёт long-tail запросов, геозапросов, сравнений инструментов, аудиторных страниц, статей по интентам и периодически обновляемых хабов.',
        },
      },
    ],
  };

  return (
    <>
      <PageJsonLd data={faqSchema} />
      <Header />

      <section className="hero">
        <div className="container">
          <span className="eyebrow">{siteProfile.eyebrow}</span>
          <h1>{heroTitle}</h1>
          <p>{heroDescription}</p>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">{directions.length}</div>
              <div className="stat-label">направлений</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{toolCategories.reduce((sum, category) => sum + category.tools.length, 0)}+</div>
              <div className="stat-label">инструментов</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{siteProfile.semanticPillars.length}</div>
              <div className="stat-label">семантических ядер</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{IS_SATELLITE ? 'Hub' : '1MB3'}</div>
              <div className="stat-label">{IS_SATELLITE ? 'маршрут в основной сайт' : 'главный хаб'}</div>
            </div>
          </div>
          <a
            href={MAIN_SITE_URL}
            className="cta-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {siteProfile.ctaButton} →
          </a>
        </div>
      </section>

      <FamilyBrief />

      <section className="section">
        <div className="container">
          <h2 className="section-title">Кластеры направлений</h2>
          <p className="section-subtitle">
            Каждое направление работает как хаб: собирает спрос, усиливает перелинковку и ведёт к релевантным сценариям монетизации.
          </p>
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

      <section className="section" style={{ background: 'rgba(17,17,21,0.5)' }}>
        <div className="container">
          <h2 className="section-title">Каталог AI-инструментов</h2>
          <p className="section-subtitle">
            Стек сервисов для текста, изображений, видео, автоматизации и разработки, который помогает закрывать задачи и расширять семантику сайта.
          </p>
          <div className="cards-grid">
            {toolCategories.map(category => (
              <Link key={category.id} href={`/instrumenty/${category.id}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <span className="card-icon">{category.icon}</span>
                  <h3>{category.name}</h3>
                  <p>{category.tools.length} сервисов с описаниями, ценами и точками применения.</p>
                  <div className="card-meta">
                    {category.tools.slice(0, 3).map(tool => (
                      <span key={tool.name} className="card-tag">{tool.name}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Для кого этот хаб</h2>
          <p className="section-subtitle">
            Подбор входа в AI по роли: фриланс, бизнес, обучение, маркетинг, разработка и запуск услуг.
          </p>
          <div className="cards-grid">
            {audiences.map(audience => (
              <Link key={audience.slug} href={`/dlya/${audience.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <h3>Для {audience.name}</h3>
                  <p>{audience.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {IS_SATELLITE && (
        <section className="section" style={{ background: 'rgba(17,17,21,0.5)' }}>
          <div className="container">
            <h2 className="section-title">Хабовые маршруты в 1MB3</h2>
            <p className="section-subtitle">
              Релевантные ссылки на основной сайт, которые собирают коммерческий интент, офферы и конверсионные сценарии.
            </p>
            <MainSiteResourceLinks />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <CtaBlock />
        </div>
      </section>

      <Footer />
    </>
  );
}
