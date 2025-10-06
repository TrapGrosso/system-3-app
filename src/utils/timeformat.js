/**
 * Time formatting utilities for consistent date/time display across the application.
 * Provides absolute, relative, smart, and specialized formatting functions.
 */

// Default fallback for null/invalid dates
export const DEFAULT_FALLBACK = "—"

/**
 * Parse input into a Date object.
 * @param {Date|string|number} value - Input value to parse
 * @param {Object} options - Parsing options
 * @param {"ms"|"s"} options.epochUnit - Unit for numeric timestamps (default: "ms")
 * @param {boolean} options.assumeUTC - Treat date strings as UTC (default: false)
 * @returns {Date|null} Parsed Date or null if invalid
 */
export function parseInput(value, { epochUnit = "ms", assumeUTC = false } = {}) {
  if (value === null || value === undefined) return null
  if (value instanceof Date) return value
  
  let date
  if (typeof value === "number") {
    // Handle epoch timestamps
    const timestamp = epochUnit === "s" ? value * 1000 : value
    date = new Date(timestamp)
  } else if (typeof value === "string") {
    // Handle date strings
    if (assumeUTC && !value.endsWith("Z") && !value.includes("T")) {
      // If we're assuming UTC for date-only strings, append UTC indicator
      date = new Date(value + "T00:00:00Z")
    } else {
      date = new Date(value)
    }
  } else {
    return null
  }
  
  return isNaN(date.getTime()) ? null : date
}

/**
 * Format a date as absolute time (date, time, or datetime).
 * @param {Date|string|number} value - Date to format
 * @param {Object} options - Formatting options
 * @param {"datetime"|"date"|"time"} options.mode - What to display (default: "datetime")
 * @param {"full"|"long"|"medium"|"short"} options.dateStyle - Date format style
 * @param {"full"|"long"|"medium"|"short"} options.timeStyle - Time format style
 * @param {boolean} options.hour12 - Use 12-hour format
 * @param {boolean} options.showSeconds - Show seconds in time
 * @param {string} options.locale - Locale for formatting
 * @param {string} options.timeZone - Time zone for formatting
 * @param {string} options.fallback - Fallback for invalid dates (default: "—")
 * @returns {string} Formatted date string
 */
export function formatAbsolute(value, {
  mode = "datetime",
  dateStyle = "medium",
  timeStyle = "short",
  hour12,
  showSeconds = false,
  locale,
  timeZone,
  fallback = DEFAULT_FALLBACK
} = {}) {
  const date = parseInput(value)
  if (!date) return fallback
  
  // Build options for Intl.DateTimeFormat
  const options = {
    locale,
    timeZone
  }
  
  if (mode === "date" || mode === "datetime") {
    options.dateStyle = dateStyle
  }
  
  if (mode === "time" || mode === "datetime") {
    options.timeStyle = timeStyle
    if (hour12 !== undefined) options.hour12 = hour12
    if (showSeconds) {
      // We need to customize the time format further if showing seconds
      // This requires a different approach since timeStyle doesn't directly support seconds control
      if (timeStyle === "short") {
        // For short style with seconds, we'll use medium
        options.timeStyle = "medium"
      }
    }
  }
  
  try {
    // If we need to show seconds and have control over the format
    if ((mode === "time" || mode === "datetime") && showSeconds) {
      // Build custom options for more control
      const parts = new Intl.DateTimeFormat(locale, {
        ...(mode !== "time" && { dateStyle }),
        ...(mode !== "date" && { 
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12,
          timeZone
        }),
        timeZone
      }).formatToParts(date)
      
      return parts.map(part => part.value).join('')
    }
    
    return new Intl.DateTimeFormat(locale, options).format(date)
  } catch (error) {
    console.warn("Failed to format date:", error)
    return fallback
  }
}

