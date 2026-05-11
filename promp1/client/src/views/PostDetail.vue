<template>
  <div class="post-detail">
    <button class="btn-secondary back-btn" @click="goBack">← 返回列表</button>
    
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!post" class="empty">文章不存在</div>
    <div v-else>
      <div class="card post-content">
        <h1 class="title">{{ post.title }}</h1>
        <div class="meta">
          <span>{{ post.author }}</span>
          <span>{{ post.createdAt }}</span>
          <span>👁️ {{ post.views }}</span>
        </div>
        <div class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="content">{{ post.content }}</div>
        <div class="actions">
          <button class="btn-primary like-btn" @click="likePost">
            ❤️ 点赞 ({{ post.likes }})
          </button>
        </div>
      </div>

      <div class="comments-section">
        <h3 class="section-title">评论 ({{ comments.length }})</h3>
        
        <div class="card comment-form">
          <h4>发表评论</h4>
          <input v-model="commentForm.author" type="text" placeholder="您的昵称" class="form-input" />
          <textarea v-model="commentForm.content" rows="3" placeholder="您的评论" class="form-textarea"></textarea>
          <button class="btn-primary" @click="submitComment">提交评论</button>
        </div>

        <div v-if="comments.length === 0" class="empty-comments">暂无评论，快来抢沙发！</div>
        <div v-else class="comment-list">
          <div v-for="comment in comments" :key="comment.id" class="card comment-item">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-date">{{ comment.createdAt }}</span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postApi, commentApi } from '../api'
import type { Post, Comment, CreateCommentForm } from '../types'

const route = useRoute()
const router = useRouter()

const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)

const commentForm = ref<CreateCommentForm>({
  author: '',
  content: ''
})

const fetchPost = async () => {
  try {
    const id = parseInt(route.params.id as string)
    const response = await postApi.getPost(id)
    post.value = response.data
  } catch (error) {
    console.error('获取文章详情失败:', error)
  }
}

const fetchComments = async () => {
  try {
    const id = parseInt(route.params.id as string)
    const response = await commentApi.getComments(id)
    comments.value = response.data
  } catch (error) {
    console.error('获取评论失败:', error)
  } finally {
    loading.value = false
  }
}

const likePost = async () => {
  if (!post.value) return
  try {
    const response = await postApi.likePost(post.value.id)
    post.value.likes = response.data.likes
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

const submitComment = async () => {
  if (!commentForm.value.author.trim() || !commentForm.value.content.trim()) {
    alert('请填写昵称和评论内容')
    return
  }

  try {
    const id = parseInt(route.params.id as string)
    await commentApi.createComment({
      postId: id,
      ...commentForm.value
    })
    commentForm.value = { author: '', content: '' }
    await fetchComments()
  } catch (error) {
    console.error('发表评论失败:', error)
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  fetchPost()
  fetchComments()
})
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 20px;
}

.loading,
.empty,
.empty-comments {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
}

.post-content .title {
  font-size: 28px;
  margin-bottom: 16px;
  color: #2c3e50;
}

.meta {
  color: #7f8c8d;
  font-size: 14px;
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.tags {
  margin-bottom: 20px;
}

.content {
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  margin-bottom: 24px;
}

.actions {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.like-btn {
  font-size: 16px;
  padding: 10px 24px;
}

.comments-section {
  margin-top: 32px;
}

.section-title {
  font-size: 20px;
  margin-bottom: 16px;
  color: #2c3e50;
}

.comment-form h4 {
  margin-bottom: 16px;
}

.form-input,
.form-textarea {
  margin-bottom: 12px;
}

.comment-list {
  margin-top: 20px;
}

.comment-item {
  margin-bottom: 16px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #4a90d9;
}

.comment-date {
  color: #7f8c8d;
  font-size: 14px;
}

.comment-content {
  color: #555;
}
</style>
