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

  // Support both header-based (preferred) and query param (legacy) authentication
  const headerSecret = request.headers.get('x-revalidate-secret');
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get('secret');

  const secret = headerSecret || querySecret;

  if (!secret) {
    return buildJsonResponse(
      { revalidated: false, error: 'Missing secret. Provide via x-revalidate-secret header or secret query param.' },
      { status: 401 },
      rateLimit
    );
  }

  if (secret !== configuredSecret) {
    return buildJsonResponse(
      { revalidated: false, error: 'Invalid secret.' },
      { status: 401 },
      rateLimit
    );
  }

  // Warn if using deprecated query param method
  if (querySecret && !headerSecret) {
    console.warn('⚠️  Revalidation using deprecated query param method. Please use x-revalidate-secret header instead.');
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
