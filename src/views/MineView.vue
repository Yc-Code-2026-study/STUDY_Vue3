<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchItems, updateItemStatus } from '../api/items'
import type { Item } from '../types/item'
import SkeletonCard from '../components/SkeletonCard.vue'

type Filter = 'all' | 'on_sale' | 'sold'

const items = ref<Item[]>([])
const loading = ref(true)
const filter = ref<Filter>('all')

const stats = computed(() => ({
  total: items.value.length,
  onSale: items.value.filter((i) => i.status === 'on_sale').length,
  sold: items.value.filter((i) => i.status === 'sold').length,
}))

const filtered = computed(() =>
  filter.value === 'all' ? items.value : items.value.filter((i) => i.status === filter.value)
)

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'on_sale', label: '在售' },
  { key: 'sold', label: '已售' },
]

async function load() {
  loading.value = true
  items.value = await fetchItems({ sortBy: 'time_desc' })
  loading.value = false
}

async function markSold(it: Item) {
  await updateItemStatus(it.id, 'sold')
  await load()
}

async function relist(it: Item) {
  await updateItemStatus(it.id, 'on_sale')
  await load()
}

onMounted(load)
</script>

<template>
  <div class="container">
    <h1 class="page-title">我的闲置</h1>

    <section class="stats">
      <div class="card stat">
        <span class="stat__num">{{ stats.total }}</span>
        <span class="stat__label">累计发布</span>
      </div>
      <div class="card stat">
        <span class="stat__num stat__num--sale">{{ stats.onSale }}</span>
        <span class="stat__label">在售</span>
      </div>
      <div class="card stat">
        <span class="stat__num stat__num--sold">{{ stats.sold }}</span>
        <span class="stat__label">已售</span>
      </div>
    </section>

    <div class="tabs">
      <button
        v-for="f in filters"
        :key="f.key"
        class="tab"
        :class="{ 'tab--on': filter === f.key }"
        @click="filter = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="loading" class="list">
      <SkeletonCard v-for="n in 4" :key="n" />
    </div>

    <div v-else-if="!filtered.length" class="empty">
      <div class="empty__icon">📦</div>
      <p>这里还没有闲置，去发布一件吧</p>
      <RouterLink to="/publish" class="btn btn--primary" style="margin-top: 16px">发布闲置</RouterLink>
    </div>

    <div v-else class="list">
      <div v-for="it in filtered" :key="it.id" class="card row">
        <RouterLink :to="{ name: 'item', params: { id: it.id } }" class="row__main">
          <span class="row__title">{{ it.title }}</span>
          <span class="row__meta">{{ it.category }} · {{ it.campus }} · {{ it.publishTime }}</span>
        </RouterLink>
        <span class="row__price">¥{{ it.price }}</span>
        <span class="badge" :class="it.status === 'sold' ? 'badge--sold' : 'badge--sale'">
          {{ it.status === 'sold' ? '已售' : '在售' }}
        </span>
        <button
          v-if="it.status === 'on_sale'"
          class="btn btn--ghost btn--sm"
          @click="markSold(it)"
        >
          标记已售
        </button>
        <button v-else class="btn btn--primary btn--sm" @click="relist(it)">重新上架</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 18px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px;
}

.stat__num {
  font-size: 26px;
  font-weight: 700;
}

.stat__num--sale {
  color: #12a150;
}

.stat__num--sold {
  color: var(--muted);
}

.stat__label {
  font-size: 13px;
  color: var(--muted);
}

.tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.tab {
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  color: var(--ink-2);
  background: var(--surface);
  border: 1px solid var(--line);
}

.tab--on {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.row__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
}

.row__meta {
  font-size: 12px;
  color: var(--muted);
}

.row__price {
  color: var(--price);
  font-weight: 700;
  font-size: 16px;
  white-space: nowrap;
}

.btn--sm {
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
  white-space: nowrap;
}

@media (max-width: 720px) {
  .stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .row {
    flex-wrap: wrap;
  }

  .row__main {
    flex-basis: 100%;
  }
}
</style>
