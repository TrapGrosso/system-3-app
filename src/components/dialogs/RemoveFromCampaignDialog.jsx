import * as React from "react"
import { useState } from "react"
import { Megaphone, Trash2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerOverlay from "@/components/shared/ui/SpinnerOverlay"

import { useCampaigns, useProspectCampaigns } from "@/contexts/CampaignsContext"

function RemoveFromCampaignDialog({
  prospect_id,
  prospect_name = "this prospect",
  open,
  onOpenChange,
  onSuccess
}) {
  // Track which campaign row is being removed
  const [removingCampaignId, setRemovingCampaignId] = useState(null)

  // Get campaigns context helpers
  const {
    removeProspectsFromCampaign,
    isRemovingFromCampaign,
  } = useCampaigns()

  // Fetch prospect campaigns
  const {
    data: campaigns = [],
    isLoading: isLoadingCampaigns,
    isError: isErrorCampaigns,
    refetch: refetchCampaigns,
  } = useProspectCampaigns(prospect_id)

  const handleRemoveFromCampaign = async (campaignId) => {
    setRemovingCampaignId(campaignId)
    try {
      // Wrapper normalizes single vs array inputs
      await removeProspectsFromCampaign(campaignId, [prospect_id])
      // Ensure the list updates immediately for this dialog
      await refetchCampaigns()
      onSuccess?.()
    } catch (error) {
      // Errors are handled by the context's toast
    } finally {
      setRemovingCampaignId(null)
    }
  }

  const handleOpenChange = (newOpen) => {
    onOpenChange(newOpen)
  }

  const isRemovingOne = isRemovingFromCampaign
  const isAnyLoading = isRemovingOne

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      icon={<Megaphone className="h-5 w-5" />}
      title={`Remove ${prospect_name} from Campaigns`}
      description={
        campaigns.length > 0
          ? `Remove ${prospect_name} from specific campaigns.`
          : `${prospect_name} is not currently in any campaigns.`
      }
      size="md"
    >
      <DialogWrapper.Body className="space-y-4">
        {/* Campaigns list */}
        <div className="space-y-3 relative">
          {isAnyLoading && <SpinnerOverlay />}
          {isLoadingCampaigns ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : isErrorCampaigns ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-destructive mb-2">Failed to load campaigns</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchCampaigns()}
              >
                Retry
              </Button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-2">Not in any campaigns</p>
              <p className="text-xs text-muted-foreground">
                {prospect_name} is not currently assigned to any campaigns
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{campaign.name}</span>
                      {campaign.status && (
                        <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                          {campaign.status}
                        </Badge>
                      )}
                    </div>
                    {(campaign.start_at || campaign.end_at) && (
                      <p className="text-xs text-muted-foreground truncate">
                        {campaign.start_at ? `Start: ${campaign.start_at}` : null}
                        {campaign.start_at && campaign.end_at ? " • " : null}
                        {campaign.end_at ? `End: ${campaign.end_at}` : null}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveFromCampaign(campaign.id)}
                    disabled={isAnyLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove from {campaign.name}</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* No bulk removal for campaigns by requirement */}
        <Separator className="hidden" />
      </DialogWrapper.Body>

      <DialogWrapper.Footer>
        <Button
          variant="outline"
          onClick={() => handleOpenChange(false)}
          disabled={isAnyLoading}
        >
          Close
        </Button>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default RemoveFromCampaignDialog
