<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import { useAdminStore } from '../stores/admin'
import { useTripStore } from '../stores/trip'
import { formatDistance } from '../utils/format'

const router = useRouter()
const adminStore = useAdminStore()
const tripStore = useTripStore()

onMounted(() => {
  if (!adminStore.isAuthed) {
    router.replace('/admin')
    return
  }
  tripStore.fetchAdminTrips()
})
</script>

<template>
  <AdminLayout>
    <section class="admin-page">
      <div class="head">
        <div>
          <h1>路书管理</h1>
          <p>创建、发布、下架和维护路书数据。当前版本先使用 mock 数据展示管理流程。</p>
        </div>
        <button type="button">新建路书</button>
      </div>

      <div class="table soft-card">
        <RouterLink
          v-for="trip in tripStore.adminTrips"
          :key="trip.id"
          class="row"
          :to="`/admin/trips/${trip.id}`"
        >
          <strong>{{ trip.name }}</strong>
          <span>{{ trip.status }}</span>
          <span>{{ formatDistance(trip.totalDistance) }}</span>
          <span>{{ trip.updatedAt }}</span>
        </RouterLink>
      </div>
    </section>
  </AdminLayout>
</template>

<style scoped>
.admin-page {
  display: grid;
  gap: 18px;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

h1,
p {
  margin: 0;
}

p {
  margin-top: 8px;
  color: var(--muted);
}

button {
  padding: 10px 14px;
  border: 0;
  border-radius: 8px;
  color: #fffaf1;
  background: var(--green-dark);
  cursor: pointer;
}

.table {
  overflow: hidden;
}

.row {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) 120px 120px 170px;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--line);
  align-items: center;
}

.row:last-child {
  border-bottom: 0;
}

.row span {
  color: var(--muted);
}

@media (max-width: 760px) {
  .head,
  .row {
    grid-template-columns: 1fr;
  }

  .head {
    display: grid;
  }
}
</style>
