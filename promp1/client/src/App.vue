<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <h1 class="logo"><router-link to="/">个人博客</router-link></h1>
        <nav class="nav">
          <router-link to="/">首页</router-link>
          <router-link to="/create">写文章</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
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
