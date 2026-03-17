/**
 * Environment variable validation utility
 * Validates required environment variables at startup
 */

/**
 * Validate that required environment variables are set
 * @param {string[]} required - Array of required environment variable names
 * @throws {Error} If any required variables are missing
 */
function validateEnv(required) {
  if (!Array.isArray(required) || required.length === 0) {
    return;
  }

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    const error = new Error(
      `Missing required environment variables: ${missing.join(', ')}\n\n` +
      `Please set these variables in your .env file or environment.\n` +
      `See SETUP_SECRETS.md for more information.`
    );
    error.code = 'ENV_VALIDATION_ERROR';
    throw error;
  }
}

/**
 * Validate optional environment variables and warn if missing
 * @param {string[]} optional - Array of optional environment variable names
 */
function validateOptionalEnv(optional) {
  if (!Array.isArray(optional) || optional.length === 0) {
    return;
  }

  const missing = optional.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `⚠️  Optional environment variables not set: ${missing.join(', ')}\n` +
      `   Some features may not work correctly.`
    );
  }
}

module.exports = { validateEnv, validateOptionalEnv };
