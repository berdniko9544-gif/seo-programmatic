import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer, CtaBlock, Breadcrumbs, PageJsonLd, InternalLinks } from '@/components/shared';
import { directions, generateHowToPages } from '@/data/seo-data';
import { SITE_URL, MAIN_SITE_URL } from '@/config/site';
import { getContentDates, CONTENT_UPDATED_LABEL } from '@/config/content';

const howToPages = generateHowToPages();

// Content for each article
const articleContent = {
  "kak-zarabotat-na-neirosetiah": {
    intro: "Нейросети перевернули рынок фриланса и digital-услуг. В 2026 году AI — это не просто тренд, а рабочий инструмент для заработка. В этой статье разбираем 12 реальных направлений монетизации AI с конкретными цифрами.",
    sections: [
      { title: "Почему 2026 — лучшее время для старта", content: "Качество AI-инструментов достигло коммерческого уровня. Бизнес активно ищет специалистов, которые умеют работать с нейросетями. При этом конкуренция пока относительно низкая — большинство людей только присматриваются к этой теме." },
      { title: "12 направлений монетизации", content: "Основные направления: AI-фото для бизнеса, AI-копирайтинг, чат-боты и автоматизация, AI-видео, AI-дизайн, AI-озвучка, инфопродукты, AI-маркетинг, создание сайтов, аналитика данных, переводы и автоматизация процессов." },
      { title: "С чего начать", content: "Выберите одно направление, которое ближе к вашим навыкам. Изучите 2–3 основных инструмента. Создайте портфолио из 3–5 работ. Начните поиск клиентов. Весь этот процесс подробно описан в гайде 1MB3 с чек-листами и шаблонами." },
      { title: "Реальные цифры дохода", content: "AI-фото: от 5 000 ₽/проект. AI-копирайтинг: от 3 000 ₽/проект. Чат-боты: от 10 000 ₽/проект. AI-автоматизация: от 30 000 ₽/проект. Средний опытный специалист зарабатывает от 80 000 до 200 000 ₽/мес." },
    ]
  },
  "zarabotok-na-chatgpt": {
    intro: "ChatGPT — самая популярная нейросеть в мире с сотнями миллионов пользователей. Но мало кто использует её для заработка. Разбираем 10 рабочих способов монетизации ChatGPT в 2026 году.",
    sections: [
      { title: "Копирайтинг и контент", content: "Писать тексты с ChatGPT в 5–10 раз быстрее. Это значит: больше заказов, выше доход. Оптимально для SEO-статей, постов в соцсети, email-рассылок, карточек для маркетплейсов." },
      { title: "Чат-боты на базе GPT", content: "Создание Telegram-ботов и виджетов для сайтов на базе API ChatGPT — востребованная услуга. Средний чек: от 10 000 ₽ за простого бота до 100 000 ₽ за бота с интеграциями." },
      { title: "Аналитика и отчёты", content: "ChatGPT Code Interpreter анализирует данные, строит графики, делает выводы. Предлагайте бизнесу услугу AI-аналитики — это экономит компаниям десятки часов." },
      { title: "Обучение и консалтинг", content: "Научитесь эффективно использовать ChatGPT — и обучайте других. Вебинары, гайды, корпоративные тренинги для бизнеса: средний чек от 15 000 ₽." },
    ]
  },
  "zarabotok-na-midjourney": {
    intro: "Midjourney генерирует изображения, которые невозможно отличить от работы профессионального дизайнера. Это открывает множество возможностей для заработка — от фото для маркетплейсов до брендинга.",
    sections: [
      { title: "Фото для маркетплейсов", content: "Wildberries, Ozon, Яндекс.Маркет — селлерам нужны качественные фото товаров. AI-фото стоит дешевле студийной съёмки, а результат часто даже лучше. Средний чек: 5 000–15 000 ₽ за комплект." },
      { title: "Дизайн и брендинг", content: "Логотипы, фирменный стиль, иллюстрации, обложки — Midjourney ускоряет процесс в разы. Дизайнеры, освоившие AI, зарабатывают значительно больше за счёт увеличения количества проектов." },
      { title: "Контент для соцсетей", content: "Уникальные визуалы для Instagram, VK, Telegram — то, за что бизнес готов платить. Абонентское обслуживание: от 15 000 ₽/мес за 30 изображений." },
      { title: "Принты и мерч", content: "Создавайте дизайны для футболок, кружек, постеров и продавайте через print-on-demand сервисы. Пассивный доход после начальной настройки." },
    ]
  },
};

