import * as React from 'react'
import { 
  parseInput, 
  formatAbsolute, 
  formatRelative, 
  formatSmart, 
  formatTimestamp, 
  formatHHmm,
  DEFAULT_FALLBACK 
} from './timeformat'

/**
 * TimeText - A React component for displaying formatted dates and times.
 * 
 * @param {Object} props - Component props
 * @param {Date|string|number} props.value - Date value to format
 * @param {"absolute"|"relative"|"smart"|"timestamp"|"hhmm"} props.variant - Formatting variant
 * @param {string} props.fallback - Fallback text for invalid dates
 * @param {Object} props.absoluteOptions - Options for absolute formatting
 * @param {Object} props.relativeOptions - Options for relative formatting
 * @param {Object} props.smartOptions - Options for smart formatting
 * @param {Object} props.hhmmOptions - Options for HHmm formatting
 * @param {Object} props.timestampOptions - Options for timestamp formatting
 * @param {Object} props.parseOptions - Options for parsing the input value
 * @param {React.HTMLAttributes<HTMLSpanElement>} props.rest - Additional HTML attributes
 * @returns {JSX.Element} Formatted time text
 */
export function TimeText({
  value,
  variant = "absolute",
  fallback = DEFAULT_FALLBACK,
  absoluteOptions = {},
  relativeOptions = {},
  smartOptions = {},
  hhmmOptions = {},
  timestampOptions = {},
  parseOptions = {},
  ...rest
}) {
  const getText = () => {
    // Parse the input value
    const date = parseInput(value, parseOptions)
    if (!date) return fallback

    // Format based on variant
    switch (variant) {
      case "absolute":
        return formatAbsolute(value, { fallback, ...absoluteOptions })
      case "relative":
        return formatRelative(value, { fallback, ...relativeOptions })
      case "smart":
        return formatSmart(value, { fallback, ...smartOptions })
      case "timestamp":
        return formatTimestamp(value, { fallback, ...timestampOptions })
      case "hhmm":
        // For hhmm variant, we expect the value to be a time string like "09:00"
        return formatHHmm(value, { fallback, ...hhmmOptions })
      default:
        return formatAbsolute(value, { fallback, ...absoluteOptions })
    }
  }

  return <span {...rest}>{getText()}</span>
}

export default TimeText
