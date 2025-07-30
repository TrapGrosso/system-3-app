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

const TEXT_FIELD_OPTIONS = [
  { value: null, label: 'Select Field' },
  { value: 'name', label: 'Name' },
  { value: 'industry', label: 'Industry' },
  { value: 'location', label: 'Location' },
  { value: 'prospect_first_name', label: 'Prospect First Name' },
  { value: 'prospect_last_name', label: 'Prospect Last Name' },
]

export default function CompaniesFilterBar({ query, onApplyFilters, onResetFilters, loading }) {
  // Local state for search input and selected field
  const [searchInput, setSearchInput] = React.useState(
    query.name || 
    query.industry || 
    query.location || 
    query.prospect_first_name || 
    query.prospect_last_name || 
    ''
  )
  
  const [selectedField, setSelectedField] = React.useState(
    query.name ? 'name' :
    query.industry ? 'industry' :
    query.location ? 'location' :
    query.prospect_first_name ? 'prospect_first_name' :
    query.prospect_last_name ? 'prospect_last_name' : ''
  )

  // Local state for size filters
  const [sizeOp, setSizeOp] = React.useState(query.size_op || '')
  const [sizeVal, setSizeVal] = React.useState(query.size_val || '')

  // Sync local search input with external filter changes
  React.useEffect(() => {
    const fieldValue = 
      query.name || 
      query.industry || 
      query.location || 
      query.prospect_first_name || 
      query.prospect_last_name || 
      ''
    
    if (fieldValue !== searchInput) {
      setSearchInput(fieldValue)
    }
  }, [query.name, query.industry, query.location, query.prospect_first_name, query.prospect_last_name])

  // Sync selected field with external filter changes
  React.useEffect(() => {
    const field = 
      query.name ? 'name' :
      query.industry ? 'industry' :
      query.location ? 'location' :
      query.prospect_first_name ? 'prospect_first_name' :
      query.prospect_last_name ? 'prospect_last_name' : ''
    
    if (field !== selectedField) {
      setSelectedField(field)
    }
  }, [query.name, query.industry, query.location, query.prospect_first_name, query.prospect_last_name])

  // Sync size filters with external filter changes
  React.useEffect(() => {
    if (query.size_op !== sizeOp) {
      setSizeOp(query.size_op || '')
    }
  }, [query.size_op])

  React.useEffect(() => {
    if (query.size_val !== sizeVal) {
      setSizeVal(query.size_val || '')
    }
  }, [query.size_val])

  const handleApplyFilters = () => {
    // Build query object with all fields reset
    const newQuery = {
      name: '',
      industry: '',
      location: '',
      prospect_first_name: '',
      prospect_last_name: '',
      size_op: sizeOp,
      size_val: sizeVal
    }

    // Set the value for the selected field
    if (searchInput.trim() && selectedField) {
      newQuery[selectedField] = searchInput.trim()
    }

    onApplyFilters(newQuery)
  }

  const handleReset = () => {
    setSearchInput('')
    setSelectedField('')
    setSizeOp('')
    setSizeVal('')
    onResetFilters()
  }

  // Count active filters (excluding pagination and sorting)
  const activeFilters = Object.entries(query).filter(([key, value]) => 
    key !== 'page' && key !== 'page_size' && key !== 'sort_by' && key !== 'sort_dir' && value
  ).length

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
                  onClick={handleReset}
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
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-9 h-9 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2"
                    />
                  </div>
                </div>

                {/* Field Selection */}
                <div className="w-40 min-w-[140px] space-y-2">
                  <Label className="text-xs font-medium tracking-wide text-muted-foreground mb-1 block">
                    Search Field
                  </Label>
                  <SingleSelect
                    value={selectedField}
                    onValueChange={setSelectedField}
                    options={TEXT_FIELD_OPTIONS}
                    placeholder="Select Field"
                    triggerClassName="h-9 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2"
                  />
                </div>
                {/* Apply Filters */}
                <Button
                  onClick={handleApplyFilters}
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
                        sizeOp={sizeOp}
                        sizeVal={sizeVal}
                        onChange={({ size_op, size_val }) => {
                          setSizeOp(size_op)
                          setSizeVal(size_val)
                        }}
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
