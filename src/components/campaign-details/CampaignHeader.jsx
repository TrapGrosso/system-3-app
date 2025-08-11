import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { CalendarDays, Clock, Globe } from "lucide-react"

/**
 * Map campaign status to shadcn Badge variant
 */
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

/**
 * Date helpers
 */
const isValidDate = (v) => {
  try {
    const d = new Date(v)
    return !isNaN(d.getTime())
  } catch {
    return false
  }
}

const formatShortDate = (value) => {
  if (!value || !isValidDate(value)) return "-"
  try {
    const d = new Date(value)
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  } catch {
    return String(value)
  }
}

const formatLongDateTime = (value) => {
  if (!value || !isValidDate(value)) return "-"
  try {
    const d = new Date(value)
    return d.toLocaleString()
  } catch {
    return String(value)
  }
}

/**
 * Tiny weekday badges using shadcn Badge
 */
const DaysBadges = ({ days }) => {
  const labels = { "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri", "6": "Sat", "7": "Sun" }
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.keys(labels).map((key) => {
        const active = Boolean(days?.[key])
        return (
          <Badge
            key={key}
            variant={active ? "secondary" : "outline"}
            className={[
              "px-1.5 py-0.5 text-[10px] leading-none",
              active ? "" : "text-muted-foreground"
            ].join(" ")}
          >
            {labels[key]}
          </Badge>
        )
      })}
    </div>
  )
}

/**
 * Compact date badge with tooltip for full value
 */
const DateBadge = ({ icon: Icon, label, value }) => {
  const shortLabel = formatShortDate(value)
  const longLabel = formatLongDateTime(value)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className="gap-1.5 px-2.5 py-1"
          aria-label={`${label}: ${shortLabel}`}
        >
          {Icon ? <Icon className="size-3.5 opacity-70" /> : null}
          <span className="text-xs/none text-muted-foreground">{label}:</span>
          <span className="text-xs/none font-medium">{shortLabel}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{label}: {longLabel}</TooltipContent>
    </Tooltip>
  )
}

/**
 * Compact schedule item
 */
const ScheduleItem = ({ item }) => {
  const name = item?.name || "Schedule"
  const tz = item?.timezone || "-"
  const from = item?.timing?.from || "-"
  const to = item?.timing?.to || "-"

  return (
    <li className="rounded-md border p-3 bg-background hover:bg-accent/30 transition-colors space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium truncate" title={name}>{name}</div>
        <Badge variant="outline" className="gap-1 px-2 py-0.5 text-[10px] font-normal">
          <Globe className="size-3 opacity-70" />
          {tz}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Clock className="size-3.5 opacity-70" />
        <span className="text-muted-foreground">Time:</span>
        <span className="font-medium tabular-nums">{from} — {to}</span>
      </div>
      <div className="space-y-1">
        <div className="text-[11px] text-muted-foreground">Days</div>
        <DaysBadges days={item?.days} />
      </div>
    </li>
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
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b">
        <div>
          <CardTitle className="text-xl sm:text-2xl">{name || "Untitled Campaign"}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusToBadgeVariant(status)} aria-label={`Status: ${status || "unknown"}`}>
            {status || "unknown"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Responsive 2-col grid on desktop, 1-col on mobile.
            Desktop: left = schedule, right = info
            Mobile:  top = info,     bottom = schedule */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Schedule column */}
          <section className="order-2 md:order-1 space-y-3">
            <div className="text-sm font-medium">Schedule</div>
            {campaign_schedule.length === 0 ? (
              <div className="text-sm text-muted-foreground rounded-md border p-3">
                No schedule configured
              </div>
            ) : (
              <ul className="space-y-2">
                {campaign_schedule.map((item, idx) => (
                  <ScheduleItem key={idx} item={item} />
                ))}
              </ul>
            )}
          </section>

          {/* Info column */}
          <section className="order-1 md:order-2 space-y-3">
            <div className="text-sm font-medium">Info</div>
            <div className="flex flex-wrap items-center gap-2">
              <DateBadge icon={CalendarDays} label="Start" value={start_at} />
              <DateBadge icon={CalendarDays} label="End" value={end_at} />
              <DateBadge icon={Clock} label="Created" value={created_at} />
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  )
}
