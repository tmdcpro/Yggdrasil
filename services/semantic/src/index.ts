/**
 * Semantic Service
 *
 * AI/ML operations: auto-tagging, entity extraction, embeddings, similarity search.
 * MVP: Keyword-based tagging and heuristic classification.
 * Phase 2: LLM integration (OpenAI/Anthropic/Ollama) via LangChain or Semantica.
 */

import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.SEMANTIC_PORT || 5002;

/**
 * Health check
 */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'semantic', version: '0.1.0' });
});

/**
 * Auto-tag content
 */
app.post('/tag', (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  const tags = autoTag(content);
  res.json({ success: true, tags });
});

/**
 * Classify content into domains
 */
app.post('/classify', (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  const classification = classifyContent(content);
  res.json({ success: true, classification });
});

/**
 * Extract entities from content
 */
app.post('/entities', (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  const entities = extractEntities(content);
  res.json({ success: true, entities });
});

/**
 * Generate a summary of content
 */
app.post('/summarize', (req, res) => {
  const { content, maxLength } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  const summary = summarize(content, maxLength || 200);
  res.json({ success: true, summary });
});

// ── MVP Implementations (will be replaced with LLM in Phase 2) ─────────────

function autoTag(content: string): Array<{ label: string; category: string; confidence: number }> {
  const contentLower = content.toLowerCase();
  const tags: Array<{ label: string; category: string; confidence: number }> = [];

  // Technology keywords
  const techKeywords: Record<string, string[]> = {
    'javascript': ['javascript', 'js', 'typescript', 'ts', 'node', 'react', 'vue', 'angular'],
    'python': ['python', 'django', 'flask', 'fastapi', 'pytorch', 'tensorflow'],
    'ai': ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'llm', 'gpt'],
    'database': ['database', 'sql', 'nosql', 'postgresql', 'mongodb', 'neo4j', 'redis'],
    'web': ['html', 'css', 'web', 'browser', 'frontend', 'backend', 'api'],
    'devops': ['docker', 'kubernetes', 'ci/cd', 'aws', 'cloud', 'deployment'],
    'security': ['security', 'encryption', 'authentication', 'vulnerability', 'privacy'],
  };

  for (const [tag, keywords] of Object.entries(techKeywords)) {
    if (keywords.some((kw) => contentLower.includes(kw))) {
      tags.push({ label: tag, category: 'topic', confidence: 0.75 });
    }
  }

  // Frequency-based keywords
  const words = content
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4);

  const freq = new Map<string, number>();
  for (const word of words) {
    const lower = word.toLowerCase();
    freq.set(lower, (freq.get(lower) || 0) + 1);
  }

  const topWords = Array.from(freq.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  for (const [word, count] of topWords) {
    const existing = tags.find((t) => t.label === word);
    if (!existing) {
      tags.push({
        label: word,
        category: 'topic',
        confidence: Math.min(0.5 + count * 0.05, 0.8),
      });
    }
  }

  return tags.slice(0, 10);
}

function classifyContent(content: string): Array<{ domain: string; confidence: number }> {
  const contentLower = content.toLowerCase();
  const domains: Array<{ domain: string; confidence: number }> = [];

  const domainMap: Record<string, string[]> = {
    'technology': ['software', 'programming', 'code', 'developer', 'api', 'framework', 'library'],
    'science': ['research', 'study', 'experiment', 'hypothesis', 'scientific', 'paper'],
    'design': ['ui', 'ux', 'design', 'layout', 'typography', 'color', 'figma'],
    'business': ['revenue', 'market', 'startup', 'company', 'investment', 'growth'],
    'ai-ml': ['machine learning', 'artificial intelligence', 'neural', 'model', 'training', 'llm'],
    'data': ['data', 'analytics', 'visualization', 'statistics', 'dashboard'],
    'education': ['tutorial', 'course', 'learn', 'guide', 'documentation', 'lesson'],
  };

  for (const [domain, keywords] of Object.entries(domainMap)) {
    const matchCount = keywords.filter((kw) => contentLower.includes(kw)).length;
    if (matchCount > 0) {
      domains.push({
        domain,
        confidence: Math.min(0.5 + matchCount * 0.1, 0.95),
      });
    }
  }

  return domains.sort((a, b) => b.confidence - a.confidence);
}

function extractEntities(content: string): Array<{ name: string; type: string; confidence: number }> {
  const entities: Array<{ name: string; type: string; confidence: number }> = [];

  // URL detection
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
  const urls = content.match(urlPattern) || [];
  for (const url of urls.slice(0, 5)) {
    try {
      const hostname = new URL(url).hostname;
      entities.push({ name: hostname, type: 'organization', confidence: 0.6 });
    } catch {
      // Invalid URL
    }
  }

  // Capitalized word sequences (potential names/organizations) - simple heuristic
  const capitalizedPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;
  const matches = content.match(capitalizedPattern) || [];
  for (const match of matches.slice(0, 5)) {
    entities.push({ name: match, type: 'concept', confidence: 0.5 });
  }

  return entities;
}

function summarize(content: string, maxLength: number): string {
  const cleaned = content.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;

  // Take first N characters, break at sentence boundary
  const truncated = cleaned.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  if (lastSentence > maxLength * 0.5) {
    return truncated.substring(0, lastSentence + 1);
  }
  return truncated + '...';
}

app.listen(PORT, () => {
  console.log(`Semantic service running on http://localhost:${PORT}`);
});

export { app };
