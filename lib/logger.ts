/**
 * Production-safe logger for StudySpace
 * Logs are suppressed in production environment except for warnings and errors
 */

const isDev = process.env.NODE_ENV !== "production";

export const logger = {
  /**
   * Log general information (dev only)
   */
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },

  /**
   * Log informational messages (dev only)
   */
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args);
  },

  /**
   * Log warnings (always shown)
   */
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },

  /**
   * Log errors (always shown)
   */
  error: (...args: unknown[]) => {
    console.error(...args);
  },

  /**
   * Log debug information (dev only)
   */
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args);
  },
};

export default logger;
