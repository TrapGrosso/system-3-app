import * as React from "react"
import { useState, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useGetStatusAll } from "@/api/status/get/all"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * ColorBadge - A small badge component that displays a color dot
 * @param {Object} props
 * @param {string|null} props.color - Hex color code or null for outline variant
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} [props.className] - Additional CSS classes
 */
function ColorBadge({ color, children, className }) {
  if (!color) {
    return (
      <Badge variant="outline" className={cn("w-2 h-2 p-0 rounded-full", className)}>
        {children}
      </Badge>
    )
  }

  return (
    <Badge 
      className={cn("w-2 h-2 p-0 rounded-full border-0", className)} 
      style={{ backgroundColor: color }}
    >
      {children}
    </Badge>
  )
}

/**
 * StatusSelect - A select component that fetches and displays statuses with color badges
 * 
 * This component automatically fetches all statuses for the current user and displays
 * them in a dropdown select. Each status is shown with a color-coded badge. When a
 * status is selected, the full status object is returned via the onChange callback.
 * 
 * @param {Object} props
 * @param {string} [props.selectedId] - Controlled selected status ID
 * @param {string} [props.defaultValue] - Uncontrolled default selected status ID
 * @param {Object|string|null} [props.currentStatus] - Current status object or ID to display immediately
 * @param {function} [props.onChange] - Callback function called when selection changes (receives full status object)
 * @param {boolean} [props.allowClear=false] - Whether to show a "None" option to clear selection
 * @param {string} [props.placeholder="Select status"] - Placeholder text when no selection
 * @param {boolean} [props.disabled=false] - Whether the select is disabled
 * @param {string} [props.className] - Additional CSS classes for the trigger
 * @param {Object} [props...props] - Additional props passed to the Select component
 * 
 * @example
 * // Controlled usage
 * const [selectedStatus, setSelectedStatus] = useState(null)
 * <StatusSelect 
 *   selectedId={selectedStatus?.id} 
 *   onChange={setSelectedStatus} 
 * />
 * 
 * @example
 * // Uncontrolled usage with current status
 * const prospect = { id: "123", status: "contacted", color: "#28a745" }
 * <StatusSelect 
 *   currentStatus={prospect}
 *   onChange={(status) => console.log("Selected:", status)}
 * />
 * 
 * @example
 * // With clear option
 * <StatusSelect 
 *   allowClear 
 *   onChange={(status) => console.log("Selected:", status)}
 * />
 */
function StatusSelect({
  selectedId,
  defaultValue,
  currentStatus,
  onChange,
  allowClear = false,
  placeholder = "Select status",
  disabled = false,
  className,
  ...props
}) {
  // Get user ID from AuthContext
  const { user } = useAuth()
  const effectiveUserId = user?.id

  // Fetch all statuses
  const { data = [], isLoading, isFetching, error } = useGetStatusAll(effectiveUserId)

  // Create a map for O(1) lookup
  const byId = useMemo(() => {
    const map = new Map()
    data.forEach(status => map.set(status.id, status))
    return map
  }, [data])

  // Extract current status info
  const currentStatusId = typeof currentStatus === 'string' ? currentStatus : currentStatus?.id || null
  const currentStatusObj = typeof currentStatus === 'object' ? currentStatus : (currentStatusId ? byId.get(currentStatusId) : null)

  // Handle selection state
  const isControlled = selectedId !== undefined
  const [internalSelectedId, setInternalSelectedId] = useState(
    isControlled ? selectedId : (defaultValue ?? currentStatusId ?? null)
  )

  const selectedIdValue = isControlled ? selectedId : internalSelectedId
  const selectedObj = byId.get(selectedIdValue) || (selectedIdValue === currentStatusId ? currentStatusObj : null)

  // Handle value change
  const handleValueChange = (id) => {
    const obj = id ? (byId.get(id) || (id === currentStatusId ? currentStatusObj : null)) : null
    
    if (!isControlled) {
      setInternalSelectedId(id || null)
    }
    
    onChange?.(obj)
  }

  // Determine if select should be disabled
  const isSelectDisabled = disabled || !effectiveUserId || isLoading || isFetching || !!error

  // Get display value for trigger
  const displayValue = selectedObj || currentStatusObj

  return (
    <Select
      value={selectedIdValue || ""}
      onValueChange={handleValueChange}
      disabled={isSelectDisabled}
      {...props}
    >
      <SelectTrigger 
        className={className}
        disabled={isSelectDisabled}
      >
        {isLoading || isFetching ? (
          <span className="text-muted-foreground">Loading...</span>
        ) : error ? (
          <span className="text-destructive">Failed to load</span>
        ) : displayValue ? (
          <div className="flex items-center gap-2">
            <ColorBadge color={displayValue.color} />
            <span>{displayValue.status}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </SelectTrigger>
      <SelectContent>
        {allowClear && (
          <SelectItem value={null}>
            <span className="text-muted-foreground">None</span>
          </SelectItem>
        )}
        {data.length === 0 && !isLoading && !isFetching ? (
          <SelectItem value={null} disabled>
            <span className="text-muted-foreground">No statuses</span>
          </SelectItem>
        ) : (
          data.map((status) => (
            <SelectItem key={status.id} value={status.id || `${new Date().toString + String(Math.random)}`}>
              <div className="flex items-center gap-2">
                <ColorBadge color={status.color} />
                <span>{status.status}</span>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

export { StatusSelect }
