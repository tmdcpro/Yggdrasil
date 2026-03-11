/**
 * Yggdrasil Capture - Background Service Worker
 *
 * Handles context menu creation and capture orchestration.
 * Communicates with the content script for page data extraction
 * and sends captures to the Yggdrasil backend API.
 */

const API_BASE = 'http://localhost:5000/api';

// ── Context Menu Setup ──────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  // Parent menu item
  chrome.contextMenus.create({
    id: 'yggdrasil-capture',
    title: 'Save to Yggdrasil',
    contexts: ['all'],
  });

  // Sub-menu items for specific capture types
  chrome.contextMenus.create({
    id: 'yggdrasil-capture-page',
    parentId: 'yggdrasil-capture',
    title: 'Save This Page',
    contexts: ['page'],
  });

  chrome.contextMenus.create({
    id: 'yggdrasil-capture-selection',
    parentId: 'yggdrasil-capture',
    title: 'Save Selection',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'yggdrasil-capture-link',
    parentId: 'yggdrasil-capture',
    title: 'Save Link',
    contexts: ['link'],
  });

  chrome.contextMenus.create({
    id: 'yggdrasil-capture-image',
    parentId: 'yggdrasil-capture',
    title: 'Save Image',
    contexts: ['image'],
  });

  chrome.contextMenus.create({
    id: 'yggdrasil-capture-video',
    parentId: 'yggdrasil-capture',
    title: 'Save Video',
    contexts: ['video'],
  });

  chrome.contextMenus.create({
    id: 'yggdrasil-capture-auto',
    parentId: 'yggdrasil-capture',
    title: 'Smart Capture (AI Detect)',
    contexts: ['all'],
  });

  console.log('[Yggdrasil] Context menus created');
});

// ── Context Menu Click Handler ──────────────────────────────────────────────

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!info.menuItemId.toString().startsWith('yggdrasil-capture')) return;
  if (!tab?.id) return;

  const captureType = getCaptureType(info.menuItemId.toString(), info);

  try {
    // Ask content script to gather page context
    const context = await chrome.tabs.sendMessage(tab.id, {
      action: 'getPageContext',
      captureType,
      info: {
        selectionText: info.selectionText,
        linkUrl: info.linkUrl,
        srcUrl: info.srcUrl,
        mediaType: info.mediaType,
        pageUrl: info.pageUrl || tab.url,
      },
    });

    const payload = buildCapturePayload(captureType, info, tab, context);

    // Send to backend
    const result = await sendCapture(payload);

    if (result.success) {
      // Notify user of successful capture
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Saved to Yggdrasil',
        message: `Captured: ${result.result?.node?.title || 'Content saved'}`,
      });

      // Tell content script to show success indicator
      chrome.tabs.sendMessage(tab.id, {
        action: 'captureSuccess',
        result,
      });
    } else {
      throw new Error(result.error || 'Capture failed');
    }
  } catch (error) {
    console.error('[Yggdrasil] Capture failed:', error);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Capture Failed',
      message: error.message || 'Failed to save to Yggdrasil',
    });
  }
});

// ── Helper Functions ────────────────────────────────────────────────────────

function getCaptureType(menuItemId, info) {
  switch (menuItemId) {
    case 'yggdrasil-capture-page':
      return 'url';
    case 'yggdrasil-capture-selection':
      return 'text';
    case 'yggdrasil-capture-link':
      return 'link';
    case 'yggdrasil-capture-image':
      return 'image';
    case 'yggdrasil-capture-video':
      return 'video';
    case 'yggdrasil-capture-auto':
      // Auto-detect based on context
      if (info.selectionText) return 'text';
      if (info.srcUrl && info.mediaType === 'image') return 'image';
      if (info.srcUrl && info.mediaType === 'video') return 'video';
      if (info.linkUrl) return 'link';
      return 'url';
    default:
      return 'url';
  }
}

function buildCapturePayload(captureType, info, tab, pageContext) {
  const content = getContent(captureType, info);

  return {
    captureType,
    content,
    sourceUrl: info.pageUrl || tab.url || '',
    sourceTitle: tab.title || '',
    capturedAt: new Date().toISOString(),
    context: {
      selectedText: info.selectionText || undefined,
      linkUrl: info.linkUrl || undefined,
      imageUrl: captureType === 'image' ? info.srcUrl : undefined,
      videoUrl: captureType === 'video' ? info.srcUrl : undefined,
      pageMeta: pageContext?.meta || undefined,
      surroundingText: pageContext?.surroundingText || undefined,
      elementPath: pageContext?.elementPath || undefined,
    },
    options: {
      enableAiExtraction: true,
    },
  };
}

function getContent(captureType, info) {
  switch (captureType) {
    case 'text':
      return info.selectionText || '';
    case 'link':
      return info.linkUrl || '';
    case 'image':
      return info.srcUrl || '';
    case 'video':
      return info.srcUrl || '';
    case 'url':
    default:
      return info.pageUrl || '';
  }
}

async function sendCapture(payload) {
  const settings = await chrome.storage.sync.get({
    apiUrl: API_BASE,
  });

  const response = await fetch(`${settings.apiUrl}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ── Message Handler (from popup / content scripts) ──────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'captureFromPopup') {
    sendCapture(message.payload)
      .then((result) => sendResponse({ success: true, result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }

  if (message.action === 'getSettings') {
    chrome.storage.sync.get(
      { apiUrl: API_BASE, enableAi: true, defaultTags: [] },
      (settings) => sendResponse(settings),
    );
    return true;
  }
});
