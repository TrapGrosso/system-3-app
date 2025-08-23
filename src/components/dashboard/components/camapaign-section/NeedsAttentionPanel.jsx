import * as React from "react"
import { TrendingDown, AlertTriangle } from "lucide-react"
import { AttentionCard } from "./AttentionCard"

/**
 * NeedsAttentionPanel - Cards showing campaigns that need attention
 */
export function NeedsAttentionPanel({ needsAttention }) {
  const lowPerformance = needsAttention.lowPerformance || []
  const highBounceRate = needsAttention.highBounceRate || []
  const codes = needsAttention.codes || {}

  const attentionItems = [
    {
      title: "Low Performance",
      count: lowPerformance.length,
      items: lowPerformance,
      variant: "destructive",
      icon: TrendingDown,
    },
    {
      title: "High Bounce Rate", 
      count: highBounceRate.length,
      items: highBounceRate,
      variant: "destructive",
      icon: AlertTriangle,
    },
    {
      title: "Account Suspended",
      count: codes.accountSuspended?.length || 0,
      items: codes.accountSuspended || [],
      variant: "destructive",
      icon: AlertTriangle,
    },
    {
      title: "Unhealthy Accounts",
      count: codes.accountsUnhealthy?.length || 0,
      items: codes.accountsUnhealthy || [],
      variant: "destructive", 
      icon: AlertTriangle,
    },
    {
      title: "Bounce Protection",
      count: codes.bounceProtect?.length || 0,
      items: codes.bounceProtect || [],
      variant: "outline",
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {attentionItems.map((item) => (
        <AttentionCard key={item.title} {...item} />
      ))}
    </div>
  )
}