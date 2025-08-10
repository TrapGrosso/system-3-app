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

function statusToBadgeVariant(status) {
  const value = (status || "").toLowerCase()
  switch (value) {
    case "active":
      return "default"
    case "running subsequences":
      return "default"
    case "paused":
      return "outline"
    case "bounce protect":
      return "outline"
    case "scheduled":
      return "outline"
    case "completed":
      return "secondary"
    case "draft":
      return "secondary"
    case "account suspended":
      return "destructive"
    case "accounts unhealthy":
      return "destructive"
    case "deleted":
      return "destructive"
    default:
      return "secondary"
  }
}

function CampaignSingleSelect({ value, onChange }) {
  const {
    campaigns = [],
    isLoadingCampaigns,
    isErrorCampaigns,
    refetchCampaigns,
  } = useCampaigns()

  const selectedCampaign = campaigns.find((c) => c.id === value)

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

      {selectedCampaign && (
        <div className="space-y-3 mt-5">
          <Label className="text-sm font-medium">Selected campaign preview:</Label>
          <div className="text-xs text-muted-foreground space-y-2 p-3 rounded-md border">
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedCampaign.name}</span>
              <Badge variant="secondary" className="ml-2">
                {selectedCampaign.prospect_count ?? 0}
              </Badge>
              {selectedCampaign.status && (
                <Badge variant={statusToBadgeVariant(selectedCampaign.status)} className="ml-1 capitalize">
                  {selectedCampaign.status}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CampaignSingleSelect
