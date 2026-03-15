import { DeepSeekClient } from '@/utils/deepseek';
import { generateDirectionPages } from '@/data/seo-data';
import { checkRateLimit, attachRateLimitHeaders } from '@/utils/rate-limit';

const deepseek = new DeepSeekClient(process.env.DEEPSEEK_API_KEY);

export async function GET(request, { params }) {
  const rateLimit = checkRateLimit(request, {
    key: 'api-content',
    limit: 30,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return attachRateLimitHeaders(
      Response.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      ),
      rateLimit
    );
  }

  const { slug } = await params;

  try {
    // Get direction data
    const directions = generateDirectionPages();
    const direction = directions.find(d => d.slug === slug);

    if (!direction) {
      return attachRateLimitHeaders(
        Response.json({ error: 'Not found' }, { status: 404 }),
        rateLimit
      );
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return attachRateLimitHeaders(
        Response.json(
          { error: 'DEEPSEEK_API_KEY is not configured' },
          { status: 503 }
        ),
        rateLimit
      );
    }

    // Generate fresh content using AI
    const content = await deepseek.generatePageContent(
      direction.name,
      'общий',
      direction.data?.id || direction.slug
    );

    return attachRateLimitHeaders(
      Response.json({
        ...direction,
        aiContent: content,
        generated: new Date().toISOString()
      }),
      rateLimit
    );
  } catch (error) {
    return attachRateLimitHeaders(
      Response.json({
        error: error.message
      }, { status: 500 }),
      rateLimit
    );
  }
}
