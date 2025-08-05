import * as React from "react"
import { SearchIcon, FilterIcon, XIcon, ChevronDownIcon, CheckIcon } from "lucide-react"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useGroups } from '@/contexts/GroupsContext'
import { useFetchCampaigns } from '@/api/campaign-context/fetchCampaigns'
import { useAllPrompts } from "@/contexts/PromptContext"
import { useAuth } from '@/contexts/AuthContext'
import { MultiSelectChipPicker } from "../shared/filter/MultiSelectChipPicker"
import { SingleSelect } from "../shared/filter/SingleSelect"
import AdvancedFiltersCollapsible from "../shared/ui/AdvancedFiltersCollapsible"

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
  { value: 'variable_name', label: 'Variable Name' },
]

export default function FilterBar({ query, onApplyFilters, onResetFilters, loading }) {
  const { user } = useAuth()
  const { groups = [] } = useGroups()
  const { data: campaigns = [] } = useFetchCampaigns(user?.id)
  const { data: prompts = [] } = useAllPrompts('deep_research')

  // Local state for search input and selected fields
  const [searchInput, setSearchInput] = React.useState(query.q || '')
  const [selectedFields, setSelectedFields] = React.useState(
    query.search_fields ? query.search_fields.split(',') : []
  )

  // Local state for single-value selects
  const [status, setStatus] = React.useState(query.status || '')
  const [inGroup, setInGroup] = React.useState(query.in_group || '')
  const [inCampaign, setInCampaign] = React.useState(query.in_campaign || '')
  const [hasBdScrape, setHasBdScrape] = React.useState(query.has_bd_scrape || '')
  const [hasDeepSearch, setHasDeepSearch] = React.useState(query.has_deep_search || '')

  // Local state for multi-select CSV filters
  const [selectedGroupNames, setSelectedGroupNames] = React.useState(
    query.group_names ? query.group_names.split(',').filter(Boolean) : []
  )
  const [selectedCampaignNames, setSelectedCampaignNames] = React.useState(
    query.campaign_names ? query.campaign_names.split(',').filter(Boolean) : []
  )
  const [selectedPromptNames, setSelectedPromptNames] = React.useState(
    query.prompt_names ? query.prompt_names.split(',').filter(Boolean) : []
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

  // Sync single-value selects with external filter changes
  React.useEffect(() => {
    if (query.status !== status) {
      setStatus(query.status || '')
    }
  }, [query.status])

  React.useEffect(() => {
    if (query.in_group !== inGroup) {
      setInGroup(query.in_group || '')
    }
  }, [query.in_group])

  React.useEffect(() => {
    if (query.in_campaign !== inCampaign) {
      setInCampaign(query.in_campaign || '')
    }
  }, [query.in_campaign])

  React.useEffect(() => {
    if (query.has_bd_scrape !== hasBdScrape) {
      setHasBdScrape(query.has_bd_scrape || '')
    }
  }, [query.has_bd_scrape])

  React.useEffect(() => {
    if (query.has_deep_search !== hasDeepSearch) {
      setHasDeepSearch(query.has_deep_search || '')
    }
  }, [query.has_deep_search])

  // Sync multi-select arrays with external filter changes
  React.useEffect(() => {
    const groupNamesFromFilter = query.group_names ? query.group_names.split(',').filter(Boolean) : []
    if (JSON.stringify(groupNamesFromFilter) !== JSON.stringify(selectedGroupNames)) {
      setSelectedGroupNames(groupNamesFromFilter)
    }
  }, [query.group_names])

  React.useEffect(() => {
    const campaignNamesFromFilter = query.campaign_names ? query.campaign_names.split(',').filter(Boolean) : []
    if (JSON.stringify(campaignNamesFromFilter) !== JSON.stringify(selectedCampaignNames)) {
      setSelectedCampaignNames(campaignNamesFromFilter)
    }
  }, [query.campaign_names])

  React.useEffect(() => {
    const promptNamesFromFilter = query.prompt_names ? query.prompt_names.split(',').filter(Boolean) : []
    if (JSON.stringify(promptNamesFromFilter) !== JSON.stringify(selectedPromptNames)) {
      setSelectedPromptNames(promptNamesFromFilter)
    }
  }, [query.prompt_names])

  const handleApplyFilters = () => {
    onApplyFilters({
      q: searchInput.trim(),
      search_fields: selectedFields.length ? selectedFields.join(',') : '',
      group_names: selectedGroupNames.length ? selectedGroupNames.join(',') : '',
      campaign_names: selectedCampaignNames.length ? selectedCampaignNames.join(',') : '',
      prompt_names: selectedPromptNames.length ? selectedPromptNames.join(',') : '',
      status,
      in_group: inGroup,
      in_campaign: inCampaign,
      has_bd_scrape: hasBdScrape,
      has_deep_search: hasDeepSearch
    })
  }

  const handleReset = () => {
    setSearchInput('')
    setSelectedFields([])
    setStatus('')
    setInGroup('')
    setInCampaign('')
    setHasBdScrape('')
    setHasDeepSearch('')
    setSelectedGroupNames([])
    setSelectedCampaignNames([])
    setSelectedPromptNames([])
    onResetFilters()
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

              {/* Advanced Filters Collapsible Section */}
              <AdvancedFiltersCollapsible label="Advanced filters" defaultOpen={false}>
                {/* Other Filters - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">Status</Label>
                    <SingleSelect
                      value={status}
                      onValueChange={setStatus}
                      options={STATUS_OPTIONS}
                      placeholder="All Statuses"
                    />
                  </div>

                  {/* Group Membership */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">In Group</Label>
                    <SingleSelect
                      value={inGroup}
                      onValueChange={setInGroup}
                      options={BOOLEAN_OPTIONS}
                      placeholder="All"
                    />
                  </div>

                  {/* Campaign Membership */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">In Campaign</Label>
                    <SingleSelect
                      value={inCampaign}
                      onValueChange={setInCampaign}
                      options={BOOLEAN_OPTIONS}
                      placeholder="All"
                    />
                  </div>

                  {/* BD Enrichment */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">BD Enrichment</Label>
                    <SingleSelect
                      value={hasBdScrape}
                      onValueChange={setHasBdScrape}
                      options={BOOLEAN_OPTIONS}
                      placeholder="All"
                    />
                  </div>

                  {/* Deep Search */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">Deep Search</Label>
                    <SingleSelect
                      value={hasDeepSearch}
                      onValueChange={setHasDeepSearch}
                      options={BOOLEAN_OPTIONS}
                      placeholder="All"
                    />
                  </div>
                </div>

                {/* Multi-select filters section */}
                <div className="space-y-4">
                  {/* Groups Multi-select */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">
                      Group Names (select multiple)
                    </Label>
                    <MultiSelectChipPicker
                      options={groups.map(group => ({ value: group.name, label: group.name }))}
                      value={selectedGroupNames}
                      onValueChange={setSelectedGroupNames}
                      placeholder={groups.length ? "Choose groups..." : "No groups available"}
                    />
                  </div>

                  {/* Campaigns Multi-select */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">
                      Campaign Names (select multiple)
                    </Label>
                    <MultiSelectChipPicker
                      options={campaigns.map(campaign => ({ value: campaign.name, label: campaign.name }))}
                      value={selectedCampaignNames}
                      onValueChange={setSelectedCampaignNames}
                      placeholder={campaigns.length ? "Choose campaigns..." : "No campaigns available"}
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
              </AdvancedFiltersCollapsible>
            </div>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  )
}
