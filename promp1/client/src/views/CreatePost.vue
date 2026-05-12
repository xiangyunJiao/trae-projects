<template>
  <div class="create-post">
    <h2 class="page-title">写文章</h2>
    
    <div class="card form-card">
      <div class="form-group">
        <label class="form-label">标题</label>
        <input v-model="form.title" type="text" placeholder="请输入文章标题" />
      </div>
      
      <div class="form-group">
        <label class="form-label">摘要（可选）</label>
        <input v-model="form.summary" type="text" placeholder="请输入文章摘要，不填则自动截取前100字" />
      </div>
      
      <div class="form-group">
        <label class="form-label">标签（用逗号分隔）</label>
        <input v-model="form.tags" type="text" placeholder="例如：Vue, 前端, 技术" />
      </div>
      
      <div class="form-group">
        <label class="form-label">内容</label>
        <textarea v-model="form.content" rows="15" placeholder="请输入文章内容..."></textarea>
      </div>
      
      <div class="form-actions">
        <button class="btn-secondary" @click="cancel">取消</button>
        <button class="btn-primary" @click="submit" :disabled="submitting">
          {{ submitting ? '发布中...' : '发布文章' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postApi } from '../api'
import type { CreatePostForm } from '../types'

const router = useRouter()

const form = ref<CreatePostForm>({
  title: '',
  content: '',
  summary: '',
  tags: ''
})

const submitting = ref(false)

const submit = async () => {
  if (!form.value.title.trim()) {
    alert('请输入文章标题')
    return
  }
  if (!form.value.content.trim()) {
    alert('请输入文章内容')
    return
  }

  submitting.value = true
  try {
    const tagsArray = form.value.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    await postApi.createPost({
      title: form.value.title,
      content: form.value.content,
      summary: form.value.summary,
      tags: tagsArray
    })

    alert('发布成功！')
    router.push('/')
  } catch (error) {
    console.error('发布失败:', error)
    alert('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

const cancel = () => {
  if (form.value.title || form.value.content) {
    if (!confirm('确定要放弃吗？未保存的内容将丢失。')) {
      return
    }
  }
  router.push('/')
}
</script>

<style scoped>
.create-post {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (max-width: 1180px) {
  .create-post {
    max-width: 100%;
  }
}

.form-card {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
