<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PublicLayout from '../layouts/PublicLayout.vue'
import RouteMap from '../components/map/RouteMap.vue'
import WaypointList from '../components/waypoint/WaypointList.vue'
import { useTripStore } from '../stores/trip'
import { formatDateRange, formatDistance, formatDuration } from '../utils/format'
import type { Trip } from '../types/trip'

const route = useRoute()
const router = useRouter()
const tripStore = useTripStore()
const trip = ref<Trip>()

onMounted(async () => {
  const result = await tripStore.fetchTrip(String(route.params.id))
  if (!result) {
    router.replace('/')
    return
  }
  trip.value = result
})
</script>

<template>
  <PublicLayout>
    <section v-if="trip" class="detail page-shell">
      <div class="detail-head">
        <RouterLink class="back" to="/">返回看板</RouterLink>
        <h1>{{ trip.name }}</h1>
        <p>{{ trip.description }}</p>
        <div class="tags">
          <span v-for="tag in trip.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <div class="summary soft-card">
        <div class="metric">
          <strong>{{ formatDistance(trip.totalDistance) }}</strong>
          <span>总里程</span>
        </div>
        <div class="metric">
          <strong>{{ formatDuration(trip.estimatedDuration) }}</strong>
          <span>预计骑行</span>
        </div>
        <div class="metric">
          <strong>{{ formatDateRange(trip.startDate, trip.endDate) }}</strong>
          <span>日期</span>
        </div>
        <div class="metric">
          <strong>{{ trip.vehicle.safeRange }} km</strong>
          <span>{{ trip.vehicle.name }} 安全续航</span>
        </div>
      </div>

      <RouteMap :waypoints="trip.waypoints" readonly />

      <div class="detail-grid">
        <section class="soft-card panel">
          <h2>途经点</h2>
          <WaypointList :waypoints="trip.waypoints" />
        </section>
        <aside class="soft-card panel">
          <h2>行程辅助</h2>
          <dl>
            <div>
              <dt>续航风险</dt>
              <dd>{{ trip.rangeRisk === 'none' ? '安全' : trip.rangeRisk === 'warning' ? '需关注' : '高风险' }}</dd>
            </div>
            <div>
              <dt>最高海拔</dt>
              <dd>{{ trip.elevationSummary?.max ?? '-' }} m</dd>
            </div>
            <div>
              <dt>累计爬升</dt>
              <dd>{{ trip.elevationSummary?.climb ?? '-' }} m</dd>
            </div>
            <div>
              <dt>更新时间</dt>
              <dd>{{ trip.updatedAt }}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  </PublicLayout>
</template>

<style scoped>
.detail {
  display: grid;
  gap: 20px;
  padding: 32px 0;
}

.detail-head {
  display: grid;
  gap: 12px;
}

.back {
  color: var(--green-dark);
  font-weight: 700;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  font-size: clamp(34px, 5vw, 58px);
  line-height: 1.05;
}

p {
  max-width: 760px;
  color: var(--muted);
  line-height: 1.8;
}

.tags,
.summary {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.summary {
  justify-content: space-between;
  padding: 18px;
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 18px;
}

.panel {
  padding: 20px;
}

.panel h2 {
  margin-bottom: 16px;
}

dl {
  display: grid;
  gap: 14px;
  margin: 0;
}

dl div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

dt {
  color: var(--muted);
}

dd {
  margin: 0;
  font-weight: 700;
}

@media (max-width: 860px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
