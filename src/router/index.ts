import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ItemDetailView from '../views/ItemDetailView.vue'
import PublishView from '../views/PublishView.vue'
import MineView from '../views/MineView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/item/:id', name: 'item', component: ItemDetailView },
    { path: '/publish', name: 'publish', component: PublishView },
    { path: '/mine', name: 'mine', component: MineView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
