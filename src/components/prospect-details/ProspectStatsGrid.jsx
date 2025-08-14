import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquareIcon, 
  CheckSquareIcon, 
  TargetIcon, 
  UsersIcon, 
  Code2, 
  DatabaseIcon, 
  SearchIcon 
} from 'lucide-react'

export default function ProspectStatsGrid({ 
  notes = [], 
  tasks = [], 
  campaigns = [], 
  groups = [], 
  variables = [], 
  enrichment = {}, 
  deepSearch = {} 
}) {
  // Calculate counts
  const notesCount = notes?.length || 0
  const tasksCount = tasks?.length || 0
  const campaignsCount = campaigns?.length || 0
  const groupsCount = groups?.length || 0
  const variablesCount = variables?.length || 0
  
  // Calculate enrichment count (prospect + company)
  const enrichmentCount = enrichment 
    ? Object.values(enrichment).flat().length 
    : 0

  // Check if in deep search queue
  const isInDeepSearchQueue = deepSearch?.is_in_queue || false

  // Stats configuration
  const stats = [
    {
      label: 'Notes',
      value: notesCount,
      icon: MessageSquareIcon,
      variant: notesCount > 0 ? 'default' : 'outline'
    },
    {
      label: 'Tasks',
      value: tasksCount,
      icon: CheckSquareIcon,
      variant: tasksCount > 0 ? 'default' : 'outline'
    },
    {
      label: 'Campaigns',
      value: campaignsCount,
      icon: TargetIcon,
      variant: campaignsCount > 0 ? 'default' : 'outline'
    },
    {
      label: 'Groups',
      value: groupsCount,
      icon: UsersIcon,
      variant: groupsCount > 0 ? 'default' : 'outline'
    },
    {
      label: 'Variables',
      value: variablesCount,
      icon: Code2,
      variant: variablesCount > 0 ? 'default' : 'outline'
    },
    {
      label: 'Enrichments',
      value: enrichmentCount,
      icon: DatabaseIcon,
      variant: enrichmentCount > 0 ? 'default' : 'outline'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <IconComponent className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        )
      })}
      
      {/* Deep Search Status Card */}
      <Card className={isInDeepSearchQueue ? "border-yellow-500" : ""}>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Deep Search
            </span>
          </div>
          {isInDeepSearchQueue && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Queued
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isInDeepSearchQueue ? 'In Queue' : 'Not Queued'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
