import React, { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  MoreHorizontalIcon, 
  PencilIcon, 
  TrashIcon, 
  MessageSquareIcon, 
  CheckSquareIcon, 
  TargetIcon, 
  SearchIcon, 
  UsersIcon,
  ChevronDownIcon
} from 'lucide-react'
import { toast } from 'sonner'

export default function ProspectHeader({ prospect, onUpdateProspect, onDeleteProspect, onAddNote, onCreateTask, onAddToCampaign, onAddToDeepResearch, onAddToGroup }) {
  const [open, setOpen] = useState(false)

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
      value: 'update-prospect',
      label: 'Update prospect',
      icon: PencilIcon,
      onSelect: onUpdateProspect
    },
    {
      value: 'delete-prospect',
      label: 'Delete prospect',
      icon: TrashIcon,
      onSelect: onDeleteProspect,
      variant: 'destructive'
    },
    {
      value: 'add-note',
      label: 'Add note',
      icon: MessageSquareIcon,
      onSelect: onAddNote
    },
    {
      value: 'create-task',
      label: 'Create task',
      icon: CheckSquareIcon,
      onSelect: onCreateTask
    },
    {
      value: 'add-to-campaign',
      label: 'Add to campaign',
      icon: TargetIcon,
      onSelect: onAddToCampaign
    },
    {
      value: 'add-to-deep-research',
      label: 'Add to deep research queue',
      icon: SearchIcon,
      onSelect: onAddToDeepResearch
    },
    {
      value: 'add-to-group',
      label: 'Add to group',
      icon: UsersIcon,
      onSelect: onAddToGroup
    }
  ]

  const handleActionSelect = (action) => {
    setOpen(false)
    if (action.onSelect) {
      action.onSelect()
    } else {
      toast.info(`${action.label} functionality not implemented yet`)
    }
  }

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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-between"
                >
                  <MoreHorizontalIcon className="h-4 w-4 mr-2" />
                  Actions
                  <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <Command>
                  <CommandInput placeholder="Search actions..." className="h-9" />
                  <CommandEmpty>No actions found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {actions.map((action) => {
                        const Icon = action.icon
                        return (
                          <CommandItem
                            key={action.value}
                            value={action.value}
                            onSelect={() => handleActionSelect(action)}
                            className={action.variant === 'destructive' ? 'text-destructive' : ''}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {action.label}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
