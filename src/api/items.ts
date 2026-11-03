import type { Item, ItemQuery, ItemStatus, PublishPayload } from '../types/item'
import {
  mockFetchItem,
  mockFetchItems,
  mockPublish,
  mockToggleFavorite,
  mockUpdateStatus,
} from '../mock/items'

/**
 * 数据源开关：.env 里 VITE_USE_MOCK 改成 false 即切到后端 /api，页面代码零改动。
 * 后端地址由 vite.config.js 的 proxy 转发到 127.0.0.1:8000。
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

function toQueryString(q: ItemQuery): string {
  const p = new URLSearchParams()
  if (q.keyword) p.set('keyword', q.keyword)
  if (q.category) p.set('category', q.category)
  if (q.campus) p.set('campus', q.campus)
  if (q.channel) p.set('channel', q.channel)
  if (q.onlyOnSale) p.set('onlyOnSale', '1')
  if (q.sortBy) p.set('sortBy', q.sortBy)
  return p.toString()
}

export async function fetchItems(query: ItemQuery = {}): Promise<Item[]> {
  if (USE_MOCK) return mockFetchItems(query)
  const res = await fetch(`/api/items?${toQueryString(query)}`)
  if (!res.ok) throw new Error(`请求失败：${res.status}`)
  return res.json()
}

export async function fetchItem(id: string): Promise<Item | undefined> {
  if (USE_MOCK) return mockFetchItem(id)
  const res = await fetch(`/api/items/${id}`)
  if (res.status === 404) return undefined
  if (!res.ok) throw new Error(`请求失败：${res.status}`)
  return res.json()
}

export async function publishItem(payload: PublishPayload): Promise<Item> {
  if (USE_MOCK) return mockPublish(payload)
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`发布失败：${res.status}`)
  return res.json()
}

export async function updateItemStatus(id: string, status: ItemStatus): Promise<void> {
  if (USE_MOCK) return mockUpdateStatus(id, status)
  const res = await fetch(`/api/items/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(`更新失败：${res.status}`)
}

export async function toggleFavorite(id: string): Promise<Item | undefined> {
  if (USE_MOCK) return mockToggleFavorite(id)
  const res = await fetch(`/api/items/${id}/favorite`, { method: 'POST' })
  if (!res.ok) throw new Error(`操作失败：${res.status}`)
  return res.json()
}
