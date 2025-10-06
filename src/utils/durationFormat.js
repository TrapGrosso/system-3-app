/**
 * Format duration in milliseconds to a human-readable string
 * 
 * Rules:
 * - If duration is 0 or negative, return "-"
 * - If duration is less than 1 second, show decimal seconds (e.g., 0.5s)
 * - If duration is 1 second or more, show seconds without decimals
 * - For longer durations, show minutes, hours, and days as appropriate
 * - Always show at most 3 non-zero units
 * 
 * @param {number} durationMs - Duration in milliseconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(durationMs) {
  if (!durationMs || durationMs <= 0) return '-'
  
  // Calculate time components
  const seconds = Math.floor((durationMs / 1000) % 60)
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60)
  const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24)
  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24))
  
  // For durations less than 1 second, show decimal seconds
  if (durationMs < 1000) {
    const decimalSeconds = (durationMs / 1000).toFixed(1)
    // Remove trailing zero (e.g., 0.0 instead of 0.0)
    return `${decimalSeconds.replace(/\.0$/, '')}s`
  }
  
  // Build units array with non-zero components
  const units = []
  if (days > 0) units.push(`${days}d`)
  if (hours > 0) units.push(`${hours}h`)
  if (minutes > 0) units.push(`${minutes}m`)
  if (seconds > 0) units.push(`${seconds}s`)
  
  // Return up to 3 non-zero units
  return units.slice(0, 3).join(' ')
}