/**
 * Format a date as relative time (e.g., "2 hours ago").
 * @param {Date|string|number} value - Date to format
 * @param {Object} options - Formatting options
 * @param {Date} options.now - Reference date (default: current date)
 * @param {"long"|"short"|"narrow"} options.style - Relative time style
 * @param {"auto"|"always"} options.numeric - Numeric style
 * @param {"round"|"floor"|"ceil"} options.rounding - Rounding method
 * @param {string} options.fallback - Fallback for invalid dates
 * @param {Object} options.thresholds - Thresholds for switching to absolute time
 * @param {number} options.thresholds.justNowSeconds - Seconds to consider "just now" (default: 30)
 * @param {number} options.thresholds.switchToAbsoluteHours - Hours after which to switch to absolute time (default: 48)
 * @param {boolean} options.absoluteWhenOlder - Whether to switch to absolute time when older than threshold
 * @param {Object} options.absoluteOptions - Options for absolute formatting when switching
 * @returns {string} Formatted relative time string
 */
export function formatRelative(value, {
  now = new Date(),
  style = "short",
  numeric = "auto",
  rounding = "round",
  fallback = DEFAULT_FALLBACK,
  thresholds = {},
  absoluteWhenOlder = true,
  absoluteOptions = {}
} = {}) {
  const date = parseInput(value)
  if (!date) return fallback

  const {
    justNowSeconds = 30,
    switchToAbsoluteHours = 48
  } = thresholds

  const diffInMs = now.getTime() - date.getTime()
  const diffInSeconds = Math.floor(Math.abs(diffInMs) / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  // Check if we should switch to absolute time
  if (absoluteWhenOlder && diffInHours >= switchToAbsoluteHours) {
    return formatAbsolute(date, {
      mode: "datetime",
      dateStyle: "medium",
      timeStyle: "short",
      ...absoluteOptions
    })
  }

  // Handle "just now" case
  if (diffInSeconds < justNowSeconds) {
    if (style === "long") return "just now"
    if (style === "short") return "now"
    return "now"
  }

  // Determine the appropriate unit and value
  let unit, unitValue
  const round = Math[rounding] || Math.round

  if (diffInYears > 0) {
    unit = "year"
    unitValue = round(diffInYears)
  } else if (diffInMonths > 0) {
    unit = "month"
    unitValue = round(diffInMonths)
  } else if (diffInWeeks > 0) {
    unit = "week"
    unitValue = round(diffInWeeks)
  } else if (diffInDays > 0) {
    unit = "day"
    unitValue = round(diffInDays)
  } else if (diffInHours > 0) {
    unit = "hour"
    unitValue = round(diffInHours)
  } else if (diffInMinutes > 0) {
    unit = "minute"
    unitValue = round(diffInMinutes)
  } else {
    unit = "second"
    unitValue = round(diffInSeconds)
  }

  // Handle negative values (future dates)
  const isFuture = diffInMs < 0

  try {
    // Use Intl.RelativeTimeFormat for localization
    const rtf = new Intl.RelativeTimeFormat(undefined, { style, numeric })
    return rtf.format(isFuture ? unitValue : -unitValue, unit)
  } catch (error) {
    console.warn("Failed to format relative time:", error)
    // Fallback to simple English formatting
    const unitStr = unitValue === 1 ? unit : `${unit}s`
    const timeStr = `${unitValue} ${unitStr}`
    return isFuture ? `in ${timeStr}` : `${timeStr} ago`
  }
}

/**
 * Format a date using smart logic - relative for recent dates, absolute for older dates.
 * @param {Date|string|number} value - Date to format
 * @param {Object} options - Formatting options
 * @param {number} options.justNowSeconds - Seconds to consider "just now" (default: 30)
 * @param {number} options.relativeUntilHours - Hours to show relative time (default: 48)
 * @param {Object} options.relativeOptions - Options for relative formatting
 * @param {Object} options.absoluteOptions - Options for absolute formatting
 * @param {string} options.fallback - Fallback for invalid dates (default: "—")
 * @returns {string} Formatted smart time string
 */
export function formatSmart(value, {
  justNowSeconds = 30,
  relativeUntilHours = 48,
  relativeOptions = {},
  absoluteOptions = {},
  fallback = DEFAULT_FALLBACK
} = {}) {
  const date = parseInput(value)
  if (!date) return fallback

  return formatRelative(value, {
    thresholds: { justNowSeconds, switchToAbsoluteHours: relativeUntilHours },
    absoluteWhenOlder: true,
    absoluteOptions,
    ...relativeOptions
  })
}

/**
 * Format a date as a timestamp (convenience function for common datetime format).
 * @param {Date|string|number} value - Date to format
 * @param {Object} options - Formatting options
 * @param {string} options.fallback - Fallback for invalid dates (default: "—")
 * @returns {string} Formatted timestamp string
 */
export function formatTimestamp(value, options = {}) {
  return formatAbsolute(value, {
    mode: "datetime",
    dateStyle: "medium",
    timeStyle: "short",
    ...options
  })
}

/**
 * Format a time string in HHmm format.
 * @param {string} hhmm - Time string in HHmm format
 * @param {Object} options - Formatting options
 * @param {boolean} options.acceptCompact - Accept compact format like "0900" (default: false)
 * @param {string} options.separator - Separator between hours and minutes (default: ":")
 * @param {boolean} options.hour12 - Use 12-hour format
 * @param {string} options.locale - Locale for formatting
 * @param {string} options.fallback - Fallback for invalid times (default: "—")
 * @returns {string} Formatted time string
 */
export function formatHHmm(hhmm, {
  acceptCompact = false,
  separator = ":",
  hour12,
  locale,
  fallback = DEFAULT_FALLBACK
} = {}) {
  if (!hhmm || typeof hhmm !== "string") return fallback

  let hours, minutes

  if (acceptCompact && hhmm.length === 4 && /^\d{4}$/.test(hhmm)) {
    // Handle compact format like "0900"
    hours = hhmm.substring(0, 2)
    minutes = hhmm.substring(2, 4)
  } else {
    // Handle standard format like "09:00"
    const parts = hhmm.split(":")
    if (parts.length < 2) return fallback
    hours = parts[0]
    minutes = parts[1]
  }

  // Validate hours and minutes
  const h = parseInt(hours, 10)
  const m = parseInt(minutes, 10)
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
    return fallback
  }

  // Pad with leading zeros
  const hh = hours.padStart(2, "0")
  const mm = minutes.padStart(2, "0")

  // If not using 12-hour format, just return formatted time
  if (hour12 === false || (hour12 !== true && !locale)) {
    return `${hh}${separator}${mm}`
  }

  // If using 12-hour format, we need to convert
  try {
    const date = new Date()
    date.setHours(h, m, 0, 0)
    
    // Use Intl.DateTimeFormat for 12-hour conversion
    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }
    
    if (locale) {
      options.locale = locale
    }
    
    return new Intl.DateTimeFormat(locale, options).format(date)
  } catch (error) {
    console.warn("Failed to format time in 12-hour format:", error)
    // Fallback to 24-hour format
    return `${hh}${separator}${mm}`
  }
}

/**
 * Format date values in an object based on key patterns.
 * @param {Object} obj - Object containing date values
 * @param {Object} options - Formatting options
 * @param {RegExp} options.keysPattern - Pattern to match date keys (default: /(_at|_on)$/i)
 * @param {Function} options.formatter - Function to format date values (default: formatTimestamp)
 * @returns {Object} New object with formatted date values
 */
export function formatDatesInObject(obj, {
  keysPattern = /(_at|_on)$/i,
  formatter = formatTimestamp
} = {}) {
  if (!obj || typeof obj !== "object") return obj

  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    if (keysPattern.test(key) && value) {
      result[key] = formatter(value)
    } else {
      result[key] = value
    }
  }
  return result
}

// Convenience function for backward compatibility with ChartKit
export const formatRelativeTime = (date) => formatRelative(date, { style: "short", numeric: "auto" })
