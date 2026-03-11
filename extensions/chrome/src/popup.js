/**
 * Yggdrasil Capture - Popup Script
 *
 * Handles the popup UI for manual capture, settings, and recent items.
 */

const API_BASE = 'http://localhost:5000/api';

// ── DOM Elements ────────────────────────────────────────────────────────────

const statusEl = document.getElementById('status');
const captureTypeEl = document.getElementById('captureType');
const titleEl = document.getElementById('title');
const contentEl = document.getElementById('content');
const tagsEl = document.getElementById('tags');
const enableAiEl = document.getElementById('enableAi');
const captureBtnEl = document.getElementById('captureBtn');
const aiSuggestionsEl = document.getElementById('aiSuggestions');
const suggestedTagsEl = document.getElementById('suggestedTags');
const recentSectionEl = document.getElementById('recentSection');
const recentListEl = document.getElementById('recentList');

let selectedSuggestions = new Set();
let apiUrl = API_BASE;

// ── Initialization ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  // Load settings
  const settings = await chrome.storage.sync.get({
    apiUrl: API_BASE,
    enableAi: true,
  });
  apiUrl = settings.apiUrl;
  enableAiEl.checked = settings.enableAi;

  // Check API connection
  await checkConnection();

  // Auto-fill from current tab
  await autoFillFromTab();

  // Load recent captures
  await loadRecent();
});

// ── Event Handlers ──────────────────────────────────────────────────────────

captureBtnEl.addEventListener('click', handleCapture);

contentEl.addEventListener('blur', async () => {
  if (enableAiEl.checked && contentEl.value) {
    await fetchAiSuggestions(contentEl.value);
  }
});

// ── Functions ───────────────────────────────────────────────────────────────

async function checkConnection() {
  try {
    const response = await fetch(`${apiUrl}/capture/recent?limit=1`);
    if (response.ok) {
      statusEl.textContent = 'Connected';
      statusEl.className = 'status connected';
    } else {
      throw new Error('API not available');
    }
  } catch {
    statusEl.textContent = 'Offline';
    statusEl.className = 'status error';
  }
}

async function autoFillFromTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      contentEl.value = tab.url || '';
      titleEl.placeholder = tab.title || 'Auto-generated if empty';

      // Auto-detect capture type
      if (tab.url) {
        if (tab.url.includes('youtube.com') || tab.url.includes('youtu.be')) {
          captureTypeEl.value = 'video';
        } else if (tab.url.includes('github.com')) {
          captureTypeEl.value = 'url';
        } else {
          captureTypeEl.value = 'url';
        }
      }

      // Try to get AI suggestions for the current page
      if (enableAiEl.checked && tab.url) {
        await fetchAiSuggestions(tab.url);
      }
    }
  } catch (error) {
    console.log('Could not auto-fill from tab:', error);
  }
}

async function fetchAiSuggestions(content) {
  try {
    const response = await fetch(`${apiUrl}/tags/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.suggestions && data.suggestions.length > 0) {
        renderSuggestions(data.suggestions);
      }
    }
  } catch {
    // Silently fail - AI suggestions are optional
  }
}

function renderSuggestions(suggestions) {
  suggestedTagsEl.innerHTML = '';
  selectedSuggestions.clear();

  for (const suggestion of suggestions) {
    const chip = document.createElement('span');
    chip.className = 'tag-chip tag-chip--suggestion';
    chip.textContent = suggestion.label;
    chip.title = `${suggestion.category} (${Math.round(suggestion.confidence * 100)}% confidence)`;
    chip.addEventListener('click', () => {
      if (selectedSuggestions.has(suggestion.label)) {
        selectedSuggestions.delete(suggestion.label);
        chip.className = 'tag-chip tag-chip--suggestion';
      } else {
        selectedSuggestions.add(suggestion.label);
        chip.className = 'tag-chip tag-chip--selected';
      }
    });
    suggestedTagsEl.appendChild(chip);
  }

  aiSuggestionsEl.style.display = 'block';
}

async function handleCapture() {
  captureBtnEl.disabled = true;
  captureBtnEl.textContent = 'Saving...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Combine manual tags + selected AI suggestions
    const manualTags = tagsEl.value
      ? tagsEl.value.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    const allTags = [...new Set([...manualTags, ...selectedSuggestions])];

    const payload = {
      captureType: captureTypeEl.value,
      content: contentEl.value,
      sourceUrl: tab?.url || '',
      sourceTitle: tab?.title || '',
      capturedAt: new Date().toISOString(),
      context: {},
      options: {
        title: titleEl.value || undefined,
        tags: allTags.length > 0 ? allTags : undefined,
        enableAiExtraction: enableAiEl.checked,
      },
    };

    const response = await fetch(`${apiUrl}/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Capture failed');

    const result = await response.json();

    captureBtnEl.textContent = 'Saved!';
    captureBtnEl.style.background = 'linear-gradient(135deg, #059669, #10b981)';

    // Refresh recent list
    await loadRecent();

    setTimeout(() => {
      captureBtnEl.textContent = 'Save to Yggdrasil';
      captureBtnEl.style.background = '';
      captureBtnEl.disabled = false;
    }, 2000);
  } catch (error) {
    captureBtnEl.textContent = 'Failed - Try Again';
    captureBtnEl.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
    captureBtnEl.disabled = false;

    setTimeout(() => {
      captureBtnEl.textContent = 'Save to Yggdrasil';
      captureBtnEl.style.background = '';
    }, 3000);
  }
}

async function loadRecent() {
  try {
    const response = await fetch(`${apiUrl}/capture/recent?limit=5`);
    if (!response.ok) return;

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      recentListEl.innerHTML = '';
      for (const item of data.items) {
        const el = document.createElement('div');
        el.className = 'recent-item';
        el.innerHTML = `
          <span class="recent-item__title">${escapeHtml(item.title)}</span>
          <span class="recent-item__type">${escapeHtml(item.type)}</span>
        `;
        recentListEl.appendChild(el);
      }
      recentSectionEl.style.display = 'block';
    }
  } catch {
    // Silently fail
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
