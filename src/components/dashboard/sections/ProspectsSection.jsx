import * as React from "react"
import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DonutChart, formatNumber, formatPercent } from "@/components/shared/ui/ChartKit"
import { NewlyAddedTable } from "../components/prospect-section/NewlyAddedTable"
import { DataCompletenessCards } from "../components/prospect-section/DataCompletenessCards"

/**
 * ProspectsSection - Newly added prospects and data completeness overview
 */
export function ProspectsSection({ data, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted/30 animate-pulse rounded w-48" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-64 bg-muted/30 animate-pulse rounded-lg" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted/30 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const prospects = data?.prospects || {}
  const newlyAdded = prospects.newlyAdded || { count: 0, items: [] }
  const dataCompleteness = prospects.dataCompleteness || {}

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Prospects</h2>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Newly Added Prospects */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recently Added</h3>
          <NewlyAddedTable prospects={newlyAdded.items} />
        </div>

        {/* Data Completeness */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Completeness</h3>
          <DataCompletenessCards completeness={dataCompleteness} />
        </div>
      </div>
    </div>
  )
}
