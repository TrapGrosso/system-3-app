import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, TargetIcon } from 'lucide-react'

export default function CampaignsTable({ campaigns = [] }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <TargetIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No campaigns yet</p>
            <p className="text-sm">This prospect hasn't been added to any campaigns.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TargetIcon className="h-5 w-5" />
          Campaigns ({campaigns.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Added At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((item, index) => {
              const campaign = item.campaign
              const status = getCampaignStatus(campaign)
              
              return (
                <TableRow key={campaign.id || index}>
                  <TableCell className="font-medium">
                    {campaign.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(status)}>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {campaign.start_at ? (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(campaign.start_at)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not set</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {campaign.end_at ? (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(campaign.end_at)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Ongoing</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(item.added_at)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
