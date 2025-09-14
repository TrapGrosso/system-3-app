import * as React from "react"
import { useEffect, useRef } from "react"
import { N8nWarningsDialog } from "@/components/dialogs"

/**
 * N8nWarningsSentinel - A component that mounts the N8nWarningsDialog as a sentinel
 * to automatically show warnings on app load.
 */
function N8nWarningsSentinel() {
  const dialogRef = useRef(null)

  useEffect(() => {
    // Optional: manually poke openOnce on mount if you want eager check
    dialogRef.current?.openOnce?.()
  }, [])

  return (
    <N8nWarningsDialog 
      ref={dialogRef} 
      initialOpen 
      storageKey="n8n-warnings:last-signature" 
    />
  )
}

export default N8nWarningsSentinel
