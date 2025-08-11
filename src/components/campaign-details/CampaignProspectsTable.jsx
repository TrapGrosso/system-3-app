import React from "react"
import { DataTable } from "@/components/shared/table/DataTable"

export default function CampaignProspectsTable({ prospects = [], onRowClick }) {
  const columns = [
    {
      id: "name",
      header: "Name",
      accessorFn: (row) => `${row?.first_name || ""} ${row?.last_name || ""}`.trim(),
      cell: ({ getValue }) => {
        const name = getValue()
        return <span className="font-medium">{name || "-"}</span>
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ getValue }) => <span className="text-foreground/80">{getValue() || "-"}</span>,
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ getValue }) => <span className="text-foreground/80">{getValue() || "-"}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs sm:text-sm">{getValue() || "-"}</span>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold px-1">Prospects in Campaign</h2>
      <DataTable
        columns={columns}
        data={prospects}
        rowId={(row) => row.linkedin_id}
        emptyMessage="No prospects in this campaign"
        onRowClick={onRowClick}
        className="bg-background"
      />
    </div>
  )
}
