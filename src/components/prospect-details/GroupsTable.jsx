import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { UsersIcon, TrashIcon } from 'lucide-react'
import { useGroups } from '@/contexts/GroupsContext'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function GroupsTable({ groups = [], prospect }) {
  const { user } = useAuth()
  const { removeFromGroup } = useGroups()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleRemoveFromGroup = async (groupId) => {
    if (!prospect?.linkedin_id || !user?.id) {
      toast.error('Missing required data')
      return
    }

    try {
      await removeFromGroup.mutateAsync({
        user_id: user.id,
        prospect_ids: [prospect.linkedin_id],
        group_id: groupId
      })
    } catch (error) {
      // Error handling is done in the context
    }
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No groups yet</p>
            <p className="text-sm">This prospect hasn't been added to any groups.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5" />
          Groups ({groups.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">
                  {group.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {group.description || 'No description'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(group.created_at)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromGroup(group.id)}
                    disabled={removeFromGroup.isPending}
                    className="text-destructive hover:text-destructive"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Remove from group</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