// Default content for articles without specific content
const defaultContent = {
  intro: "Подробный разбор темы с практическими рекомендациями и инструментами. Основано на опыте 1200+ покупателей гайда 1MB3.",
  sections: [
    { title: "Почему это важно в 2026", content: "AI-инструменты развиваются стремительно, открывая новые возможности для заработка. Те, кто начинают сейчас, получают преимущество первопроходцев на быстрорастущем рынке." },
    { title: "Как начать", content: "Выберите конкретное направление. Освойте 2–3 ключевых инструмента. Создайте портфолио. Найдите первых клиентов. Подробный план на 30 дней — в гайде 1MB3." },
    { title: "Инструменты и ресурсы", content: "В каталоге гайда — 200+ нейросетей и сервисов с ценами, описаниями и рекомендациями по использованию для каждого направления." },
  ]
};

export async function generateStaticParams() {
  return howToPages.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = howToPages.find(p => p.slug === slug);
  if (!page) return {};
  const { publishedAt, updatedAt } = getContentDates({
    publishedAt: page.publishedAt,
    updatedAt: page.updatedAt,
  });

  return {
    title: page.title.replace(' | 1MB3', ''),
    description: page.description,
    alternates: { canonical: `${SITE_URL}/blog/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      authors: ['1MB3'],
    },
  };
}

export default async function BlogArticle({ params }) {
  const { slug } = await params;
  const page = howToPages.find(p => p.slug === slug);
  if (!page) return notFound();

  const content = articleContent[slug] || defaultContent;
  const otherArticles = howToPages.filter(p => p.slug !== slug).slice(0, 6);
  const { publishedAt, updatedAt } = getContentDates({
    publishedAt: page.publishedAt,
    updatedAt: page.updatedAt,
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.h1,
    "description": page.description,
    "author": { "@type": "Organization", "name": "1MB3", "url": MAIN_SITE_URL },
    "publisher": { "@type": "Organization", "name": "1MB3" },
    "datePublished": publishedAt,
    "dateModified": updatedAt,
    "mainEntityOfPage": `${SITE_URL}/blog/${page.slug}`,
  };

  return (
    <>
      <PageJsonLd data={schema} />
      <Header />
      <Breadcrumbs items={[
        { label: 'Блог', href: '/blog' },
        { label: page.h1 }
      ]} />

      <section className="hero">
        <div className="container">
          <h1>{page.h1}</h1>
          <p>{page.description}</p>
          <div style={{ fontSize: '13px', color: '#8b8b99', marginTop: '12px' }}>
            Автор: 1MB3 · Обновлено: {CONTENT_UPDATED_LABEL} · {page.readTime || '5 мин'}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="article-content">
            <p><strong>{content.intro}</strong></p>

            {content.sections.map((s, i) => (
              <div key={i}>
                <h2>{s.title}</h2>
                <p>{s.content}</p>
              </div>
            ))}

            <h2>12 направлений заработка на AI</h2>
            <InternalLinks links={directions.map(d => ({
              href: `/napravleniya/${d.id}`,
              label: `${d.icon} ${d.nameShort}`
            }))} />

            <CtaBlock />

            <h2>Читайте также</h2>
            <InternalLinks links={otherArticles.map(a => ({
              href: `/blog/${a.slug}`,
              label: a.h1
            }))} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
