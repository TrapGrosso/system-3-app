import * as React from "react"
import { useMemo } from "react"
import { Sparkles, Users2, MessageSquare, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { StatTile } from "./StatTile"

export function ConfirmationSummary({ 
  selectedEnrichments, 
  selectedProspectCount, 
  selectedPromptIds,
  selectedByProspect,
  selectedPromptCount,
  flags = [],
  flagOptions = []
}) {
  // Aggregate enrichments by type and source
  const countsByKind = useMemo(() => {
    const counts = {}
    selectedEnrichments.forEach(enrichment => {
      const kind = enrichment.entity_kind || 'unknown'
      counts[kind] = (counts[kind] || 0) + 1
    })
    return counts
  }, [selectedEnrichments])

  const countsBySource = useMemo(() => {
    const counts = {}
    selectedEnrichments.forEach(enrichment => {
      const source = enrichment.source || 'unknown'
      counts[source] = (counts[source] || 0) + 1
    })
    return counts
  }, [selectedEnrichments])

  // Get unique prospect names (first 10)
  const prospectNames = useMemo(() => {
    const names = selectedEnrichments
      .map(e => e.prospect_name)
      .filter(Boolean)
      .filter((name, index, arr) => arr.indexOf(name) === index)
      .slice(0, 10)
    return names
  }, [selectedEnrichments])

  // Create a map of flag values to labels for display
  const flagLabelMap = useMemo(() => {
    const map = {}
    flagOptions.forEach(option => {
      map[option.value] = option.label
    })
    return map
  }, [flagOptions])

  const selectedCount = selectedEnrichments.length

  return (
    <div className="space-y-6">
      {/* Headline Metrics */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatTile 
          label="Enrichments" 
          value={selectedCount} 
          icon={Sparkles}
        />
        <StatTile 
          label="Prospects" 
          value={selectedProspectCount} 
          icon={Users2}
        />
        <StatTile 
          label="Prompts" 
          value={`${selectedPromptCount} Selected`}
          icon={MessageSquare}
          valueClass={selectedPromptCount > 0 ? "text-green-600" : "text-muted-foreground"}
        />
      </div>

      <Separator />

      {/* Detailed Breakdown */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm">Breakdown</h4>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {/* By Type */}
          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-medium text-muted-foreground">By Type</h5>
            <div className="space-y-1">
              {Object.entries(countsByKind).map(([kind, count]) => (
                <div key={kind} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{kind}</span>
                  <Badge variant="secondary" className="text-xs">{count}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* By Source */}
          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-medium text-muted-foreground">By Source</h5>
            <div className="space-y-1">
              {Object.entries(countsBySource).map(([source, count]) => (
                <div key={source} className="flex justify-between items-center">
                  <span className="text-sm">{source}</span>
                  <Badge variant="secondary" className="text-xs">{count}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processing Options */}
        {flags.length > 0 && (
          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-medium text-muted-foreground">Processing Options</h5>
            <div className="space-y-1">
              {flags.map((flag) => (
                <div key={flag} className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{flagLabelMap[flag] || flag}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Affected Prospects */}
        {prospectNames.length > 0 && (
          <div className="p-4 border rounded-lg space-y-2">
            <h5 className="text-sm font-medium text-muted-foreground">
              Affected Prospects ({selectedProspectCount})
            </h5>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {prospectNames.join(", ")}
              {selectedProspectCount > prospectNames.length && (
                <span className="italic"> and {selectedProspectCount - prospectNames.length} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Warning Banner */}
      <div className="flex gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-orange-800">Ready to create variables</p>
          <p className="text-sm text-orange-700">
            This action will immediately create variables for all selected enrichments. Please review the breakdown above before continuing.
          </p>
        </div>
      </div>
    </div>
  )
}
