<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAdminStore } from '../stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

function logout() {
  adminStore.logout()
  router.push('/admin')
}
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <RouterLink class="brand" to="/admin/trips">
        <span>MT</span>
        <strong>路书后台</strong>
      </RouterLink>
      <nav>
        <RouterLink to="/admin/trips">路书管理</RouterLink>
        <RouterLink to="/admin/import">智能导入</RouterLink>
        <RouterLink to="/">查看前台</RouterLink>
      </nav>
      <button type="button" @click="logout">退出后台</button>
    </aside>
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 232px minmax(0, 1fr);
}

.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  height: 100vh;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border-right: 1px solid var(--line);
  background: #173f32;
  color: #fffaf1;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.brand span {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 8px;
  background: #fffaf1;
  color: #173f32;
  font-weight: 800;
}

nav {
  display: grid;
  gap: 8px;
}

nav a,
button {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(255, 250, 241, 0.18);
  border-radius: 8px;
  color: inherit;
  background: rgba(255, 250, 241, 0.08);
  text-align: left;
  cursor: pointer;
}

button {
  margin-top: auto;
}

.admin-main {
  padding: 28px;
}

@media (max-width: 760px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
  }
}
</style>
