import * as React from "react"
import { SearchIcon, FilterIcon, XIcon } from "lucide-react"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { SingleSelect } from "../shared/filter/SingleSelect"
import { DateTimeRangePicker } from "../shared/filter/DateTimeRangePicker"
import { makeStagedBindings } from "@/utils/filterBindings"
import { countActiveFilters } from "@/utils/activeFilters"

const STATUS_OPTIONS = [
  { value: null, label: 'All Statuses' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
]

const ACTION_OPTIONS = [
  { value: null, label: 'All Actions' },
  { value: 'add_leads', label: 'Add Leads' },
  { value: 'retry_leads', label: 'Retry Leads' },
  { value: 'deep_search', label: 'Deep Search' },
]

const DATE_FIELD_OPTIONS = [
  { value: 'start_time', label: 'Start Time' },
  { value: 'end_time', label: 'End Time' },
]

export default function LogTableFilterBar({ query, onApplyFilters, onResetFilters, loading }) {
  const schema = React.useMemo(() => ({
    message: { kind: "input" },
    status: { kind: "singleSelect" },
    action: { kind: "singleSelect" },
    date_field: { kind: "singleSelect", defaultValue: "start_time" },
    date_range: { kind: "dateRange", fromKey: "date_from", toKey: "date_to" }
  }), [])

  const {
    staged,
    apply,
    reset
  } = makeStagedBindings(query, schema, onApplyFilters, onResetFilters)

  const handleDateRangeChange = ({ from, to }) => {
    staged.date_range.set({ from, to })
  }

  const dateField = staged.date_field.value || "start_time"
  const activeFilters = countActiveFilters(query, ['page','page_size','sort_by','sort_dir'], { excludeDefaults: { date_field: 'start_time' }})

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <fieldset disabled={loading}>
          <div className="space-y-4">
            {/* Header with filter count and reset */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Filters</span>
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
                  onClick={reset}
                  className="h-8 px-2"
                >
                  <XIcon className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            {/* Filter controls */}
            <div className="space-y-4">
              {/* Search Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Message Search */}
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-[13px] font-medium text-muted-foreground">Search in Messages</Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search log messages..."
                      value={staged.message.value}
                      onChange={(e) => staged.message.set(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Apply Filters Button */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">&nbsp;</Label>
                  <Button 
                    onClick={apply}
                    className="w-full h-9"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>

              {/* Status, Action and Date Field Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">Action</Label>
                  <SingleSelect
                    value={staged.action.value}
                    onValueChange={staged.action.set}
                    options={ACTION_OPTIONS}
                    placeholder="All Actions"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">Status</Label>
                  <SingleSelect
                    value={staged.status.value}
                    onValueChange={staged.status.set}
                    options={STATUS_OPTIONS}
                    placeholder="All Statuses"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">Date Field</Label>
                  <SingleSelect
                    value={staged.date_field.value}
                    onValueChange={staged.date_field.set}
                    options={DATE_FIELD_OPTIONS}
                    placeholder="Select field"
                  />
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-4">
                <DateTimeRangePicker
                  from={staged.date_range.value.from}
                  to={staged.date_range.value.to}
                  onChange={handleDateRangeChange}
                  withTime={false}
                  label={`Date Range (filtered by ${dateField === 'start_time' ? 'Start Time' : 'End Time'})`}
                />
              </div>
            </div>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  )
}
