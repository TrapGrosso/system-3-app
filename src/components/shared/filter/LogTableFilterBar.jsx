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

export default function LogTableFilterBar({ query, onApplyFilters, onResetFilters, loading }) {
  // Local state for search input
  const [searchInput, setSearchInput] = React.useState(query.message || '')

  // Local state for single-value selects
  const [status, setStatus] = React.useState(query.status || '')

  // Local state for date/time ranges
  const [startTimeFrom, setStartTimeFrom] = React.useState(query.start_time_from || '')
  const [endTimeTo, setEndTimeTo] = React.useState(query.end_time_to || '')
  const [startDate, setStartDate] = React.useState(query.start_date || '')
  const [endDate, setEndDate] = React.useState(query.end_date || '')

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

  // Sync date/time ranges with external filter changes
  React.useEffect(() => {
    if (query.start_time_from !== startTimeFrom) {
      setStartTimeFrom(query.start_time_from || '')
    }
  }, [query.start_time_from])

  React.useEffect(() => {
    if (query.end_time_to !== endTimeTo) {
      setEndTimeTo(query.end_time_to || '')
    }
  }, [query.end_time_to])

  React.useEffect(() => {
    if (query.start_date !== startDate) {
      setStartDate(query.start_date || '')
    }
  }, [query.start_date])

  React.useEffect(() => {
    if (query.end_date !== endDate) {
      setEndDate(query.end_date || '')
    }
  }, [query.end_date])

  const handleApplyFilters = () => {
    onApplyFilters({
      message: searchInput.trim(),
      status,
      start_time_from: startTimeFrom,
      end_time_to: endTimeTo,
      start_date: startDate,
      end_date: endDate
    })
  }

  const handleReset = () => {
    setSearchInput('')
    setStatus('')
    setStartTimeFrom('')
    setEndTimeTo('')
    setStartDate('')
    setEndDate('')
    onResetFilters()
  }

  const handleTimeRangeChange = ({ from, to }) => {
    setStartTimeFrom(from)
    setEndTimeTo(to)
  }

  const handleDateRangeChange = ({ from, to }) => {
    setStartDate(from)
    setEndDate(to)
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

              {/* Status Filter */}
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
              </div>

              {/* Date and Time Filters */}
              <div className="space-y-4">
                {/* Time Range (with time) */}
                <DateTimeRangePicker
                  from={startTimeFrom}
                  to={endTimeTo}
                  onChange={handleTimeRangeChange}
                  withTime={true}
                  label="Time Range (absolute)"
                />

                {/* Date Range (date only) */}
                <DateTimeRangePicker
                  from={startDate}
                  to={endDate}
                  onChange={handleDateRangeChange}
                  withTime={false}
                  label="Date Range (by date)"
                />
              </div>
            </div>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  )
}
