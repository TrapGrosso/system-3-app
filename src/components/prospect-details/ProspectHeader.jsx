import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PlusIcon, MessageSquareIcon } from 'lucide-react'

export default function ProspectHeader({ prospect }) {
  if (!prospect) return null

  const { first_name, last_name, headline, status, location } = prospect
  
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
            <Button variant="ghost" size="sm">
              <MessageSquareIcon className="h-4 w-4" />
              Add Note
            </Button>
            <Button variant="ghost" size="sm">
              <PlusIcon className="h-4 w-4" />
              Create Task
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
