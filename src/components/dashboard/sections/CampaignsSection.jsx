import * as React from "react"
import { TrendingUp, TrendingDown, AlertTriangle, Users, Mail, MailOpen, Reply } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DataTable } from "@/components/shared/table/DataTable"
import { MiniAreaChart, formatPercent, formatNumber } from "@/components/shared/ui/ChartKit"

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

/**
 * RunningCampaignCard - Individual campaign card with metrics and sparkline
 */
function RunningCampaignCard({ campaign, thresholds }) {
  const analytics = campaign.analytics || {}
  const steps = campaign.steps || []

  // Check thresholds for warning badges
  const isLowOpenRate = analytics.open_rate < (thresholds?.lowOpenRate || 0.15)
  const isLowReplyRate = analytics.reply_rate < (thresholds?.lowReplyRate || 0.02)
  const isHighBounceRate = analytics.bounce_rate > (thresholds?.highBounceRate || 0.05)

  // Prepare sparkline data from steps
  const sparklineData = steps.map((step, index) => ({
    x: step.step_number || index + 1,
    y: step.reply_rate || 0,
  }))

  return (
    <Card className="@container/campaign">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{campaign.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                {campaign.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <MailOpen className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Open Rate</span>
              {isLowOpenRate && <AlertTriangle className="h-3 w-3 text-destructive" />}
            </div>
            <div className={`font-medium ${isLowOpenRate ? "text-destructive" : ""}`}>
              {formatPercent(analytics.open_rate)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Reply className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Reply Rate</span>
              {isLowReplyRate && <AlertTriangle className="h-3 w-3 text-destructive" />}
            </div>
            <div className={`font-medium ${isLowReplyRate ? "text-destructive" : ""}`}>
              {formatPercent(analytics.reply_rate)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Bounce Rate</span>
              {isHighBounceRate && <AlertTriangle className="h-3 w-3 text-destructive" />}
            </div>
            <div className={`font-medium ${isHighBounceRate ? "text-destructive" : ""}`}>
              {formatPercent(analytics.bounce_rate)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Emails Sent</span>
            </div>
            <div className="font-medium">
              {formatNumber(analytics.emails_sent_count)}
            </div>
          </div>
        </div>

        {/* Counts Row */}
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div>
            <div className="font-medium">{formatNumber(analytics.open_count)}</div>
            <div className="text-muted-foreground">Opens</div>
          </div>
          <div>
            <div className="font-medium">{formatNumber(analytics.reply_count)}</div>
            <div className="text-muted-foreground">Replies</div>
          </div>
          <div>
            <div className="font-medium">{formatNumber(analytics.bounced_count)}</div>
            <div className="text-muted-foreground">Bounces</div>
          </div>
        </div>

        {/* Steps Sparkline */}
        {sparklineData.length > 1 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Reply Rate by Step</div>
            <MiniAreaChart
              data={sparklineData}
              xKey="x"
              yKey="y"
              height={40}
              colorVar="primary"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * BestPerformingTable - Table of best performing campaigns
 */
function BestPerformingTable({ campaigns }) {
  const columns = [
    {
      accessorKey: "name",
      header: "Campaign Name",
    },
    {
      accessorKey: "reply_rate",
      header: "Reply Rate",
      cell: ({ row }) => formatPercent(row.original.reply_rate),
    },
    {
      accessorKey: "open_rate", 
      header: "Open Rate",
      cell: ({ row }) => formatPercent(row.original.open_rate),
    },
    {
      accessorKey: "bounce_rate",
      header: "Bounce Rate", 
      cell: ({ row }) => formatPercent(row.original.bounce_rate),
    },
    {
      accessorKey: "emails_sent_count",
      header: "Emails Sent",
      cell: ({ row }) => formatNumber(row.original.emails_sent_count),
    },
  ]

  const rowActions = (campaign) => [
    {
      label: "View Details",
      onSelect: () => {
        // Navigate to campaign details - would integrate with existing routing
        console.log("Navigate to campaign:", campaign.id)
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      enableSelection={false}
      rowActions={rowActions}
      emptyMessage="No best performing campaigns data available"
      rowId={(row) => row.id}
    />
  )
}

/**
 * NeedsAttentionPanel - Cards showing campaigns that need attention
 */
function NeedsAttentionPanel({ needsAttention }) {
  const lowPerformance = needsAttention.lowPerformance || []
  const highBounceRate = needsAttention.highBounceRate || []
  const codes = needsAttention.codes || {}

  const attentionItems = [
    {
      title: "Low Performance",
      count: lowPerformance.length,
      items: lowPerformance,
      variant: "destructive",
      icon: TrendingDown,
    },
    {
      title: "High Bounce Rate", 
      count: highBounceRate.length,
      items: highBounceRate,
      variant: "destructive",
      icon: AlertTriangle,
    },
    {
      title: "Account Suspended",
      count: codes.accountSuspended?.length || 0,
      items: codes.accountSuspended || [],
      variant: "destructive",
      icon: AlertTriangle,
    },
    {
      title: "Unhealthy Accounts",
      count: codes.accountsUnhealthy?.length || 0,
      items: codes.accountsUnhealthy || [],
      variant: "destructive", 
      icon: AlertTriangle,
    },
    {
      title: "Bounce Protection",
      count: codes.bounceProtect?.length || 0,
      items: codes.bounceProtect || [],
      variant: "outline",
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {attentionItems.map((item) => (
        <AttentionCard key={item.title} {...item} />
      ))}
    </div>
  )
}

/**
 * AttentionCard - Individual attention item card with collapsible details
 */
function AttentionCard({ title, count, items, variant, icon: Icon }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <CardDescription className="text-sm font-medium">
              {title}
            </CardDescription>
          </div>
          <Badge variant={variant}>
            {count}
          </Badge>
        </div>
      </CardHeader>
      
      {count > 0 && (
        <CardContent className="pt-0">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto">
                <span className="text-xs text-muted-foreground">
                  {isOpen ? "Hide" : "Show"} details
                </span>
                <TrendingDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="space-y-1">
                {items.slice(0, 5).map((item, index) => (
                  <div key={index} className="text-xs text-muted-foreground truncate">
                    {typeof item === "string" ? item : item.name || item.id || "Unknown"}
                  </div>
                ))}
                {items.length > 5 && (
                  <div className="text-xs text-muted-foreground">
                    +{items.length - 5} more
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      )}
    </Card>
  )
}
