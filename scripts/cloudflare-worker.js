const DEFAULT_MAIN_SITE_URL =
  process.env.MAIN_SITE_URL ||
  process.env.NEXT_PUBLIC_MAIN_SITE ||
  'https://1mb3-guide-2026.vercel.app';

const DEFAULT_WORKERS_SUBDOMAIN = 'berdniko9544';

function makeWorkerName(satelliteName) {
  const prefix = 'seo-sat-';
  const safe = String(satelliteName).toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const max = 63 - prefix.length;
  return prefix + safe.slice(0, max);
}

function getWorkersSubdomain() {
  if (process.env.CLOUDFLARE_WORKERS_SUBDOMAIN) {
    return process.env.CLOUDFLARE_WORKERS_SUBDOMAIN;
  }

  const workersBaseUrl =
    process.env.CLOUDFLARE_WORKERS_URL ||
    process.env.CLOUDFLARE_WORKERS_BASE_URL ||
    process.env.WORKERS_DEV_URL ||
    `https://seo-programmatic-main.${DEFAULT_WORKERS_SUBDOMAIN}.workers.dev`;

  const match = workersBaseUrl.match(/^https?:\/\/[^.]+\.([a-z0-9-]+)\.workers\.dev/i);
  return match?.[1] || DEFAULT_WORKERS_SUBDOMAIN;
}

function computeSatelliteRoute(satelliteName) {
  if (!process.env.SATELLITE_PARENT_DOMAIN) {
    return null;
  }

  return `${satelliteName}.${process.env.SATELLITE_PARENT_DOMAIN}/*`;
}

function computeSatellitePublicUrl(satelliteName) {
  if (process.env.SATELLITE_PARENT_DOMAIN) {
    return `https://${satelliteName}.${process.env.SATELLITE_PARENT_DOMAIN}`;
  }

  const workersSubdomain = getWorkersSubdomain();
  if (!workersSubdomain) {
    return null;
  }

  return `https://${makeWorkerName(satelliteName)}.${workersSubdomain}.workers.dev`;
}

module.exports = {
  DEFAULT_MAIN_SITE_URL,
  makeWorkerName,
  getWorkersSubdomain,
  computeSatelliteRoute,
  computeSatellitePublicUrl,
};
