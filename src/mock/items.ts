import type { Item, ItemQuery, ItemStatus, PublishPayload, User } from '../types/item'

/** 当前登录用户（假数据） */
export const CURRENT_USER: User = { id: 'u_me', nickname: '小集同学' }

/** 筛选器可选项 */
export const CATEGORIES = ['教材图书', '数码电子', '生活用品', '运动户外', '衣物鞋包', '其他']
export const CAMPUSES = ['主校区', '东校区', '西校区', '南校区']
export const CHANNELS = ['频道A·跳蚤市场', '频道B·校园闲置', '频道C·二手交易']

const seed: Item[] = [
  {
    id: '1001',
    title: '高等数学同济第七版 上下册',
    price: 25,
    originalPrice: 78,
    category: '教材图书',
    campus: '主校区',
    channel: '频道A·跳蚤市场',
    author: '大二学长',
    publishTime: '2026-11-02 14:30',
    status: 'on_sale',
    rawText: '高数教材，有少量笔记，不影响阅读，25元两本带走。联系QQ：123456。',
    contact: 'QQ 123456',
  },
  {
    id: '1002',
    title: '捷安特 ATX 山地自行车',
    price: 350,
    originalPrice: 1299,
    category: '运动户外',
    campus: '东校区',
    channel: '频道B·校园闲置',
    author: '爱骑车的小王',
    publishTime: '2026-11-01 09:15',
    status: 'on_sale',
    rawText: '毕业出，捷安特ATX系列，骑了一年，换了新刹车片，350出。仅限校内面交。',
    contact: '微信 wang_ride',
  },
  {
    id: '1003',
    title: '小米台灯 Pro',
    price: 50,
    originalPrice: 169,
    category: '生活用品',
    campus: '主校区',
    channel: '频道C·二手交易',
    author: '匿名同学',
    publishTime: '2026-10-31 20:00',
    status: 'sold',
    rawText: '小米台灯，99新，原价169现在50出。评论区有人问还在吗，楼主回复：已出，封帖。',
  },
  {
    id: '1004',
    title: '罗技 G502 游戏鼠标',
    price: 80,
    originalPrice: 269,
    category: '数码电子',
    campus: '西校区',
    channel: '频道A·跳蚤市场',
    author: '电竞社-阿凯',
    publishTime: '2026-10-30 18:45',
    status: 'on_sale',
    rawText: '罗技G502，用了半年，无拆无修，按键手感正常，80出。',
    contact: 'QQ 998877',
  },
  {
    id: '1005',
    title: 'iPad 2019 128G 银色',
    price: 900,
    originalPrice: 2999,
    category: '数码电子',
    campus: '主校区',
    channel: '频道B·校园闲置',
    author: '大四学姐',
    publishTime: '2026-10-29 12:10',
    status: 'on_sale',
    rawText: 'iPad 2019 128G，考研自用，无磕碰，带充电器，900出。可小刀，面交验货。',
    contact: 'QQ 556677',
  },
  {
    id: '1006',
    title: '考研政治肖秀荣全套',
    price: 30,
    originalPrice: 120,
    category: '教材图书',
    campus: '南校区',
    channel: '频道C·二手交易',
    author: '上岸学长',
    publishTime: '2026-10-28 16:20',
    status: 'on_sale',
    rawText: '肖秀荣精讲精练+1000题+真题，有部分勾画，30出全套。',
  },
  {
    id: '1007',
    title: '宿舍折叠小桌子',
    price: 20,
    category: '生活用品',
    campus: '东校区',
    channel: '频道A·跳蚤市场',
    author: '匿名同学',
    publishTime: '2026-10-27 11:00',
    status: 'sold',
    rawText: '宿舍床上小桌板，折叠款，20元。已出。',
  },
  {
    id: '1008',
    title: '斯伯丁篮球 7号',
    price: 60,
    originalPrice: 199,
    category: '运动户外',
    campus: '主校区',
    channel: '频道B·校园闲置',
    author: '校队小王',
    publishTime: '2026-10-26 15:30',
    status: 'on_sale',
    rawText: '斯伯丁篮球，皮质，几乎全新，60出。',
  },
  {
    id: '1009',
    title: '机械键盘 87键 红轴',
    price: 120,
    originalPrice: 349,
    category: '数码电子',
    campus: '西校区',
    channel: '频道C·二手交易',
    author: '程序猿小张',
    publishTime: '2026-10-25 21:05',
    status: 'on_sale',
    rawText: '87键红轴机械键盘，办公神器，键帽无磨损，120出。',
    contact: '微信 zhang_code',
  },
  {
    id: '1010',
    title: '冬季加厚棉被',
    price: 40,
    category: '生活用品',
    campus: '南校区',
    channel: '频道A·跳蚤市场',
    author: '大二学妹',
    publishTime: '2026-10-24 10:40',
    status: 'on_sale',
    rawText: '加厚棉被，冬天保暖，只用了一季，40出。',
  },
  {
    id: '1011',
    title: '全新帆布鞋 42码',
    price: 80,
    originalPrice: 189,
    category: '衣物鞋包',
    campus: '东校区',
    channel: '频道B·校园闲置',
    author: '匿名同学',
    publishTime: '2026-10-23 19:25',
    status: 'sold',
    rawText: '全新帆布鞋42码，买大了没穿过，80出。已出。',
  },
  {
    id: '1012',
    title: '考研英语真题 近十年',
    price: 15,
    originalPrice: 68,
    category: '教材图书',
    campus: '主校区',
    channel: '频道C·二手交易',
    author: '上岸学长',
    publishTime: '2026-10-22 08:55',
    status: 'on_sale',
    rawText: '近十年考研英语真题，有少量笔迹，15出。',
  },
]

