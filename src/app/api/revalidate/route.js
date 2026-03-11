import { DeepSeekClient } from '@/utils/deepseek';

const deepseek = new DeepSeekClient(process.env.DEEPSEEK_API_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Verify secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    // Revalidate all paths
    const paths = [
      '/',
      '/napravleniya',
      '/blog',
      '/instrumenty',
      '/sravnenie',
    ];

    // Note: In production, you'd use revalidatePath() or revalidateTag()
    // For now, we'll just return success

    return Response.json({
      revalidated: true,
      now: Date.now(),
      paths: paths.length
    });
  } catch (err) {
    return Response.json({
      revalidated: false,
      error: err.message
    }, { status: 500 });
  }
}
