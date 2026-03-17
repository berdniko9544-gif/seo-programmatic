import { Header, Footer } from '@/components/shared';
import { SITE_URL } from '@/config/site';

export const metadata = {
  title: 'Наши Проекты - AI Сателлиты | Zarabotok-na-AI',
  description: 'Сеть специализированных сайтов о заработке с помощью искусственного интеллекта. Копирайтинг, дизайн, автоматизация, маркетинг, видео, бизнес, фриланс, обучение.',
  alternates: {
    canonical: `${SITE_URL}/projects`,
  },
  openGraph: {
    title: 'Наши Проекты - AI Сателлиты',
    description: 'Сеть специализированных сайтов о заработке с помощью искусственного интеллекта',
  }
};

const SATELLITES = [
  {
    niche: 'AI Копирайтинг',
    description: 'Заработок на создании текстов с помощью ИИ',
    urls: [
      'https://seo-sat-ai-copywriting-1773660281654-0-l3ot5mmhp.vercel.app',
      'https://seo-sat-ai-copywriting-1773660748483-0-6r6obs0rl.vercel.app',
      'https://seo-sat-ai-copywriting-1773660984985-8-gxxxb6610.vercel.app',
      'https://seo-sat-ai-copywriting-1773661238954-16-e23yto7sr.vercel.app',
      'https://seo-sat-demo-copywriting-sat-001-9jmu0tzmz.vercel.app'
    ]
  },
  {
    niche: 'AI Дизайн',
    description: 'Заработок на графическом дизайне с помощью ИИ',
    urls: [
      'https://seo-sat-ai-design-1773660308409-1-goa960opa.vercel.app',
      'https://seo-sat-ai-design-1773660776147-1-mjixykala.vercel.app',
      'https://seo-sat-ai-design-1773661013814-9-7d8je3oa2.vercel.app',
      'https://seo-sat-ai-design-1773661272900-17-e4jlunbsu.vercel.app'
    ]
  },
  {
    niche: 'AI Автоматизация',
    description: 'Заработок на автоматизации процессов с помощью ИИ',
    urls: [
      'https://seo-sat-ai-automation-1773660334758-2-iter1mnxo.vercel.app',
      'https://seo-sat-ai-automation-1773660805570-2-dl1wxdjlk.vercel.app',
      'https://seo-sat-ai-automation-1773661046696-10-7be5dvaun.vercel.app',
      'https://seo-sat-ai-automation-1773661303738-18-9jxkkfjy5.vercel.app'
    ]
  },
  {
    niche: 'AI Маркетинг',
    description: 'Заработок на маркетинге с помощью ИИ',
    urls: [
      'https://seo-sat-ai-marketing-1773660364510-3-hdccikf2l.vercel.app',
      'https://seo-sat-ai-marketing-1773660835352-3-ab8bh620w.vercel.app',
      'https://seo-sat-ai-marketing-1773661078429-11-7me7gn88f.vercel.app',
      'https://seo-sat-ai-marketing-1773661333363-19-46j2mkeyi.vercel.app'
    ]
  },
  {
    niche: 'AI Видео',
    description: 'Заработок на создании видео с помощью ИИ',
    urls: [
      'https://seo-sat-ai-video-1773660397611-4-hu32kaw8i.vercel.app',
      'https://seo-sat-ai-video-1773660865519-4-92xahpbdt.vercel.app',
      'https://seo-sat-ai-video-1773661110424-12-6a44nn3vo.vercel.app'
    ]
  },
  {
    niche: 'AI Бизнес',
    description: 'Заработок на бизнес-решениях с помощью ИИ',
    urls: [
      'https://seo-sat-ai-business-1773660894098-5-hxmd5yk8s.vercel.app',
      'https://seo-sat-ai-business-1773661142437-13-hlyz4f7e2.vercel.app'
    ]
  },
  {
    niche: 'AI Фриланс',
    description: 'Заработок на фрилансе с помощью ИИ',
    urls: [
      'https://seo-sat-ai-freelance-1773660924533-6-9fwthuz5p.vercel.app',
      'https://seo-sat-ai-freelance-1773661174591-14-chaokk34s.vercel.app'
    ]
  },
  {
    niche: 'AI Обучение',
    description: 'Заработок на обучении с помощью ИИ',
    urls: [
      'https://seo-sat-ai-education-1773660955280-7-i53rb2kmq.vercel.app',
      'https://seo-sat-ai-education-1773661207806-15-48zzzp5cr.vercel.app'
    ]
  }
];

export default function ProjectsPage() {
  const totalSatellites = SATELLITES.reduce((sum, cat) => sum + cat.urls.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Наши Проекты</h1>
          <p className="text-xl text-gray-600 mb-8">
            Сеть из {totalSatellites} специализированных сайтов о заработке с помощью искусственного интеллекта
          </p>

          <div className="space-y-8">
            {SATELLITES.map((category, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-2">{category.niche}</h2>
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                <div className="space-y-2">
                  {category.urls.map((url, urlIdx) => (
                    <a
                      key={urlIdx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 hover:bg-blue-50 rounded border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <span className="text-blue-600 hover:text-blue-800 break-all">
                        {url}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-bold mb-2">О Сети Сателлитов</h3>
            <p className="text-gray-700 mb-4">
              Каждый сайт специализируется на конкретной нише заработка с помощью ИИ. 
              Все сайты связаны между собой и регулярно обновляются свежим контентом.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>1000+ страниц на каждом сайте</li>
              <li>Автоматическое обновление контента каждую неделю</li>
              <li>Мгновенная индексация через IndexNow API</li>
              <li>Перекрестные ссылки между сайтами</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
