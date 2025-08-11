import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const MetricTile = ({ label, value }) => (
  <div className="rounded-lg border p-3">
    <div className="text-xs text-muted-foreground mb-1">{label}</div>
    <div className="text-base font-semibold">{typeof value === "number" ? value.toLocaleString() : (value ?? "-")}</div>
  </div>
)

export default function CampaignAnalyticsSection({ analytics }) {
  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          No analytics available for this campaign.
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

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold px-1">Campaign Analytics</h2>
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <MetricTile label="Leads" value={leads_count} />
            <MetricTile label="Contacted" value={contacted_count} />
            <MetricTile label="Opens" value={open_count} />
            <MetricTile label="Replies" value={reply_count} />
            <MetricTile label="Link Clicks" value={link_click_count} />
            <MetricTile label="Bounced" value={bounced_count} />
            <MetricTile label="Unsubscribed" value={unsubscribed_count} />
            <MetricTile label="Completed" value={completed_count} />
            <MetricTile label="Emails Sent" value={emails_sent_count} />
            <MetricTile label="New Leads Contacted" value={new_leads_contacted_count} />
            <MetricTile label="Total Opportunities" value={total_opportunities} />
            <MetricTile label="Total Opportunity Value" value={typeof total_opportunity_value === "number" ? `$${total_opportunity_value.toLocaleString()}` : total_opportunity_value} />
          </div>
          <div className="text-xs text-muted-foreground">
            Updated: {updated_at ? new Date(updated_at).toLocaleString() : "-"} • Evergreen: {campaign_is_evergreen ? "Yes" : "No"}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
