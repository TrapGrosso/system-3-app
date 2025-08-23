import * as React from "react"
import { TrendingDown, AlertTriangle, Mail, MailOpen, Reply } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StackedBarChart, formatPercent, formatNumber } from "@/components/shared/ui/ChartKit"
import { buildStepVariantMetricStackData } from "../../utils/buildStepVariantMetricStackData"

/**
 * RunningCampaignCard - Individual campaign card with metrics and sparkline
 */
export function RunningCampaignCard({ campaign, thresholds }) {
  const analytics = campaign.analytics || {}
  const steps = campaign.steps || []

  // Check thresholds for warning badges
  const isLowOpenRate = analytics.open_rate < (thresholds?.lowOpenRate || 0.15)
  const isLowReplyRate = analytics.reply_rate < (thresholds?.lowReplyRate || 0.02)
  const isHighBounceRate = analytics.bounce_rate > (thresholds?.highBounceRate || 0.05)

  // Build step variant metric stack data
  const stepVariantData = buildStepVariantMetricStackData(steps)

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

        {/* Step Variants Performance Chart */}
        {stepVariantData.data.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Step Variant Performance (Rates)</div>
            <StackedBarChart
              data={stepVariantData.data}
              xKey="x"
              series={stepVariantData.series}
              height={160}
              yAxisProps={{
                domain: [0, 100],
                tickFormatter: (value) => `${value}%`
              }}
              barProps={{
                minPointSize: 6
              }}
              barCategoryGap="15%"
              maxBarSize={60}
            />
            <div className="text-[10px] text-muted-foreground">Stacked by Open, Click, Reply rate - higher stacks indicate better performance</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}