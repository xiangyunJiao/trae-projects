<template>
  <div class="admin-layout">
    <div class="admin-sidebar">
      <div class="sidebar-header">
        <h2>运营活动管理</h2>
      </div>
      <nav class="sidebar-nav">
        <a
          v-for="item in menuItems"
          :key="item.path"
          :href="item.path"
          :class="['nav-item', { active: currentPath === item.path }]"
        >
          {{ item.name }}
        </a>
      </nav>
      <a href="/" class="nav-item exit-btn">返回H5页面</a>
    </div>
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AdminHome',
  data() {
    return {
      menuItems: [
        { name: '活动配置', path: '/admin/config' },
        { name: '抽奖配置', path: '/admin/lottery' },
        { name: '礼物配置', path: '/admin/gift' },
        { name: '榜单配置', path: '/admin/ranking' }
      ]
    }
  },
  computed: {
    currentPath(): string {
      return this.$route.path
    }
  }
})
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}

.admin-sidebar {
  width: 250px;
  background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
  padding: 20px;
}

.sidebar-header {
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.sidebar-header h2 {
  color: #fff;
  font-size: 20px;
  margin: 0;
  text-align: center;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-item.active {
  background: #3498db;
}

.exit-btn {
  margin-top: auto;
  background: rgba(231, 76, 60, 0.8) !important;
}

.exit-btn:hover {
  background: rgba(231, 76, 60, 1) !important;
}

.admin-content {
  flex: 1;
  padding: 30px;
  background: #f5f7fa;
  overflow-y: auto;
}
</style>