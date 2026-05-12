<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <h1 class="logo"><router-link to="/">个人博客</router-link></h1>
        <nav class="nav">
          <router-link to="/">首页</router-link>
          <router-link v-if="isAdmin" to="/create">写文章</router-link>
          <router-link v-if="isAdmin" to="/users">用户管理</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
        <div class="user-info">
          <template v-if="currentUser">
            <span class="username">
              {{ currentUser.username }}
              <span v-if="isAdmin" class="admin-badge">管理员</span>
            </span>
            <button class="logout-btn" @click="handleLogout">退出</button>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">登录</router-link>
            <router-link to="/register" class="nav-link">注册</router-link>
          </template>
        </div>
      </div>
    </header>
    <main class="main container">
      <router-view />
    </main>
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 个人博客. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from './api'
import { useAuth } from './store/auth'

const router = useRouter()
const { currentUser, isAdmin, initAuth, clearUser } = useAuth()

const handleLogout = async () => {
  try {
    await authApi.logout()
  } catch (e) {
    console.log('Logout API error', e)
  }
  
  clearUser()
  router.push('/')
}

onMounted(() => {
  initAuth()
})
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.logo a {
  color: white;
}

.logo a:hover {
  color: #e0e0e0;
}

.nav {
  display: flex;
  gap: 24px;
}

.nav a {
  color: white;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
}

.nav a:hover,
.nav a.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-link {
  color: white;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.main {
  flex: 1;
  padding: 32px 0;
}

.footer {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 20px 0;
  text-align: center;
  margin-top: auto;
}
</style>
