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
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useGroups } from '@/contexts/GroupsContext'
import { useFetchCampaigns } from '@/api/campaign-context/fetchCampaigns'
import { useAuth } from '@/contexts/AuthContext'
import { useProspects } from '@/contexts/ProspectsContext'

const STATUS_OPTIONS = [
  { value: null, label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'queued', label: 'Queued' },
  { value: 'researching', label: 'Researching' },
  { value: 'ready', label: 'Ready' },
  { value: 'archived', label: 'Archived' },
]

const BOOLEAN_OPTIONS = [
  { value: null, label: 'All' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

const SEARCH_FIELD_OPTIONS = [
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'headline', label: 'Headline' },
  { value: 'location', label: 'Location' },
  { value: 'email', label: 'Email' },
  { value: 'title', label: 'Title' },
  { value: 'company_name', label: 'Company Name' },
  { value: 'company_website', label: 'Company Website' },
  { value: 'company_industry', label: 'Company Industry' },
  { value: 'company_size', label: 'Company Size' },
  { value: 'company_location', label: 'Company Location' },
  { value: 'notes', label: 'Notes' },
  { value: 'task_titles', label: 'Task Titles' },
  { value: 'task_descriptions', label: 'Task Descriptions' },
  { value: 'group_names', label: 'Group Names' },
  { value: 'campaign_names', label: 'Campaign Names' },
  { value: 'enrichment_data', label: 'Enrichment Data' },
]

// Multi-select chip picker component using Command + Popover
function MultiSelectChipPicker({ 
  options, 
  value = [], 
  onValueChange, 
  placeholder = "Choose fields..." 
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
            <CommandInput placeholder="Search fields..." />
            <CommandEmpty>No fields found.</CommandEmpty>
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

export default function FilterBar() {
  const { user } = useAuth()
  const { groups = [] } = useGroups()
  const { data: campaigns = [] } = useFetchCampaigns(user?.id)
  const { query, setQuery, resetFilters, isLoading } = useProspects()

  // Local state for search input and selected fields
  const [searchInput, setSearchInput] = React.useState(query.q || '')
  const [selectedFields, setSelectedFields] = React.useState(
    query.search_fields ? query.search_fields.split(',') : []
  )

  // Sync local search input with external filter changes
  React.useEffect(() => {
    if (query.q !== searchInput) {
      setSearchInput(query.q || '')
    }
  }, [query.q])

  // Sync selected fields with external filter changes
  React.useEffect(() => {
    const fieldsFromFilter = query.search_fields ? query.search_fields.split(',') : []
    if (JSON.stringify(fieldsFromFilter) !== JSON.stringify(selectedFields)) {
      setSelectedFields(fieldsFromFilter)
    }
  }, [query.search_fields])

  const handleFilterChange = (key, value) => {
    setQuery({ [key]: value })
  }

  const handleApplyFilters = () => {
    setQuery({
      q: searchInput.trim(),
      search_fields: selectedFields.length ? selectedFields.join(',') : '',
      page: 1 // Reset to first page when applying filters
    })
  }

  const handleReset = () => {
    setSearchInput('')
    setSelectedFields([])
    resetFilters()
  }

  // Count active filters
  const activeFilters = Object.entries(query).filter(([key, value]) => 
    key !== 'page' && key !== 'page_size' && key !== 'sort_by' && key !== 'sort_dir' && value
  ).length

  // Group options for select
  const groupOptions = [
    { value: 'all', label: 'All Groups' },
    ...groups.map(group => ({
      value: group.name,
      label: group.name
    }))
  ]

  // Campaign options for select
  const campaignOptions = [
    { value: 'all', label: 'All Campaigns' },
    ...campaigns.map(campaign => ({
      value: campaign.name,
      label: campaign.name
    }))
  ]

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
              {/* Search Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Global Search */}
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-[13px] font-medium text-muted-foreground">Search</Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search prospects..."
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

              {/* Search Fields Selection */}
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-muted-foreground">
                  Search Fields (leave empty to search all fields)
                </Label>
                <MultiSelectChipPicker
                  options={SEARCH_FIELD_OPTIONS}
                  value={selectedFields}
                  onValueChange={setSelectedFields}
                  placeholder="Choose search fields..."
                />
              </div>

              {/* Other Filters - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">Status</Label>
                  <Select
                    value={query.status || ''}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger className="h-9 min-w-[180px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Group Membership */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">In Group</Label>
                  <Select
                    value={query.in_group || ''}
                    onValueChange={(value) => handleFilterChange('in_group', value)}
                  >
                    <SelectTrigger className="h-9 min-w-[180px]">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOLEAN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Specific Group */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">Group Name</Label>
                  <Select
                    value={query.group_name || ''}
                    onValueChange={(value) => handleFilterChange('group_name', value)}
                    disabled={!groups.length}
                  >
                    <SelectTrigger className="h-9 min-w-[180px]">
                      <SelectValue placeholder={groups.length ? "All Groups" : "No groups available"} />
                    </SelectTrigger>
                    <SelectContent>
                      {groupOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Campaign Membership */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">In Campaign</Label>
                  <Select
                    value={query.in_campaign || ''}
                    onValueChange={(value) => handleFilterChange('in_campaign', value)}
                  >
                    <SelectTrigger className="h-9 min-w-[180px]">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOLEAN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Specific Campaign */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">Campaign Name</Label>
                  <Select
                    value={query.campaign_name || ''}
                    onValueChange={(value) => handleFilterChange('campaign_name', value)}
                    disabled={!campaigns.length}
                  >
                    <SelectTrigger className="h-9 min-w-[180px]">
                      <SelectValue placeholder={campaigns.length ? "All Campaigns" : "No campaigns available"} />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* BD Enrichment */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">BD Enrichment</Label>
                  <Select
                    value={query.has_bd_scrape || ''}
                    onValueChange={(value) => handleFilterChange('has_bd_scrape', value)}
                  >
                    <SelectTrigger className="h-9 min-w-[180px]">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOLEAN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Deep Search */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">Deep Search</Label>
                  <Select
                    value={query.has_deep_search || ''}
                    onValueChange={(value) => handleFilterChange('has_deep_search', value)}
                  >
                    <SelectTrigger className="h-9 min-w-[180px]">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOLEAN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  )
}
