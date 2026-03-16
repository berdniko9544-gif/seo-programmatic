import Link from 'next/link';
import { IS_SATELLITE, MAIN_SITE_URL, SITE_URL } from '@/config/site';
import { siteProfile } from '@/config/site-profile';

function buildMainSiteHref(path = '') {
  return `${MAIN_SITE_URL}${path}`;
}

export function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo">
          1MB3 <span>{siteProfile.logoSuffix}</span>
        </Link>
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/napravleniya" style={{ fontSize: '14px', color: '#8b8b99' }}>Направления</Link>
          <Link href="/instrumenty" style={{ fontSize: '14px', color: '#8b8b99' }}>Инструменты</Link>
          <Link href="/blog" style={{ fontSize: '14px', color: '#8b8b99' }}>Блог</Link>
          <a href={IS_SATELLITE ? buildMainSiteHref('/#offer') : '#offer'} className="header-cta">
            {IS_SATELLITE ? siteProfile.ctaButton : 'Купить гайд'}
          </a>
        </nav>
      </div>
    </header>
  );
}

export function MainSiteResourceLinks({ compact = false }) {
  if (!IS_SATELLITE || !siteProfile.mainSiteLinks?.length) {
    return null;
  }

  return (
    <section className={`hub-links ${compact ? 'hub-links--compact' : ''}`}>
      <div className="hub-links-head">
        <span className="eyebrow">{siteProfile.eyebrow}</span>
        <h3>{compact ? 'Главный хаб 1MB3' : 'Куда идти дальше в основном хабе 1MB3'}</h3>
        {!compact && (
          <p>
            Эти страницы собирают коммерческие сценарии, инструменты и направления,
            к которым логично вести читателя после входа по long-tail запросам.
          </p>
        )}
      </div>
      <div className="hub-links-grid">
        {siteProfile.mainSiteLinks.map(link => (
          <a key={link.path} href={buildMainSiteHref(link.path)} className="hub-link-card">
            <strong>{link.label}</strong>
            <span>{link.description}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function FamilyBrief() {
  return (
    <section className="family-brief">
      <div className="container">
        <div className="family-brief-card">
          <span className="eyebrow">{siteProfile.eyebrow}</span>
          <h2>{siteProfile.familyTitle}</h2>
          <p>{siteProfile.familySummary}</p>
          <div className="family-pillars">
            {siteProfile.semanticPillars.map(pillar => (
              <span key={pillar} className="family-pill">{pillar}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Направления</h4>
            <Link href="/napravleniya/ai-photo">AI-фото</Link>
            <Link href="/napravleniya/ai-copywriting">AI-копирайтинг</Link>
            <Link href="/napravleniya/ai-bots">AI-боты</Link>
            <Link href="/napravleniya/ai-video">AI-видео</Link>
            <Link href="/napravleniya/ai-design">AI-дизайн</Link>
            <Link href="/napravleniya/ai-automation">AI-автоматизация</Link>
          </div>
          <div className="footer-col">
            <h4>Инструменты</h4>
            <Link href="/instrumenty/text-ai">Текстовые AI</Link>
            <Link href="/instrumenty/image-ai">AI для изображений</Link>
            <Link href="/instrumenty/video-ai">AI для видео</Link>
            <Link href="/instrumenty/audio-ai">AI для аудио</Link>
            <Link href="/instrumenty/automation-ai">AI-автоматизация</Link>
            <Link href="/instrumenty/code-ai">AI для разработки</Link>
          </div>
          <div className="footer-col">
            <h4>Блог</h4>
            <Link href="/blog/kak-zarabotat-na-neirosetiah">Как зарабатывать на нейросетях</Link>
            <Link href="/blog/zarabotok-na-chatgpt">Заработок на ChatGPT</Link>
            <Link href="/blog/zarabotok-na-midjourney">Заработок на Midjourney</Link>
            <Link href="/blog/pervyy-zakazchik-za-7-dney">Первый заказчик за 7 дней</Link>
            <Link href="/blog/ai-uslugi-dlya-biznesa">AI-услуги для бизнеса</Link>
          </div>
          <div className="footer-col">
            <h4>{IS_SATELLITE ? 'Главный хаб 1MB3' : 'О проекте'}</h4>
            {IS_SATELLITE ? (
              <>
                {siteProfile.mainSiteLinks.slice(0, 4).map(link => (
                  <a key={link.path} href={buildMainSiteHref(link.path)}>{link.label}</a>
                ))}
                <a href={buildMainSiteHref('/#offer')}>Главное предложение 1MB3</a>
              </>
            ) : (
              <>
                <a href="https://t.me/Inside1mb3" target="_blank" rel="noopener">Telegram @Inside1mb3</a>
                <a href="https://www.instagram.com/inside1mb3" target="_blank" rel="noopener">Instagram</a>
                <a href={MAIN_SITE_URL}>Купить гайд</a>
                <Link href="/dlya/freelancer">Для фрилансеров</Link>
                <Link href="/dlya/business">Для предпринимателей</Link>
              </>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 1MB3. Все материалы защищены. Контент служит навигацией по AI-направлениям и связан с главным хабом 1MB3.
          <br />
          <a href={buildMainSiteHref('/legal/offer')}>Оферта</a> · <a href={buildMainSiteHref('/legal/privacy')}>Конфиденциальность</a>
        </div>
      </div>
    </footer>
  );
}

export function CtaBlock() {
  return (
    <div className="cta-block" id="offer">
      <h2>{siteProfile.ctaTitle}</h2>
      <p>{siteProfile.ctaBody}</p>
      <div className="price-row">
        <span className="price-old">₽ 3 990</span>
        <span className="price-new">₽ 1 990</span>
      </div>
      <a href={IS_SATELLITE ? buildMainSiteHref('/#offer') : '#offer'} className="cta-btn">
        {siteProfile.ctaButton} →
      </a>
      <MainSiteResourceLinks compact />
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs container" aria-label="Навигация">
      <Link href="/">Главная</Link>
      {items.map((item, index) => (
        <span key={index}>
          <span>/</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span style={{ color: '#e8e8ed' }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageJsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function InternalLinks({ links }) {
  if (!links?.length) {
    return null;
  }

  return (
    <div className="internal-links">
      {links.map((link, index) => (
        <Link key={index} href={link.href}>{link.label}</Link>
      ))}
    </div>
  );
}
