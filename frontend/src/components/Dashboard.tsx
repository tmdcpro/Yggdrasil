import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Tag, Clock, ExternalLink } from 'lucide-react';
import { useCaptureStore } from '../store/captureStore';

export function Dashboard() {
  const { items, loading, fetchRecent } = useCaptureStore();

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-ygg-text">Dashboard</h2>
          <p className="text-sm text-ygg-muted mt-1">
            Your knowledge graph at a glance
          </p>
        </div>
        <Link
          to="/capture"
          className="flex items-center gap-2 px-4 py-2 bg-ygg-accent text-ygg-bg rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <PlusCircle size={16} />
          New Capture
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Items" value={items.length.toString()} />
        <StatCard
          label="Unique Tags"
          value={
            new Set(items.flatMap((item) => item.tags)).size.toString()
          }
        />
        <StatCard
          label="Content Types"
          value={new Set(items.map((item) => item.type)).size.toString()}
        />
      </div>

      {/* Recent Captures */}
      <div>
        <h3 className="text-lg font-semibold text-ygg-text mb-4">
          Recent Captures
        </h3>
        {loading ? (
          <div className="text-ygg-muted text-sm">Loading...</div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {items.slice(0, 20).map((item) => (
              <CaptureItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ygg-surface border border-ygg-border rounded-lg p-4">
      <p className="text-2xl font-bold text-ygg-accent">{value}</p>
      <p className="text-xs text-ygg-muted mt-1">{label}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-ygg-surface border border-ygg-border rounded-lg p-8 text-center">
      <p className="text-ygg-muted mb-4">
        No captures yet. Start by capturing content from the web.
      </p>
      <div className="flex flex-col gap-2 text-sm text-ygg-muted">
        <p>1. Install the Chrome extension from <code className="text-ygg-accent">/extensions/chrome</code></p>
        <p>2. Right-click any content and select &quot;Save to Yggdrasil&quot;</p>
        <p>3. Or use the Capture page to add content manually</p>
      </div>
    </div>
  );
}

function CaptureItem({
  item,
}: {
  item: {
    id: string;
    type: string;
    title: string;
    tags: string[];
    sourceUrl: string;
    created: string;
  };
}) {
  return (
    <div className="bg-ygg-surface border border-ygg-border rounded-lg p-3 flex items-center gap-3 hover:border-ygg-accent transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ygg-text truncate">
          {item.title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs px-2 py-0.5 rounded bg-ygg-bg text-ygg-muted">
            {item.type}
          </span>
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs text-ygg-accent flex items-center gap-1"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs text-ygg-muted">
              +{item.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-ygg-muted">
        <Clock size={12} />
        <span className="text-xs">
          {new Date(item.created).toLocaleDateString()}
        </span>
        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ygg-muted hover:text-ygg-accent"
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
