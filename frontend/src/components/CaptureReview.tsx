import { useState } from 'react';
import { Send, Sparkles, X, Plus, Loader2 } from 'lucide-react';
import { useCaptureStore } from '../store/captureStore';

type CaptureType = 'url' | 'text' | 'image' | 'link' | 'code' | 'video' | 'screenshot';

const captureTypes: { value: CaptureType; label: string }[] = [
  { value: 'url', label: 'Page URL' },
  { value: 'text', label: 'Text / Note' },
  { value: 'code', label: 'Code Snippet' },
  { value: 'link', label: 'Link' },
  { value: 'image', label: 'Image URL' },
  { value: 'video', label: 'Video URL' },
  { value: 'screenshot', label: 'Screenshot' },
];

export function CaptureReview() {
  const { capture, fetchSuggestions, suggestions, loading, error } = useCaptureStore();

  const [captureType, setCaptureType] = useState<CaptureType>('url');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [enableAi, setEnableAi] = useState(true);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(
    new Set(),
  );
  const [submitted, setSubmitted] = useState(false);

  const handleContentBlur = () => {
    if (enableAi && content.trim()) {
      fetchSuggestions(content);
    }
  };

  const toggleSuggestion = (label: string) => {
    setSelectedSuggestions((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const allTags = [...new Set([...tags, ...selectedSuggestions])];

    await capture({
      captureType,
      content,
      sourceUrl: captureType === 'url' ? content : '',
      sourceTitle: title || '',
      capturedAt: new Date().toISOString(),
      context: {},
      options: {
        title: title || undefined,
        tags: allTags.length > 0 ? allTags : undefined,
        enableAiExtraction: enableAi,
      },
    });

    const currentError = useCaptureStore.getState().error;
    if (!currentError) {
      setSubmitted(true);
      setTimeout(() => {
        setContent('');
        setTitle('');
        setTags([]);
        setTagInput('');
        setSelectedSuggestions(new Set());
        setSubmitted(false);
      }, 2000);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-ygg-text mb-1">Capture</h2>
      <p className="text-sm text-ygg-muted mb-6">
        Add content to your knowledge graph manually or review AI-extracted
        metadata
      </p>

      {/* Capture Type Selector */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-ygg-muted uppercase tracking-wide mb-2">
          Content Type
        </label>
        <div className="flex flex-wrap gap-2">
          {captureTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setCaptureType(type.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                captureType === type.value
                  ? 'bg-ygg-accent text-ygg-bg'
                  : 'bg-ygg-surface text-ygg-muted border border-ygg-border hover:text-ygg-text'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-ygg-muted uppercase tracking-wide mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Auto-generated if empty"
          className="w-full px-3 py-2 bg-ygg-surface border border-ygg-border rounded-lg text-sm text-ygg-text placeholder-ygg-muted focus:border-ygg-accent focus:outline-none"
        />
      </div>

      {/* Content */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-ygg-muted uppercase tracking-wide mb-2">
          Content / URL
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleContentBlur}
          placeholder={
            captureType === 'url'
              ? 'https://example.com/article'
              : captureType === 'code'
                ? 'Paste your code snippet here...'
                : 'Enter text content...'
          }
          rows={captureType === 'code' || captureType === 'text' ? 8 : 3}
          className={`w-full px-3 py-2 bg-ygg-surface border border-ygg-border rounded-lg text-sm text-ygg-text placeholder-ygg-muted focus:border-ygg-accent focus:outline-none resize-none ${
            captureType === 'code' ? 'font-mono' : ''
          }`}
        />
      </div>

      {/* AI Toggle */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="enableAi"
          checked={enableAi}
          onChange={(e) => setEnableAi(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="enableAi" className="text-sm text-ygg-text flex items-center gap-1">
          <Sparkles size={14} className="text-ygg-accent" />
          Enable AI extraction &amp; auto-tagging
        </label>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-4 p-3 bg-ygg-surface border border-ygg-border rounded-lg">
          <label className="block text-xs font-semibold text-ygg-muted uppercase tracking-wide mb-2">
            AI Suggested Tags (click to select)
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => toggleSuggestion(s.label)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedSuggestions.has(s.label)
                    ? 'bg-ygg-accent text-ygg-bg'
                    : 'bg-ygg-bg text-ygg-accent border border-ygg-accent hover:bg-ygg-accent hover:text-ygg-bg'
                }`}
                title={`${s.category} (${Math.round(s.confidence * 100)}% confidence)`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Tags */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-ygg-muted uppercase tracking-wide mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-ygg-accent text-ygg-bg"
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:opacity-70">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag..."
            className="flex-1 px-3 py-2 bg-ygg-surface border border-ygg-border rounded-lg text-sm text-ygg-text placeholder-ygg-muted focus:border-ygg-accent focus:outline-none"
          />
          <button
            onClick={addTag}
            className="px-3 py-2 bg-ygg-surface border border-ygg-border rounded-lg text-ygg-muted hover:text-ygg-accent hover:border-ygg-accent transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!content.trim() || loading}
        className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm transition-all ${
          submitted
            ? 'bg-ygg-success text-white'
            : 'bg-ygg-accent text-ygg-bg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing...
          </>
        ) : submitted ? (
          'Saved to Knowledge Graph!'
        ) : (
          <>
            <Send size={16} />
            Save to Yggdrasil
          </>
        )}
      </button>
    </div>
  );
}
