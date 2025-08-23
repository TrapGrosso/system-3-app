import * as React from "react"
import { DataTable } from "@/components/shared/table/DataTable"
import { formatPercent, formatNumber } from "@/components/shared/ui/ChartKit"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { useNavigate } from "react-router-dom"

/**
 * BestPerformingTable - Table of best performing campaigns
 */
export function BestPerformingTable({ campaigns }) {
  const navigate = useNavigate()

  const RateBadge = ({ value, inverse }) => {
    let color = "bg-green-100 text-green-700"
    if (inverse) {
      if (value > 0.2) color = "bg-red-100 text-red-700"
      else if (value > 0.1) color = "bg-yellow-100 text-yellow-700"
      else color = "bg-green-100 text-green-700"
    } else {
      if (value > 0.4) color = "bg-green-100 text-green-700"
      else if (value > 0.2) color = "bg-yellow-100 text-yellow-700"
      else color = "bg-red-100 text-red-700"
    }
    return (
      <Badge variant="outline" className={`${color} tabular-nums`}>
        {formatPercent(value)}
      </Badge>
    )
  }

  const columns = [
    {
      accessorKey: "name",
      header: "Campaign Name",
    },
    {
      accessorKey: "reply_rate",
      header: () => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>Reply Rate</span>
          </TooltipTrigger>
          <TooltipContent>Percentage of replies received</TooltipContent>
        </Tooltip>
      ),
      cell: ({ row }) => <RateBadge value={row.original.reply_rate} />,
      meta: { align: 'right' },
    },
    {
      accessorKey: "open_rate", 
      header: () => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>Open Rate</span>
          </TooltipTrigger>
          <TooltipContent>Percentage of emails opened</TooltipContent>
        </Tooltip>
      ),
      cell: ({ row }) => <RateBadge value={row.original.open_rate} />,
      meta: { align: 'right' },
    },
    {
      accessorKey: "bounce_rate",
      header: () => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>Bounce Rate</span>
          </TooltipTrigger>
          <TooltipContent>Percentage of emails bounced</TooltipContent>
        </Tooltip>
      ), 
      cell: ({ row }) => <RateBadge value={row.original.bounce_rate} inverse />,
      meta: { align: 'right' },
    },
    {
      accessorKey: "emails_sent_count",
      header: "Emails Sent",
      cell: ({ row }) => formatNumber(row.original.emails_sent_count),
      meta: { align: 'right', cellClassName: 'tabular-nums' },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      enableSelection={false}
      onRowClick={(row) => navigate(`/campaigns/${row.id}`)}
      emptyMessage="No best performing campaigns data available"
      rowId={(row) => row.id}
      headerClassName="sticky top-0 z-10 bg-background"
      bodyClassName="[&_tr:nth-child(odd)]:bg-muted/30"
      rowClassName="hover:bg-accent/40"
    />
  )
}
