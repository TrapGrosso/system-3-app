import * as React from "react"
import { DataTable } from "@/components/shared/table/DataTable"
import { formatPercent, formatNumber } from "@/components/shared/ui/ChartKit"

/**
 * BestPerformingTable - Table of best performing campaigns
 */
export function BestPerformingTable({ campaigns }) {
  const columns = [
    {
      accessorKey: "name",
      header: "Campaign Name",
    },
    {
      accessorKey: "reply_rate",
      header: "Reply Rate",
      cell: ({ row }) => formatPercent(row.original.reply_rate),
    },
    {
      accessorKey: "open_rate", 
      header: "Open Rate",
      cell: ({ row }) => formatPercent(row.original.open_rate),
    },
    {
      accessorKey: "bounce_rate",
      header: "Bounce Rate", 
      cell: ({ row }) => formatPercent(row.original.bounce_rate),
    },
    {
      accessorKey: "emails_sent_count",
      header: "Emails Sent",
      cell: ({ row }) => formatNumber(row.original.emails_sent_count),
    },
  ]

  const rowActions = (campaign) => [
    {
      label: "View Details",
      onSelect: () => {
        // Navigate to campaign details - would integrate with existing routing
        console.log("Navigate to campaign:", campaign.id)
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      enableSelection={false}
      rowActions={rowActions}
      emptyMessage="No best performing campaigns data available"
      rowId={(row) => row.id}
    />
  )
}