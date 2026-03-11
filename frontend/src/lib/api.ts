/**
 * API client for the Yggdrasil backend
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers: optionHeaders, ...restOptions } = options || {};
  const response = await fetch(`${API_BASE}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...optionHeaders,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  capture: {
    create: (payload: Record<string, unknown>) =>
      request('/capture', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    extract: (data: { url?: string; content?: string; captureType: string }) =>
      request('/capture/extract', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    recent: (limit = 20) =>
      request<{ items: Record<string, unknown>[]; total: number }>(
        `/capture/recent?limit=${limit}`,
      ),
  },
  nodes: {
    list: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ items: Record<string, unknown>[]; total: number }>(
        `/nodes${query}`,
      );
    },
    get: (id: string) => request<Record<string, unknown>>(`/nodes/${id}`),
    update: (id: string, data: Record<string, unknown>) =>
      request(`/nodes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  tags: {
    list: () =>
      request<{ items: Record<string, unknown>[]; total: number }>('/tags'),
    suggest: (content: string, existingTags?: string[]) =>
      request<{ suggestions: Array<{ label: string; category: string; confidence: number }> }>(
        '/tags/suggest',
        {
          method: 'POST',
          body: JSON.stringify({ content, existingTags }),
        },
      ),
  },
};
