const CONTENT_PUBLISHED_AT =
  process.env.NEXT_PUBLIC_CONTENT_PUBLISHED_AT || '2026-02-14T00:00:00.000Z';
const CONTENT_UPDATED_AT =
  process.env.NEXT_PUBLIC_CONTENT_UPDATED_AT || new Date().toISOString();

const RU_MONTHS = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

function normalizeDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(CONTENT_UPDATED_AT) : date;
}

function getContentDates(overrides = {}) {
  return {
    publishedAt: overrides.publishedAt || CONTENT_PUBLISHED_AT,
    updatedAt: overrides.updatedAt || CONTENT_UPDATED_AT,
  };
}

function getContentMonthLabel(value = CONTENT_UPDATED_AT) {
  const date = normalizeDate(value);
  return `${RU_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

module.exports = {
  CONTENT_PUBLISHED_AT,
  CONTENT_UPDATED_AT,
  CONTENT_UPDATED_LABEL: getContentMonthLabel(CONTENT_UPDATED_AT),
  getContentDates,
  getContentMonthLabel,
};
