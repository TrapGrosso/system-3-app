import * as React from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

/**
 * CheckboxMatrix - A reusable component for rendering a grid of checkboxes
 * 
 * @param {Array} options - Array of { value, label, disabled? } objects
 * @param {Array} value - Array of currently selected option values
 * @param {Function} onChange - Callback function(newValues) when selection changes
 * @param {string|ReactNode} label - Optional section heading
 * @param {string} columns - Tailwind grid column classes (default: "grid-cols-1 sm:grid-cols-2")
 * @param {boolean} disabled - Disable entire matrix
 * @param {string} className - Additional CSS classes for outer wrapper
 * @param {string} itemClassName - Additional CSS classes for each label container
 * @param {Function} renderItem - Custom render function({ option, checked, toggle })
 */
function CheckboxMatrix({
  options = [],
  value = [],
  onChange,
  label,
  columns = "grid-cols-1 sm:grid-cols-2",
  disabled = false,
  className = "",
  itemClassName = "",
  renderItem,
  ...props
}) {
  const handleToggle = (optionValue) => {
    if (!onChange) return
    
    const newValue = value.includes(optionValue)
      ? value.filter(val => val !== optionValue)
      : [...value, optionValue]
    
    onChange(newValue)
  }

  const defaultRenderItem = ({ option, checked, isDisabled }) => (
    <label
      key={option.value}
      className={cn(
        "flex items-center gap-2 cursor-pointer",
        isDisabled && "cursor-not-allowed opacity-50",
        itemClassName
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => handleToggle(option.value)}
        disabled={isDisabled}
      />
      <span className="text-sm">{option.label}</span>
    </label>
  )

  if (options.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-3", className)} {...props}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className={cn("grid gap-3", columns)}>
        {options.map((option) => {
          const checked = value.includes(option.value)
          const isDisabled = disabled || option.disabled
          
          if (renderItem) {
            return renderItem({
              option,
              checked,
              toggle: () => handleToggle(option.value),
              isDisabled
            })
          }
          
          return defaultRenderItem({ option, checked, isDisabled })
        })}
      </div>
    </div>
  )
}

export default CheckboxMatrix
