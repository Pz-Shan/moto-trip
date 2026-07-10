import { mockTrips } from '../data/mockTrips'
import type { Trip } from '../types/trip'

const USE_MOCK = true

export async function listPublishedTrips(): Promise<Trip[]> {
  if (USE_MOCK) {
    return mockTrips.filter((trip) => trip.status === 'published')
  }

  return []
}

export async function getTripById(id: string): Promise<Trip | undefined> {
  if (USE_MOCK) {
    return mockTrips.find((trip) => trip.id === id && trip.status === 'published')
  }

  return undefined
}

export async function listAdminTrips(): Promise<Trip[]> {
  if (USE_MOCK) {
    return mockTrips
  }

  return []
}
