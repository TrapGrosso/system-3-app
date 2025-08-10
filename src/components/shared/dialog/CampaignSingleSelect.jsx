import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"

import { useCampaigns } from "@/contexts/CampaignsContext"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"

function CampaignSingleSelect({ value, onChange }) {
  const {
    campaigns = [],
    isLoadingCampaigns,
    isErrorCampaigns,
    refetchCampaigns,
  } = useCampaigns()

  if (isLoadingCampaigns) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (isErrorCampaigns) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">Failed to load campaigns</p>
        <SpinnerButton
          variant="outline"
          size="sm"
          onClick={() => refetchCampaigns()}
        >
          Retry
        </SpinnerButton>
      </div>
    )
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground mb-2">No campaigns found</p>
        
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="campaign-select" className="text-sm font-medium">
          Select campaign
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id="campaign-select" className="w-full">
            <SelectValue placeholder="Choose a campaign..." />
          </SelectTrigger>
          <SelectContent>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{campaign.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {campaign.prospect_count ?? 0}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default CampaignSingleSelect
