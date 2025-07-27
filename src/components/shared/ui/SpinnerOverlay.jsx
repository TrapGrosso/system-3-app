import * as React from "react"
import { Spinner } from "@/components/ui/spinner"

/**
 * SpinnerOverlay - Full-area loading overlay with centered spinner
 * Positions absolutely over its relative parent container
 */
function SpinnerOverlay({ className = "" }) {
  return (
    <div
      className={`absolute inset-0 bg-background/70 flex items-center justify-center z-50 ${className}`}
      aria-busy="true"
    >
      <Spinner size="lg" />
    </div>
  )
}

export default SpinnerOverlay
