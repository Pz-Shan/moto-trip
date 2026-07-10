import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'moto-trip-admin-ok'
const DEV_PASSWORD = 'moto2026'

export const useAdminStore = defineStore('admin', () => {
  const authed = ref(sessionStorage.getItem(STORAGE_KEY) === '1')

  const isAuthed = computed(() => authed.value)

  function login(password: string) {
    if (password !== DEV_PASSWORD) return false
    authed.value = true
    sessionStorage.setItem(STORAGE_KEY, '1')
    return true
  }

  function logout() {
    authed.value = false
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return {
    isAuthed,
    login,
    logout,
  }
})
