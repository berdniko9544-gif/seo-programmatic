import Link from 'next/link';

const MAIN_SITE = "https://1mb3-guide-2026.vercel.app";

export function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo">
          1MB3 <span>GUIDE</span>
        </Link>
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/napravleniya" style={{ fontSize: '14px', color: '#8b8b99' }}>Направления</Link>
          <Link href="/instrumenty" style={{ fontSize: '14px', color: '#8b8b99' }}>Инструменты</Link>
          <Link href="/blog" style={{ fontSize: '14px', color: '#8b8b99' }}>Блог</Link>
          <a href={MAIN_SITE} className="header-cta" target="_blank" rel="noopener">
            Купить гайд →
          </a>
        </nav>
      </div>
    </header>
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
            <Link href="/napravleniya/ai-voice">AI-озвучка</Link>
            <Link href="/napravleniya/ai-sites">AI-сайты</Link>
            <Link href="/napravleniya/ai-automation">AI-автоматизация</Link>
          </div>
          <div className="footer-col">
            <h4>Инструменты</h4>
            <Link href="/instrumenty/text-ai">Нейросети для текста</Link>
            <Link href="/instrumenty/image-ai">Нейросети для изображений</Link>
            <Link href="/instrumenty/video-ai">Нейросети для видео</Link>
            <Link href="/instrumenty/audio-ai">Нейросети для аудио</Link>
            <Link href="/instrumenty/automation-ai">Автоматизация</Link>
            <Link href="/instrumenty/code-ai">AI для разработки</Link>
          </div>
          <div className="footer-col">
            <h4>Блог</h4>
            <Link href="/blog/kak-zarabotat-na-neirosetiah">Как заработать на нейросетях</Link>
            <Link href="/blog/zarabotok-na-chatgpt">Заработок на ChatGPT</Link>
            <Link href="/blog/zarabotok-na-midjourney">Заработок на Midjourney</Link>
            <Link href="/blog/luchshie-neiroset-dlya-zarabotka">Лучшие нейросети</Link>
            <Link href="/blog/pervyy-zakazchik-za-7-dney">Первый заказчик за 7 дней</Link>
          </div>
          <div className="footer-col">
            <h4>О проекте</h4>
            <a href="https://t.me/Inside1mb3" target="_blank" rel="noopener">Telegram @Inside1mb3</a>
            <a href="https://www.instagram.com/inside1mb3" target="_blank" rel="noopener">Instagram</a>
            <a href={MAIN_SITE} target="_blank" rel="noopener">Купить гайд</a>
            <Link href="/dlya/freelancer">Для фрилансеров</Link>
            <Link href="/dlya/business">Для предпринимателей</Link>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 1MB3. Все материалы защищены. Гайд является цифровым продуктом.
          <br />
          <Link href={`${MAIN_SITE}/legal/offer`}>Оферта</Link> · <Link href={`${MAIN_SITE}/legal/privacy`}>Конфиденциальность</Link>
        </div>
      </div>
    </footer>
  );
}

export function CtaBlock({ variant = 'default' }) {
  return (
    <div className="cta-block">
      <h2>Забирайте гайд и начинайте зарабатывать</h2>
      <p>12 направлений · 200+ инструментов · План на 30 дней · PDF + шаблоны</p>
      <div className="price-row">
        <span className="price-old">₽ 3 990</span>
        <span className="price-new">₽ 1 990</span>
      </div>
      <a href={MAIN_SITE + "#offer"} className="cta-btn" target="_blank" rel="noopener">
        Купить гайд — ₽ 1 990 →
      </a>
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs container" aria-label="Навигация">
      <Link href="/">Главная</Link>
      {items.map((item, i) => (
        <span key={i}>
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
  return (
    <div className="internal-links">
      {links.map((link, i) => (
        <Link key={i} href={link.href}>{link.label}</Link>
      ))}
    </div>
  );
}
