<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { fetchItems } from '../api/items'
import type { Item, SortKey } from '../types/item'
import { CAMPUSES, CATEGORIES, CHANNELS } from '../mock/items'
import ItemCard from '../components/ItemCard.vue'
import SkeletonCard from '../components/SkeletonCard.vue'

const items = ref<Item[]>([])
const loading = ref(true)
const error = ref('')

const keyword = ref('')
const category = ref('')
const campus = ref('')
const channel = ref('')
const onlyOnSale = ref(false)
const sortBy = ref<SortKey>('time_desc')

let timer: ReturnType<typeof setTimeout> | undefined

async function load() {
  loading.value = true
  error.value = ''
  try {
    items.value = await fetchItems({
      keyword: keyword.value,
      category: category.value || undefined,
      campus: campus.value || undefined,
      channel: channel.value || undefined,
      onlyOnSale: onlyOnSale.value,
      sortBy: sortBy.value,
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function clearAll() {
  keyword.value = ''
  category.value = ''
  campus.value = ''
  channel.value = ''
  onlyOnSale.value = false
}

// 关键词输入做防抖，其余筛选项变化立即刷新
watch(keyword, () => {
  clearTimeout(timer)
  timer = setTimeout(load, 300)
})
watch([category, campus, channel, onlyOnSale, sortBy], load)

onMounted(load)
</script>

<template>
  <div class="container">
    <section class="searchbar">
      <div class="searchbar__box">
        <span class="searchbar__icon" aria-hidden="true">🔍</span>
        <input
          v-model="keyword"
          class="input searchbar__input"
          placeholder="搜索标题或帖子内容，如「高数」「自行车」"
        />
        <button v-if="keyword" class="searchbar__clear" @click="keyword = ''">×</button>
      </div>
    </section>

    <section class="filters">
      <select v-model="category" class="select">
        <option value="">全部分类</option>
        <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="campus" class="select">
        <option value="">全部校区</option>
        <option v-for="c in CAMPUSES" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="channel" class="select">
        <option value="">全部频道</option>
        <option v-for="c in CHANNELS" :key="c" :value="c">{{ c }}</option>
      </select>

      <label class="only-sale">
        <button
          class="switch"
          :class="{ 'switch--on': onlyOnSale }"
          :aria-pressed="onlyOnSale"
          @click="onlyOnSale = !onlyOnSale"
        ></button>
        <span>只看在售</span>
      </label>

      <select v-model="sortBy" class="select">
        <option value="time_desc">最新发布</option>
        <option value="time_asc">最早发布</option>
        <option value="price_desc">价格从高到低</option>
        <option value="price_asc">价格从低到高</option>
      </select>
    </section>

    <div class="list-head">
      <span>共 {{ items.length }} 件</span>
      <button
        v-if="keyword || category || campus || channel || onlyOnSale"
        class="link"
        @click="clearAll"
      >
        清空筛选
      </button>
    </div>

    <div v-if="loading" class="grid">
      <SkeletonCard v-for="n in 6" :key="n" />
    </div>

    <div v-else-if="error" class="empty">
      <div class="empty__icon">⚠️</div>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!items.length" class="empty">
      <div class="empty__icon">🔍</div>
      <p>没有找到相关闲置，换个关键词或清空筛选试试</p>
    </div>

    <div v-else class="grid">
      <ItemCard v-for="it in items" :key="it.id" :item="it" :keyword="keyword" />
    </div>
  </div>
</template>

<style scoped>
.searchbar {
  margin-bottom: 16px;
}

.searchbar__box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px 14px;
}

.searchbar__icon {
  font-size: 16px;
}

.searchbar__input {
  flex: 1;
  border: none;
  padding: 0;
  background: transparent;
}

.searchbar__input:focus {
  outline: none;
}

.searchbar__clear {
  font-size: 20px;
  color: var(--muted);
  line-height: 1;
  padding: 0 4px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.filters .select {
  min-width: 130px;
}

.only-sale {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ink-2);
  cursor: pointer;
}

.list-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  font-size: 13px;
  color: var(--muted);
}

.link {
  color: var(--primary);
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
