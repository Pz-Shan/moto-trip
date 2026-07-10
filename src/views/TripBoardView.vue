<script setup lang="ts">
import { onMounted } from 'vue'
import PublicLayout from '../layouts/PublicLayout.vue'
import TripCard from '../components/trip/TripCard.vue'
import { useTripStore } from '../stores/trip'

const tripStore = useTripStore()

onMounted(() => {
  tripStore.fetchPublishedTrips()
})
</script>

<template>
  <PublicLayout>
    <section class="hero page-shell">
      <div>
        <span class="eyebrow">PUBLIC ROADBOOK</span>
        <h1>选一条路，先在地图里骑一遍。</h1>
        <p>无需登录，直接查看已发布路书。加油点、住宿点、里程和续航风险都在一张看板里。</p>
      </div>
      <div class="hero-panel soft-card">
        <div class="metric">
          <strong>{{ tripStore.trips.length }}</strong>
          <span>已发布路书</span>
        </div>
        <div class="metric">
          <strong>{{ tripStore.tags.length - 1 }}</strong>
          <span>路线标签</span>
        </div>
      </div>
    </section>

    <section class="toolbar page-shell soft-card">
      <input v-model="tripStore.keyword" type="search" placeholder="搜索路书、地点或简介" />
      <div class="tag-filter">
        <button
          v-for="tag in tripStore.tags"
          :key="tag"
          type="button"
          :class="{ active: tripStore.selectedTag === tag }"
          @click="tripStore.selectedTag = tag"
        >
          {{ tag }}
        </button>
      </div>
    </section>

    <section class="trip-grid page-shell">
      <TripCard v-for="trip in tripStore.filteredTrips" :key="trip.id" :trip="trip" />
      <div v-if="!tripStore.loading && !tripStore.filteredTrips.length" class="empty soft-card">
        没有匹配的已发布路书。
      </div>
    </section>
  </PublicLayout>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 24px;
  padding: 54px 0 28px;
}

.eyebrow {
  color: var(--green);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

h1 {
  max-width: 720px;
  margin: 12px 0;
  font-size: clamp(34px, 6vw, 68px);
  line-height: 1.02;
}

.hero p {
  max-width: 620px;
  margin: 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.8;
}

.hero-panel {
  display: grid;
  align-content: center;
  gap: 24px;
  padding: 24px;
}

.toolbar {
  display: grid;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
}

input {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffdf7;
  color: var(--ink);
  outline: none;
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-filter button {
  padding: 7px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fffdf7;
  color: var(--muted);
  cursor: pointer;
}

.tag-filter button.active {
  border-color: var(--green);
  background: var(--green);
  color: #fffaf1;
}

.trip-grid {
  display: grid;
  gap: 18px;
}

.empty {
  padding: 28px;
  color: var(--muted);
  text-align: center;
}

@media (max-width: 760px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 36px;
  }
}
</style>
