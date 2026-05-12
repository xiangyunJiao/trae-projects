<template>
  <div class="post-detail">
    <button class="btn-secondary back-btn" @click="goBack">← 返回列表</button>
    
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!post" class="empty">文章不存在</div>
    <div v-else>
      <div class="card post-content">
        <div class="post-header">
          <h1 class="title">{{ post.title }}</h1>
          <div v-if="isAdmin" class="admin-actions">
            <button class="btn-secondary" @click="showEditModal = true">编辑</button>
            <button class="btn-danger" @click="deletePost">删除</button>
          </div>
        </div>
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
          <button 
            :class="['like-btn', { 'btn-primary': !hasLiked, 'liked-btn': hasLiked }]" 
            @click="toggleLike"
            :disabled="liking"
          >
            <span v-if="hasLiked">❤️ 已点赞 ({{ likesCount }})</span>
            <span v-else-if="isLoggedIn">🤍 点赞 ({{ likesCount }})</span>
            <span v-else>🔒 登录后可点赞 ({{ likesCount }})</span>
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
              <div>
                <span class="comment-date">{{ comment.createdAt }}</span>
                <button v-if="isAdmin" class="btn-danger delete-comment-btn" @click="deleteComment(comment)">
                  删除
                </button>
              </div>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content card">
        <h3>编辑文章</h3>
        <div class="form-group">
          <label class="form-label">标题</label>
          <input v-model="editForm.title" type="text" />
        </div>
        <div class="form-group">
          <label class="form-label">摘要</label>
          <input v-model="editForm.summary" type="text" />
        </div>
        <div class="form-group">
          <label class="form-label">标签（用逗号分隔）</label>
          <input v-model="editForm.tags" type="text" />
        </div>
        <div class="form-group">
          <label class="form-label">内容</label>
          <textarea v-model="editForm.content" rows="10"></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showEditModal = false">取消</button>
          <button class="btn-primary" @click="saveEdit" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postApi, commentApi } from '../api'
import type { Post, Comment, CreateCommentForm } from '../types'

const route = useRoute()
const router = useRouter()

const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)
const showEditModal = ref(false)
const saving = ref(false)
const liking = ref(false)
const hasLiked = ref(false)
const likesCount = ref(0)

const token = localStorage.getItem('token')
const isLoggedIn = computed(() => !!token)

const userStr = localStorage.getItem('user')
const currentUser = userStr ? JSON.parse(userStr) : null
const isAdmin = computed(() => currentUser?.role === 'admin')

const commentForm = ref<CreateCommentForm>({
  author: '',
  content: ''
})

const editForm = reactive({
  title: '',
  content: '',
  summary: '',
  tags: ''
})

const fetchPost = async () => {
  try {
    const id = parseInt(route.params.id as string)
    const response = await postApi.getPost(id)
    post.value = response.data
    likesCount.value = response.data.likes
    
    editForm.title = response.data.title
    editForm.content = response.data.content
    editForm.summary = response.data.summary
    editForm.tags = response.data.tags.join(', ')
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

const fetchLikeStatus = async () => {
  if (!isLoggedIn.value || !post.value) return
  
  try {
    const response = await postApi.getLikeStatus(post.value.id)
    hasLiked.value = response.data.hasLiked
    likesCount.value = response.data.likes
  } catch (error) {
    console.error('获取点赞状态失败:', error)
  }
}

const toggleLike = async () => {
  if (!post.value) return
  
  if (!isLoggedIn.value) {
    alert('请先登录后再点赞')
    router.push('/login')
    return
  }

  liking.value = true
  try {
    const response = await postApi.toggleLike(post.value.id)
    hasLiked.value = response.data.hasLiked
    likesCount.value = response.data.likes
    if (post.value) {
      post.value.likes = response.data.likes
    }
  } catch (error) {
    console.error('点赞失败:', error)
    alert('操作失败，请重试')
  } finally {
    liking.value = false
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

const saveEdit = async () => {
  if (!post.value) return
  
  if (!editForm.title.trim()) {
    alert('标题不能为空')
    return
  }
  if (!editForm.content.trim()) {
    alert('内容不能为空')
    return
  }

  saving.value = true
  try {
    const tagsArray = editForm.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    await postApi.updatePost(post.value.id, {
      title: editForm.title,
      content: editForm.content,
      summary: editForm.summary,
      tags: tagsArray
    })
    
    post.value.title = editForm.title
    post.value.content = editForm.content
    post.value.summary = editForm.summary
    post.value.tags = tagsArray
    
    showEditModal.value = false
    alert('保存成功！')
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

const deletePost = async () => {
  if (!post.value) return
  
  if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) return

  try {
    await postApi.deletePost(post.value.id)
    alert('删除成功！')
    router.push('/')
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败，请重试')
  }
}

const deleteComment = async (comment: Comment) => {
  if (!confirm('确定要删除这条评论吗？')) return

  try {
    await commentApi.deleteComment(comment.id)
    comments.value = comments.value.filter(c => c.id !== comment.id)
  } catch (error) {
    console.error('删除评论失败:', error)
    alert('删除评论失败')
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(async () => {
  await fetchPost()
  await fetchComments()
  await fetchLikeStatus()
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

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.admin-actions {
  display: flex;
  gap: 8px;
}

.admin-actions button {
  padding: 6px 12px;
  font-size: 12px;
}

.post-content .title {
  font-size: 28px;
  margin-bottom: 0;
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

.liked-btn {
  background-color: #e74c3c;
  color: white;
}

.liked-btn:hover {
  background-color: #c0392b;
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
  align-items: center;
  margin-bottom: 8px;
}

.comment-header > div {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comment-author {
  font-weight: 600;
  color: #4a90d9;
}

.comment-date {
  color: #7f8c8d;
  font-size: 14px;
}

.delete-comment-btn {
  padding: 4px 10px;
  font-size: 12px;
}

.comment-content {
  color: #555;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
