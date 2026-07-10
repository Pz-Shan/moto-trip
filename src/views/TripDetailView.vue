<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Popup } from 'vant'
import PublicLayout from '../layouts/PublicLayout.vue'
import RouteMap from '../components/map/RouteMap.vue'
import WaypointList from '../components/waypoint/WaypointList.vue'
import { useTripStore } from '../stores/trip'
import { formatDateRange, formatDistance, formatDuration } from '../utils/format'
import type { FleetVehicle, Trip } from '../types/trip'

const route = useRoute()
const router = useRouter()
const tripStore = useTripStore()
const trip = ref<Trip>()
const vehiclePopupVisible = ref(false)

const fleetVehicles = computed<FleetVehicle[]>(() => {
  if (!trip.value) return []
  if (trip.value.fleetVehicles?.length) return trip.value.fleetVehicles

  return [
    {
      id: 'default',
      ...trip.value.vehicle,
    },
  ]
})

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
      <div class="mobile-detail">
        <section class="mobile-hero soft-card">
          <RouterLink class="back" to="/">返回看板</RouterLink>
          <div class="mobile-hero-head">
            <span v-if="trip.importSource" class="import-badge">文档导入</span>
            <span class="mobile-risk" :class="trip.rangeRisk">
              {{ trip.rangeRisk === 'none' ? '安全' : trip.rangeRisk === 'warning' ? '需关注' : '高风险' }}
            </span>
          </div>
          <h1>{{ trip.name }}</h1>
          <p>{{ trip.description }}</p>
          <p v-if="trip.importNote" class="import-note">{{ trip.importNote }}</p>
          <div class="tags">
            <span v-for="tag in trip.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="mobile-stat-grid">
            <article>
              <span>总里程</span>
              <strong>{{ formatDistance(trip.totalDistance) }}</strong>
            </article>
            <article>
              <span>预计骑行</span>
              <strong>{{ formatDuration(trip.estimatedDuration) }}</strong>
            </article>
            <article>
              <span>日期</span>
              <strong>{{ formatDateRange(trip.startDate, trip.endDate) }}</strong>
            </article>
            <article>
              <span>安全续航</span>
              <strong>{{ trip.vehicle.safeRange }} km</strong>
            </article>
          </div>
        </section>

        <section class="mobile-map-card soft-card">
          <div class="section-head compact">
            <div>
              <h2>路线总览</h2>
              <p>{{ trip.waypoints.length }} 个途经点 · {{ fleetVehicles.length }} 台车编组</p>
            </div>
          </div>
          <RouteMap :waypoints="trip.waypoints" readonly />
        </section>

        <section class="mobile-brief">
          <article class="brief-card soft-card">
            <span>续航风险</span>
            <strong>{{ trip.rangeRisk === 'none' ? '安全' : trip.rangeRisk === 'warning' ? '需关注' : '高风险' }}</strong>
            <small>按当前车队默认续航估算</small>
          </article>
          <article class="brief-card soft-card">
            <span>更新时间</span>
            <strong>{{ trip.updatedAt }}</strong>
            <small>出发前建议再确认一次</small>
          </article>
          <article class="brief-card soft-card">
            <span>最高海拔</span>
            <strong>{{ trip.elevationSummary?.max ?? '-' }} m</strong>
            <small>累计爬升 {{ trip.elevationSummary?.climb ?? '-' }} m</small>
          </article>
          <button type="button" class="brief-card soft-card action-card" @click="vehiclePopupVisible = true">
            <span>车辆信息</span>
            <strong>{{ fleetVehicles.length }} 台车</strong>
            <small>点按查看每台车角色与续航</small>
          </button>
        </section>

        <section class="soft-card panel mobile-panel">
          <div class="section-head">
            <div>
              <h2>途经点</h2>
              <p>按实际骑行顺序浏览停靠点</p>
            </div>
          </div>
          <WaypointList :waypoints="trip.waypoints" />
        </section>

        <section v-if="trip.schedule?.length" class="soft-card panel mobile-panel">
          <div class="section-head">
            <div>
              <h2>时间轴</h2>
              <p>手机端优先看时间和动作安排</p>
            </div>
          </div>
          <div class="timeline mobile-timeline">
            <article v-for="item in trip.schedule" :key="`${item.time}-${item.title}`">
              <time>{{ item.time }}</time>
              <div>
                <strong>{{ item.title }}</strong>
                <p v-if="item.description">{{ item.description }}</p>
              </div>
            </article>
          </div>
        </section>

        <section v-if="trip.returnPlans?.length" class="soft-card panel mobile-panel">
          <div class="section-head">
            <div>
              <h2>返程方案</h2>
              <p>到终点后再根据体力和时间决定</p>
            </div>
          </div>
          <div class="return-plans mobile-return-plans">
            <article v-for="plan in trip.returnPlans" :key="plan.name">
              <strong>{{ plan.name }}</strong>
              <p>{{ plan.route }}</p>
              <span>{{ formatDistance(plan.distance) }} · {{ formatDuration(plan.duration) }}</span>
              <small v-if="plan.note">{{ plan.note }}</small>
            </article>
          </div>
        </section>

        <section v-if="trip.checklist?.length" class="soft-card panel mobile-panel">
          <div class="section-head">
            <div>
              <h2>出发确认</h2>
              <p>出门前快速过一遍，不漏装备</p>
            </div>
          </div>
          <ul class="checklist mobile-checklist">
            <li v-for="item in trip.checklist" :key="item.name">
              <span></span>
              <div>
                <strong>{{ item.name }}</strong>
                <small v-if="item.appliesTo?.length">适用：{{ item.appliesTo.join('、') }}</small>
              </div>
            </li>
          </ul>
        </section>

        <section v-if="trip.safetyNotes?.length || trip.foodNotes?.length" class="soft-card panel mobile-panel">
          <div class="section-head">
            <div>
              <h2>注意事项</h2>
              <p>把最容易临场忘掉的信息放在最后集中看</p>
            </div>
          </div>
          <ul class="notes mobile-notes">
            <li v-for="note in trip.safetyNotes" :key="note">{{ note }}</li>
          </ul>
          <h3 v-if="trip.foodNotes?.length">美食记录</h3>
          <ul class="notes mobile-notes">
            <li v-for="note in trip.foodNotes" :key="note">{{ note }}</li>
          </ul>
        </section>
      </div>

      <div class="desktop-detail">
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

        <div class="summary soft-card desktop-summary">
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
          <aside class="soft-card panel support-card">
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

        <section class="soft-card panel">
          <h2>车辆信息</h2>
          <button type="button" class="vehicle-trigger" @click="vehiclePopupVisible = true">
            <div class="vehicle-grid">
              <article class="vehicle-card">
                <span>车队配置</span>
                <strong>{{ fleetVehicles.length }} 台车</strong>
                <small>{{ trip.vehicle.name }}</small>
              </article>
              <article class="vehicle-card">
                <span>默认安全续航</span>
                <strong>{{ trip.vehicle.safeRange }} km</strong>
                <small>点击查看每辆车详情</small>
              </article>
              <article class="vehicle-card">
                <span>预警里程</span>
                <strong>{{ trip.vehicle.warningRange }} km</strong>
                <small>按车队默认值展示</small>
              </article>
            </div>
          </button>
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

        <div class="notes-grid">
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
      </div>

      <Popup v-model:show="vehiclePopupVisible" round position="bottom" :style="{ height: '72%' }">
        <section class="vehicle-popup">
          <div class="vehicle-popup-head">
            <div>
              <h2>车辆详情</h2>
              <p>按车队编组查看每辆车的角色和续航信息。</p>
            </div>
            <button type="button" class="close-button" @click="vehiclePopupVisible = false">关闭</button>
          </div>

          <article class="vehicle-card">
            <div v-for="vehicle in fleetVehicles" :key="vehicle.id" class="fleet-row">
              <div class="fleet-title">
                <strong>{{ vehicle.name }}</strong>
                <span v-if="vehicle.role" class="tag">{{ vehicle.role }}</span>
              </div>
              <dl class="fleet-meta">
                <div v-if="vehicle.model">
                  <dt>车型</dt>
                  <dd>{{ vehicle.model }}</dd>
                </div>
                <div v-if="vehicle.displacement">
                  <dt>排量</dt>
                  <dd>{{ vehicle.displacement }}</dd>
                </div>
                <div v-if="vehicle.riderCount">
                  <dt>人数</dt>
                  <dd>{{ vehicle.riderCount }} 人</dd>
                </div>
                <div>
                  <dt>安全续航</dt>
                  <dd>{{ vehicle.safeRange }} km</dd>
                </div>
                <div>
                  <dt>预警里程</dt>
                  <dd>{{ vehicle.warningRange }} km</dd>
                </div>
                <div v-if="vehicle.theoreticalRange">
                  <dt>理论续航</dt>
                  <dd>{{ vehicle.theoreticalRange }} km</dd>
                </div>
                <div v-if="vehicle.fuelTankCapacity">
                  <dt>油箱容量</dt>
                  <dd>{{ vehicle.fuelTankCapacity }} L</dd>
                </div>
                <div v-if="vehicle.averageFuelConsumption">
                  <dt>平均油耗</dt>
                  <dd>{{ vehicle.averageFuelConsumption }} L/100km</dd>
                </div>
              </dl>
              <p v-if="vehicle.note" class="fleet-note">{{ vehicle.note }}</p>
            </div>
          </article>
        </section>
      </Popup>
    </section>
  </PublicLayout>
