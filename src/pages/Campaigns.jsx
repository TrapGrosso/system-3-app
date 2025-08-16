import * as React from "react"
import { RefreshCw, Loader2, Users, Upload, Sparkles } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { ActionDropdown } from "@/components/shared/ui/ActionDropdown"
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
    syncCampaigns,
    syncProspects,
    updateAllProspectsInCampaigns,
    syncAll,
    isSyncingAll,
  } = useCampaigns()

  const [isRetrying, setIsRetrying] = React.useState(false)


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

  const isAnySyncing = isSyncingAll

  const syncItems = React.useMemo(() => [
    { label: "Sync campaigns", icon: RefreshCw, disabled: isAnySyncing, onSelect: () => { void syncCampaigns().catch(() => {}) } },
    { label: "Sync campaign prospects", icon: Users, disabled: isAnySyncing, onSelect: () => { void syncProspects().catch(() => {}) } },
    { label: "Update all prospects in campaigns", icon: Upload, disabled: isAnySyncing, onSelect: () => { void updateAllProspectsInCampaigns().catch(() => {}) } },
    "separator",
    { label: "Sync everything", icon: Sparkles, disabled: isAnySyncing, onSelect: () => { void syncAll().catch(() => {}) } },
  ], [isAnySyncing, syncCampaigns, syncProspects, updateAllProspectsInCampaigns, syncAll])

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

          <ActionDropdown
            items={syncItems}
            renderTrigger={(triggerProps) => (
              <Button {...triggerProps} disabled={isAnySyncing}>
                {isAnySyncing
                  ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  : <RefreshCw className="h-4 w-4 mr-2" />}
                Sync with Instantly
              </Button>
            )}
            align="end"
            side="bottom"
            sideOffset={6}
          />
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
              <ActionDropdown
                items={syncItems}
                renderTrigger={(triggerProps) => (
                  <Button {...triggerProps} variant="outline" disabled={isAnySyncing}>
                    {isAnySyncing
                      ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      : <RefreshCw className="h-4 w-4 mr-2" />}
                    Sync with Instantly
                  </Button>
                )}
                align="end"
                side="bottom"
                sideOffset={6}
              />
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
