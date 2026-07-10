import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getTripById, listAdminTrips, listPublishedTrips } from '../api/trip'
import type { Trip } from '../types/trip'

export const useTripStore = defineStore('trip', () => {
  const trips = ref<Trip[]>([])
  const adminTrips = ref<Trip[]>([])
  const loading = ref(false)
  const keyword = ref('')
  const selectedTag = ref('全部')

  const tags = computed(() => {
    const values = new Set<string>()
    trips.value.forEach((trip) => trip.tags.forEach((tag) => values.add(tag)))
    return ['全部', ...Array.from(values)]
  })

  const filteredTrips = computed(() => {
    const normalizedKeyword = keyword.value.trim().toLowerCase()

    return trips.value.filter((trip) => {
      const matchesKeyword =
        !normalizedKeyword ||
        trip.name.toLowerCase().includes(normalizedKeyword) ||
        trip.description.toLowerCase().includes(normalizedKeyword)
      const matchesTag = selectedTag.value === '全部' || trip.tags.includes(selectedTag.value)

      return matchesKeyword && matchesTag
    })
  })

  async function fetchPublishedTrips() {
    loading.value = true
    try {
      trips.value = await listPublishedTrips()
    } finally {
      loading.value = false
    }
  }

  async function fetchAdminTrips() {
    loading.value = true
    try {
      adminTrips.value = await listAdminTrips()
    } finally {
      loading.value = false
    }
  }

  async function fetchTrip(id: string) {
    return getTripById(id)
  }

  return {
    trips,
    adminTrips,
    loading,
    keyword,
    selectedTag,
    tags,
    filteredTrips,
    fetchPublishedTrips,
    fetchAdminTrips,
    fetchTrip,
  }
})
