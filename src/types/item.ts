/**
 * 前后端契约：Item 就是一条「QQ 校园频道帖子」对应的二手商品。
 * 保留了原始帖子字段（channel / author / rawText），给爬虫组转交时对照 README 的契约表即可。
 */

export type ItemStatus = 'on_sale' | 'sold'

export type SortKey = 'time_desc' | 'time_asc' | 'price_asc' | 'price_desc'

export interface Item {
  /** 商品唯一 id（后端用帖子 id 或自增 id） */
  id: string
  title: string
  /** 售价（元），数字类型，详情页据此算「省 ¥xxx」 */
  price: number
  /** 原价（元），可选，用于展示省了多少钱 */
  originalPrice?: number
  /** 分类，如：教材图书 / 数码电子 / 生活用品 / 运动户外 / 衣物鞋包 */
  category: string
  /** 校区 */
  campus: string
  /** QQ 校园频道名 */
  channel: string
  /** 发帖人昵称 */
  author: string
  /** 发布时间，格式 YYYY-MM-DD HH:mm */
  publishTime: string
  /** 在售 / 已售 */
  status: ItemStatus
  /** 帖子原文 */
  rawText: string
  /** 图片 URL 列表（本地上传时为 dataURL） */
  images?: string[]
  /** 联系方式 */
  contact?: string
  /** 是否已收藏（前端本地状态） */
  favorite?: boolean
}

export interface User {
  id: string
  nickname: string
}

/** 列表页查询参数 */
export interface ItemQuery {
  keyword?: string
  category?: string
  campus?: string
  channel?: string
  onlyOnSale?: boolean
  sortBy?: SortKey
}

/** 发布请求体 */
export interface PublishPayload {
  title: string
  price: number
  originalPrice?: number
  category: string
  campus: string
  channel: string
  contact?: string
  rawText: string
  images: string[]
}
