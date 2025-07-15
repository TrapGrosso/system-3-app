import * as React from "react"
import { SearchIcon, FilterIcon, XIcon, ChevronDownIcon, CheckIcon } from "lucide-react"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Card, CardContent } from '@/components/ui/card'
import { useGetAllPrompts } from '@/api/prompt-context/getAllPrompts'
import { useAuth } from '@/contexts/AuthContext'
import { useEnrichments } from '@/contexts/EnrichmentsContext'

const TYPE_OPTIONS = [
  { value: 'bd_scrape', label: 'BD Scrape' },
  { value: 'deep_search', label: 'Deep Search' },
]

const HAS_COMPANY_OPTIONS = [
  { value: null, label: 'All' },
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

// Multi-select chip picker component using Command + Popover
function MultiSelectChipPicker({ 
  options, 
  value = [], 
  onValueChange, 
  placeholder = "Choose options..." 
}) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onValueChange(newValue)
  }

  const handleRemoveChip = (optionValue) => {
    onValueChange(value.filter(v => v !== optionValue))
  }

  const getOptionLabel = (optionValue) => {
    return options.find(opt => opt.value === optionValue)?.label || optionValue
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 min-w-40 justify-between"
            role="combobox"
            aria-expanded={open}
          >
            {placeholder}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search options..." />
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <CheckIcon
                      className={`mr-2 h-4 w-4 ${
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((optionValue) => (
            <Badge 
              key={optionValue} 
              variant="outline" 
              className="text-xs px-2 py-1"
            >
              {getOptionLabel(optionValue)}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => handleRemoveChip(optionValue)}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default function EnrichmentsFilterBar() {
  const { user } = useAuth()
  const { data: prompts = [] } = useGetAllPrompts(user?.id)
  const { query, setQuery, resetFilters, isLoading } = useEnrichments()

  // Local state for filters
  const [selectedTypes, setSelectedTypes] = React.useState(
    query.type ? query.type.split(',').filter(Boolean) : []
  )
  const [selectedPromptNames, setSelectedPromptNames] = React.useState(
    query.prompt_name ? query.prompt_name.split(',').filter(Boolean) : []
  )
  const [hasCompany, setHasCompany] = React.useState(query.has_company || '')

  // Sync local state with external filter changes
  React.useEffect(() => {
    const typesFromFilter = query.type ? query.type.split(',').filter(Boolean) : []
    if (JSON.stringify(typesFromFilter) !== JSON.stringify(selectedTypes)) {
      setSelectedTypes(typesFromFilter)
    }
  }, [query.type])

  React.useEffect(() => {
    const promptNamesFromFilter = query.prompt_name ? query.prompt_name.split(',').filter(Boolean) : []
    if (JSON.stringify(promptNamesFromFilter) !== JSON.stringify(selectedPromptNames)) {
      setSelectedPromptNames(promptNamesFromFilter)
    }
  }, [query.prompt_name])

  React.useEffect(() => {
    if (query.has_company !== hasCompany) {
      setHasCompany(query.has_company || '')
    }
  }, [query.has_company])

  const handleApplyFilters = () => {
    setQuery({
      type: selectedTypes.length ? selectedTypes.join(',') : '',
      prompt_name: selectedPromptNames.length ? selectedPromptNames.join(',') : '',
      has_company: hasCompany,
      page: 1 // Reset to first page when applying filters
    })
  }

  const handleReset = () => {
    setSelectedTypes([])
    setSelectedPromptNames([])
    setHasCompany('')
    resetFilters()
  }

  // Count active filters
  const activeFilters = Object.entries(query).filter(([key, value]) => 
    key !== 'page' && key !== 'page_size' && key !== 'sort_by' && key !== 'sort_dir' && value
  ).length

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <fieldset disabled={isLoading}>
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
              {/* Apply Filters Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleApplyFilters}
                  className="h-9"
                >
                  Apply Filters
                </Button>
              </div>

              {/* Filter Options - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Has Company Filter */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">Has Company</Label>
                  <Select
                    value={hasCompany}
                    onValueChange={setHasCompany}
                  >
                    <SelectTrigger className="h-9 min-w-[180px]">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      {HAS_COMPANY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Multi-select filters section */}
              <div className="space-y-4">
                {/* Types Multi-select */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">
                    Enrichment Types (select multiple)
                  </Label>
                  <MultiSelectChipPicker
                    options={TYPE_OPTIONS}
                    value={selectedTypes}
                    onValueChange={setSelectedTypes}
                    placeholder="Choose types..."
                  />
                </div>

                {/* Prompts Multi-select */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">
                    Prompt Names (select multiple)
                  </Label>
                  <MultiSelectChipPicker
                    options={prompts.map(prompt => ({ value: prompt.name, label: prompt.name }))}
                    value={selectedPromptNames}
                    onValueChange={setSelectedPromptNames}
                    placeholder={prompts.length ? "Choose prompts..." : "No prompts available"}
                  />
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  )
}
