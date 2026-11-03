<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchItem, toggleFavorite } from '../api/items'
import type { Item } from '../types/item'

const route = useRoute()
const router = useRouter()

const item = ref<Item | null>(null)
const loading = ref(true)
const notFound = ref(false)

const saved = computed(() => {
  if (!item.value || item.value.originalPrice == null) return 0
  return Math.max(0, item.value.originalPrice - item.value.price)
})

async function load() {
  const id = String(route.params.id)
  loading.value = true
  notFound.value = false
  const data = await fetchItem(id)
  if (!data) notFound.value = true
  else item.value = data
  loading.value = false
}

async function onToggleFavorite() {
  if (!item.value) return
  const updated = await toggleFavorite(item.value.id)
  if (updated) item.value = updated
}

onMounted(load)
watch(() => route.params.id, load)
</script>

<template>
  <div class="container narrow">
    <button class="link back" @click="router.back()">← 返回</button>

    <div v-if="loading" class="card detail-skeleton">
      <div class="skeleton" style="width: 70%; height: 26px"></div>
      <div class="skeleton" style="width: 40%; height: 32px; margin-top: 16px"></div>
      <div class="skeleton" style="width: 100%; height: 14px; margin-top: 20px"></div>
      <div class="skeleton" style="width: 100%; height: 14px; margin-top: 8px"></div>
      <div class="skeleton" style="width: 88%; height: 14px; margin-top: 8px"></div>
    </div>

    <div v-else-if="notFound" class="empty">
      <div class="empty__icon">🤔</div>
      <p>商品不存在或已下架</p>
      <RouterLink to="/" class="btn btn--primary" style="margin-top: 16px">去集市看看</RouterLink>
    </div>

    <template v-else-if="item">
      <div class="card detail">
        <div class="detail__head">
          <span class="chip">{{ item.category }}</span>
          <span
            class="badge"
            :class="item.status === 'sold' ? 'badge--sold' : 'badge--sale'"
          >
            {{ item.status === 'sold' ? '已售' : '在售' }}
          </span>
          <button class="fav" :class="{ 'fav--on': item.favorite }" @click="onToggleFavorite">
            {{ item.favorite ? '♥' : '♡' }} {{ item.favorite ? '已收藏' : '收藏' }}
          </button>
        </div>

        <h1 class="detail__title">{{ item.title }}</h1>

        <div class="detail__price">
          <span class="price">¥{{ item.price }}</span>
          <template v-if="item.originalPrice != null">
            <span class="price--origin">¥{{ item.originalPrice }}</span>
            <span class="save">省 ¥{{ saved }}</span>
          </template>
        </div>

        <div v-if="item.images?.length" class="detail__images">
          <img v-for="(img, i) in item.images" :key="i" :src="img" alt="商品图片" />
        </div>

        <section class="detail__section">
          <h2 class="detail__subtitle">帖子原文</h2>
          <p class="detail__raw">{{ item.rawText }}</p>
        </section>

        <section class="detail__section">
          <h2 class="detail__subtitle">来源信息</h2>
          <dl class="detail__meta">
            <div><dt>频道</dt><dd>{{ item.channel }}</dd></div>
            <div><dt>发帖人</dt><dd>{{ item.author }}</dd></div>
            <div><dt>发布时间</dt><dd>{{ item.publishTime }}</dd></div>
            <div><dt>校区</dt><dd>{{ item.campus }}</dd></div>
          </dl>
        </section>

        <div v-if="item.contact" class="detail__contact">
          <span>联系方式：</span><b>{{ item.contact }}</b>
        </div>
      </div>

      <aside class="card safety">
        <h2 class="safety__title">🛡️ 安全交易提示</h2>
        <ul class="safety__list">
          <li>仅限校内当面交易，拒绝任何形式的线上转账、押金。</li>
          <li>面交时选择人多的公共场所（图书馆、食堂、教学楼大厅）。</li>
          <li>收到货再确认，核对商品与帖子描述是否一致。</li>
          <li>警惕明显低于市场价的商品与「先付款后发货」套路。</li>
        </ul>
      </aside>
    </template>
  </div>
</template>

<style scoped>
.narrow {
  width: min(760px, calc(100% - 40px));
}

.back {
  display: inline-block;
  margin-bottom: 14px;
}

.detail {
  padding: 26px 28px;
}

.detail__head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fav {
  margin-left: auto;
  font-size: 14px;
  color: var(--ink-2);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 6px 14px;
}

.fav--on {
  color: var(--price);
  border-color: #f3c1c1;
  background: #fdecec;
}

.detail__title {
  font-size: 22px;
  font-weight: 700;
  margin: 14px 0 12px;
}

.detail__price {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.price {
  color: var(--price);
  font-size: 30px;
  font-weight: 700;
}

.price--origin {
  color: var(--muted);
  font-size: 15px;
  text-decoration: line-through;
}

.save {
  font-size: 13px;
  color: var(--price);
  background: #fdecec;
  padding: 2px 8px;
  border-radius: 6px;
}

.detail__images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 18px;
}

.detail__images img {
  border-radius: 10px;
  border: 1px solid var(--line);
  object-fit: cover;
  aspect-ratio: 1;
}

.detail__section {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.detail__subtitle {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-2);
  margin-bottom: 10px;
}

.detail__raw {
  white-space: pre-wrap;
  color: var(--ink);
  line-height: 1.8;
}

.detail__meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 24px;
  margin: 0;
}

.detail__meta div {
  display: flex;
  gap: 10px;
  font-size: 14px;
}

.detail__meta dt {
  color: var(--muted);
  min-width: 52px;
}

.detail__meta dd {
  margin: 0;
  color: var(--ink-2);
}

.detail__contact {
  margin-top: 20px;
  padding: 14px 16px;
  background: var(--primary-soft);
  border-radius: 10px;
  font-size: 14px;
  color: var(--ink-2);
}

.detail__contact b {
  color: var(--primary);
}

.safety {
  margin-top: 16px;
  padding: 18px 22px;
  background: #fffdf4;
}

.safety__title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.safety__list {
  margin: 0;
  padding-left: 18px;
  color: var(--ink-2);
  font-size: 13px;
  line-height: 2;
}

.detail-skeleton {
  padding: 26px 28px;
}
</style>
