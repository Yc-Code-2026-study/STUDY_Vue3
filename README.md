# 校集 · QQ 校园频道二手集市（前端）

基于 QQ 校园频道公开帖子抓取的校园二手交易平台前端。Vue 3 + TypeScript + Vite，当前默认跑本地假数据，后端就绪后改一行配置即可切换。

## 快速开始

```bash
npm install
npm run dev
```

## 页面路由

| 路由 | 页面 | 功能 |
| --- | --- | --- |
| `/` | 集市首页 | 搜索（标题+帖子正文）、分类/校区/频道筛选、「只看在售」开关、价格与时间排序、关键词高亮、骨架屏、空状态 |
| `/item/:id` | 详情页 | 价格与「省 ¥xxx」、帖子原文、来源信息（频道/发帖人/时间）、收藏、安全提示 |
| `/publish` | 发布页 | 图片上传预览、中文表单校验 |
| `/mine` | 我的闲置 | 发布统计、状态筛选、标记已售 / 重新上架 |

## 核心架构

- `src/api/items.ts` 里的 `USE_MOCK` 开关：现在跑 `src/mock/items.ts` 的 12 条假数据。
- 后端好了之后，把 `.env` 里的 `VITE_USE_MOCK` 改成 `false`，即切真实接口，页面代码零改动。
- `vite.config.js` 已配好 `/api` 代理，转发到 `http://127.0.0.1:8000`。

## 前后端契约（转交给爬虫/后端组）

`src/types/item.ts` 的 `Item` 接口就是契约，保留了原始 QQ 帖子字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 商品唯一 id |
| `title` | string | 标题 |
| `price` | number | 售价（元） |
| `originalPrice` | number? | 原价（元），可选 |
| `category` | string | 分类（教材图书 / 数码电子 / 生活用品 / 运动户外 / 衣物鞋包 / 其他） |
| `campus` | string | 校区 |
| `channel` | string | QQ 校园频道名 |
| `author` | string | 发帖人昵称 |
| `publishTime` | string | 发布时间 `YYYY-MM-DD HH:mm` |
| `status` | `'on_sale' \| 'sold'` | 在售 / 已售 |
| `rawText` | string | 帖子原文 |
| `images` | string[]? | 图片 URL 列表 |
| `contact` | string? | 联系方式 |
| `favorite` | boolean? | 是否收藏（前端本地状态） |

### 后端接口约定（对应 `src/api/items.ts`）

- `GET /api/items` — 列表，query 参数：`keyword`、`category`、`campus`、`channel`、`onlyOnSale=1`、`sortBy`
- `GET /api/items/:id` — 详情，404 时返回不存在
- `POST /api/items` — 发布，body 为 `PublishPayload`
- `PATCH /api/items/:id/status` — 改状态，body `{ "status": "on_sale" | "sold" }`
- `POST /api/items/:id/favorite` — 收藏切换
