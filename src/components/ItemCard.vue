<script setup lang="ts">
import { computed } from 'vue'
import type { Item } from '../types/item'
import { splitKeyword } from '../utils/highlight'

const props = defineProps<{ item: Item; keyword?: string }>()

const saved = computed(() =>
  props.item.originalPrice != null
    ? Math.max(0, props.item.originalPrice - props.item.price)
    : 0
)

const titleSegs = computed(() => splitKeyword(props.item.title, props.keyword ?? ''))
const textSegs = computed(() => splitKeyword(props.item.rawText, props.keyword ?? ''))
</script>

<template>
  <RouterLink :to="{ name: 'item', params: { id: item.id } }" class="card item-card">
    <div class="item-card__top">
      <span class="chip">{{ item.category }}</span>
      <h3 class="item-card__title">
        <template v-for="(s, i) in titleSegs" :key="i">
          <mark v-if="s.hit">{{ s.text }}</mark>
          <template v-else>{{ s.text }}</template>
        </template>
      </h3>
      <span
        class="badge"
        :class="item.status === 'sold' ? 'badge--sold' : 'badge--sale'"
      >
        {{ item.status === 'sold' ? '已售' : '在售' }}
      </span>
    </div>

    <div class="item-card__price">
      <span class="price">¥{{ item.price }}</span>
      <template v-if="item.originalPrice != null">
        <span class="price--origin">¥{{ item.originalPrice }}</span>
        <span class="save">省 ¥{{ saved }}</span>
      </template>
    </div>

    <p class="item-card__text">
      <template v-for="(s, i) in textSegs" :key="i">
        <mark v-if="s.hit">{{ s.text }}</mark>
        <template v-else>{{ s.text }}</template>
      </template>
    </p>

    <div class="item-card__meta">
      <span>{{ item.channel }}</span>
      <span>{{ item.campus }}</span>
      <span>{{ item.author }}</span>
      <span>{{ item.publishTime }}</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.item-card {
  color: var(--ink);
}

.item-card__top {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.item-card__title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.item-card__price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 12px 0 8px;
}

.price {
  color: var(--price);
  font-size: 20px;
  font-weight: 700;
}

.price--origin {
  color: var(--muted);
  font-size: 13px;
  text-decoration: line-through;
}

.save {
  font-size: 12px;
  color: var(--price);
  background: #fdecec;
  padding: 1px 6px;
  border-radius: 6px;
}

.item-card__text {
  color: var(--ink-2);
  font-size: 13px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.item-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  font-size: 12px;
  color: var(--muted);
  border-top: 1px solid var(--line);
  padding-top: 10px;
}
</style>
