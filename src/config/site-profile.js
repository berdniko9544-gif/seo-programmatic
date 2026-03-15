const { SITE_VERTICAL } = require('./site');
const { TEMPLATE_FAMILIES, getSemanticBlueprint } = require('../utils/site-network-config');

const familyId = process.env.NEXT_PUBLIC_TEMPLATE_FAMILY || 'signal';
const family = TEMPLATE_FAMILIES[familyId] || TEMPLATE_FAMILIES.signal;
const blueprint = getSemanticBlueprint(SITE_VERTICAL);

const siteProfile = {
  ...family,
  vertical: SITE_VERTICAL,
  nicheLabel: blueprint.label,
  semanticPillars: blueprint.seedKeywords.slice(0, 4),
  mainSiteLinks: blueprint.mainSiteLinks,
};

module.exports = {
  TEMPLATE_FAMILIES,
  siteProfile,
};
