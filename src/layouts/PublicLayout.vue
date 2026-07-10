<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="public-layout">
    <header class="topbar">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">MT</span>
        <span>
          <strong>摩旅路书</strong>
          <small>公开路线看板</small>
        </span>
      </RouterLink>
      <RouterLink class="admin-link" to="/admin">后台</RouterLink>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
  padding-bottom: 48px;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px max(16px, calc((100vw - 1180px) / 2));
  border-bottom: 1px solid var(--line);
  background: rgba(255, 250, 241, 0.86);
  backdrop-filter: blur(18px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 8px;
  color: #fffaf1;
  background: var(--green-dark);
  font-weight: 800;
}

.brand strong,
.brand small {
  display: block;
}

.brand small {
  margin-top: 2px;
  color: var(--muted);
  font-size: 12px;
}

.admin-link {
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--green-dark);
  background: rgba(255, 255, 255, 0.56);
}
</style>
