function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getFreshnessBadgeText(markup) {
  const text = stripHtml(markup || '');
  return text || null;
}

module.exports = {
  stripHtml,
  getFreshnessBadgeText,
};
