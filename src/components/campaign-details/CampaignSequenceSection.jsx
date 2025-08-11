import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const isHtml = (body) => {
  if (typeof body !== "string") return false
  return /<[^>]+>/.test(body)
}

const formatNumber = (v) => (typeof v === "number" ? v.toLocaleString() : v ?? "-")

const delayLabel = (d) => {
  if (typeof d !== "number") return "-"
  if (d === 0) return "Delay 0 days"
  return `Delay ${d} day${d === 1 ? "" : "s"}`
}

const metricItems = [
  { key: "sent", label: "Sent" },
  { key: "opened", label: "Opened" },
  { key: "unique_opened", label: "Unique Opened" },
  { key: "replies", label: "Replies" },
  { key: "unique_replies", label: "Unique Replies" },
  { key: "clicks", label: "Clicks" },
  { key: "unique_clicks", label: "Unique Clicks" },
]

function StatsGrid({ data, tone = "neutral" }) {
  const chipBase = "rounded-lg px-3 py-2"
  const chipTone = tone === "accent" ? "bg-primary/5" : "bg-muted/30 dark:bg-muted/10"
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      {metricItems.map((it) => (
        <div key={it.key} className={`${chipBase} ${chipTone}`}>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{it.label}</div>
          <div className="text-base font-semibold">{formatNumber(data?.[it.key])}</div>
        </div>
      ))}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  )
}

function ContentPreview({ subject, body }) {
  const html = isHtml(body)
  return (
    <div className="space-y-3">
      {subject ? (
        <div className="rounded-md border p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Subject</div>
          <div className="text-sm font-medium">{subject}</div>
        </div>
      ) : null}
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Content</div>
        <div className="rounded-md border p-3 bg-background h-[360px] overflow-auto">
          {html ? (
            <div
              className="text-sm leading-6"
              // Note: HTML originates from trusted templates in this app. Review before enabling external input.
              dangerouslySetInnerHTML={{ __html: body }} />
          ) : (
            <pre className="text-sm whitespace-pre-wrap leading-6">{body || "-"}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

function StepSelect({ sequence, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="seq-step">Step</Label>
      <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger id="seq-step" size="sm" className="min-w-[220px]">
          <SelectValue placeholder="Select step" />
        </SelectTrigger>
        <SelectContent>
          {sequence.map((s, i) => (
            <SelectItem key={i} value={String(i)}>
              <span className="inline-flex items-center gap-2">
                <span className="font-medium">Step {i + 1}</span>
                <span className="text-muted-foreground">• {String(s?.type || "N/A").toUpperCase()}</span>
                <span className="text-muted-foreground">• {delayLabel(s?.delay)}</span>
              </span>
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
    <div className="flex flex-col gap-1">
      <Label htmlFor="seq-variant">Variant</Label>
      <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger id="seq-variant" size="sm" className="min-w-[160px]">
          <SelectValue placeholder="Select variant" />
        </SelectTrigger>
        <SelectContent>
          {variants.map((_, i) => (
            <SelectItem key={i} value={String(i)}>
              Variant {i + 1}
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
    <div className="flex justify-center">
      <Card className="w-full">
        <CardHeader className="gap-3">
          <CardTitle className="text-base flex items-center justify-between gap-4">
            <span className="flex flex-col">
              <span className="font-semibold">Campaign Sequence</span>
              {currentStep ? (
                <span className="text-muted-foreground text-sm">
                  Step {stepIndex + 1} • {String(currentStep?.type || "N/A").toUpperCase()} • {delayLabel(currentStep?.delay)}
                </span>
              ) : null}
            </span>

            {Array.isArray(sequence) && sequence.length > 0 ? (
              <div className="flex items-end gap-3 flex-wrap">
                <StepSelect sequence={sequence} value={stepIndex} onChange={handleStepChange} />
                <VariantSelect
                  variants={variants}
                  value={variantIndex}
                  onChange={setVariantIndex}
                />
              </div>
            ) : null}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!sequence || sequence.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">
              No sequence configured for this campaign.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Content preview */}
              <div>
                {variants.length === 0 ? (
                  <div className="rounded-md border p-3 text-sm text-muted-foreground">
                    No variants available for this step.
                  </div>
                ) : (
                  <ContentPreview subject={currentVariant?.subject} body={currentVariant?.body} />
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Step totals */}
              <div className="space-y-2">
                <SectionLabel>Step totals</SectionLabel>
                <StatsGrid data={currentStep?.step_totals} tone="neutral" />
              </div>

              {/* Variant analytics */}
              {showVariantSelect ? (
                <div className="space-y-2">
                  <SectionLabel>Variant analytics</SectionLabel>
                  <div className="text-xs text-muted-foreground">
                    Variant {variantIndex + 1} of {variants.length}
                  </div>
                  <StatsGrid data={currentVariant?.analytics} tone="accent" />
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
