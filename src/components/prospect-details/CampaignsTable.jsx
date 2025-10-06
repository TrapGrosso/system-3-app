// CampaignsTable: Refactored to use shared DataTable
import React, { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarIcon, TargetIcon, Trash2, PlusIcon } from 'lucide-react'
import { DataTable } from '@/components/shared/table/DataTable'
import { useNavigate } from 'react-router-dom'
import { formatAbsolute } from '@/utils/timeformat'

export default function CampaignsTable({ campaigns = [], prospect, onOpenRemoveFromCampaign, onAddToCampaign }) {
  const getCampaignStatus = (campaign) => {
    const now = new Date()
    const startDate = campaign.start_at ? new Date(campaign.start_at) : null
    const endDate = campaign.end_at ? new Date(campaign.end_at) : null

    if (endDate && now > endDate) return 'completed'
    if (startDate && now >= startDate) return 'active'
    if (startDate && now < startDate) return 'scheduled'
    return 'draft'
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'completed':
        return 'secondary'
      case 'scheduled':
        return 'outline'
      case 'draft':
        return 'outline'
      default:
        return 'outline'
    }
  }


  const navigate = useNavigate()

  const rows = useMemo(() => {
    return campaigns.map((item) => {
      const campaign = item.campaign || {}
      const status = getCampaignStatus(campaign)
      return {
        id: campaign.id,
        name: campaign.name,
        status,
        start_at: campaign.start_at,
        end_at: campaign.end_at,
        added_at: item.added_at,
        raw: item,
      }
    })
  }, [campaigns])

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Campaign Name',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      )
    },
    {
      accessorKey: 'start_at',
      header: 'Start Date',
      cell: ({ row }) => (
        row.original.start_at ? (
          <div className="flex items-center gap-1 text-muted-foreground">
            <CalendarIcon className="h-3 w-3" />
            {formatAbsolute(row.original.start_at, { mode: "date", dateStyle: "short" })}
          </div>
        ) : <div>—</div>
      )
    },
    {
      accessorKey: 'end_at',
      header: 'End Date',
      cell: ({ row }) => (
        row.original.end_at ? (
          <div className="flex items-center gap-1 text-muted-foreground">
            <CalendarIcon className="h-3 w-3" />
            {formatAbsolute(row.original.end_at, { mode: "date", dateStyle: "short" })}
          </div>
        ) : <div>—</div>
      )
    },
    {
      accessorKey: 'added_at',
      header: 'Added At',
      cell: ({ row }) => formatAbsolute(row.original.added_at, { mode: "date", dateStyle: "short" })
    }
  ], [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="h-5 w-5" />
            Campaigns ({rows.length})
          </CardTitle>
          <Button onClick={onAddToCampaign} size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add to Campaign
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={rows}
          rowId={(row) => row.id}
          enableSelection={false}
          emptyMessage="This prospect hasn't been added to any campaigns."
          rowActions={(row) => [
            {
              id: "remove",
              label: "Remove from campaign",
              variant: 'destructive',
              icon: Trash2,
              onSelect: () => onOpenRemoveFromCampaign?.({
                prospectId: prospect.linkedin_id,
                prospectName: `${prospect.first_name} ${prospect.last_name}`
              })
            }
          ]}
          onRowClick={(row) => navigate(`/campaigns/${row.id}`)}
        />
      </CardContent>
    </Card>
  )
}
