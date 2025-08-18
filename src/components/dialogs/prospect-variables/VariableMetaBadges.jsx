import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

function VariableMetaBadges({ variable, formatDate }) {
  const prompt = variable?.prompt || null
  const enrichments = Array.isArray(variable?.enrichments) ? variable.enrichments : []
  const hasPrompt = !!prompt
  const hasEnrichments = enrichments.length > 0

  if (!hasPrompt && !hasEnrichments) return null

  const fmtDate = (dateString) => {
    if (!dateString) return null
    try {
      return typeof formatDate === "function"
        ? formatDate(dateString)
        : new Date(dateString).toLocaleDateString()
    } catch {
      return null
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {hasPrompt && (
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant="secondary"
              title="View variable prompt"
              className="cursor-pointer"
            >
              Prompt
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-72 max-h-80 overflow-y-auto space-y-2">
            <div className="text-xs font-medium">Variable Prompt</div>
            <div className="space-y-1.5">
              {prompt?.name ? (
                <div className="text-sm font-medium">{prompt.name}</div>
              ) : (
                <div className="text-sm font-medium">Untitled prompt</div>
              )}
              {prompt?.agent_type && (
                <div className="text-xs text-muted-foreground">{prompt.agent_type}</div>
              )}
              {prompt?.description ? (
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {prompt.description}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">No description</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {hasEnrichments && (
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant="secondary"
              title="View enrichments"
              className="cursor-pointer"
            >
              Enrichments ({enrichments.length})
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-80 overflow-y-auto">
            <div className="space-y-2">
              <div className="text-xs font-medium">Enrichments</div>
              <Separator />
              <div className="space-y-3">
                {enrichments.map((e, idx) => {
                  const showSep = idx < enrichments.length - 1
                  return (
                    <div key={e?.id || idx} className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {e?.type ? (
                          <Badge variant="outline" className="text-[10px]">
                            {e.type}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            enrichment
                          </Badge>
                        )}
                        {e?.source && <span>{e.source}</span>}
                        {e?.created_at && (
                          <span>• {fmtDate(e.created_at)}</span>
                        )}
                      </div>

                      {e?.prompt ? (
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">{e.prompt.name || "Untitled prompt"}</div>
                          {e.prompt.agent_type && (
                            <div className="text-xs text-muted-foreground">{e.prompt.agent_type}</div>
                          )}
                          {e.prompt.description ? (
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                              {e.prompt.description}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">No description</p>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">No enrichment prompt</div>
                      )}
                      {showSep && <Separator />}
                    </div>
                  )
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default VariableMetaBadges
