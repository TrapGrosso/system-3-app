import * as React from "react"

/**
 * Sort direction indicator icon for table headers
 */
export function SortIcon({ direction }) {
  if (direction === 'asc' || direction === false) {
    return <span className="text-xs text-muted-foreground ml-1">▲</span>
  }
  
  if (direction === 'desc') {
    return <span className="text-xs text-muted-foreground ml-1">▼</span>
  }
  
  // Unsorted state
  return <span className="text-xs text-muted-foreground/50 ml-1">↕</span>
}
