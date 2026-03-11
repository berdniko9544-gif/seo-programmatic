import Link from 'next/link';
import { Header, Footer } from '@/components/shared';

export const metadata = {
  title: 'Страница не найдена — 404 | 1MB3',
  description: 'Запрашиваемая страница не найдена. Вернитесь на главную или выберите раздел.',
};

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="hero" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '120px', fontWeight: '900', color: 'var(--accent)', marginBottom: '24px' }}>
            404
          </div>
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Страница не найдена</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="cta-btn">
              На главную →
            </Link>
            <Link href="/napravleniya" className="cta-btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              Направления
            </Link>
            <Link href="/blog" className="cta-btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              Блог
            </Link>
          </div>

          <div style={{ marginTop: '64px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Популярные разделы</h2>
            <div className="cards-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <Link href="/napravleniya/ai-photo" style={{ textDecoration: 'none' }}>
                <div className="card">
                  <span className="card-icon">📸</span>
                  <h3>AI-фото для бизнеса</h3>
                  <p>Генерация фотографий товаров и контента</p>
                </div>
              </Link>
              <Link href="/napravleniya/ai-copywriting" style={{ textDecoration: 'none' }}>
                <div className="card">
                  <span className="card-icon">✍️</span>
                  <h3>AI-копирайтинг</h3>
                  <p>Написание текстов с помощью GPT</p>
                </div>
              </Link>
              <Link href="/napravleniya/ai-bots" style={{ textDecoration: 'none' }}>
                <div className="card">
                  <span className="card-icon">🤖</span>
                  <h3>AI-боты</h3>
                  <p>Создание чат-ботов и автоматизация</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
