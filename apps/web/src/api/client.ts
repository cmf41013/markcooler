import {
  API,
  type AddHistoryRequest,
  type AddHistoryResponse,
  type FileContentResponse,
  type FileListResponse,
  type HistoryEntry,
} from '@markcooler/shared';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let message = `请求失败（${res.status}）`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // 忽略非 JSON 响应
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

/** 服务器模式的 API 客户端（双击模式下不使用）。 */
export const api = {
  listFiles: () => request<FileListResponse>(API.files),
  readFile: (path: string) =>
    request<FileContentResponse>(`${API.file}?path=${encodeURIComponent(path)}`),
  listHistory: () => request<HistoryEntry[]>(API.history),
  addHistory: (path: string) =>
    request<AddHistoryResponse>(API.history, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path } satisfies AddHistoryRequest),
    }),
  removeHistory: (id: string) =>
    request<{ ok: boolean }>(`${API.history}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
