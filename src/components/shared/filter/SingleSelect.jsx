import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SingleSelect({
  value,
  onValueChange,
  options = [],
  placeholder = "Select...",
  triggerClassName = "h-9 min-w-[180px]",
  selectProps = {},
  itemClassName = ""
}) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      {...selectProps}
    >
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className={itemClassName}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
