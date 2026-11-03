<template>
  <div class="container">
    <h1>🎓 校园二手交易聚合搜索</h1>
    <p class="subtitle">聚合三大QQ频道，AI帮你找好物，过滤已售出信息</p>

    <!-- 搜索框 -->
    <div class="search-box">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="输入你想找的物品（如：高数、自行车）..." 
      />
      <button @click="search">搜索</button>
    </div>

    <!-- 搜索结果列表 -->
    <div class="results">
      <div v-for="item in results" :key="item.id" class="card">
        <div class="card-header">
          <h3>{{ item.title }}</h3>
          <span class="price">{{ item.price }}</span>
        </div>
        <p class="info">📍 {{ item.channel }} | 发布人: {{ item.author }} | 时间: {{ item.publish_time }}</p>
        <p class="raw-text">{{ item.raw_text }}</p>
        <div class="status" :class="item.status === '在售' ? 'selling' : 'sold'">
          {{ item.status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 导入刚才改好的 js 文件
import { mockData } from './mock_data.js'

const searchQuery = ref('')
const allData = ref(mockData)
const results = ref(mockData)

const search = () => {
  if (!searchQuery.value) {
    results.value = allData.value
    return
  }
  const keyword = searchQuery.value.toLowerCase()
  results.value = allData.value.filter(item => 
    item.title.toLowerCase().includes(keyword) || 
    item.raw_text.toLowerCase().includes(keyword)
  )
}
</script>

<style>
/* 简单美化一下页面 */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}
.subtitle { color: #666; margin-bottom: 20px; }
.search-box { display: flex; gap: 10px; margin-bottom: 20px; }
.search-box input {
  flex: 1; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px;
}
.search-box button {
  padding: 12px 24px; background-color: #42b883; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;
}
.card {
  border: 1px solid #eee; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); position: relative;
}
.card-header { display: flex; justify-content: space-between; align-items: center; }
.price { color: #e74c3c; font-size: 20px; font-weight: bold; }
.info { color: #888; font-size: 14px; margin: 8px 0; }
.raw-text { color: #333; background: #f9f9f9; padding: 10px; border-radius: 4px; font-size: 14px; }
.status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
.selling { background: #e8f8f5; color: #1abc9c; }
.sold { background: #fce4ec; color: #e91e63; opacity: 0.6; }
</style>