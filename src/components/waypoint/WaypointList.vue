<script setup lang="ts">
import { formatDistance, formatDuration } from '../../utils/format'
import type { Waypoint } from '../../types/trip'

defineProps<{
  waypoints: Waypoint[]
}>()

const typeLabels: Record<string, string> = {
  start: '起点',
  pass: '途经',
  destination: '终点',
  fuel: '加油',
  rest: '休息',
  hotel: '住宿',
  scenic: '景点',
  repair: '维修',
  food: '餐饮',
}
</script>

<template>
  <ol class="waypoint-list">
    <li v-for="point in waypoints" :key="point.id" class="waypoint">
      <div class="order">{{ point.order }}</div>
      <div class="body">
        <div class="head">
          <strong>{{ point.name }}</strong>
          <span class="tag">{{ typeLabels[point.type] }}</span>
        </div>
        <p v-if="point.remark">{{ point.remark }}</p>
        <div class="meta">
          <span v-if="point.distanceFromPrevious">上一段 {{ formatDistance(point.distanceFromPrevious) }}</span>
          <span v-if="point.durationFromPrevious">约 {{ formatDuration(point.durationFromPrevious) }}</span>
          <span v-if="point.estimatedArrivalTime">预计 {{ point.estimatedArrivalTime }}</span>
        </div>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.waypoint-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.waypoint {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
}

.order {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  color: #fffaf1;
  background: var(--green-dark);
  font-weight: 800;
}

.body {
  display: grid;
  gap: 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

p {
  margin: 0;
  color: var(--muted);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--muted);
  font-size: 13px;
}
</style>
