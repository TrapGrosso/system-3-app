import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Mail,
  Eye,
  MessageCircle,
  MousePointer,
  Send,
  Users,
  Clock,
  BarChart3,
  FileText,
  Calendar
} from "lucide-react"
import ContentDisplay, { isLikelyHtml } from "@/utils/ContentDisplay"

const formatNumber = (v) => (typeof v === "number" ? v.toLocaleString() : v ?? "-")

const delayLabel = (d) => {
  if (typeof d !== "number") return "-"
  if (d === 0) return "Immediate"
  return `${d} day${d === 1 ? "" : "s"}`
}

const metricItems = [
  { key: "sent", label: "Sent", icon: Send, color: "hsl(210, 40%, 70%)" },
  { key: "opened", label: "Opened", icon: Eye, color: "hsl(142, 71%, 45%)" },
  { key: "unique_opened", label: "Unique Opened", icon: Eye, color: "hsl(142, 71%, 55%)" },
  { key: "replies", label: "Replies", icon: MessageCircle, color: "hsl(47, 96%, 53%)" },
  { key: "unique_replies", label: "Unique Replies", icon: MessageCircle, color: "hsl(47, 96%, 63%)" },
  { key: "clicks", label: "Clicks", icon: MousePointer, color: "hsl(271, 91%, 65%)" },
  { key: "unique_clicks", label: "Unique Clicks", icon: MousePointer, color: "hsl(271, 91%, 75%)" },
]

// Enhanced MetricCard component similar to CampaignAnalyticsSection
const MetricCard = ({ label, value, icon: Icon, status = "default", className = "" }) => {
  const getStatusColors = (status) => {
    switch (status) {
      case "success":
        return "from-emerald-500/20 to-emerald-600/10 border-emerald-200 dark:border-emerald-800"
      case "warning":
        return "from-amber-500/20 to-amber-600/10 border-amber-200 dark:border-amber-800"
      case "info":
        return "from-blue-500/20 to-blue-600/10 border-blue-200 dark:border-blue-800"
      case "accent":
        return "from-primary/20 to-primary/10 border-primary/20"
      default:
        return "from-gray-500/10 to-gray-600/5 border-gray-200 dark:border-gray-800"
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${getStatusColors(status)} p-3 transition-all hover:shadow-md hover:scale-[1.02] ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          </div>
          <p className="text-lg font-bold tracking-tight">
            {formatNumber(value)}
          </p>
        </div>
      </div>
    </div>
  )
}

function StatsGrid({ data, tone = "neutral" }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {metricItems.map((item) => (
        <MetricCard
          key={item.key}
          label={item.label}
          value={data?.[item.key]}
          icon={item.icon}
          status={tone === "accent" ? "accent" : "default"}
        />
      ))}
    </div>
  )
}

function SectionLabel({ children, icon: Icon }) {
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      <div className="text-sm font-semibold text-foreground uppercase tracking-wide">
        {children}
      </div>
    </div>
  )
}

function ContentPreview({ subject, body }) {
  const isHtmlContent = isLikelyHtml(body)
  return (
    <div className="space-y-4">
      {subject ? (
        <div className="rounded-lg border bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800 p-4 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <div className="text-xs font-semibold text-blue-800 dark:text-blue-400 uppercase tracking-wide">Subject Line</div>
          </div>
          <div className="text-sm font-medium text-foreground">{subject}</div>
        </div>
      ) : null}
      <div className="space-y-3">
        <SectionLabel icon={FileText}>Email Content</SectionLabel>
        <div className="rounded-lg border bg-background shadow-sm">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {isHtmlContent ? "HTML" : "Plain Text"}
              </Badge>
            </div>
          </div>
          <div className="p-4 h-[320px] overflow-auto">
            <ContentDisplay
              content={body}
              mode="auto"
              sanitize={true}
              prose
              preWrap
              containerClassName="text-sm leading-6"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StepSelect({ sequence, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="seq-step" className="text-sm font-medium">Step</Label>
      <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger id="seq-step" className="min-w-[240px] bg-background border-input">
          <SelectValue placeholder="Select step" />
        </SelectTrigger>
        <SelectContent>
          {sequence.map((s, i) => (
            <SelectItem key={i} value={String(i)}>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">
                  {i + 1}
                </Badge>
                <span className="font-medium">{String(s?.type || "N/A").toUpperCase()}</span>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-muted-foreground">{delayLabel(s?.delay)}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function VariantSelect({ variants, value, onChange }) {
  // Render only when variants > 1 (spec requirement)
  if (!Array.isArray(variants) || variants.length <= 1) return null

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="seq-variant" className="text-sm font-medium">Variant</Label>
      <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger id="seq-variant" className="min-w-[160px] bg-background border-input">
          <SelectValue placeholder="Select variant" />
        </SelectTrigger>
        <SelectContent>
          {variants.map((_, i) => (
            <SelectItem key={i} value={String(i)}>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  V{i + 1}
                </Badge>
                <span>Variant {i + 1}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function CampaignSequenceSection({ sequence = [] }) {
  const [stepIndex, setStepIndex] = React.useState(0)
  const [variantIndex, setVariantIndex] = React.useState(0)

  // Guard invalid indices when data changes
  React.useEffect(() => {
    if (!Array.isArray(sequence) || sequence.length === 0) {
      setStepIndex(0)
      setVariantIndex(0)
      return
    }
    if (stepIndex >= sequence.length) setStepIndex(0)
  }, [sequence, stepIndex])

  const currentStep = sequence?.[stepIndex]
  const variants = currentStep?.variants || []
  const currentVariant =
    variants.length > 0 ? variants[Math.min(variantIndex, variants.length - 1)] : null
  const showVariantSelect = variants.length > 1

  const handleStepChange = (i) => {
    setStepIndex(i)
    setVariantIndex(0) // reset variant on step change
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-bold">Campaign Sequence</CardTitle>
              </div>
              {currentStep ? (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    Step {stepIndex + 1}
                  </Badge>
                  <span>•</span>
                  <Badge variant="secondary" className="text-xs">
                    {String(currentStep?.type || "N/A").toUpperCase()}
                  </Badge>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{delayLabel(currentStep?.delay)}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {Array.isArray(sequence) && sequence.length > 0 ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <StepSelect sequence={sequence} value={stepIndex} onChange={handleStepChange} />
              <VariantSelect
                variants={variants}
                value={variantIndex}
                onChange={setVariantIndex}
              />
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!sequence || sequence.length === 0 ? (
          <div className="py-12 text-center">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              No sequence configured for this campaign.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Content preview */}
            <div>
              {variants.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-500/20 to-amber-600/10 p-6 text-center">
                  <Users className="mx-auto h-8 w-8 text-amber-600 mb-2" />
                  <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">
                    No variants available for this step.
                  </p>
                </div>
              ) : (
                <ContentPreview subject={currentVariant?.subject} body={currentVariant?.body} />
              )}
            </div>

            <Separator />

            {/* Step totals */}
            <div className="space-y-4">
              <SectionLabel icon={BarChart3}>Step Performance</SectionLabel>
              <StatsGrid data={currentStep?.step_totals} tone="neutral" />
            </div>

            {/* Variant analytics */}
            {showVariantSelect ? (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <SectionLabel icon={BarChart3}>Variant Analytics</SectionLabel>
                    <Badge variant="outline" className="text-xs">
                      Variant {variantIndex + 1} of {variants.length}
                    </Badge>
                  </div>
                  <StatsGrid data={currentVariant?.analytics} tone="accent" />
                </div>
              </>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
