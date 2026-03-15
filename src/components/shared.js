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
          <Link href="/napravleniya" style={{ fontSize: '14px', color: '#8b8b99' }}>РќР°РїСЂР°РІР»РµРЅРёСЏ</Link>
          <Link href="/instrumenty" style={{ fontSize: '14px', color: '#8b8b99' }}>РРЅСЃС‚СЂСѓРјРµРЅС‚С‹</Link>
          <Link href="/blog" style={{ fontSize: '14px', color: '#8b8b99' }}>Р‘Р»РѕРі</Link>
          <a href={IS_SATELLITE ? buildMainSiteHref('/#offer') : '#offer'} className="header-cta">
            {IS_SATELLITE ? siteProfile.ctaButton : 'РљСѓРїРёС‚СЊ РіР°Р№Рґ'}
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
        <h3>{compact ? 'Р“Р»Р°РІРЅС‹Р№ С…Р°Р± 1MB3' : 'РљСѓРґР° РёРґС‚Рё РґР°Р»СЊС€Рµ РІ РѕСЃРЅРѕРІРЅРѕРј С…Р°Р±Рµ 1MB3'}</h3>
        {!compact && (
          <p>
            Р­С‚Рё СЃС‚СЂР°РЅРёС†С‹ СЃРѕР±РёСЂР°СЋС‚ РєРѕРјРјРµСЂС‡РµСЃРєРёРµ СЃС†РµРЅР°СЂРёРё, РёРЅСЃС‚СЂСѓРјРµРЅС‚С‹ Рё РЅР°РїСЂР°РІР»РµРЅРёСЏ,
            Рє РєРѕС‚РѕСЂС‹Рј Р»РѕРіРёС‡РЅРѕ РІРµСЃС‚Рё С‡РёС‚Р°С‚РµР»СЏ РїРѕСЃР»Рµ РІС…РѕРґР° РїРѕ long-tail Р·Р°РїСЂРѕСЃР°Рј.
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
            <h4>РќР°РїСЂР°РІР»РµРЅРёСЏ</h4>
            <Link href="/napravleniya/ai-photo">AI-С„РѕС‚Рѕ</Link>
            <Link href="/napravleniya/ai-copywriting">AI-РєРѕРїРёСЂР°Р№С‚РёРЅРі</Link>
            <Link href="/napravleniya/ai-bots">AI-Р±РѕС‚С‹</Link>
            <Link href="/napravleniya/ai-video">AI-РІРёРґРµРѕ</Link>
            <Link href="/napravleniya/ai-design">AI-РґРёР·Р°Р№РЅ</Link>
            <Link href="/napravleniya/ai-automation">AI-Р°РІС‚РѕРјР°С‚РёР·Р°С†РёСЏ</Link>
          </div>
          <div className="footer-col">
            <h4>РРЅСЃС‚СЂСѓРјРµРЅС‚С‹</h4>
            <Link href="/instrumenty/text-ai">РўРµРєСЃС‚РѕРІС‹Рµ AI</Link>
            <Link href="/instrumenty/image-ai">AI РґР»СЏ РёР·РѕР±СЂР°Р¶РµРЅРёР№</Link>
            <Link href="/instrumenty/video-ai">AI РґР»СЏ РІРёРґРµРѕ</Link>
            <Link href="/instrumenty/audio-ai">AI РґР»СЏ Р°СѓРґРёРѕ</Link>
            <Link href="/instrumenty/automation-ai">AI-Р°РІС‚РѕРјР°С‚РёР·Р°С†РёСЏ</Link>
            <Link href="/instrumenty/code-ai">AI РґР»СЏ СЂР°Р·СЂР°Р±РѕС‚РєРё</Link>
          </div>
          <div className="footer-col">
            <h4>Р‘Р»РѕРі</h4>
            <Link href="/blog/kak-zarabotat-na-neirosetiah">РљР°Рє Р·Р°СЂР°Р±Р°С‚С‹РІР°С‚СЊ РЅР° РЅРµР№СЂРѕСЃРµС‚СЏС…</Link>
            <Link href="/blog/zarabotok-na-chatgpt">Р—Р°СЂР°Р±РѕС‚РѕРє РЅР° ChatGPT</Link>
            <Link href="/blog/zarabotok-na-midjourney">Р—Р°СЂР°Р±РѕС‚РѕРє РЅР° Midjourney</Link>
            <Link href="/blog/pervyy-zakazchik-za-7-dney">РџРµСЂРІС‹Р№ Р·Р°РєР°Р·С‡РёРє Р·Р° 7 РґРЅРµР№</Link>
            <Link href="/blog/ai-uslugi-dlya-biznesa">AI-СѓСЃР»СѓРіРё РґР»СЏ Р±РёР·РЅРµСЃР°</Link>
          </div>
          <div className="footer-col">
            <h4>{IS_SATELLITE ? 'Р“Р»Р°РІРЅС‹Р№ С…Р°Р± 1MB3' : 'Рћ РїСЂРѕРµРєС‚Рµ'}</h4>
            {IS_SATELLITE ? (
              <>
                {siteProfile.mainSiteLinks.slice(0, 4).map(link => (
                  <a key={link.path} href={buildMainSiteHref(link.path)}>{link.label}</a>
                ))}
                <a href={buildMainSiteHref('/#offer')}>Р“Р»Р°РІРЅРѕРµ РїСЂРµРґР»РѕР¶РµРЅРёРµ 1MB3</a>
              </>
            ) : (
              <>
                <a href="https://t.me/Inside1mb3" target="_blank" rel="noopener">Telegram @Inside1mb3</a>
                <a href="https://www.instagram.com/inside1mb3" target="_blank" rel="noopener">Instagram</a>
                <a href={MAIN_SITE_URL}>РљСѓРїРёС‚СЊ РіР°Р№Рґ</a>
                <Link href="/dlya/freelancer">Р”Р»СЏ С„СЂРёР»Р°РЅСЃРµСЂРѕРІ</Link>
                <Link href="/dlya/business">Р”Р»СЏ РїСЂРµРґРїСЂРёРЅРёРјР°С‚РµР»РµР№</Link>
              </>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          В© 2026 1MB3. Р’СЃРµ РјР°С‚РµСЂРёР°Р»С‹ Р·Р°С‰РёС‰РµРЅС‹. РљРѕРЅС‚РµРЅС‚ СЃР»СѓР¶РёС‚ РЅР°РІРёРіР°С†РёРµР№ РїРѕ AI-РЅР°РїСЂР°РІР»РµРЅРёСЏРј Рё СЃРІСЏР·Р°РЅ СЃ РіР»Р°РІРЅС‹Рј С…Р°Р±РѕРј 1MB3.
          <br />
          <a href={buildMainSiteHref('/legal/offer')}>РћС„РµСЂС‚Р°</a> В· <a href={buildMainSiteHref('/legal/privacy')}>РљРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚СЊ</a>
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
        <span className="price-old">в‚Ѕ 3 990</span>
        <span className="price-new">в‚Ѕ 1 990</span>
      </div>
      <a href={IS_SATELLITE ? buildMainSiteHref('/#offer') : '#offer'} className="cta-btn">
        {siteProfile.ctaButton} в†’
      </a>
      <MainSiteResourceLinks compact />
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs container" aria-label="РќР°РІРёРіР°С†РёСЏ">
      <Link href="/">Р“Р»Р°РІРЅР°СЏ</Link>
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

