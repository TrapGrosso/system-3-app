import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function statusToBadgeVariant(status) {
  const value = (status || "").toLowerCase()
  switch (value) {
    case "active":
      return "default"
    case "running subsequences":
      return "default"
    case "paused":
      return "outline"
    case "bounce protect":
      return "outline"
    case "scheduled":
      return "outline"
    case "completed":
      return "secondary"
    case "draft":
      return "secondary"
    case "account suspended":
      return "destructive"
    case "accounts unhealthy":
      return "destructive"
    case "deleted":
      return "destructive"
    default:
      return "secondary"
  }
}

const formatDate = (value) => {
  if (!value) return "-"
  try {
    const d = new Date(value)
    return isNaN(d) ? String(value) : d.toLocaleString()
  } catch {
    return String(value)
  }
}

const DayPills = ({ days }) => {
  const labels = { "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri", "6": "Sat", "7": "Sun" }
  return (
    <div className="flex flex-wrap gap-1">
      {Object.keys(labels).map((key) => {
        const active = Boolean(days?.[key])
        return (
          <span
            key={key}
            className={[
              "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium",
              active
                ? "bg-primary text-primary-foreground border-transparent"
                : "bg-muted text-muted-foreground"
            ].join(" ")}
          >
            {labels[key]}
          </span>
        )
      })}
    </div>
  )
}

export default function CampaignHeader({ campaign }) {
  if (!campaign) return null

  const {
    name,
    status,
    start_at,
    end_at,
    created_at,
    campaign_schedule = []
  } = campaign

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-xl sm:text-2xl">{name || "Untitled Campaign"}</CardTitle>
          <CardDescription className="mt-1">
            Created at: <span className="font-medium text-foreground/80">{formatDate(created_at)}</span>
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusToBadgeVariant(status)}>{status || "unknown"}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground mb-1">Start</div>
            <div className="text-sm font-medium">{formatDate(start_at)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground mb-1">End</div>
            <div className="text-sm font-medium">{formatDate(end_at)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground mb-1">Created</div>
            <div className="text-sm font-medium">{formatDate(created_at)}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="text-sm font-medium">Campaign Schedule</div>
          {campaign_schedule.length === 0 ? (
            <div className="text-sm text-muted-foreground">No schedule configured</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {campaign_schedule.map((item, idx) => (
                <div key={idx} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{item?.name || "Schedule"}</div>
                    <div className="text-xs text-muted-foreground">{item?.timezone || "-"}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">
                      {item?.timing?.from || "-"} — {item?.timing?.to || "-"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Days</div>
                    <DayPills days={item?.days} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
