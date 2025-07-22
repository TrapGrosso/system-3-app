import * as React from "react"
import { MultiSelectChipPicker } from "@/components/shared/filter/MultiSelectChipPicker"
import { useAllPrompts } from "@/contexts/PromptContext"
import { useAuth } from "@/contexts/AuthContext"

export function EnrichmentFilters({ filters, onChange, enrichmentsData = [] }) {
  const { user } = useAuth()
  const { data: prompts = [] } = useAllPrompts('deep_search')

  // Generate unique sources from enrichments data
  const sourceOptions = React.useMemo(() => {
    const uniqueSources = [...new Set(enrichmentsData.map(e => e.source).filter(Boolean))]
    return uniqueSources.map(source => ({ value: source, label: source }))
  }, [enrichmentsData])

  // Prompt options
  const promptOptions = React.useMemo(() => 
    prompts.map(prompt => ({ value: prompt.id, label: prompt.name })),
    [prompts]
  )

  // Entity kind options (static)
  const entityKindOptions = [
    { value: 'prospect', label: 'Prospect' },
    { value: 'company', label: 'Company' }
  ]

  const handlePromptChange = (promptIds) => {
    onChange({ ...filters, promptIds })
  }

  const handleEntityKindChange = (entityKinds) => {
    onChange({ ...filters, entityKinds })
  }

  const handleSourceChange = (sources) => {
    onChange({ ...filters, sources })
  }

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <h4 className="font-medium text-sm">Filters</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Prompts</label>
          <MultiSelectChipPicker
            options={promptOptions}
            value={filters.promptIds || []}
            onValueChange={handlePromptChange}
            placeholder="Filter by prompts..."
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Type</label>
          <MultiSelectChipPicker
            options={entityKindOptions}
            value={filters.entityKinds || []}
            onValueChange={handleEntityKindChange}
            placeholder="Filter by type..."
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Source</label>
          <MultiSelectChipPicker
            options={sourceOptions}
            value={filters.sources || []}
            onValueChange={handleSourceChange}
            placeholder="Filter by source..."
          />
        </div>
      </div>
    </div>
  )
}
