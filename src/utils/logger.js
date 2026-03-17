/**
 * STRUCTURED LOGGER
 * Provides structured JSON logging for better observability
 */

class Logger {
  constructor(context = {}) {
    this.context = context;
  }

  /**
   * Log a message with structured data
   * @param {string} level - Log level (info, warn, error, debug)
   * @param {string} message - Log message
   * @param {object} data - Additional structured data
   */
  log(level, message, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...data
    };

    // Output as JSON for log aggregation tools
    console.log(JSON.stringify(entry));
  }

  /**
   * Log info message
   */
  info(message, data = {}) {
    this.log('info', message, data);
  }

  /**
   * Log warning message
   */
  warn(message, data = {}) {
    this.log('warn', message, data);
  }

  /**
   * Log error message
   */
  error(message, data = {}) {
    // Include error stack if available
    if (data.error instanceof Error) {
      data.errorMessage = data.error.message;
      data.errorStack = data.error.stack;
      delete data.error; // Remove non-serializable Error object
    }
    this.log('error', message, data);
  }

  /**
   * Log debug message
   */
  debug(message, data = {}) {
    if (process.env.DEBUG) {
      this.log('debug', message, data);
    }
  }

  /**
   * Create child logger with additional context
   */
  child(additionalContext = {}) {
    return new Logger({
      ...this.context,
      ...additionalContext
    });
  }

  /**
   * Log with custom level
   */
  custom(level, message, data = {}) {
    this.log(level, message, data);
  }
}

/**
 * Create a logger instance
 * @param {object} context - Initial context for all log entries
 * @returns {Logger} Logger instance
 */
function createLogger(context = {}) {
  return new Logger(context);
}

module.exports = {
  Logger,
  createLogger
};
