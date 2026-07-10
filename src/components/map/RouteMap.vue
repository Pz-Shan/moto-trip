<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadAmap } from '../../services/amap'
import type { Waypoint } from '../../types/trip'

interface AMapLngLat {
  new (longitude: number, latitude: number): unknown
}

interface AMapMap {
  add(control: unknown): void
  add(overlay: unknown[] | unknown): void
  clearMap(): void
  destroy(): void
  setFitView(overlays?: unknown[], immediately?: boolean, avoid?: number[], maxZoom?: number): void
}

interface AMapStatic {
  Map: new (
    container: HTMLElement,
    options: {
      center: [number, number]
      zoom: number
      viewMode?: '2D' | '3D'
      mapStyle?: string
    },
  ) => AMapMap
  Marker: new (options: {
    position: unknown
    title?: string
    label?: {
      content: string
      direction?: string
      offset?: unknown
    }
    anchor?: string
  }) => unknown
  Polyline: new (options: {
    path: unknown[]
    strokeColor: string
    strokeWeight: number
    strokeOpacity: number
    lineJoin?: string
    lineCap?: string
  }) => unknown
  LngLat: AMapLngLat
  Pixel: new (x: number, y: number) => unknown
  Scale: new () => unknown
  ToolBar: new (options?: { position?: string }) => unknown
}

const props = defineProps<{
  waypoints: Waypoint[]
  readonly?: boolean
}>()

const mapEl = ref<HTMLDivElement | null>(null)
const status = ref('地图加载中')
const hasError = ref(false)
let AMap: AMapStatic | null = null
let map: AMapMap | null = null

const validWaypoints = computed(() =>
  props.waypoints.filter((point) => Number.isFinite(point.longitude) && Number.isFinite(point.latitude)),
)

function getCenter(): [number, number] {
  const first = validWaypoints.value[0]
  if (!first) return [104.0668, 30.5728]
  return [first.longitude, first.latitude]
}

function createLngLat(point: Waypoint) {
  if (!AMap) return null
  return new AMap.LngLat(point.longitude, point.latitude)
}

function renderRoute() {
  if (!AMap || !map) return

  map.clearMap()

  const positions = validWaypoints.value.map(createLngLat).filter(Boolean) as unknown[]
  const overlays: unknown[] = []

  validWaypoints.value.forEach((point) => {
    const position = createLngLat(point)
    if (!position || !AMap) return

    const marker = new AMap.Marker({
      position,
      title: point.name,
      anchor: 'bottom-center',
      label: {
        content: `<div class="amap-route-label">${point.order}. ${point.name}</div>`,
        direction: 'top',
        offset: new AMap.Pixel(0, -8),
      },
    })

    overlays.push(marker)
  })

  if (positions.length >= 2) {
    overlays.push(
      new AMap.Polyline({
        path: positions,
        strokeColor: '#1f7a5c',
        strokeWeight: 7,
        strokeOpacity: 0.88,
        lineJoin: 'round',
        lineCap: 'round',
      }),
    )
  }

  if (overlays.length) {
    map.add(overlays)
    map.setFitView(overlays, false, [48, 48, 48, 48], 12)
  }

  status.value = positions.length >= 2 ? '实际地图已加载，当前为途经点连线预览' : '实际地图已加载'
}

onMounted(async () => {
  if (!mapEl.value) return

  try {
    AMap = (await loadAmap()) as AMapStatic
    map = new AMap.Map(mapEl.value, {
      center: getCenter(),
      zoom: 8,
      viewMode: '2D',
      mapStyle: 'amap://styles/normal',
    })
    map.add(new AMap.Scale())
    map.add(new AMap.ToolBar({ position: 'RB' }))
    renderRoute()
  } catch (error) {
    hasError.value = true
    status.value = error instanceof Error ? error.message : '地图加载失败'
  }
})

watch(
  () => props.waypoints,
  () => renderRoute(),
  { deep: true },
)

onBeforeUnmount(() => {
  map?.destroy()
  map = null
})
</script>

<template>
  <section class="route-map">
    <div ref="mapEl" class="map-canvas">
      <div class="map-panel" :class="{ error: hasError }">
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
  background: #dfe8df;
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
  pointer-events: none;
}

.map-panel span {
  color: var(--muted);
  font-size: 13px;
}

.map-panel.error {
  border-color: rgba(185, 71, 53, 0.32);
  color: var(--red);
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
  pointer-events: none;
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

:global(.amap-route-label) {
  padding: 4px 7px;
  border: 1px solid rgba(31, 122, 92, 0.22);
  border-radius: 999px;
  color: #173f32;
  background: rgba(255, 250, 241, 0.94);
  box-shadow: 0 8px 20px rgba(44, 42, 36, 0.16);
  font-size: 12px;
  white-space: nowrap;
}

@media (max-width: 720px) {
  .map-canvas {
    min-height: 230px;
  }

  .map-panel {
    left: 10px;
    top: 10px;
    gap: 4px;
    max-width: calc(100% - 20px);
    padding: 9px 10px;
    border-radius: 6px;
  }

  .map-panel strong {
    font-size: 12px;
    line-height: 1.3;
  }

  .map-panel span {
    font-size: 11px;
  }

  .map-points {
    display: none;
  }

  :global(.amap-route-label) {
    padding: 3px 6px;
    font-size: 11px;
  }
}
</style>
