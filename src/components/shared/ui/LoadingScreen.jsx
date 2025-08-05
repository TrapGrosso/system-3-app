import * as React from "react"
import { Spinner } from "@/components/ui/spinner"

/**
 * LoadingScreen - A simple centered loading component with spinner and message
 * 
 * @param {string} message - Optional loading message to display below spinner
 * @param {string} className - Additional CSS classes for the container
 */
function LoadingScreen({ 
  message = "Loading...", 
  className = "" 
}) {
  return (
    <div className={`flex flex-col items-center justify-center w-full min-h-full ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  )
}

export { LoadingScreen }
