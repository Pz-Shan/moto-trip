export type TripStatus = 'draft' | 'published' | 'archived' | 'completed' | 'cancelled'

export type WaypointType =
  | 'start'
  | 'pass'
  | 'destination'
  | 'fuel'
  | 'rest'
  | 'hotel'
  | 'scenic'
  | 'repair'
  | 'food'

export type RangeRisk = 'none' | 'warning' | 'danger'

export type ImportSource = 'manual' | 'document' | 'text' | 'markdown'

export interface VehicleConfig {
  name: string
  fuelTankCapacity?: number
  averageFuelConsumption?: number
  theoreticalRange?: number
  safeRange: number
  warningRange: number
}

export interface FleetVehicle extends VehicleConfig {
  id: string
  role?: string
  model?: string
  displacement?: string
  riderCount?: number
  note?: string
}

export interface Waypoint {
  id: string
  name: string
  address?: string
  longitude: number
  latitude: number
  order: number
  type: WaypointType
  remark?: string
  stayDurationMinutes?: number
  distanceFromPrevious?: number
  durationFromPrevious?: number
  accumulatedDistance?: number
  distanceFromLastFuel?: number
  estimatedArrivalTime?: string
}

export interface RouteSegment {
  fromWaypointId: string
  toWaypointId: string
  distance: number
  duration?: number
  rangeRisk?: RangeRisk
}

export interface ScheduleItem {
  time: string
  title: string
  description?: string
}

export interface ReturnPlan {
  name: string
  route: string
  distance: number
  duration: number
  note?: string
}

export interface ChecklistItem {
  name: string
  appliesTo?: string[]
  required?: boolean
}

export interface Trip {
  id: string
  name: string
  description: string
  coverImageUrl?: string
  status: TripStatus
  importSource?: ImportSource
  importNote?: string
  tags: string[]
  startDate?: string
  endDate?: string
  vehicle: VehicleConfig
  fleetVehicles?: FleetVehicle[]
  totalDistance: number
  estimatedDuration: number
  rangeRisk: RangeRisk
  elevationSummary?: {
    min: number
    max: number
    climb: number
    descent: number
  }
  waypoints: Waypoint[]
  segments: RouteSegment[]
  schedule?: ScheduleItem[]
  returnPlans?: ReturnPlan[]
  checklist?: ChecklistItem[]
  safetyNotes?: string[]
  foodNotes?: string[]
  updatedAt: string
}
