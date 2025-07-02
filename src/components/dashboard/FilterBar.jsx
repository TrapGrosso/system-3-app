import * as React from "react"
import { SearchIcon, FilterIcon, XIcon } from "lucide-react"
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
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'
import { Card, CardContent } from '@/components/ui/card'
import { useGroups } from '@/contexts/GroupsContext'
import { useFetchCampaigns } from '@/api/campaign-context/fetchCampaigns'
import { useAuth } from '@/contexts/AuthContext'

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
]

const BOOLEAN_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

export default function FilterBar({ filters, onFiltersChange }) {
  const { user } = useAuth()
  const { groups = [] } = useGroups()
  const { data: campaigns = [] } = useFetchCampaigns(user?.id)

  // Local state for search input to enable debouncing
  const [searchInput, setSearchInput] = React.useState(filters.q || '')
  const debouncedSearch = useDebounce(searchInput, 300)

  // Update filters when debounced search changes
  React.useEffect(() => {
    if (debouncedSearch !== filters.q) {
      onFiltersChange({ q: debouncedSearch })
    }
  }, [debouncedSearch, filters.q, onFiltersChange])

  // Sync local search input with external filter changes
  React.useEffect(() => {
    if (filters.q !== searchInput) {
      setSearchInput(filters.q || '')
    }
  }, [filters.q])

  const handleFilterChange = (key, value) => {
    onFiltersChange({ [key]: value })
  }

  const handleReset = () => {
    setSearchInput('')
    onFiltersChange({
      q: '',
      status: '',
      in_group: '',
      group_name: '',
      in_campaign: '',
      campaign_name: '',
      has_bd_scrape: '',
      has_deep_search: '',
    })
  }

  // Count active filters
  const activeFilters = Object.entries(filters).filter(([key, value]) => 
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Global Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search prospects..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
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
              <Label>In Group</Label>
              <Select
                value={filters.in_group || ''}
                onValueChange={(value) => handleFilterChange('in_group', value)}
              >
                <SelectTrigger>
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
              <Label>Group Name</Label>
              <Select
                value={filters.group_name || ''}
                onValueChange={(value) => handleFilterChange('group_name', value)}
                disabled={!groups.length}
              >
                <SelectTrigger>
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
              <Label>In Campaign</Label>
              <Select
                value={filters.in_campaign || ''}
                onValueChange={(value) => handleFilterChange('in_campaign', value)}
              >
                <SelectTrigger>
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
              <Label>Campaign Name</Label>
              <Select
                value={filters.campaign_name || ''}
                onValueChange={(value) => handleFilterChange('campaign_name', value)}
                disabled={!campaigns.length}
              >
                <SelectTrigger>
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

            {/* BD Scrape */}
            <div className="space-y-2">
              <Label>BD Enrichment</Label>
              <Select
                value={filters.has_bd_scrape || ''}
                onValueChange={(value) => handleFilterChange('has_bd_scrape', value)}
              >
                <SelectTrigger>
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
              <Label>Deep Search</Label>
              <Select
                value={filters.has_deep_search || ''}
                onValueChange={(value) => handleFilterChange('has_deep_search', value)}
              >
                <SelectTrigger>
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
      </CardContent>
    </Card>
  )
}
