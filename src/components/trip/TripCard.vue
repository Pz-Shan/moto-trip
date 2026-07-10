<script setup lang="ts">
import { computed } from 'vue'
import { formatDateRange, formatDistance, formatDuration } from '../../utils/format'
import type { Trip } from '../../types/trip'

const props = defineProps<{
  trip: Trip
}>()

const riskLabel = computed(() => {
  if (props.trip.rangeRisk === 'danger') return '高风险'
  if (props.trip.rangeRisk === 'warning') return '需关注'
  return '安全'
})
</script>

<template>
  <RouterLink class="trip-card soft-card" :to="`/trip/${trip.id}`">
    <div class="cover">
      <span>{{ trip.name.slice(0, 2) }}</span>
    </div>
    <div class="content">
      <div class="title-row">
        <h2>{{ trip.name }}</h2>
        <span class="risk" :class="trip.rangeRisk">{{ riskLabel }}</span>
      </div>
      <p>{{ trip.description }}</p>
      <div class="tags">
        <span v-for="tag in trip.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="stats">
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
          <span>出行时间</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.trip-card {
  display: grid;
  grid-template-columns: 180px 1fr;
  min-height: 220px;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.trip-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 60px rgba(44, 42, 36, 0.16);
}

.cover {
  display: grid;
  place-items: end start;
  padding: 18px;
  color: #fffaf1;
  background:
    linear-gradient(145deg, rgba(20, 84, 63, 0.92), rgba(36, 107, 145, 0.84)),
    repeating-linear-gradient(45deg, transparent 0 14px, rgba(255, 255, 255, 0.1) 14px 16px);
}

.cover span {
  font-size: 34px;
  font-weight: 800;
}

.content {
  display: grid;
  gap: 14px;
  padding: 20px;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

h2 {
  margin: 0;
  font-size: 25px;
  line-height: 1.2;
}

p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.tags,
.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.stats {
  align-items: end;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}

.risk {
  flex: none;
  padding: 5px 10px;
  border-radius: 999px;
  color: #fffaf1;
  font-size: 12px;
}

.risk.none {
  background: var(--green);
}

.risk.warning {
  background: var(--amber);
}

.risk.danger {
  background: var(--red);
}

@media (max-width: 680px) {
  .trip-card {
    grid-template-columns: 1fr;
  }

  .cover {
    min-height: 118px;
  }
}
</style>
