import { create } from 'zustand';
import { api } from '../lib/api';

interface CaptureItem {
  id: string;
  type: string;
  title: string;
  content: string;
  sourceUrl: string;
  tags: string[];
  metadata: Record<string, unknown>;
  created: string;
  modified: string;
}

interface TagSuggestion {
  label: string;
  category: string;
  confidence: number;
}

interface CaptureStore {
  // State
  items: CaptureItem[];
  loading: boolean;
  error: string | null;
  suggestions: TagSuggestion[];

  // Actions
  fetchRecent: () => Promise<void>;
  capture: (payload: Record<string, unknown>) => Promise<void>;
  fetchSuggestions: (content: string) => Promise<void>;
  clearError: () => void;
}

export const useCaptureStore = create<CaptureStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  suggestions: [],

  fetchRecent: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.capture.recent(50);
      set({ items: data.items as CaptureItem[], loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch',
        loading: false,
      });
    }
  },

  capture: async (payload: Record<string, unknown>) => {
    set({ loading: true, error: null });
    try {
      await api.capture.create(payload);
      // Refresh the list after capture
      const data = await api.capture.recent(50);
      set({ items: data.items as CaptureItem[], loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Capture failed',
        loading: false,
      });
    }
  },

  fetchSuggestions: async (content: string) => {
    try {
      const data = await api.tags.suggest(content);
      set({ suggestions: data.suggestions });
    } catch {
      // Silently fail for suggestions
    }
  },

  clearError: () => set({ error: null }),
}));
