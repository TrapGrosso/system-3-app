import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ActionDropdown } from '@/components/shared/ui/ActionDropdown'
import { 
  MoreHorizontalIcon, 
  PencilIcon, 
  TrashIcon, 
  MessageSquareIcon, 
  CheckSquareIcon, 
  TargetIcon, 
  SearchIcon, 
  UsersIcon,
  EditIcon,
  XIcon
} from 'lucide-react'
import { toast } from 'sonner'

export default function ProspectHeader({ 
  prospect, 
  deepSearch, 
  onUpdateProspect, 
  onDeleteProspect, 
  onUpdateQueuePrompt, 
  onRemoveFromQueue, 
  onAddNote, 
  onCreateTask, 
  onAddToCampaign, 
  onAddToDeepResearch, 
  onAddToGroup 
}) {

  if (!prospect) return null

  const { first_name, last_name, headline, status, location, linkedin_id } = prospect
  
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'default'
      case 'contacted':
        return 'secondary'
      case 'qualified':
        return 'default'
      default:
        return 'outline'
    }
  }

  const actions = [
    {
      id: 'update-prospect',
      label: 'Update prospect',
      icon: PencilIcon,
      onSelect: onUpdateProspect
    },
    {
      id: 'delete-prospect',
      label: 'Delete prospect',
      icon: TrashIcon,
      onSelect: onDeleteProspect,
      variant: 'destructive'
    },
    'separator',
    ...(deepSearch?.is_in_queue ? [
      {
        id: 'update-deepsearch-prompt',
        label: 'Update deep search queue prompt',
        icon: EditIcon,
        onSelect: onUpdateQueuePrompt
      },
      {
        id: 'remove-from-deepsearch-queue',
        label: 'Remove from deepsearch queue',
        icon: XIcon,
        onSelect: onRemoveFromQueue,
        variant: 'destructive'
      },
      'separator'
    ] : []),
    {
      id: 'add-note',
      label: 'Add note',
      icon: MessageSquareIcon,
      onSelect: onAddNote
    },
    {
      id: 'create-task',
      label: 'Create task',
      icon: CheckSquareIcon,
      onSelect: onCreateTask
    },
    {
      id: 'add-to-campaign',
      label: 'Add to campaign',
      icon: TargetIcon,
      onSelect: onAddToCampaign
    },
    {
      id: 'add-to-deep-research',
      label: deepSearch?.is_in_queue ? 'Already in deep research queue' : 'Add to deep research queue',
      icon: SearchIcon,
      onSelect: deepSearch?.is_in_queue 
        ? () => toast.info('Prospect already queued for deep research')
        : onAddToDeepResearch,
      variant: deepSearch?.is_in_queue ? 'secondary' : undefined
    },
    {
      id: 'add-to-group',
      label: 'Add to group',
      icon: UsersIcon,
      onSelect: onAddToGroup
    }
  ]

  return (
    <Card className="mx-4 lg:mx-6 mb-6">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {getInitials(first_name, last_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-2xl">
                {first_name} {last_name}
              </CardTitle>
              <Badge variant={getStatusVariant(status)}>
                {status}
              </Badge>
              {deepSearch?.is_in_queue && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 cursor-help">
                      Deep research queued
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium">Queued prompts:</p>
                      {deepSearch.prompts?.map((prompt, index) => (
                        <p key={prompt.id || index} className="text-sm">
                          • {prompt.name}
                        </p>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            
            {headline && (
              <CardDescription className="text-base mb-2">
                {headline}
              </CardDescription>
            )}
            
            {location && (
              <CardDescription className="text-sm text-muted-foreground">
                📍 {location}
              </CardDescription>
            )}
          </div>

          <div className="flex gap-2">
            <ActionDropdown
              items={actions}
              triggerProps={{
                variant: "outline",
                size: "sm",
                icon: MoreHorizontalIcon,
                className: "justify-between"
              }}
              align="end"
              side="bottom"
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
