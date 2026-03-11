import { useEffect, useState, useCallback } from 'react';
import { Network, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useCaptureStore } from '../store/captureStore';

/**
 * Graph visualization view.
 *
 * MVP: Shows a placeholder with node list.
 * Phase 2: Will integrate Cytoscape.js for interactive graph rendering.
 *
 * The Cytoscape.js integration is scaffolded but commented out
 * to avoid requiring the full dependency chain for the initial scaffold.
 */

// import CytoscapeComponent from 'react-cytoscapejs';
// import cytoscape from 'cytoscape';

export function GraphView() {
  const { items, fetchRecent } = useCaptureStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  // Build graph elements from captured items
  const graphElements = useCallback(() => {
    const nodes = items.map((item) => ({
      data: {
        id: item.id,
        label: item.title,
        type: item.type,
        tags: item.tags,
      },
    }));

    // Create edges based on shared tags
    const edges: Array<{ data: { id: string; source: string; target: string; label: string } }> = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const sharedTags = items[i].tags.filter((t) =>
          items[j].tags.includes(t),
        );
        if (sharedTags.length > 0) {
          edges.push({
            data: {
              id: `edge-${items[i].id}-${items[j].id}`,
              source: items[i].id,
              target: items[j].id,
              label: sharedTags[0],
            },
          });
        }
      }
    }

    return { nodes, edges };
  }, [items]);

  const { nodes, edges } = graphElements();

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-ygg-border">
        <div className="flex items-center gap-2">
          <Network size={20} className="text-ygg-accent" />
          <h2 className="text-lg font-semibold text-ygg-text">
            Knowledge Graph
          </h2>
          <span className="text-xs text-ygg-muted ml-2">
            {nodes.length} nodes, {edges.length} edges
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-ygg-muted hover:text-ygg-text hover:bg-ygg-surface transition-colors">
            <ZoomIn size={16} />
          </button>
          <button className="p-2 rounded-lg text-ygg-muted hover:text-ygg-text hover:bg-ygg-surface transition-colors">
            <ZoomOut size={16} />
          </button>
          <button className="p-2 rounded-lg text-ygg-muted hover:text-ygg-text hover:bg-ygg-surface transition-colors">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 flex">
        {/* Canvas placeholder - will be replaced with Cytoscape.js */}
        <div className="flex-1 relative bg-ygg-bg">
          {nodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Network
                  size={48}
                  className="text-ygg-border mx-auto mb-4"
                />
                <p className="text-ygg-muted">
                  Capture some content to see your knowledge graph
                </p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md">
                <Network
                  size={48}
                  className="text-ygg-accent mx-auto mb-4"
                />
                <p className="text-ygg-text font-medium mb-2">
                  Graph Visualization Ready
                </p>
                <p className="text-sm text-ygg-muted mb-4">
                  {nodes.length} nodes and {edges.length} edges loaded.
                  Cytoscape.js interactive rendering will be integrated in the
                  next phase.
                </p>
                <p className="text-xs text-ygg-muted">
                  View nodes in the sidebar panel &rarr;
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Node List Sidebar */}
        {nodes.length > 0 && (
          <div className="w-72 border-l border-ygg-border bg-ygg-bg overflow-auto">
            <div className="p-3 border-b border-ygg-border">
              <h3 className="text-xs font-semibold text-ygg-muted uppercase tracking-wide">
                Nodes ({nodes.length})
              </h3>
            </div>
            <div className="divide-y divide-ygg-border">
              {nodes.map((node) => (
                <button
                  key={node.data.id}
                  onClick={() => setSelectedNode(node.data.id)}
                  className={`w-full text-left p-3 transition-colors ${
                    selectedNode === node.data.id
                      ? 'bg-ygg-surface border-l-2 border-ygg-accent'
                      : 'hover:bg-ygg-surface'
                  }`}
                >
                  <p className="text-sm text-ygg-text truncate">
                    {node.data.label}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-ygg-surface text-ygg-muted">
                      {node.data.type}
                    </span>
                    {node.data.tags.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-xs text-ygg-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
