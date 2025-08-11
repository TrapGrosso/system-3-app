import * as React from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import CampaignsGrid from "@/components/campaign/CampaignsGrid"
import { CampaignsProvider, useCampaigns } from "@/contexts/CampaignsContext"
import { useNavigate } from "react-router-dom"

function CampaignsContent() {
  const {
    campaigns = [],
    isLoadingCampaigns,
    isErrorCampaigns,
    refetchCampaigns,
  } = useCampaigns()

  const [isRetrying, setIsRetrying] = React.useState(false)

  const handleCreateCampaign = React.useCallback(() => {
    // Placeholder until createCampaign mutation is implemented
    toast.info("Create campaign: not implemented yet")
  }, [])

  const navigate = useNavigate()

  const handleCampaignSelection = React.useCallback((campaignId) => {
    if (!campaignId) return
    navigate(`/campaigns/${campaignId}`)
  }, [navigate])

  const handleRetry = React.useCallback(async () => {
    setIsRetrying(true)
    try {
      await refetchCampaigns()
    } finally {
      setIsRetrying(false)
    }
  }, [refetchCampaigns])

  return (
    <DashboardLayout headerText="Campaigns">
      <div className="px-4 lg:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Campaign Management</h2>
            <p className="text-muted-foreground">
              Create and manage your outreach campaigns
            </p>
          </div>

          <Button onClick={handleCreateCampaign}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Loading */}
        {isLoadingCampaigns && (
          <CampaignsGrid isLoading skeletonCount={12} />
        )}

        {/* Error state */}
        {!isLoadingCampaigns && isErrorCampaigns && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Failed to load campaigns</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                There was an error while fetching your campaigns. Please try again.
              </p>
              <SpinnerButton
                loading={isRetrying}
                onClick={handleRetry}
                variant="outline"
              >
                Retry
              </SpinnerButton>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!isLoadingCampaigns && !isErrorCampaigns && campaigns.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">No campaigns found</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Get started by creating your first campaign.
              </p>
              <Button onClick={handleCreateCampaign} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Campaigns grid */}
        {!isLoadingCampaigns && !isErrorCampaigns && campaigns.length > 0 && (
          <>
            <div className="text-sm text-muted-foreground">
              Showing {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}
            </div>
            <CampaignsGrid campaigns={campaigns} handleCampaignSelection={handleCampaignSelection} />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function Campaigns() {
  return (
    <CampaignsProvider>
      <CampaignsContent />
    </CampaignsProvider>
  )
}
