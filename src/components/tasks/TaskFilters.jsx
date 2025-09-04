import * as React from "react"
import { SearchIcon, FilterIcon, XIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SingleSelect } from "@/components/shared/filter/SingleSelect"
import { DateTimeRangePicker } from "@/components/shared/filter/DateTimeRangePicker"
import AdvancedFiltersCollapsible from "@/components/shared/ui/AdvancedFiltersCollapsible"
import { makeStagedBindings } from "@/utils/filterBindings"
import { countActiveFilters } from "@/utils/activeFilters"
import { useAllTasks } from "@/contexts/TaskContext"

const TEXT_FIELD_OPTIONS = [
  { value: "title", label: "Title" },
  { value: "description", label: "Description" },
]

const STATUS_OPTIONS = [
  { value: null, label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
  { value: "overdue", label: "Overdue" },
]

export default function TaskFilters() {
  const { query, setQuery, resetFilters, isFetching } = useAllTasks()

  const schema = React.useMemo(() => ({
    search: { kind: "oneOf", options: TEXT_FIELD_OPTIONS },
    status: { kind: "singleSelect" },
    due_date_range: { kind: "dateRange", fromKey: "due_date_from", toKey: "due_date_to" },
    ended_at_range: { kind: "dateRange", fromKey: "ended_at_from", toKey: "ended_at_to" },
  }), [])

  const onApplyFilters = React.useCallback((partial) => {
    setQuery({ ...partial, page: 1 })
  }, [setQuery])

  const onResetFilters = React.useCallback(() => {
    resetFilters()
  }, [resetFilters])

  const { staged, apply, reset } = makeStagedBindings(query, schema, onApplyFilters, onResetFilters)

  const handleFilterApply = () => apply()
  const handleFilterClear = () => reset()

  const activeFilters = countActiveFilters(
    query,
    ["page","page_size","sort_by","sort_dir"],
    { excludeDefaults: { sort_by: "created_at", sort_dir: "desc" } }
  )

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <fieldset disabled={isFetching}>
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Filters</span>
                {activeFilters > 0 && (
                  <Badge variant="secondary">{activeFilters} active</Badge>
                )}
              </div>
              {activeFilters > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFilterClear}
                  className="h-8 px-2"
                >
                  <XIcon className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            {/* Basic Search Row */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[220px] space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Search
                </Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Search by ${staged.search.value?.field || "title/description"}...`}
                    value={staged.search.value?.value || ""}
                    onChange={(e) => staged.search.set({ field: staged.search.value?.field, value: e.target.value })}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleFilterApply() } }}
                    className="pl-9 h-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Field
                </Label>
                <SingleSelect
                  value={staged.search.value?.field || ""}
                  onValueChange={(field) => staged.search.set({ field, value: staged.search.value?.value || "" })}
                  options={[{ value: null, label: "Select Field" }, ...TEXT_FIELD_OPTIONS]}
                  placeholder="Select Field"
                  triggerClassName="h-9 min-w-[180px]"
                />
              </div>

              <Button
                onClick={handleFilterApply}
                className="md:w-auto w-full md:flex-none flex-grow h-9 px-4"
              >
                Apply Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            <AdvancedFiltersCollapsible label="Advanced filters" defaultOpen={false}>
              <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Status
                  </Label>
                  <SingleSelect
                    value={staged.status.value}
                    onValueChange={staged.status.set}
                    options={STATUS_OPTIONS}
                    placeholder="All Statuses"
                  />
                </div>

                {/* Due Date Range */}
                <DateTimeRangePicker
                  from={staged.due_date_range.value.from}
                  to={staged.due_date_range.value.to}
                  onChange={staged.due_date_range.set}
                  withTime={false}
                  label="Due Date Range"
                />

                {/* Ended At Range */}
                <DateTimeRangePicker
                  from={staged.ended_at_range.value.from}
                  to={staged.ended_at_range.value.to}
                  onChange={staged.ended_at_range.set}
                  withTime={false}
                  label="Ended At Range"
                />
              </div>
            </AdvancedFiltersCollapsible>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  )
}
