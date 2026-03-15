const stores = globalThis.__seoProgrammaticRateLimitStores || new Map();

if (!globalThis.__seoProgrammaticRateLimitStores) {
  globalThis.__seoProgrammaticRateLimitStores = stores;
}

function getClientAddress(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

function cleanupExpiredEntries(store, now) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime <= now) {
      store.delete(key);
    }
  }
}

function checkRateLimit(
  request,
  { key = 'global', limit = 60, windowMs = 60_000 } = {}
) {
  const now = Date.now();
  const identifier = `${key}:${getClientAddress(request)}`;
  const scopedStore = stores.get(key) || new Map();

  stores.set(key, scopedStore);
  cleanupExpiredEntries(scopedStore, now);

  const entry = scopedStore.get(identifier);

  if (!entry) {
    const resetTime = now + windowMs;
    scopedStore.set(identifier, { count: 1, resetTime });

    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetTime,
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  entry.count += 1;
  scopedStore.set(identifier, entry);

  return {
    allowed: true,
    limit,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

function attachRateLimitHeaders(response, rateLimit) {
  response.headers.set('X-RateLimit-Limit', String(rateLimit.limit));
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  response.headers.set(
    'X-RateLimit-Reset',
    new Date(rateLimit.resetTime).toISOString()
  );

  if (!rateLimit.allowed) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
    );
    response.headers.set('Retry-After', String(retryAfterSeconds));
  }

  return response;
}

module.exports = {
  checkRateLimit,
  attachRateLimitHeaders,
};
