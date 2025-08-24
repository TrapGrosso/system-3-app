import * as React from "react"
import { User2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/table/DataTable"
import { formatRelativeTime } from "@/components/shared/ui/ChartKit"

/**
 * FailedOperationsTable - Table of failed operations with retry options
 */
export function FailedOperationsTable({ operations }) {
  const columns = [
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.original.action?.replace(/_/g, " ") || "Unknown"
        return <Badge variant="destructive">{action}</Badge>
      },
    },
    {
      accessorKey: "message",
      header: "Error Message",
      cell: ({ row }) => {
        const message = row.original.message || ""
        return (
          <div className="max-w-md">
            <div className="text-sm line-clamp-2" title={message}>
              {message}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "start_time",
      header: "Failed At",
      cell: ({ row }) => {
        const startTime = row.original.start_time
        return startTime ? formatRelativeTime(startTime) : "-"
      },
    },
    {
      accessorKey: "prospects",
      header: "Prospects",
      cell: ({ row }) => {
        const prospects = row.original.prospects || []
        if (!prospects.length) return "-"
        
        return (
          <div className="flex items-center gap-1">
            <User2 className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{prospects.length}</span>
            {prospects.length === 1 && prospects[0].name && (
              <span className="text-xs text-muted-foreground ml-1">
                ({prospects[0].name})
              </span>
            )}
          </div>
        )
      },
    }
  ]

  return (
    <DataTable
      columns={columns}
      data={operations}
      enableSelection={false}
      emptyMessage="No failed operations"
      rowId={(row) => row.id}
      rowClassName="bg-destructive/5"
    />
  )
}