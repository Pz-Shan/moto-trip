<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { loadAmap } from '../../services/amap'
import type { Waypoint } from '../../types/trip'

defineProps<{
  waypoints: Waypoint[]
  readonly?: boolean
}>()

const mapEl = ref<HTMLDivElement | null>(null)
const status = ref('地图加载中')

onMounted(async () => {
  if (!mapEl.value) return

  try {
    await loadAmap()
    status.value = '高德地图已就绪，路线绘制将在接入真实数据后启用'
  } catch (error) {
    status.value = error instanceof Error ? error.message : '地图加载失败'
  }
})
</script>

<template>
  <section class="route-map">
    <div ref="mapEl" class="map-canvas">
      <div class="map-panel">
        <strong>{{ status }}</strong>
        <span>当前展示 {{ waypoints.length }} 个途经点</span>
      </div>
      <ol class="map-points">
        <li v-for="point in waypoints" :key="point.id">
          <span>{{ point.order }}</span>
          {{ point.name }}
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.route-map {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #dfe8df;
}

.map-canvas {
  position: relative;
  min-height: 360px;
  background:
    linear-gradient(90deg, rgba(31, 122, 92, 0.12) 1px, transparent 1px),
    linear-gradient(rgba(31, 122, 92, 0.12) 1px, transparent 1px),
    linear-gradient(145deg, #e8eadf, #c7d8cf);
  background-size:
    36px 36px,
    36px 36px,
    auto;
}

.map-panel {
  position: absolute;
  left: 18px;
  top: 18px;
  display: grid;
  gap: 6px;
  max-width: min(360px, calc(100% - 36px));
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 250, 241, 0.9);
  box-shadow: var(--shadow);
}

.map-panel span {
  color: var(--muted);
  font-size: 13px;
}

.map-points {
  position: absolute;
  right: 18px;
  bottom: 18px;
  display: grid;
  max-width: min(280px, calc(100% - 36px));
  gap: 8px;
  margin: 0;
  padding: 14px;
  border-radius: 8px;
  background: rgba(23, 63, 50, 0.9);
  color: #fffaf1;
  list-style: none;
}

.map-points li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.map-points span {
  display: grid;
  width: 22px;
  height: 22px;
  flex: none;
  place-items: center;
  border-radius: 50%;
  background: #fffaf1;
  color: #173f32;
  font-size: 12px;
  font-weight: 700;
}
</style>
