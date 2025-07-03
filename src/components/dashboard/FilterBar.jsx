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

export default function FilterBar({ filters, onFiltersChange }) {
  const { user } = useAuth()
  const { groups = [] } = useGroups()
  const { data: campaigns = [] } = useFetchCampaigns(user?.id)

  // Local state for search input and selected fields
  const [searchInput, setSearchInput] = React.useState(filters.q || '')
  const [selectedFields, setSelectedFields] = React.useState(
    filters.search_fields ? filters.search_fields.split(',') : []
  )

  // Sync local search input with external filter changes
  React.useEffect(() => {
    if (filters.q !== searchInput) {
      setSearchInput(filters.q || '')
    }
  }, [filters.q])

  // Sync selected fields with external filter changes
  React.useEffect(() => {
    const fieldsFromFilter = filters.search_fields ? filters.search_fields.split(',') : []
    if (JSON.stringify(fieldsFromFilter) !== JSON.stringify(selectedFields)) {
      setSelectedFields(fieldsFromFilter)
    }
  }, [filters.search_fields])

  const handleFilterChange = (key, value) => {
    onFiltersChange({ [key]: value })
  }

  const handleApplyFilters = () => {
    onFiltersChange({
      q: searchInput.trim(),
      search_fields: selectedFields.length ? selectedFields.join(',') : ''
    })
  }

  const handleReset = () => {
    setSearchInput('')
    setSelectedFields([])
    onFiltersChange({
      q: '',
      search_fields: '',
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
          <div className="space-y-4">
            {/* Search Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Apply Filters Button */}
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button 
                  onClick={handleApplyFilters}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Search Fields Selection */}
            <div className="space-y-2">
              <Label>Search Fields (leave empty to search all fields)</Label>
              <ToggleGroup
                type="multiple"
                value={selectedFields}
                onValueChange={setSelectedFields}
                className="flex-wrap justify-start"
              >
                {SEARCH_FIELD_OPTIONS.map((field) => (
                  <ToggleGroupItem
                    key={field.value}
                    value={field.value}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {field.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Other Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

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
        </div>
      </CardContent>
    </Card>
  )
}
