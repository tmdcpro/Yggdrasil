/**
 * Yggdrasil Capture - Content Script
 *
 * Runs on every page to:
 * 1. Extract page metadata and context when requested by background script
 * 2. Show visual feedback when captures succeed/fail
 */

// ── Message Handler ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getPageContext') {
    const context = extractPageContext(message.captureType, message.info);
    sendResponse(context);
    return true;
  }

  if (message.action === 'captureSuccess') {
    showCaptureIndicator('success', message.result);
    return;
  }

  if (message.action === 'captureFailed') {
    showCaptureIndicator('error', message.error);
    return;
  }
});

// ── Page Context Extraction ─────────────────────────────────────────────────

function extractPageContext(captureType, info) {
  const context = {
    meta: extractPageMeta(),
    surroundingText: null,
    elementPath: null,
  };

  // Get surrounding text for text selections
  if (captureType === 'text' && window.getSelection) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      context.surroundingText = getSurroundingText(range);
      context.elementPath = getElementPath(range.startContainer.parentElement);
    }
  }

  return context;
}

/**
 * Extract metadata from page meta tags, Open Graph, JSON-LD, etc.
 */
function extractPageMeta() {
  const meta = {};

  // Basic meta tags
  meta.title = document.title;
  meta.description = getMetaContent('description');
  meta.author = getMetaContent('author');
  meta.keywords = getMetaContent('keywords')
    ? getMetaContent('keywords').split(',').map((k) => k.trim())
    : undefined;

  // Open Graph
  meta.ogTitle = getMetaProperty('og:title');
  meta.ogDescription = getMetaProperty('og:description');
  meta.ogImage = getMetaProperty('og:image');
  meta.ogType = getMetaProperty('og:type');
  meta.siteName = getMetaProperty('og:site_name');

  // Twitter Card
  meta.twitterTitle = getMetaContent('twitter:title');
  meta.twitterDescription = getMetaContent('twitter:description');
  meta.twitterImage = getMetaContent('twitter:image');

  // Canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    meta.canonicalUrl = canonical.getAttribute('href');
  }

  // Favicon
  const favicon =
    document.querySelector('link[rel="icon"]') ||
    document.querySelector('link[rel="shortcut icon"]');
  if (favicon) {
    meta.favicon = favicon.getAttribute('href');
    // Make absolute URL if relative
    if (meta.favicon && !meta.favicon.startsWith('http')) {
      meta.favicon = new URL(meta.favicon, window.location.origin).href;
    }
  }

  // Published date (various formats)
  meta.publishedDate =
    getMetaContent('article:published_time') ||
    getMetaProperty('article:published_time') ||
    getMetaContent('date') ||
    getMetaContent('DC.date');

  // Language
  meta.language = document.documentElement.lang || getMetaContent('language');

  return meta;
}

function getMetaContent(name) {
  const el = document.querySelector(`meta[name="${name}"]`);
  return el ? el.getAttribute('content') : undefined;
}

function getMetaProperty(property) {
  const el = document.querySelector(`meta[property="${property}"]`);
  return el ? el.getAttribute('content') : undefined;
}

/**
 * Get text surrounding a selection for context
 */
function getSurroundingText(range) {
  const container = range.startContainer.parentElement;
  if (!container) return null;

  // Get the parent paragraph or block element
  let block = container;
  const blockTags = ['P', 'DIV', 'ARTICLE', 'SECTION', 'LI', 'BLOCKQUOTE', 'TD', 'PRE'];
  while (block && !blockTags.includes(block.tagName)) {
    block = block.parentElement;
  }

  if (block) {
    const text = block.textContent || '';
    // Return up to 500 chars of surrounding context
    if (text.length <= 500) return text;
    return text.substring(0, 500) + '...';
  }

  return null;
}

/**
 * Get CSS selector path to an element
 */
function getElementPath(element) {
  if (!element) return null;

  const parts = [];
  let current = element;
  let depth = 0;

  while (current && current !== document.body && depth < 5) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += `#${current.id}`;
    } else if (current.className && typeof current.className === 'string') {
      const classes = current.className.trim().split(/\s+/).slice(0, 2).join('.');
      if (classes) selector += `.${classes}`;
    }
    parts.unshift(selector);
    current = current.parentElement;
    depth++;
  }

  return parts.join(' > ');
}

// ── Visual Feedback ─────────────────────────────────────────────────────────

function showCaptureIndicator(type, data) {
  // Remove any existing indicator
  const existing = document.getElementById('yggdrasil-capture-indicator');
  if (existing) existing.remove();

  const indicator = document.createElement('div');
  indicator.id = 'yggdrasil-capture-indicator';
  indicator.className = `yggdrasil-indicator yggdrasil-indicator--${type}`;

  if (type === 'success') {
    const title = data?.result?.node?.title || 'Content captured';
    const tagCount = data?.result?.node?.tags?.length || 0;
    indicator.innerHTML = `
      <div class="yggdrasil-indicator__icon">&#10003;</div>
      <div class="yggdrasil-indicator__text">
        <strong>Saved to Yggdrasil</strong>
        <span>${title}${tagCount > 0 ? ` (${tagCount} tags)` : ''}</span>
      </div>
    `;
  } else {
    indicator.innerHTML = `
      <div class="yggdrasil-indicator__icon">&#10007;</div>
      <div class="yggdrasil-indicator__text">
        <strong>Capture Failed</strong>
        <span>${typeof data === 'string' ? data : 'Please try again'}</span>
      </div>
    `;
  }

  document.body.appendChild(indicator);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    indicator.classList.add('yggdrasil-indicator--fade');
    setTimeout(() => indicator.remove(), 300);
  }, 3000);
}