/** 可变数据源：发布/改状态/收藏都作用在这个数组上，页面之间共享同一份状态 */
let items: Item[] = seed.map((it) => ({ ...it, favorite: false }))
let seq = 2000

const delay = (ms = 260) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function formatNow(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

export async function mockFetchItems(query: ItemQuery = {}): Promise<Item[]> {
  await delay()
  let list = [...items]

  const kw = (query.keyword ?? '').trim().toLowerCase()
  if (kw) {
    list = list.filter(
      (it) =>
        it.title.toLowerCase().includes(kw) || it.rawText.toLowerCase().includes(kw)
    )
  }
  if (query.category) list = list.filter((it) => it.category === query.category)
  if (query.campus) list = list.filter((it) => it.campus === query.campus)
  if (query.channel) list = list.filter((it) => it.channel === query.channel)
  if (query.onlyOnSale) list = list.filter((it) => it.status === 'on_sale')

  const sort = query.sortBy ?? 'time_desc'
  list.sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return a.price - b.price
      case 'price_desc':
        return b.price - a.price
      case 'time_asc':
        return a.publishTime.localeCompare(b.publishTime)
      default:
        return b.publishTime.localeCompare(a.publishTime)
    }
  })

  return list
}

export async function mockFetchItem(id: string): Promise<Item | undefined> {
  await delay(160)
  const found = items.find((it) => it.id === id)
  return found ? { ...found } : undefined
}

export async function mockPublish(payload: PublishPayload): Promise<Item> {
  await delay()
  const item: Item = {
    id: String(++seq),
    title: payload.title,
    price: payload.price,
    originalPrice: payload.originalPrice,
    category: payload.category,
    campus: payload.campus,
    channel: payload.channel,
    author: CURRENT_USER.nickname,
    publishTime: formatNow(),
    status: 'on_sale',
    rawText: payload.rawText,
    images: payload.images,
    contact: payload.contact,
    favorite: false,
  }
  items.unshift(item)
  return item
}

export async function mockUpdateStatus(id: string, status: ItemStatus): Promise<void> {
  await delay(140)
  const it = items.find((x) => x.id === id)
  if (it) it.status = status
}

export async function mockToggleFavorite(id: string): Promise<Item | undefined> {
  await delay(100)
  const it = items.find((x) => x.id === id)
  if (it) it.favorite = !it.favorite
  return it
}
