export function formatDistance(meters: number) {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (!hours) return `${mins} 分钟`
  if (!mins) return `${hours} 小时`
  return `${hours} 小时 ${mins} 分钟`
}

export function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return '时间待定'
  if (start && !end) return start
  if (!start && end) return end
  return `${start} - ${end}`
}
