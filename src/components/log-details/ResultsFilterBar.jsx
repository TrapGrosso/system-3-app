import * as React from "react"
import { FilterIcon, XIcon } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { SingleSelect } from "../shared/filter/SingleSelect"
import FormField from "../shared/ui/FormField"

const FIELD_OPTIONS = [
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'company_name', label: 'Company Name' },
]

const STATUS_OPTIONS = [
  { value: null, label: 'All Statuses' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
]

export default function ResultsFilterBar({ filters = {}, onApply, onClear, loading = false }) {
  const [field, setField] = React.useState(filters.field || 'first_name')
  const [value, setValue] = React.useState(filters.value || '')
  const [status, setStatus] = React.useState(filters.status || '')

  // Sync with external filter changes
  React.useEffect(() => {
    setField(filters.field || 'first_name')
    setValue(filters.value || '')
    setStatus(filters.status || '')
  }, [filters])

  const handleApply = () => {
    onApply({ field, value: value.trim(), status })
  }

  const handleClear = () => {
    setField('first_name')
    setValue('')
    setStatus('')
    onClear()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApply()
    }
  }

  // Count active filters
  const activeFilters = Object.entries(filters).filter(([key, val]) => 
    key !== 'field' && val && val.toString().trim()
  ).length

  return (
    <fieldset disabled={loading}>
      <div className="space-y-4">
        {/* Header with filter count and clear */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Filter Results</span>
            {activeFilters > 0 && (
              <Badge variant="secondary">
                {activeFilters} active
              </Badge>
            )}
          </div>
          {activeFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 px-2"
            >
              <XIcon className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Field Selection */}
          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-muted-foreground">Filter by</Label>
            <SingleSelect
              value={field}
              onValueChange={setField}
              options={FIELD_OPTIONS}
              placeholder="Select field"
              triggerClassName="h-9"
            />
          </div>

          {/* Value Input */}
          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-muted-foreground">Value</Label>
            <FormField
              id="filter-value"
              type="text"
              value={value}
              onChange={setValue}
              placeholder={`Search by ${field.replace('_', ' ')}...`}
              className="h-9 flex mb-0"
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-muted-foreground">Status</Label>
            <SingleSelect
              value={status}
              onValueChange={setStatus}
              options={STATUS_OPTIONS}
              placeholder="All Statuses"
              triggerClassName="h-9"
            />
          </div>

          {/* Apply Button */}
          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-muted-foreground">&nbsp;</Label>
            <Button 
              onClick={handleApply}
              className="w-full h-9"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </fieldset>
  )
}
