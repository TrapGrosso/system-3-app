import * as React from "react"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
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
        const p = row.original
        const first = p.first_name || ""
        const last = p.last_name || ""
        const fullName = `${first} ${last}`.trim() || "Unknown"
        const initials = (first[0] || "") + (last[0] || "")
        return (
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="size-7">
              <AvatarImage alt={fullName} src={p.avatar_url || undefined} />
              <AvatarFallback>{initials.toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-medium truncate">{fullName}</div>
              {p.title ? (
                <div className="text-muted-foreground text-xs truncate">{p.title}</div>
              ) : null}
            </div>
          </div>
        )
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
            <Badge variant="outline" className="max-w-40 truncate font-mono">{linkedinId}</Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`https://linkedin.com/in/${linkedinId}`, "_blank")
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open profile</TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Added",
      cell: ({ row }) => {
        const createdAt = row.original.created_at
        return createdAt ? (
          <Badge variant="outline">{formatRelativeTime(createdAt)}</Badge>
        ) : "-"
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

  return (
    <DataTable
      columns={columns}
      data={prospects}
      enableSelection={false}
      emptyMessage="No recently added prospects"
      rowId={(row) => row.linkedin_id}
      onRowClick={(row) => {
        if (!row?.linkedin_id) return
        window.location.assign(`/prospects/${row.linkedin_id}`)
      }}
      headerClassName="bg-muted/50"
      rowClassName={() => "h-11 hover:bg-muted/60"}
    />
  )
}
