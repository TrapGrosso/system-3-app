import * as React from "react"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import FormField from "@/components/shared/ui/FormField"

/**
 * DialogAdvancedSettingsCollapsible - A reusable collapsible advanced settings component
 * 
 * @param {Object} settings - Current values object (e.g. {temperature: 0.7, ...})
 * @param {Function} onChange - Callback function(key, value) to handle field changes
 * @param {boolean} disabled - Whether inputs should be disabled
 * @param {boolean} open - Controlled collapsible state (optional)
 * @param {boolean} defaultOpen - Initial open state for uncontrolled mode (optional)
 * @param {Function} onOpenChange - Callback for open state changes (optional)
 * @param {string} title - Title for the collapsible section (default: "Advanced Settings")
 * @param {React.ReactNode} description - Custom description/helper text (optional)
 * @param {Array} fieldConfig - Array of field configuration objects
 * @param {string} className - Additional CSS classes for the content wrapper
 */
function DialogAdvancedSettingsCollapsible({
  settings = {},
  onChange,
  disabled = false,
  open,
  defaultOpen = false,
  onOpenChange,
  title = "Advanced Settings",
  description,
  fieldConfig = [],
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

  const handleFieldChange = (field, value) => {
    const parser = field.parser || ((v) => v)
    const parsedValue = parser(value)
    onChange?.(field.key, parsedValue)
  }

  if (fieldConfig.length === 0) {
    return null
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
          <span>{title}</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className={`space-y-4 mt-4 p-4 border rounded-lg bg-muted/50 ${className}`}>
        {description && (
          <div className="text-sm text-muted-foreground mb-4">
            {description}
          </div>
        )}
        
        {fieldConfig.map((field) => (
          <FormField
            key={field.key}
            id={field.key}
            label={field.label}
            type={field.type || "text"}
            min={field.min}
            max={field.max}
            step={field.step}
            value={settings[field.key] || ""}
            onChange={(value) => handleFieldChange(field, value)}
            helper={field.helper}
            disabled={disabled}
            placeholder={field.placeholder}
            options={field.options}
            {...(field.fieldProps || {})}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default DialogAdvancedSettingsCollapsible
