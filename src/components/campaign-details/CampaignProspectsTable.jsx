import React from "react"
import { DataTable } from "@/components/shared/table/DataTable"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  Mail as MailIcon,
  ExternalLink as ExternalLinkIcon,
  Copy as CopyIcon,
  Building2 as Building2Icon,
  Users,
} from "lucide-react"

export default function CampaignProspectsTable({ prospects = [], onRowClick }) {
  // Enhanced columns using shadcn/ui
  const columns = React.useMemo(() => [
    {
      id: "name",
      header: "Name",
      accessorFn: (row) => `${row?.first_name || ""} ${row?.last_name || ""}`.trim(),
      cell: ({ row }) => {
        const fn = row.original.first_name || ""
        const ln = row.original.last_name || ""
        const fullName = [fn, ln].filter(Boolean).join(" ")
        const initials = (fn?.[0] || "") + (ln?.[0] || "")
        return (
          <div className="flex items-center gap-2 max-w-[240px]">
            <Avatar className="size-6">
              {row.original.avatar_url ? (
                <AvatarImage src={row.original.avatar_url} alt={fullName} />
              ) : null}
              <AvatarFallback className="text-[10px]">
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium truncate" title={fullName || "—"}>
                  {fullName || "—"}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">{fullName || "—"}</TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const value = row.original.title || row.original.headline || ""
        return (
          <div className="max-w-[240px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="truncate max-w-[240px] font-normal text-xs"
                  title={value || "—"}
                >
                  {value || "—"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top">{value || "—"}</TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => {
        const name = row.original.company || ""
        if (!name) return <div>—</div>
        return (
          <div className="max-w-[260px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Building2Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span className="truncate max-w-[240px]" title={name}>
                    {name}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">{name}</TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.original.email
        if (!email) return <div>—</div>

        const handleCopy = (e) => {
          e.stopPropagation()
          if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(email)
          }
        }

        return (
          <div className="flex items-center gap-1 max-w-[300px]">
            <Button
              variant="link"
              asChild
              className="h-auto p-0 text-left justify-start min-w-0"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1 min-w-0"
                rel="noopener noreferrer"
              >
                <MailIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                <span className="truncate max-w-[220px]">{email}</span>
                <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
              </a>
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopy}
                  aria-label="Copy email"
                >
                  <CopyIcon className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Copy</TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
  ], [])

  // Row action: Remove from Campaign (alert single id)
  const rowActions = React.useCallback((ctx) => [
    {
      label: "Remove from Campaign",
      variant: "destructive",
      onSelect: () => {
        alert(`Remove from campaign: ${ctx.linkedin_id}`)
      }
    }
  ], [])

  // Bulk action: Remove from Campaign (alert array of ids)
  const bulkActions = React.useMemo(() => [
    {
      label: "Remove from Campaign",
      value: "removeFromCampaign",
      variant: "destructive",
      onSelect: (selectedIds) => {
        alert(`Remove from campaign: ${JSON.stringify(selectedIds)}`)
      }
    }
  ], [])

  const formatNumber = (v) => (typeof v === "number" ? v.toLocaleString() : v ?? 0)

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">Campaign Prospects</CardTitle>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {formatNumber(prospects?.length)} Total
              </Badge>
              {prospects?.length > 0 && (
                <>
                  <span>•</span>
                  <span>Manage and track prospect engagement</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <DataTable
          columns={columns}
          data={prospects}
          rowId={(row) => row.linkedin_id}
          emptyMessage="No prospects in this campaign"
          onRowClick={onRowClick}
          className="bg-background"
          // Enable selection by providing bulkActions, and add row action menu
          bulkActions={bulkActions}
          rowActions={rowActions}
        />
      </CardContent>
    </Card>
  )
}
