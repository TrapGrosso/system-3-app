import * as React from "react"
import { SearchIcon, FilterIcon, XIcon } from "lucide-react"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { SingleSelect } from "../shared/filter/SingleSelect"
import { SizeFilter } from "../shared/filter/SizeFilter"
import AdvancedFiltersCollapsible from "../shared/ui/AdvancedFiltersCollapsible"
import { makeStagedBindings } from "@/utils/filterBindings"
import { countActiveFilters } from "@/utils/activeFilters"

const TEXT_FIELD_OPTIONS = [
  { value: null, label: 'Select Field' },
  { value: 'name', label: 'Name' },
  { value: 'industry', label: 'Industry' },
  { value: 'location', label: 'Location' },
  { value: 'prospect_first_name', label: 'Prospect First Name' },
  { value: 'prospect_last_name', label: 'Prospect Last Name' },
]

export default function CompaniesFilterBar({ query, onApplyFilters, onResetFilters, loading }) {
  const schema = React.useMemo(() => ({
    search: { kind: "oneOf", options: TEXT_FIELD_OPTIONS.filter(opt => opt.value !== null) },
    size: { kind: "pair", valueKey: "size_val", labelKey: "size_op" }
  }), [])

  const {
    staged,
    apply,
    reset
  } = makeStagedBindings(query, schema, onApplyFilters, onResetFilters)

  const handleSizeChange = ({ size_op, size_val }) => {
    staged.size.set({ size_op, size_val })
  }

  const activeFilters = countActiveFilters(query, ['page','page_size','sort_by','sort_dir'])

  return (
    <Card className="mb-6">
      <CardContent className="px-4 pt-6">
        <fieldset disabled={loading}>
          <div className="space-y-6">
            {/* Header with filter count and reset */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <FilterIcon className="h-4 w-4 text-muted-foreground" aria-label="Filter icon" />
                <span className="font-semibold text-sm text-foreground">Filters</span>
                {activeFilters > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilters} active
                  </Badge>
                )}
              </div>
              {activeFilters > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  className="h-8 px-3 text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <XIcon className="h-3 w-3 ms-1" aria-label="Clear filters" />
                  Clear all
                </Button>
              )}
            </div>

            {/* Filter controls */}
            <div className="space-y-4">
              {/* Search + field + apply button */}
              <div className="flex flex-wrap items-end gap-4">
                {/* Global Search */}
                <div className="flex-1 min-w-[200px] space-y-2">
                  <Label htmlFor="search" className="text-xs font-medium tracking-wide text-muted-foreground mb-1 block">
                    Search
                  </Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-label="Search icon" />
                    <Input
                      id="search"
                      placeholder="Search companies..."
                      value={staged.search.value?.value || ''}
                      onChange={(e) => staged.search.set({ field: staged.search.value?.field, value: e.target.value })}
                      className="pl-9 h-9 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2"
                    />
                  </div>
                </div>

                {/* Field Selection */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium tracking-wide text-muted-foreground mb-1 block">
                    Search Field
                  </Label>
                  <SingleSelect
                    value={staged.search.value?.field || ''}
                    onValueChange={(field) => staged.search.set({ field, value: staged.search.value?.value })}
                    options={TEXT_FIELD_OPTIONS}
                    placeholder="Select Field"
                    triggerClassName="h-9 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2"
                  />
                </div>
                {/* Apply Filters */}
                <Button
                  onClick={apply}
                  className="md:w-auto w-full md:flex-none flex-grow h-9 px-4 text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  Apply Filters
                </Button>
              </div>

              {/* Advanced Filters Collapsible Section */}
              <div className="mt-6">
                <AdvancedFiltersCollapsible label="Advanced filters" defaultOpen={false}>
                  <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-min">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium tracking-wide text-muted-foreground mb-1 block">
                        Company Size
                      </Label>
                      <SizeFilter
                      sizeOp={staged.size.value.size_op}
                      sizeVal={staged.size.value.size_val}
                      onChange={handleSizeChange}
                      />
                    </div>
                  </div>
                </AdvancedFiltersCollapsible>
              </div>
            </div>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  )
}
