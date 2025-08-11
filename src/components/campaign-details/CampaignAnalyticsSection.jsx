import React, { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Area,
  AreaChart
} from "recharts"
import { 
  Users, 
  Mail, 
  Eye, 
  MessageCircle, 
  MousePointer, 
  AlertTriangle, 
  UserMinus,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3
} from "lucide-react"

// Enhanced MetricCard component with icons and styling
const MetricCard = ({ label, value, icon: Icon, change, status = "default", className = "" }) => {
  const getStatusColors = (status) => {
    switch (status) {
      case "success":
        return "from-emerald-500/20 to-emerald-600/10 border-emerald-200 dark:border-emerald-800"
      case "warning":
        return "from-amber-500/20 to-amber-600/10 border-amber-200 dark:border-amber-800"
      case "danger":
        return "from-red-500/20 to-red-600/10 border-red-200 dark:border-red-800"
      case "info":
        return "from-blue-500/20 to-blue-600/10 border-blue-200 dark:border-blue-800"
      default:
        return "from-gray-500/10 to-gray-600/5 border-gray-200 dark:border-gray-800"
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${getStatusColors(status)} p-4 transition-all hover:shadow-lg hover:scale-105 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          </div>
          <p className="text-2xl font-bold tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : (value ?? "-")}
          </p>
          {change && (
            <Badge variant={change > 0 ? "default" : "secondary"} className="text-xs">
              {change > 0 ? "+" : ""}{change}%
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

// Chart configurations
const chartConfig = {
  funnel: {
    leads: { label: "Leads", color: "hsl(var(--chart-1))" },
    contacted: { label: "Contacted", color: "hsl(var(--chart-2))" },
    opened: { label: "Opened", color: "hsl(var(--chart-3))" },
    replied: { label: "Replied", color: "hsl(var(--chart-4))" },
  },
  sequence: {
    sent: { label: "Sent", color: "hsl(221, 83%, 53%)" },
    opened: { label: "Opened", color: "hsl(142, 71%, 45%)" },
    replied: { label: "Replied", color: "hsl(47, 96%, 53%)" },
    clicked: { label: "Clicked", color: "hsl(271, 91%, 65%)" },
  },
  distribution: {
    opened: { label: "Opens", color: "hsl(142, 71%, 45%)" },
    replied: { label: "Replies", color: "hsl(47, 96%, 53%)" },
    clicked: { label: "Clicks", color: "hsl(271, 91%, 65%)" },
    bounced: { label: "Bounced", color: "hsl(0, 84%, 60%)" },
    unsubscribed: { label: "Unsubscribed", color: "hsl(25, 95%, 53%)" },
    pending: { label: "Pending", color: "hsl(210, 40%, 70%)" },
  }
}

export default function CampaignAnalyticsSection({ analytics, sequence = [] }) {
  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">No analytics available for this campaign.</p>
        </CardContent>
      </Card>
    )
  }

  const {
    campaign_is_evergreen,
    leads_count,
    contacted_count,
    open_count,
    reply_count,
    link_click_count,
    bounced_count,
    unsubscribed_count,
    completed_count,
    emails_sent_count,
    new_leads_contacted_count,
    total_opportunities,
    total_opportunity_value,
    updated_at
  } = analytics

  // Calculate key metrics and rates
  const openRate = contacted_count > 0 ? ((open_count / contacted_count) * 100).toFixed(1) : 0
  const replyRate = contacted_count > 0 ? ((reply_count / contacted_count) * 100).toFixed(1) : 0
  const clickRate = open_count > 0 ? ((link_click_count / open_count) * 100).toFixed(1) : 0
  const completionRate = leads_count > 0 ? ((completed_count / leads_count) * 100).toFixed(1) : 0

  // Prepare funnel data
  const funnelData = useMemo(() => [
    { name: "Leads", value: leads_count, color: "hsl(221, 83%, 53%)", percentage: 100 },
    { name: "Contacted", value: contacted_count, color: "hsl(142, 71%, 45%)", percentage: leads_count > 0 ? ((contacted_count / leads_count) * 100).toFixed(1) : 0 },
    { name: "Opened", value: open_count, color: "hsl(47, 96%, 53%)", percentage: contacted_count > 0 ? ((open_count / contacted_count) * 100).toFixed(1) : 0 },
    { name: "Replied", value: reply_count, color: "hsl(271, 91%, 65%)", percentage: open_count > 0 ? ((reply_count / open_count) * 100).toFixed(1) : 0 },
  ], [leads_count, contacted_count, open_count, reply_count])

  // Prepare sequence performance data
  const sequenceData = useMemo(() => {
    if (!sequence || !Array.isArray(sequence)) return []
    
    return sequence.map((step, index) => ({
      step: `Step ${index + 1}`,
      delay: step.delay,
      sent: step.step_totals?.sent || 0,
      opened: step.step_totals?.opened || 0,
      replied: step.step_totals?.replies || 0,
      clicked: step.step_totals?.clicks || 0,
      openRate: step.step_totals?.sent > 0 ? ((step.step_totals.opened / step.step_totals.sent) * 100).toFixed(1) : 0,
      replyRate: step.step_totals?.sent > 0 ? ((step.step_totals.replies / step.step_totals.sent) * 100).toFixed(1) : 0,
    }))
  }, [sequence])

  // Prepare response distribution data
  const distributionData = useMemo(() => {
    const total = contacted_count
    const pending = total - (open_count + bounced_count + unsubscribed_count)
    
    return [
      { name: "Opens", value: open_count, color: "hsl(142, 71%, 45%)" },
      { name: "Replies", value: reply_count, color: "hsl(47, 96%, 53%)" },
      { name: "Clicks", value: link_click_count, color: "hsl(271, 91%, 65%)" },
      { name: "Bounced", value: bounced_count, color: "hsl(0, 84%, 60%)" },
      { name: "Unsubscribed", value: unsubscribed_count, color: "hsl(25, 95%, 53%)" },
      { name: "Pending", value: Math.max(0, pending), color: "hsl(210, 40%, 70%)" },
    ].filter(item => item.value > 0)
  }, [open_count, reply_count, link_click_count, bounced_count, unsubscribed_count, contacted_count])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaign Analytics</h2>
          <p className="text-muted-foreground">
            Last updated: {updated_at ? new Date(updated_at).toLocaleString() : "-"}
            {campaign_is_evergreen && <Badge variant="secondary" className="ml-2">Evergreen</Badge>}
          </p>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <MetricCard
          label="Total Leads"
          value={leads_count}
          icon={Users}
          status="info"
        />
        <MetricCard
          label="Contacted"
          value={contacted_count}
          icon={Mail}
          status="success"
        />
        <MetricCard
          label="Open Rate"
          value={`${openRate}%`}
          icon={Eye}
          status={openRate > 20 ? "success" : openRate > 10 ? "warning" : "danger"}
        />
        <MetricCard
          label="Reply Rate"
          value={`${replyRate}%`}
          icon={MessageCircle}
          status={replyRate > 5 ? "success" : replyRate > 2 ? "warning" : "danger"}
        />
        <MetricCard
          label="Total Value"
          value={typeof total_opportunity_value === "number" ? `$${(total_opportunity_value / 1000).toFixed(0)}K` : total_opportunity_value}
          icon={DollarSign}
          status="success"
        />
        <MetricCard
          label="Opportunities"
          value={total_opportunities}
          icon={Target}
          status="info"
        />
      </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Response Distribution */}
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg">Response Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ChartContainer
                  config={chartConfig.distribution}
                  className="h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={distributionData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      strokeWidth={2}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList
                        dataKey="name"
                        className="fill-background"
                        stroke="none"
                        fontSize={12}
                        position="outside"
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Key Performance Indicators */}
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="grid gap-3 grid-cols-2">
                  <MetricCard
                    label="Opens"
                    value={open_count}
                    icon={Eye}
                    status="success"
                    className="p-3"
                  />
                  <MetricCard
                    label="Replies"
                    value={reply_count}
                    icon={MessageCircle}
                    status="info"
                    className="p-3"
                  />
                  <MetricCard
                    label="Clicks"
                    value={link_click_count}
                    icon={MousePointer}
                    status="warning"
                    className="p-3"
                  />
                  <MetricCard
                    label="Bounced"
                    value={bounced_count}
                    icon={AlertTriangle}
                    status="danger"
                    className="p-3"
                  />
                </div>
                <Separator />
                <div className="grid gap-3 grid-cols-2">
                  <MetricCard
                    label="Completion Rate"
                    value={`${completionRate}%`}
                    icon={CheckCircle}
                    status="success"
                    className="p-3"
                  />
                  <MetricCard
                    label="Click Rate"
                    value={`${clickRate}%`}
                    icon={TrendingUp}
                    status="info"
                    className="p-3"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
    </div>
  )
}
