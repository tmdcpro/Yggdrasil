/**
 * Extraction Service
 *
 * Handles web scraping, content extraction, and metadata gathering.
 * MVP: Basic URL metadata extraction using fetch + HTML parsing.
 * Phase 2: Playwright/Browserless integration for JS-rendered pages,
 *          platform-specific extractors (YouTube, GitHub, Twitter).
 */

import express, { Express } from 'express';

const app: Express = express();
app.use(express.json());

const PORT = process.env.EXTRACTION_PORT || 5001;

/**
 * Health check
 */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'extraction', version: '0.1.0' });
});

/**
 * Extract metadata from a URL
 */
app.post('/extract/url', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  try {
    const metadata = await extractUrlMetadata(url);
    res.json({ success: true, metadata });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Extraction failed';
    res.status(500).json({ success: false, error: message });
  }
});

/**
 * Extract content from HTML
 */
app.post('/extract/html', (req, res) => {
  const { html, url } = req.body;

  if (!html) {
    res.status(400).json({ error: 'HTML content is required' });
    return;
  }

  const metadata = parseHtmlMetadata(html, url);
  res.json({ success: true, metadata });
});

/**
 * Validate URL to prevent SSRF attacks.
 * Blocks localhost, private networks, and non-http(s) schemes.
 */
function validateUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid URL');
  }

  // Only allow http and https schemes
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`Unsupported protocol: ${parsed.protocol}`);
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost variants
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.localhost')
  ) {
    throw new Error('Requests to localhost are not allowed');
  }

  // Block private/internal network ranges
  const privatePatterns = [
    /^10\./,           // 10.0.0.0/8
    /^172\.(1[6-9]|2\d|3[01])\./, // 172.16.0.0/12
    /^192\.168\./,     // 192.168.0.0/16
    /^169\.254\./,     // Link-local
    /^0\./,            // 0.0.0.0/8
  ];

  if (privatePatterns.some((p) => p.test(hostname))) {
    throw new Error('Requests to private networks are not allowed');
  }
}

/**
 * Basic URL metadata extraction via fetch
 */
async function extractUrlMetadata(url: string, depth = 0): Promise<Record<string, unknown>> {
  if (depth > 5) {
    throw new Error('Too many redirects');
  }

  validateUrl(url);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Yggdrasil/0.1.0 (Knowledge Graph Studio)',
    },
    signal: AbortSignal.timeout(15000),
    redirect: 'manual',
  });

  // Handle redirects manually to prevent SSRF via redirect
  if ([301, 302, 303, 307, 308].includes(response.status)) {
    const location = response.headers.get('location');
    if (location) {
      const redirectUrl = new URL(location, url).href;
      validateUrl(redirectUrl);
      return extractUrlMetadata(redirectUrl, depth + 1);
    }
    throw new Error('Redirect with no location header');
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const html = await response.text();

  if (contentType.includes('text/html')) {
    return parseHtmlMetadata(html, url);
  }

  return {
    url,
    contentType,
    title: url,
    description: `${contentType} resource`,
  };
}

/**
 * Parse metadata from HTML string using regex (MVP - no DOM parser dependency)
 */
function parseHtmlMetadata(html: string, url?: string) {
  const getTag = (pattern: RegExp): string | undefined => {
    const match = html.match(pattern);
    return match ? decodeHtmlEntities(match[1].trim()) : undefined;
  };

  const title =
    getTag(/<title[^>]*>([^<]+)<\/title>/i) ||
    getTag(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i) ||
    getTag(/<meta[^>]+name="title"[^>]+content="([^"]+)"/i);

  const description =
    getTag(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) ||
    getTag(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i);

  const author =
    getTag(/<meta[^>]+name="author"[^>]+content="([^"]+)"/i) ||
    getTag(/<meta[^>]+property="article:author"[^>]+content="([^"]+)"/i);

  const ogImage = getTag(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
  const ogType = getTag(/<meta[^>]+property="og:type"[^>]+content="([^"]+)"/i);
  const siteName = getTag(/<meta[^>]+property="og:site_name"[^>]+content="([^"]+)"/i);
  const publishedDate =
    getTag(/<meta[^>]+property="article:published_time"[^>]+content="([^"]+)"/i) ||
    getTag(/<meta[^>]+name="date"[^>]+content="([^"]+)"/i);

  const keywords = getTag(/<meta[^>]+name="keywords"[^>]+content="([^"]+)"/i);
  const language = getTag(/<html[^>]+lang="([^"]+)"/i);

  const canonicalMatch = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : undefined;

  const faviconMatch = html.match(/<link[^>]+rel="(?:icon|shortcut icon)"[^>]+href="([^"]+)"/i);
  let favicon = faviconMatch ? faviconMatch[1] : undefined;
  if (favicon && url && !favicon.startsWith('http')) {
    try {
      favicon = new URL(favicon, url).href;
    } catch {
      // Keep as-is
    }
  }

  return {
    url,
    title,
    description,
    author,
    ogImage,
    ogType,
    siteName,
    publishedDate,
    keywords: keywords ? keywords.split(',').map((k: string) => k.trim()) : undefined,
    language,
    canonicalUrl: canonical,
    favicon,
  };
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'");
}

app.listen(PORT, () => {
  console.log(`Extraction service running on http://localhost:${PORT}`);
});

export { app };
