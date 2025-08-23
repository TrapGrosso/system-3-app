import * as React from "react"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/table/DataTable"
import { formatRelativeTime } from "@/components/shared/ui/ChartKit"

/**
 * NewlyAddedTable - Table of recently added prospects
 */
export function NewlyAddedTable({ prospects }) {
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const prospect = row.original
        const fullName = `${prospect.first_name || ""} ${prospect.last_name || ""}`.trim()
        return fullName || "Unknown"
      },
    },
    {
      accessorKey: "linkedin_id",
      header: "LinkedIn",
      cell: ({ row }) => {
        const linkedinId = row.original.linkedin_id
        if (!linkedinId) return "-"
        
        return (
          <div className="flex items-center gap-2">
            <span className="truncate max-w-32">{linkedinId}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`https://linkedin.com/in/${linkedinId}`, "_blank")
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Added",
      cell: ({ row }) => {
        const createdAt = row.original.created_at
        return createdAt ? formatRelativeTime(createdAt) : "-"
      },
    },
    {
      accessorKey: "inCampaign",
      header: "In Campaign",
      cell: ({ row }) => {
        const inCampaign = row.original.inCampaign
        return (
          <Badge variant={inCampaign ? "default" : "outline"}>
            {inCampaign ? "Yes" : "No"}
          </Badge>
        )
      },
    },
  ]

  const rowActions = (prospect) => [
    {
      label: "View Details",
      onSelect: () => {
        // Navigate to prospect details or People&Companies with filter
        console.log("Navigate to prospect:", prospect.linkedin_id)
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={prospects}
      enableSelection={false}
      rowActions={rowActions}
      emptyMessage="No recently added prospects"
      rowId={(row) => row.linkedin_id}
    />
  )
}