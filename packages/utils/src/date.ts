/**
 * Date utility functions
 */

/**
 * Format a date as ISO 8601 string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parse an ISO 8601 string to Date
 */
export function parseDate(iso: string): Date {
  return new Date(iso);
}

/**
 * Human-readable time ago string
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
}
