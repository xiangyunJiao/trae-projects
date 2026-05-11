<template>
  <div class="home">
    <h2 class="page-title">最新文章</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="posts.length === 0" class="empty">暂无文章</div>
    <div v-else class="post-list">
      <div v-for="post in posts" :key="post.id" class="card post-item">
        <div class="post-header">
          <h3 class="post-title">
            <router-link :to="`/post/${post.id}`">{{ post.title }}</router-link>
          </h3>
          <div class="post-meta">
            <span>{{ post.author }}</span>
            <span>{{ post.createdAt }}</span>
          </div>
        </div>
        <p class="post-summary">{{ post.summary }}</p>
        <div class="post-footer">
          <div class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="post-stats">
            <span>👁️ {{ post.views }}</span>
            <span>❤️ {{ post.likes }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { postApi } from '../api'
import type { Post } from '../types'

const posts = ref<Post[]>([])
const loading = ref(true)

const fetchPosts = async () => {
  try {
    const response = await postApi.getPosts()
    posts.value = response.data
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
}

.post-item {
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.post-header {
  margin-bottom: 12px;
}

.post-title {
  font-size: 20px;
  margin-bottom: 8px;
}

.post-title a {
  color: #2c3e50;
}

.post-title a:hover {
  color: #4a90d9;
}

.post-meta {
  font-size: 14px;
  color: #7f8c8d;
  display: flex;
  gap: 16px;
}

.post-summary {
  color: #555;
  margin-bottom: 16px;
  line-height: 1.7;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-stats {
  display: flex;
  gap: 16px;
  color: #7f8c8d;
  font-size: 14px;
}
</style>
