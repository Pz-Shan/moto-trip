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
        <span v-if="trip.importSource" class="import-badge">文档导入</span>
        <h1>{{ trip.name }}</h1>
        <p>{{ trip.description }}</p>
        <p v-if="trip.importNote" class="import-note">{{ trip.importNote }}</p>
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

      <section v-if="trip.schedule?.length" class="soft-card panel">
        <h2>时间轴</h2>
        <div class="timeline">
          <article v-for="item in trip.schedule" :key="`${item.time}-${item.title}`">
            <time>{{ item.time }}</time>
            <div>
              <strong>{{ item.title }}</strong>
              <p v-if="item.description">{{ item.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <section v-if="trip.returnPlans?.length" class="soft-card panel">
        <h2>返程方案</h2>
        <div class="return-plans">
          <article v-for="plan in trip.returnPlans" :key="plan.name">
            <strong>{{ plan.name }}</strong>
            <p>{{ plan.route }}</p>
            <span>{{ formatDistance(plan.distance) }} · {{ formatDuration(plan.duration) }}</span>
            <small v-if="plan.note">{{ plan.note }}</small>
          </article>
        </div>
      </section>

      <div class="detail-grid">
        <section v-if="trip.checklist?.length" class="soft-card panel">
          <h2>出发确认</h2>
          <ul class="checklist">
            <li v-for="item in trip.checklist" :key="item.name">
              <span></span>
              <div>
                <strong>{{ item.name }}</strong>
                <small v-if="item.appliesTo?.length">适用：{{ item.appliesTo.join('、') }}</small>
              </div>
            </li>
          </ul>
        </section>

        <section v-if="trip.safetyNotes?.length || trip.foodNotes?.length" class="soft-card panel">
          <h2>注意事项</h2>
          <ul class="notes">
            <li v-for="note in trip.safetyNotes" :key="note">{{ note }}</li>
          </ul>
          <h3 v-if="trip.foodNotes?.length">美食记录</h3>
          <ul class="notes">
            <li v-for="note in trip.foodNotes" :key="note">{{ note }}</li>
          </ul>
        </section>
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

.import-badge {
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  color: #fffaf1;
  background: var(--blue);
  font-size: 12px;
  font-weight: 800;
}

h1,
h2,
h3,
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

.import-note {
  padding: 10px 12px;
  border: 1px solid rgba(36, 107, 145, 0.18);
  border-radius: 8px;
  background: rgba(36, 107, 145, 0.08);
  color: var(--blue);
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

.timeline,
.return-plans,
.checklist,
.notes {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
}

.timeline article {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.timeline time {
  color: var(--green-dark);
  font-weight: 800;
}

.timeline strong,
.return-plans strong,
.checklist strong {
  display: block;
  margin-bottom: 4px;
}

.timeline p,
.return-plans p {
  color: var(--muted);
}

.return-plans {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.return-plans article {
  display: grid;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffdf7;
}

.return-plans span {
  color: var(--green-dark);
  font-weight: 800;
}

.return-plans small,
.checklist small {
  color: var(--muted);
  line-height: 1.6;
}

.checklist,
.notes {
  list-style: none;
}

.checklist li {
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 10px;
  align-items: start;
}

.checklist li > span {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  border: 2px solid var(--green);
  border-radius: 5px;
}

.notes {
  color: var(--muted);
  line-height: 1.7;
  list-style: disc;
  padding-left: 18px;
}

h3 {
  margin-top: 18px;
  font-size: 16px;
}

@media (max-width: 860px) {
  .detail-grid,
  .return-plans,
  .timeline article {
    grid-template-columns: 1fr;
  }
}
</style>
