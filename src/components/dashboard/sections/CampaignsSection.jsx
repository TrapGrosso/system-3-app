import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RunningCampaignCard } from "../components/camapaign-section/RunningCampaignCard"
import { BestPerformingTable } from "../components/camapaign-section/BestPerformingTable"
import { NeedsAttentionPanel } from "../components/camapaign-section/NeedsAttentionPanel"

/**
 * CampaignsSection - Complete campaigns overview with running campaigns, best performing, and needs attention
 */
export function CampaignsSection({ data, thresholds, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted/30 animate-pulse rounded w-48" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted/30 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const campaigns = data?.campaigns || {}
  const running = campaigns.running || []
  const bestPerforming = campaigns.bestPerforming || []
  const needsAttention = campaigns.needsAttention || {}

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Campaigns</h2>
      
      {/* Running Campaigns Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Running Campaigns</h3>
        {running.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {running.map((campaign) => (
              <RunningCampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                thresholds={thresholds}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No running campaigns found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Best Performing Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Best Performing Campaigns</h3>
        <BestPerformingTable campaigns={bestPerforming} />
      </div>

      {/* Needs Attention Panel */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Campaigns Needing Attention</h3>
        <NeedsAttentionPanel needsAttention={needsAttention} />
      </div>
    </div>
  )
}