import { ref, computed } from 'vue'
import type { User } from '../types'

const currentUser = ref<User | null>(null)

const isLoggedIn = computed(() => !!currentUser.value)
const isAdmin = computed(() => currentUser.value?.role === 'admin')

const initAuth = () => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  
  if (token && userStr) {
    try {
      currentUser.value = JSON.parse(userStr)
    } catch (e) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      currentUser.value = null
    }
  } else {
    currentUser.value = null
  }
}

const setUser = (user: User, token: string) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  currentUser.value = user
}

const clearUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  currentUser.value = null
}

export const useAuth = () => {
  return {
    currentUser,
    isLoggedIn,
    isAdmin,
    initAuth,
    setUser,
    clearUser
  }
}
