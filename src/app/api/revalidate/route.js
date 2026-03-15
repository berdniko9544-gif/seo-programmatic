import { revalidatePath } from 'next/cache';
import { checkRateLimit, attachRateLimitHeaders } from '@/utils/rate-limit';
import { getRevalidationPaths } from '@/utils/revalidation';

function buildJsonResponse(payload, init, rateLimit) {
  const response = Response.json(payload, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...(init?.headers || {}),
    },
  });

  return attachRateLimitHeaders(response, rateLimit);
}

async function handleRevalidation(request) {
  const rateLimit = checkRateLimit(request, {
    key: 'api-revalidate',
    limit: 10,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return buildJsonResponse(
      { revalidated: false, error: 'Too many revalidation requests.' },
      { status: 429 },
      rateLimit
    );
  }

  const configuredSecret = process.env.REVALIDATE_SECRET;

  if (!configuredSecret) {
    return buildJsonResponse(
      { revalidated: false, error: 'REVALIDATE_SECRET is not configured.' },
      { status: 500 },
      rateLimit
    );
  }

  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== configuredSecret) {
    return buildJsonResponse(
      { revalidated: false, error: 'Invalid secret.' },
      { status: 401 },
      rateLimit
    );
  }

  const requestedPath = searchParams.get('path');
  const paths = requestedPath ? [requestedPath] : getRevalidationPaths();

  try {
    for (const path of paths) {
      revalidatePath(path);
    }

    return buildJsonResponse(
      {
        revalidated: true,
        now: Date.now(),
        paths: paths.length,
      },
      { status: 200 },
      rateLimit
    );
  } catch (error) {
    return buildJsonResponse(
      {
        revalidated: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
      rateLimit
    );
  }
}

export async function GET(request) {
  return handleRevalidation(request);
}

export async function POST(request) {
  return handleRevalidation(request);
}
