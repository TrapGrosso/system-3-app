import * as React from "react"
import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CompletenessCard } from "./CompletenessCard"

/**
 * DataCompletenessCards - Grid of data completeness metrics with donut charts
 */
export function DataCompletenessCards({ completeness }) {
  const total = completeness.total || 0
  
  const completenessItems = [
    {
      title: "Has Email",
      key: "hasEmail",
      icon: CheckCircle,
      description: "Prospects with email addresses",
    },
    {
      title: "Email Safe to Send",
      key: "emailSafeToSend", 
      icon: CheckCircle,
      description: "Verified and deliverable emails",
    },
    {
      title: "Has Company",
      key: "hasCompany",
      icon: CheckCircle,
      description: "Prospects with company information",
    },
    {
      title: "Has Enrichment",
      key: "hasEnrichment",
      icon: CheckCircle,
      description: "Prospects with enrichment data",
    },
  ]

  if (total === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No prospect data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {completenessItems.map((item) => (
        <CompletenessCard
          key={item.key}
          title={item.title}
          icon={item.icon}
          description={item.description}
          data={completeness[item.key]}
          total={total}
        />
      ))}
    </div>
  )
}