</template>

<style scoped>
.detail {
  display: grid;
  padding: 32px 0;
}

.mobile-detail {
  display: none;
}

.desktop-detail {
  display: grid;
  gap: 20px;
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

.notes-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(360px, 1.08fr);
  gap: 18px;
}

.panel {
  padding: 20px;
}

.panel h2 {
  margin-bottom: 16px;
}

.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.section-head.compact {
  margin-bottom: 12px;
}

.section-head p {
  max-width: none;
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
.vehicle-grid,
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

.vehicle-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.vehicle-trigger {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.vehicle-card {
  display: grid;
  gap: 6px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffdf7;
}

.vehicle-card span,
.vehicle-card small {
  color: var(--muted);
}

.vehicle-card strong {
  font-size: 28px;
  line-height: 1.1;
}

.mobile-hero,
.mobile-map-card,
.brief-card,
.mobile-panel {
  background: rgba(255, 250, 241, 0.94);
}

.mobile-hero-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.mobile-stat-grid,
.mobile-brief {
  display: grid;
  gap: 12px;
}

.mobile-stat-grid article,
.brief-card {
  display: grid;
  gap: 6px;
}

.mobile-stat-grid span,
.brief-card span,
.brief-card small {
  color: var(--muted);
}

.mobile-stat-grid strong {
  font-size: 28px;
  line-height: 1.08;
}

.action-card {
  width: 100%;
  border: 0;
  cursor: pointer;
  text-align: left;
}

.mobile-risk.none {
  color: var(--green-dark);
  background: rgba(31, 122, 92, 0.1);
}

.mobile-risk.warning {
  color: #8d5c14;
  background: rgba(217, 134, 34, 0.14);
}

.mobile-risk.danger {
  color: #8b2f23;
  background: rgba(185, 71, 53, 0.14);
}

.vehicle-popup {
  display: grid;
  gap: 18px;
  height: 100%;
  padding: 22px 20px 32px;
  overflow: auto;
  background: #fffaf1;
}

.vehicle-popup-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.vehicle-popup-head p,
.fleet-note {
  color: var(--muted);
}

.close-button {
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffdf7;
  cursor: pointer;
}

.fleet-row {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffdf7;
}

.fleet-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fleet-title strong {
  font-size: 24px;
}

.fleet-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.fleet-meta div {
  display: grid;
  gap: 4px;
}

.fleet-meta dt {
  color: var(--muted);
  font-size: 12px;
}

.fleet-meta dd {
  margin: 0;
  font-size: 18px;
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
  .notes-grid,
  .vehicle-grid,
  .fleet-meta,
  .return-plans,
  .timeline article {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .detail {
    padding: 10px 0 22px;
  }

  .desktop-detail {
    display: none;
  }

  .mobile-detail {
    display: grid;
    gap: 14px;
  }

  .mobile-hero {
    display: grid;
    gap: 12px;
    padding: 16px;
    background:
      linear-gradient(180deg, rgba(31, 122, 92, 0.09), rgba(255, 250, 241, 0.96) 58%),
      rgba(255, 250, 241, 0.96);
  }

  .back {
    font-size: 13px;
  }

  .import-badge {
    width: fit-content;
  }

  h1 {
    font-size: 26px;
    line-height: 1.14;
    letter-spacing: -0.02em;
  }

  p {
    max-width: none;
    font-size: 14px;
    line-height: 1.7;
  }

  .import-note {
    font-size: 14px;
  }

  .tags {
    gap: 6px;
  }

  .mobile-map-card,
  .mobile-panel,
  .brief-card {
    padding: 14px;
  }

  .mobile-risk {
    padding: 5px 9px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
  }

  .mobile-stat-grid,
  .mobile-brief {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .mobile-stat-grid article {
    padding: 12px;
    border: 1px solid rgba(33, 91, 71, 0.08);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.55);
  }

  .mobile-stat-grid strong,
  .brief-card strong {
    font-size: 20px;
    line-height: 1.2;
  }

  .mobile-stat-grid span,
  .brief-card span,
  .brief-card small {
    font-size: 12px;
  }

  .mobile-brief {
    grid-template-columns: 1fr 1fr;
  }

  .brief-card {
    min-height: 110px;
  }

  .action-card {
    border-radius: 18px;
  }

  .section-head {
    margin-bottom: 12px;
  }

  .section-head h2 {
    margin: 0;
    font-size: 20px;
  }

  .section-head p {
    font-size: 13px;
  }

  .mobile-panel :deep(.waypoint-list) {
    gap: 12px;
  }

  .mobile-timeline article {
    grid-template-columns: 76px 1fr;
    gap: 10px;
    padding-bottom: 12px;
  }

  .mobile-timeline time {
    font-size: 15px;
  }

  .mobile-return-plans article,
  .vehicle-card,
  .fleet-row,
  .brief-card {
    padding: 12px;
  }

  .mobile-return-plans {
    grid-template-columns: 1fr;
  }

  .mobile-return-plans span {
    font-size: 15px;
  }

  .mobile-checklist li {
    grid-template-columns: 18px 1fr;
    gap: 8px;
  }

  .mobile-checklist li > span {
    width: 16px;
    height: 16px;
  }

  .mobile-checklist small,
  .mobile-return-plans small {
    font-size: 13px;
  }

  .mobile-notes {
    gap: 8px;
    padding-left: 16px;
    font-size: 14px;
    line-height: 1.72;
  }

  .vehicle-card strong {
    font-size: 22px;
  }

  .vehicle-popup {
    gap: 14px;
    padding: 18px 14px 26px;
  }

  .vehicle-popup-head {
    gap: 10px;
  }

  .vehicle-popup-head h2 {
    font-size: 24px;
  }

  .vehicle-popup-head p {
    font-size: 14px;
  }

  .close-button {
    padding: 7px 10px;
    font-size: 14px;
  }

  .fleet-title strong {
    font-size: 20px;
  }

  .fleet-meta dd {
    font-size: 16px;
  }
}
</style>
