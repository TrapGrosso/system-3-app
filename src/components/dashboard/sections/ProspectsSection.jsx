import * as React from "react"
import { Users, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/table/DataTable"
import { DonutChart, formatNumber, formatRelativeTime, formatPercent } from "@/components/shared/ui/ChartKit"

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

/**
 * NewlyAddedTable - Table of recently added prospects
 */
function NewlyAddedTable({ prospects }) {
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const prospect = row.original
        const fullName = `${prospect.first_name || ""} ${prospect.last_name || ""}`.trim()
        return fullName || "Unknown"
      },
    },
    {
      accessorKey: "linkedin_id",
      header: "LinkedIn",
      cell: ({ row }) => {
        const linkedinId = row.original.linkedin_id
        if (!linkedinId) return "-"
        
        return (
          <div className="flex items-center gap-2">
            <span className="truncate max-w-32">{linkedinId}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`https://linkedin.com/in/${linkedinId}`, "_blank")
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Added",
      cell: ({ row }) => {
        const createdAt = row.original.created_at
        return createdAt ? formatRelativeTime(createdAt) : "-"
      },
    },
    {
      accessorKey: "inCampaign",
      header: "In Campaign",
      cell: ({ row }) => {
        const inCampaign = row.original.inCampaign
        return (
          <Badge variant={inCampaign ? "default" : "outline"}>
            {inCampaign ? "Yes" : "No"}
          </Badge>
        )
      },
    },
  ]

  const rowActions = (prospect) => [
    {
      label: "View Details",
      onSelect: () => {
        // Navigate to prospect details or People&Companies with filter
        console.log("Navigate to prospect:", prospect.linkedin_id)
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={prospects}
      enableSelection={false}
      rowActions={rowActions}
      emptyMessage="No recently added prospects"
      rowId={(row) => row.linkedin_id}
    />
  )
}

/**
 * DataCompletenessCards - Grid of data completeness metrics with donut charts
 */
function DataCompletenessCards({ completeness }) {
  const total = completeness.total || 0
  
  const completenessItems = [
    {
      title: "Has Email",
      key: "hasEmail",
      icon: CheckCircle,
      description: "Prospects with email addresses",
    },
    {
      title: "Email Safe to Send",
      key: "emailSafeToSend", 
      icon: CheckCircle,
      description: "Verified and deliverable emails",
    },
    {
      title: "Has Company",
      key: "hasCompany",
      icon: CheckCircle,
      description: "Prospects with company information",
    },
    {
      title: "Has Enrichment",
      key: "hasEnrichment",
      icon: CheckCircle,
      description: "Prospects with enrichment data",
    },
  ]

  if (total === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No prospect data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {completenessItems.map((item) => (
        <CompletenessCard
          key={item.key}
          title={item.title}
          icon={item.icon}
          description={item.description}
          data={completeness[item.key]}
          total={total}
        />
      ))}
    </div>
  )
}

/**
 * CompletenessCard - Individual data completeness card with donut chart
 */
function CompletenessCard({ title, icon: Icon, description, data, total }) {
  const count = data?.count || 0
  const percentage = data?.pct || 0

  // Prepare donut chart data
  const chartData = [
    {
      name: "Complete",
      value: count,
    },
    {
      name: "Missing",
      value: total - count,
    },
  ]

  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--muted))",
  ]

  return (
    <Card className="@container/completeness">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <CardDescription className="text-xs">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold tabular-nums">
              {formatNumber(count)}
            </div>
            <div className="text-xs text-muted-foreground">
              out of {formatNumber(total)}
            </div>
          </div>
          
          <div className="w-16 @[200px]/completeness:w-20">
            <DonutChart
              data={chartData}
              nameKey="name"
              valueKey="value"
              colors={colors}
              centerText={formatPercent(percentage, 0)}
              showLegend={false}
              height={64}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Complete</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-muted" />
            <span className="text-xs text-muted-foreground">Missing</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
