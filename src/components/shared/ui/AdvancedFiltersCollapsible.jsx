import * as React from "react"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

/**
 * AdvancedFiltersCollapsible - A reusable collapsible wrapper for advanced filter sections
 * 
 * @param {string} label - The label text for the collapsible trigger
 * @param {boolean} open - Controlled open state (optional)
 * @param {boolean} defaultOpen - Initial open state for uncontrolled mode
 * @param {Function} onOpenChange - Callback for open state changes (optional)
 * @param {React.ReactNode} children - Content to be collapsed/expanded
 * @param {string} className - Additional CSS classes for the content wrapper
 */
function AdvancedFiltersCollapsible({
  label = "Advanced filters",
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className = "",
  ...props
}) {
  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  
  const handleOpenChange = (newOpen) => {
    if (isControlled) {
      onOpenChange?.(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={handleOpenChange}
      {...props}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full p-0 h-auto font-medium text-left"
          type="button"
        >
          <span>{label}</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className={`mt-4 space-y-4 ${className}`}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default AdvancedFiltersCollapsible
