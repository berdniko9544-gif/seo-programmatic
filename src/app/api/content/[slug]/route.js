import { DeepSeekClient } from '@/utils/deepseek';
import { generateDirectionPages } from '@/data/seo-data';

const deepseek = new DeepSeekClient(process.env.DEEPSEEK_API_KEY);

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    // Get direction data
    const directions = generateDirectionPages();
    const direction = directions.find(d => d.slug === slug);

    if (!direction) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    // Generate fresh content using AI
    const content = await deepseek.generatePageContent(
      direction.name,
      'общий',
      direction.id
    );

    return Response.json({
      ...direction,
      aiContent: content,
      generated: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({
      error: error.message
    }, { status: 500 });
  }
}
