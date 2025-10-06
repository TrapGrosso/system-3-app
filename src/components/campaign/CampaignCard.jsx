import * as React from "react"
import { toast } from "sonner"
import {
  CalendarDays,
  Users,
  Clock,
  Mail,
  Phone,
  Linkedin,
  ListChecks,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { ActionDropdown } from "@/components/shared/ui/ActionDropdown"
import ContentDisplay from "@/utils/ContentDisplay"
import { formatAbsolute, formatHHmm } from "@/utils/timeformat"

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

function typeIcon(type) {
  const t = (type || "").toLowerCase()
  if (t === "email") return Mail
  if (t === "call") return Phone
  if (t === "linkedin") return Linkedin
  return ListChecks
}


const dayShort = {
  "1": "Mon",
  "2": "Tue",
  "3": "Wed",
  "4": "Thu",
  "5": "Fri",
  "6": "Sat",
  "7": "Sun",
}

function summarizeDays(daysObj) {
  if (!daysObj || typeof daysObj !== "object") return "Days N/A"
  const active = Object.keys(daysObj)
    .filter((k) => daysObj[k])
    .map((k) => parseInt(k, 10))
    .sort((a, b) => a - b)

  if (active.length === 0) return "No days"

  // Detect common ranges like Mon–Fri
  const isMonToFri =
    active.length === 5 && [1, 2, 3, 4, 5].every((v, i) => v === active[i])
  if (isMonToFri) return "Mon–Fri"

  const isWeekend = active.length === 2 && active[0] === 6 && active[1] === 7
  if (isWeekend) return "Sat–Sun"

  // Fallback to comma list
  return active.map((n) => dayShort[String(n)] || String(n)).join(", ")
}

function timeRange(timing) {
  if (!timing || (!timing.from && !timing.to)) return "Time N/A"
  const from = formatHHmm(timing.from)
  const to = formatHHmm(timing.to)
  if (from && to) return `${from}–${to}`
  return from || to || "Time N/A"
}

function getSchedules(campaign) {
  return campaign?.campaign_schedule || []
}

function getSequences(campaign) {
  return Array.isArray(campaign?.campaign_sequence) ? campaign.campaign_sequence : []
}

function firstNonEmpty(strArr = []) {
  const s = (strArr || []).find((s) => typeof s === "string" && s.trim().length > 0)
  return s || ""
}

function getEmailPreview(variants) {
  if (!Array.isArray(variants) || variants.length === 0) return { subject: "", body: "" }
  const subj = firstNonEmpty(variants.map((v) => v?.subject || ""))
  const body = firstNonEmpty(variants.map((v) => v?.body || ""))
  return { subject: subj, body }
}

export default function CampaignCard({ campaign, handleCampaignSelection }) {
  const [open, setOpen] = React.useState(false)

  const {
    id,
    name,
    status,
    created_at,
    prospect_count = 0,
  } = campaign || {}

  const schedules = getSchedules(campaign)
  const sequence = getSequences(campaign)

  const dropdownItems = [
    { label: "View Campaign", onSelect: () => handleCampaignSelection ? handleCampaignSelection(id) : toast.info("Navigate to campaign details: not wired yet") },
    "separator",
    { label: "Add prospects", onSelect: () => toast.info("Add prospects: coming soon") },
    "separator",
    { label: "Edit", onSelect: () => toast.info("Edit not implemented yet"), disabled: true },
    { label: "Duplicate", onSelect: () => toast.info("Duplicate not implemented yet"), disabled: true },
    "separator",
    { label: "Delete", onSelect: () => toast.info("Delete not implemented yet"), variant: "destructive", disabled: true },
  ]

  return (
    <Card className="group self-start overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start gap-3 sm:justify-between">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <CardTitle className="text-base sm:text-lg font-semibold leading-snug line-clamp-2 sm:line-clamp-1 break-words max-w-full">
                {name || "Untitled campaign"}
              </CardTitle>
              {status && (
                <Badge variant={statusToBadgeVariant(status)} className="text-xs">
                  {status}
                </Badge>
              )}
            </div>
            <CardDescription className="flex flex-wrap items-center gap-1 text-[11px] sm:text-xs">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Created {formatAbsolute(created_at, { mode: "date", dateStyle: "medium" }) || "N/A"}</span>
            </CardDescription>
          </div>

          <div className="order-1 w-full flex justify-end sm:w-auto sm:order-none shrink-0">
            <ActionDropdown items={dropdownItems} align="end" side="bottom" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="outline" className="gap-1">
            <Users className="h-3.5 w-3.5" />
            {prospect_count} prospects
          </Badge>
          <Badge variant="outline" className="gap-1">
            <ListChecks className="h-3.5 w-3.5" />
            {sequence.length} step{sequence.length === 1 ? "" : "s"}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3.5 w-3.5" />
            {schedules.length} schedule{schedules.length === 1 ? "" : "s"}
          </Badge>
        </div>

        {/* Collapsible details */}
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-0 h-auto">
              <span className="font-medium">View details</span>
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4 space-y-6">
            {/* Sequence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Sequence</p>
                <span className="text-xs text-muted-foreground">
                  {sequence.length} step{sequence.length === 1 ? "" : "s"}
                </span>
              </div>

              {sequence.length === 0 ? (
                <p className="text-sm text-muted-foreground">No steps defined.</p>
              ) : (
                <div className="space-y-2">
                  {sequence.map((step, idx) => {
                    const Icon = typeIcon(step?.type)
                    const delay = typeof step?.delay === "number" ? step.delay : null
                    const isEmail = (step?.type || "").toLowerCase() === "email"
                    const { subject, body } = isEmail ? getEmailPreview(step?.variants) : { subject: "", body: "" }

                    return (
                      <div key={idx} className="border rounded-md p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                Step {idx + 1}: {step?.type ? step.type.charAt(0).toUpperCase() + step.type.slice(1) : "Unknown"}
                              </p>
                              {delay !== null && (
                                <p className="text-xs text-muted-foreground">Delay: +{delay} day{delay === 1 ? "" : "s"}</p>
                              )}
                            </div>
                          </div>
                        </div>

{isEmail && (
  <div className="mt-2 space-y-1">
    {subject && (
      <p className="text-xs text-muted-foreground">
        Subject: <span className="text-foreground">{subject}</span>
      </p>
    )}
    {body && (
      <ContentDisplay
        content={body}
        mode="auto"
        sanitize={true}
        maxChars={200}
        preserveWords
        lineClamp={3}
        className="text-xs text-muted-foreground"
      />
    )}
    {!subject && !body && (
      <p className="text-xs text-muted-foreground">No email content.</p>
    )}
  </div>
)}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Schedules */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Schedules</p>
                <span className="text-xs text-muted-foreground">
                  {schedules.length} schedule{schedules.length === 1 ? "" : "s"}
                </span>
              </div>

              {schedules.length === 0 ? (
                <p className="text-sm text-muted-foreground">No schedules defined.</p>
              ) : (
                <div className="space-y-2">
                  {schedules.map((sch, idx) => (
                    <div key={idx} className="border rounded-md p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {sch?.name || "Schedule"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {summarizeDays(sch?.days)} • {timeRange(sch?.timing)}
                          </p>
                        </div>
                        {sch?.timezone && (
                          <Badge variant="outline" className="text-xs">
                            {sch.timezone}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="pt-0">
        {/* Reserved for future quick actions */}
      </CardFooter>
    </Card>
  )
}
