<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import PublicLayout from '../layouts/PublicLayout.vue'
import { useAdminStore } from '../stores/admin'

const router = useRouter()
const adminStore = useAdminStore()
const password = ref('')

function submit() {
  if (adminStore.login(password.value)) {
    router.push('/admin/trips')
    return
  }

  showToast('管理口令不正确')
}
</script>

<template>
  <PublicLayout>
    <section class="access page-shell">
      <form class="soft-card" @submit.prevent="submit">
        <span>ADMIN</span>
        <h1>后台管理入口</h1>
        <p>开发期默认口令：moto2026。上线前应替换为云函数校验或正式账号体系。</p>
        <input v-model="password" type="password" placeholder="输入管理口令" />
        <button type="submit">进入后台</button>
      </form>
    </section>
  </PublicLayout>
</template>

<style scoped>
.access {
  display: grid;
  min-height: calc(100vh - 80px);
  place-items: center;
  padding: 32px 0;
}

form {
  display: grid;
  width: min(420px, 100%);
  gap: 14px;
  padding: 28px;
}

span {
  color: var(--green);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

h1,
p {
  margin: 0;
}

p {
  color: var(--muted);
  line-height: 1.7;
}

input,
button {
  height: 44px;
  border-radius: 8px;
}

input {
  padding: 0 12px;
  border: 1px solid var(--line);
}

button {
  border: 0;
  color: #fffaf1;
  background: var(--green-dark);
  cursor: pointer;
}
</style>
