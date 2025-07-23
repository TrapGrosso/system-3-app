import * as React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * FormField - A compound component that handles common form field patterns
 * Reduces boilerplate for Label + Input/Textarea/Select + helper text + character counter
 */
function FormField({
  id,
  label,
  type = "text", // "text" | "textarea" | "select"
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
