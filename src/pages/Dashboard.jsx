import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { AlertCircle } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboardDataQuery } from "@/api/dashboard/getDashboardData"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { KpiRow } from "@/components/dashboard/KpiRow"
import { CampaignsSection } from "@/components/dashboard/sections/CampaignsSection"
import { ProspectsSection } from "@/components/dashboard/sections/ProspectsSection"
import { TasksSection } from "@/components/dashboard/sections/TasksSection"
import { ActivitySection } from "@/components/dashboard/sections/ActivitySection"
import { QueuesSection } from "@/components/dashboard/sections/QueuesSection"
import { EngagementSection } from "@/components/dashboard/sections/EngagementSection"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

function Dashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Dashboard params state
  const [params, setParams] = React.useState({
    lookbackDays: 7,
    campaignsLimit: 5,
    topN: 5,
    thresholds: {
      lowOpenRate: 0.15,
      lowReplyRate: 0.02,
      highBounceRate: 0.05,
    },
  })

  // Advanced settings visibility
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  // Build query params with userId
  const queryParams = React.useMemo(() => ({
    userId: user?.id,
    ...params,
  }), [user?.id, params])

  // Fetch dashboard data
  const {
    data,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useDashboardDataQuery(queryParams, {
    enabled: !!user?.id,
  })

  // Handle manual refresh
  const handleRefresh = () => {
    queryClient.invalidateQueries(['getDashboardData'])
    refetch()
  }

  // Handle params change
  const handleParamsChange = (newParams) => {
    setParams(newParams)
  }

  // Show loading state if user is loading or no user
  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <div className="text-muted-foreground">Loading user data...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 px-4 lg:px-6">
        {/* Dashboard Header with Controls */}
        <DashboardHeader
          params={params}
          onParamsChange={handleParamsChange}
          lastRefresh={dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : data?.meta?.generatedAt}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          showAdvanced={showAdvanced}
          onToggleAdvanced={setShowAdvanced}
        />

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Failed to load dashboard data</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {error.message || "An error occurred while fetching data"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-4"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Content */}
        {!error && (
          <>
            {/* KPI Overview */}
            <section>
              <KpiRow data={data} isLoading={isLoading} />
            </section>

            <Separator />

            {/* Campaigns Section */}
            <section>
              <CampaignsSection
                data={data}
                thresholds={params.thresholds}
                isLoading={isLoading}
              />
            </section>

            <Separator />

            {/* Prospects Section */}
            <section>
              <ProspectsSection data={data} isLoading={isLoading} />
            </section>

            <Separator />

            {/* Tasks Section */}
            <section>
              <TasksSection data={data} isLoading={isLoading} onRefetch={refetch} />
            </section>

            <Separator />

            {/* Activity Section */}
            <section>
              <ActivitySection data={data} isLoading={isLoading} />
            </section>

            <Separator />

            {/* Queues Section */}
            <section>
              <QueuesSection data={data} isLoading={isLoading} />
            </section>

            <Separator />

            {/* Engagement Section */}
            <section>
              <EngagementSection data={data} isLoading={isLoading} />
            </section>
          </>
        )}

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && data && (
          <details className="mt-8">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Debug: Raw Dashboard Data
            </summary>
            <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
