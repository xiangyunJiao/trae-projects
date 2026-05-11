<template>
  <div class="user-management">
    <h2 class="page-title">用户管理</h2>
    
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="users.length === 0" class="empty">暂无用户</div>
    <div v-else class="user-list card">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-badge', user.role]">
                {{ user.role === 'admin' ? '管理员' : '普通用户' }}
              </span>
            </td>
            <td>{{ user.createdAt }}</td>
            <td>
              <button 
                v-if="user.username !== 'admin0511'"
                class="btn-secondary action-btn" 
                @click="toggleRole(user)"
              >
                {{ user.role === 'admin' ? '设为普通用户' : '设为管理员' }}
              </button>
              <button 
                v-if="user.username !== 'admin0511'"
                class="btn-danger action-btn" 
                @click="deleteUser(user)"
              >
                删除
              </button>
              <span v-else class="system-admin">系统管理员</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '../api'
import type { User } from '../types'

const users = ref<User[]>([])
const loading = ref(true)

const fetchUsers = async () => {
  try {
    const response = await userApi.getUsers()
    users.value = response.data
  } catch (error) {
    console.error('获取用户列表失败:', error)
    alert('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const toggleRole = async (user: User) => {
  const newRole = user.role === 'admin' ? 'user' : 'admin'
  const confirmMsg = newRole === 'admin' 
    ? `确定要将用户 "${user.username}" 设为管理员吗？`
    : `确定要将用户 "${user.username}" 降为普通用户吗？`
  
  if (!confirm(confirmMsg)) return
  
  try {
    await userApi.updateUserRole(user.id, newRole)
    user.role = newRole
  } catch (error) {
    console.error('更新用户角色失败:', error)
    alert('更新用户角色失败')
  }
}

const deleteUser = async (user: User) => {
  if (!confirm(`确定要删除用户 "${user.username}" 吗？此操作不可恢复。`)) return
  
  try {
    await userApi.deleteUser(user.id)
    users.value = users.value.filter(u => u.id !== user.id)
  } catch (error) {
    console.error('删除用户失败:', error)
    alert('删除用户失败')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management {
  max-width: 900px;
  margin: 0 auto;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
}

.user-list {
  padding: 0;
  overflow: hidden;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.user-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.user-table tr:last-child td {
  border-bottom: none;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge.admin {
  background: #ffeaa7;
  color: #d68910;
}

.role-badge.user {
  background: #dfe6e9;
  color: #636e72;
}

.action-btn {
  margin-right: 8px;
  padding: 6px 12px;
  font-size: 12px;
}

.system-admin {
  color: #95a5a6;
  font-size: 12px;
}
</style>
