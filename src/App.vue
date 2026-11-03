<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { CURRENT_USER } from './mock/items'

const route = useRoute()
const router = useRouter()

const navs = [
  { name: 'home', label: '逛集市', to: '/' },
  { name: 'mine', label: '我的闲置', to: '/mine' },
]
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <RouterLink to="/" class="brand">
        <svg class="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#2F5BFF" />
          <path d="M16 26l16-7 16 7-16 7-16-7z" fill="#fff" />
          <path
            d="M22 31v9c0 3 4.5 5 10 5s10-2 10-5v-9"
            fill="none"
            stroke="#fff"
            stroke-width="3.2"
            stroke-linecap="round"
          />
        </svg>
        <span class="brand__text">
          <b>校集</b>
          <small>QQ 校园频道 · 二手集市</small>
        </span>
      </RouterLink>

      <nav class="nav">
        <RouterLink
          v-for="nav in navs"
          :key="nav.name"
          :to="nav.to"
          class="nav__item"
          :class="{ 'nav__item--on': route.name === nav.name }"
        >
          {{ nav.label }}
        </RouterLink>
      </nav>

      <div class="header-right">
        <button class="btn btn--primary" @click="router.push('/publish')">发布闲置</button>
        <div class="user">
          <span class="user__avatar">{{ CURRENT_USER.nickname.slice(0, 1) }}</span>
          <span class="user__name">{{ CURRENT_USER.nickname }}</span>
        </div>
      </div>
    </div>
  </header>

  <main class="page">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </RouterView>
  </main>

  <footer class="site-footer">
    <div class="container site-footer__inner">
      <span>数据来源：QQ 校园频道公开帖子（当前为本地示例数据）</span>
      <span>仅限校内当面交易 · 请勿轻信线上转账</span>
    </div>
  </footer>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid var(--line);
}

.site-header__inner {
  display: flex;
  align-items: center;
  gap: 28px;
  height: 64px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand__mark {
  width: 32px;
  height: 32px;
}

.brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand__text b {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.brand__text small {
  font-size: 11px;
  color: var(--muted);
}

.nav {
  display: flex;
  gap: 4px;
  margin-right: auto;
}

.nav__item {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--ink-2);
}

.nav__item:hover {
  background: #f2f3f7;
  color: var(--ink);
}

.nav__item--on {
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user__avatar {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 13px;
  font-weight: 600;
}

.user__name {
  font-size: 13px;
  color: var(--ink-2);
}

.page {
  min-height: calc(100vh - 200px);
  padding: 26px 0 56px;
}

.site-footer {
  border-top: 1px solid var(--line);
  background: var(--surface);
}

.site-footer__inner {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 0;
  font-size: 12px;
  color: var(--muted);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.16s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 720px) {
  .nav {
    display: none;
  }

  .user__name {
    display: none;
  }

  .header-right {
    margin-left: auto;
  }

  .site-footer__inner {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
