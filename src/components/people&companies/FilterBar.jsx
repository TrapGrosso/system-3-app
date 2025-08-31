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
import { makeStagedBindings } from "@/utils/filterBindings"
import { countActiveFilters } from "@/utils/activeFilters"

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
  { value: 'enrichment_types', label: 'Enrichment Types' },
  { value: 'enrichment_prompt_names', label: 'Enrichment Prompt Names' },
]

export default function FilterBar({ query, onApplyFilters, onResetFilters, loading }) {
  const { user } = useAuth()
  const { groups = [] } = useGroups()
  const { data: campaigns = [] } = useFetchCampaigns(user?.id)
  const { data: prompts = [] } = useAllPrompts('deep_research')

  const schema = React.useMemo(() => ({
    q: { kind: "input" },
    search_fields: { kind: "multiCsv" },
    status: { kind: "singleSelect" },
    in_group: { kind: "singleSelect" },
    in_campaign: { kind: "singleSelect" },
    has_bd_scrape: { kind: "singleSelect" },
    has_deep_search: { kind: "singleSelect" },
    group_names: { kind: "multiCsv" },
    campaign_names: { kind: "multiCsv" },
    prompt_names: { kind: "multiCsv" },
  }), [])

  const {
    staged,
    apply,
    reset
  } = makeStagedBindings(query, schema, onApplyFilters, onResetFilters)

  const activeFilters = countActiveFilters(query, ['page','page_size','sort_by','sort_dir'])

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
                  onClick={reset}
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
                      value={staged.q.value}
                      onChange={(e) => staged.q.set(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Apply Filters Button */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-muted-foreground">&nbsp;</Label>
                  <Button 
                    onClick={apply}
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
                  value={staged.search_fields.value}
                  onValueChange={staged.search_fields.set}
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
                      value={staged.status.value}
                      onValueChange={staged.status.set}
                      options={STATUS_OPTIONS}
                      placeholder="All Statuses"
                    />
                  </div>

                  {/* Group Membership */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">In Group</Label>
                    <SingleSelect
                      value={staged.in_group.value}
                      onValueChange={staged.in_group.set}
                      options={BOOLEAN_OPTIONS}
                      placeholder="All"
                    />
                  </div>

                  {/* Campaign Membership */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">In Campaign</Label>
                    <SingleSelect
                      value={staged.in_campaign.value}
                      onValueChange={staged.in_campaign.set}
                      options={BOOLEAN_OPTIONS}
                      placeholder="All"
                    />
                  </div>

                  {/* BD Enrichment */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">BD Enrichment</Label>
                    <SingleSelect
                      value={staged.has_bd_scrape.value}
                      onValueChange={staged.has_bd_scrape.set}
                      options={BOOLEAN_OPTIONS}
                      placeholder="All"
                    />
                  </div>

                  {/* Deep Search */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">Deep Search</Label>
                    <SingleSelect
                      value={staged.has_deep_search.value}
                      onValueChange={staged.has_deep_search.set}
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
                      value={staged.group_names.value}
                      onValueChange={staged.group_names.set}
                      placeholder={groups.length ? "Choose groups..." : "No groups available"}
                    />
                  </div>

                  {/* Campaigns Multi-select */}
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">
                      Campaign Names (select multiple)
                    </Label>
                    <MultiSelectChipPicker
                      options={campaigns.map(campaign => ({ id: campaign.id,value: campaign.name, label: campaign.name }))}
                      value={staged.campaign_names.value}
                      onValueChange={staged.campaign_names.set}
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
                      value={staged.prompt_names.value}
                      onValueChange={staged.prompt_names.set}
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
