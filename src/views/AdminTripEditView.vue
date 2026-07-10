<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import RouteMap from '../components/map/RouteMap.vue'
import WaypointList from '../components/waypoint/WaypointList.vue'
import { useAdminStore } from '../stores/admin'
import { useTripStore } from '../stores/trip'
import type { Trip } from '../types/trip'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()
const tripStore = useTripStore()
const trip = ref<Trip>()

onMounted(async () => {
  if (!adminStore.isAuthed) {
    router.replace('/admin')
    return
  }

  trip.value = await tripStore.fetchTrip(String(route.params.id))
})
</script>

<template>
  <AdminLayout>
    <section v-if="trip" class="edit-page">
      <div class="head">
        <div>
          <RouterLink to="/admin/trips">返回路书列表</RouterLink>
          <h1>{{ trip.name }}</h1>
          <p>后台编辑骨架已就绪，下一步接入表单保存、云函数和真实路线规划。</p>
        </div>
        <div class="actions">
          <button type="button">保存草稿</button>
          <button type="button" class="primary">发布</button>
        </div>
      </div>

      <div class="grid">
        <section class="soft-card panel">
          <h2>基础信息</h2>
          <label>
            路书名称
            <input :value="trip.name" readonly />
          </label>
          <label>
            简介
            <textarea :value="trip.description" readonly rows="4" />
          </label>
        </section>

        <section class="soft-card panel">
          <h2>车辆续航</h2>
          <label>
            车辆
            <input :value="trip.vehicle.name" readonly />
          </label>
          <label>
            安全续航
            <input :value="`${trip.vehicle.safeRange} km`" readonly />
          </label>
        </section>
      </div>

      <RouteMap :waypoints="trip.waypoints" />

      <section class="soft-card panel">
        <h2>途经点配置</h2>
        <WaypointList :waypoints="trip.waypoints" />
      </section>
    </section>
  </AdminLayout>
</template>

<style scoped>
.edit-page {
  display: grid;
  gap: 18px;
}

.head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  margin-top: 8px;
}

p {
  margin-top: 8px;
  color: var(--muted);
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffaf1;
  cursor: pointer;
}

button.primary {
  border-color: var(--green-dark);
  color: #fffaf1;
  background: var(--green-dark);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.panel {
  display: grid;
  gap: 14px;
  padding: 20px;
}

label {
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-size: 13px;
}

input,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--ink);
  background: #fffdf7;
}

@media (max-width: 860px) {
  .head,
  .grid {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
