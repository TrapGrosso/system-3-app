import * as React from "react"
import { CalendarIcon, FilterIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

const FILTER_FIELDS = [
  { value: 'title', label: 'Title' },
  { value: 'description', label: 'Description' },
  { value: 'due_date', label: 'Due Date' },
]

function TaskFilters({ onApply, onClear, className }) {
  const [field, setField] = React.useState('title')
  const [value, setValue] = React.useState('')
  const [dateValue, setDateValue] = React.useState('')

  const handleApply = () => {
    const filterValue = field === 'due_date' ? dateValue : value
    if (filterValue.trim()) {
      onApply({ field, value: filterValue })
    }
  }

  const handleClear = () => {
    setField('title')
    setValue('')
    setDateValue('')
    onClear()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApply()
    }
  }

  const currentValue = field === 'due_date' ? dateValue : value
  const hasValue = currentValue.trim().length > 0

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      {/* Field Selection */}
      <div className="space-y-1">
        <Label htmlFor="filter-field" className="text-xs font-medium">
          Filter by
        </Label>
        <Select value={field} onValueChange={setField}>
          <SelectTrigger className="w-32" size="sm">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_FIELDS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Input Field */}
      <div className="space-y-1 flex-1 min-w-0">
        <Label htmlFor="filter-value" className="text-xs font-medium">
          Value
        </Label>
        {field === 'due_date' ? (
          <Input
            id="filter-value"
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8"
            placeholder="Select date..."
          />
        ) : (
          <Input
            id="filter-value"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8"
            placeholder={`Search by ${field}...`}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleApply}
          disabled={!hasValue}
          className="h-8 px-3"
        >
          <FilterIcon className="h-3 w-3 mr-1" />
          Apply
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-8 px-2"
          title="Clear filter"
        >
          <XIcon className="h-3 w-3" />
          <span className="sr-only">Clear filter</span>
        </Button>
      </div>
    </div>
  )
}

export default TaskFilters
