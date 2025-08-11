import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

const isHtml = (body) => {
  if (typeof body !== "string") return false
  return /<[^>]+>/.test(body)
}

const formatNumber = (v) => (typeof v === "number" ? v.toLocaleString() : v ?? "-")

function TotalsGrid({ totals }) {
  if (!totals) return null
  const items = [
    { key: "sent", label: "Sent" },
    { key: "opened", label: "Opened" },
    { key: "unique_opened", label: "Unique Opened" },
    { key: "replies", label: "Replies" },
    { key: "unique_replies", label: "Unique Replies" },
    { key: "clicks", label: "Clicks" },
    { key: "unique_clicks", label: "Unique Clicks" },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
      {items.map((it) => (
        <div key={it.key} className="rounded-md border p-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{it.label}</div>
          <div className="text-sm font-semibold">{formatNumber(totals?.[it.key])}</div>
        </div>
      ))}
    </div>
  )
}

function VariantAnalytics({ analytics }) {
  if (!analytics) return null
  const items = [
    { key: "sent", label: "Sent" },
    { key: "opened", label: "Opened" },
    { key: "unique_opened", label: "Unique Opened" },
    { key: "replies", label: "Replies" },
    { key: "unique_replies", label: "Unique Replies" },
    { key: "clicks", label: "Clicks" },
    { key: "unique_clicks", label: "Unique Clicks" },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
      {items.map((it) => (
        <div key={it.key} className="rounded-md border p-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{it.label}</div>
          <div className="text-sm font-semibold">{formatNumber(analytics?.[it.key])}</div>
        </div>
      ))}
    </div>
  )
}

export default function CampaignSequenceSection({ sequence = [] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold px-1">Campaign Sequence</h2>

      {(!sequence || sequence.length === 0) && (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No sequence configured for this campaign.
          </CardContent>
        </Card>
      )}

      {sequence?.map((step, idx) => {
        const variants = step?.variants || []
        const defaultTab = variants.length ? "variant-0" : "empty"

        return (
          <Card key={idx}>
            <CardHeader className="gap-2">
              <CardTitle className="text-base">
                <span className="font-semibold">Step {idx + 1}</span>
                <span className="text-muted-foreground"> • {String(step?.type || "N/A").toUpperCase()}</span>
                <span className="text-muted-foreground">
                  {" "}
                  • Delay {typeof step?.delay === "number" ? `${step.delay} day${step.delay === 1 ? "" : "s"}` : "-"}
                </span>
              </CardTitle>
              <TotalsGrid totals={step?.step_totals} />
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />
              {variants.length === 0 ? (
                <div className="text-sm text-muted-foreground">No variants available for this step.</div>
              ) : (
                <Tabs defaultValue={defaultTab} className="w-full">
                  <TabsList>
                    {variants.map((_, vIdx) => (
                      <TabsTrigger key={vIdx} value={`variant-${vIdx}`}>
                        Variant {vIdx + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {variants.map((variant, vIdx) => {
                    const subject = variant?.subject
                    const body = variant?.body
                    const html = isHtml(body)

                    return (
                      <TabsContent key={vIdx} value={`variant-${vIdx}`} className="space-y-3">
                        {subject ? (
                          <div className="rounded-md border p-3">
                            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Subject</div>
                            <div className="text-sm font-medium">{subject}</div>
                          </div>
                        ) : null}

                        <VariantAnalytics analytics={variant?.analytics} />

                        <div className="space-y-2">
                          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Content</div>
                          <div className="rounded-md border p-3 bg-background">
                            {html ? (
                              <div
                                className="text-sm leading-6 overflow-x-auto"
                                // Note: HTML originates from trusted templates in this app. Review before enabling external input.
                                dangerouslySetInnerHTML={{ __html: body }} />
                            ) : (
                              <pre className="text-sm whitespace-pre-wrap leading-6">{body || "-"}</pre>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    )
                  })}
                </Tabs>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
