import * as React from "react"
import { SearchIcon, FilterIcon, XIcon } from "lucide-react"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { SingleSelect } from "./SingleSelect"
import { DateTimeRangePicker } from "./DateTimeRangePicker"

const STATUS_OPTIONS = [
  { value: null, label: 'All Statuses' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
]

const DATE_FIELD_OPTIONS = [
  { value: 'start_time', label: 'Start Time' },
  { value: 'end_time', label: 'End Time' },
]

export default function LogTableFilterBar({ query, onApplyFilters, onResetFilters, loading }) {
  // Local state for search input
  const [searchInput, setSearchInput] = React.useState(query.message || '')

  // Local state for single-value selects
  const [status, setStatus] = React.useState(query.status || '')
  const [dateField, setDateField] = React.useState(query.date_field || 'start_time')

  // Local state for date range
  const [dateFrom, setDateFrom] = React.useState(query.date_from || '')
  const [dateTo, setDateTo] = React.useState(query.date_to || '')

  // Sync local search input with external filter changes
  React.useEffect(() => {
    if (query.message !== searchInput) {
      setSearchInput(query.message || '')
    }
  }, [query.message])

  // Sync single-value selects with external filter changes
  React.useEffect(() => {
    if (query.status !== status) {
      setStatus(query.status || '')
    }
  }, [query.status])

  React.useEffect(() => {
    if (query.date_field !== dateField) {
      setDateField(query.date_field || 'start_time')
    }
  }, [query.date_field])

  // Sync date range with external filter changes
  React.useEffect(() => {
    if (query.date_from !== dateFrom) {
      setDateFrom(query.date_from || '')
    }
  }, [query.date_from])

  React.useEffect(() => {
    if (query.date_to !== dateTo) {
      setDateTo(query.date_to || '')
    }
  }, [query.date_to])

  const handleApplyFilters = () => {
    onApplyFilters({
      message: searchInput.trim(),
      status,
      date_from: dateFrom,
      date_to: dateTo,
      date_field: dateField
    })
  }

  const handleReset = () => {
    setSearchInput('')
    setStatus('')
    setDateFrom('')
    setDateTo('')
    setDateField('start_time')
    onResetFilters()
  }

  const handleDateRangeChange = ({ from, to }) => {
    setDateFrom(from)
    setDateTo(to)
  }

  // Count active filters
  const activeFilters = Object.entries(query).filter(([key, value]) => 
    key !== 'page' && key !== 'page_size' && key !== 'sort_by' && key !== 'sort_dir' && value
  ).length

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
                  onClick={handleReset}
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
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Apply Filters Button */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">&nbsp;</Label>
                  <Button 
                    onClick={handleApplyFilters}
                    className="w-full h-9"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>

              {/* Status and Date Field Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">Status</Label>
                  <SingleSelect
                    value={status}
                    onValueChange={setStatus}
                    options={STATUS_OPTIONS}
                    placeholder="All Statuses"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">Date Field</Label>
                  <SingleSelect
                    value={dateField}
                    onValueChange={setDateField}
                    options={DATE_FIELD_OPTIONS}
                    placeholder="Select field"
                  />
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-4">
                <DateTimeRangePicker
                  from={dateFrom}
                  to={dateTo}
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
