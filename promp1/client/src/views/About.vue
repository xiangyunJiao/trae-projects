<template>
  <div class="about">
    <h2 class="page-title">关于我</h2>
    
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="card about-card">
      <div class="profile-header">
        <img :src="about.avatar" alt="头像" class="avatar" />
        <div class="profile-info">
          <h3 class="name">{{ about.name }}</h3>
          <p class="bio">{{ about.bio }}</p>
        </div>
      </div>
      
      <div class="skills-section">
        <h4>技能</h4>
        <div class="skills">
          <span v-for="skill in about.skills" :key="skill" class="tag">{{ skill }}</span>
        </div>
      </div>
      
      <div class="contact-section">
        <h4>联系方式</h4>
        <div class="contact-item">
          <span>📧 Email:</span>
          <a :href="`mailto:${about.email}`">{{ about.email }}</a>
        </div>
        <div class="contact-item" v-if="about.github">
          <span>💻 GitHub:</span>
          <a :href="about.github" target="_blank">{{ about.github }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { aboutApi } from '../api'
import type { About } from '../types'

const about = ref<About>({
  name: '',
  avatar: '',
  bio: '',
  skills: [],
  email: '',
  github: ''
})
const loading = ref(true)

const fetchAbout = async () => {
  try {
    const response = await aboutApi.getAbout()
    about.value = response.data
  } catch (error) {
    console.error('获取关于信息失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAbout()
})
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
}

.about-card {
  padding: 30px;
}

.profile-header {
  display: flex;
  gap: 24px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f0f0f0;
}

.profile-info {
  flex: 1;
}

.name {
  font-size: 24px;
  margin-bottom: 8px;
  color: #2c3e50;
}

.bio {
  color: #555;
  line-height: 1.7;
}

.skills-section,
.contact-section {
  margin-bottom: 24px;
}

.skills-section h4,
.contact-section h4 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #2c3e50;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skills .tag {
  font-size: 14px;
  padding: 4px 12px;
}

.contact-item {
  margin-bottom: 8px;
  color: #555;
}

.contact-item span {
  margin-right: 8px;
}
</style>
