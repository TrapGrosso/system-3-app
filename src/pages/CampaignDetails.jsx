import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { useCampaigns } from "@/contexts/CampaignsContext"
import { usegetCampaignDetails } from "@/api/campaign-details/getCampaignDetails"
import { LoadingScreen } from "@/components/shared/ui/LoadingScreen"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Search } from "lucide-react"
import {
  CampaignHeader,
  CampaignSequenceSection,
  CampaignAnalyticsSection,
  CampaignProspectsTable
} from "@/components/campaign-details"

export default function CampaignDetails() {
  const { user } = useAuth()
  const { campaignId } = useParams()
  const navigate = useNavigate()

  const { removeProspectsFromCampaign } = useCampaigns()

  const { data, isLoading, isError, refetch } = usegetCampaignDetails(user?.id, campaignId)

  const handleRemoveFromCampaign = React.useCallback((prospectIds) => {
      const ids = Array.isArray(prospectIds) ? prospectIds : [prospectIds]
      removeProspectsFromCampaign(campaignId, ids)
        .then(() => {
          refetch()
        })
        .catch((err) => {
          console.error(err)
        })
    }, [campaignId, removeProspectsFromCampaign, refetch])

  if (isLoading) {
    return (
      <DashboardLayout headerText="Campaign Details">
        <LoadingScreen message="Loading campaign details..." />
      </DashboardLayout>
    )
  }

  if (isError || (Array.isArray(data) && !data.length)) {
    return (
      <DashboardLayout headerText="Campaign Details">
        <div className="flex justify-center items-center py-24">
          <Card className="max-w-md">
            <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <p className="text-muted-foreground">
                Failed to load campaign details. Please try again.
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!data) {
    return (
      <DashboardLayout headerText="Campaign Details">
        <div className="flex justify-center items-center py-24">
          <Card className="max-w-md">
            <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                No campaign found with ID:{' '}
                <span className="px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-mono text-sm">
                  {campaignId}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const handleRowClick = (row) => {
    if (row?.linkedin_id) {
      navigate(`/prospects/${row.linkedin_id}`)
    }
  }

  console.log(data)

  return (
    <DashboardLayout headerText="Campaign Details">
      <div className="px-4 lg:px-6 space-y-8">
        <CampaignHeader campaign={data.campaign}/>

        <CampaignAnalyticsSection analytics={data?.analytics} prospects={data?.prospects || []}/>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CampaignSequenceSection sequence={data?.campaign?.campaign_sequence || []} />
          <CampaignProspectsTable
            prospects={data?.prospects || []}
            onRowClick={handleRowClick}
            onRemoveFromCampaign={handleRemoveFromCampaign}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
