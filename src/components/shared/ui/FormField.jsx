import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/**
 * FormField - A compound component that handles common form field patterns
 * Reduces boilerplate for Label + Input/Textarea/Select/DatePicker + helper text + character counter
 */
function FormField({
  id,
  label,
  type = "text", // "text" | "textarea" | "select" | "date"
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  rows = 3,
  helper,
  options = [], // for select type
  optionLabel = "label",
  optionValue = "value",
  className,
  ...props
}) {
  const handleChange = (newValue) => {
    if (type === "select") {
      onChange?.(newValue)
    } else if (type === "date") {
      // Handle date - convert to YYYY-MM-DD string
      const dateStr = newValue ? new Date(newValue).toISOString().split('T')[0] : ""
      onChange?.(dateStr)
    } else {
      onChange?.(newValue.target ? newValue.target.value : newValue)
    }
  }

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            id={id}
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className="resize-none"
            {...props}
          />
        )
      
      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={handleChange}
            disabled={disabled}
          >
            <SelectTrigger id={id}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem 
                  key={option[optionValue]} 
                  value={option[optionValue]}
                >
                  {option[optionLabel]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? new Date(value).toLocaleDateString() : (placeholder || "Pick a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={handleChange}
                disabled={disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )
      
      default: // "text"
        return (
          <Input
            id={id}
            type="text"
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            {...props}
          />
        )
    }
  }

  return (
    <div className={`space-y-2 ${className || ""}`}>
      {/* Label */}
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Input/Textarea/Select */}
      {renderInput()}

      {/* Helper text and character counter */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{helper || ""}</span>
        {maxLength && (
          <span>{(value || "").length}/{maxLength}</span>
        )}
      </div>
    </div>
  )
}

export default FormField
