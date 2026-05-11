<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">登录</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">用户名</label>
          <input v-model="form.username" type="text" placeholder="请输入用户名" required />
        </div>
        
        <div class="form-group">
          <label class="form-label">密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        
        <div class="error-message" v-if="error">{{ error }}</div>
        
        <button type="submit" class="btn-primary submit-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div class="auth-footer">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../api'
import type { LoginForm } from '../types'

const router = useRouter()

const form = ref<LoginForm>({
  username: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const response = await authApi.login(form.value)
    const { token, user } = response.data
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.error || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.auth-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.auth-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
  color: #2c3e50;
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

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 10px;
  background: #fdf2f2;
  border-radius: 4px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  color: #7f8c8d;
  font-size: 14px;
}
</style>
