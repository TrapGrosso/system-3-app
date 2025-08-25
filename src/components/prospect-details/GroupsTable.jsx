import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UsersIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { useGroups } from '@/contexts/GroupsContext'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { DataTable } from '@/components/shared/table/DataTable'
import { useDialogs } from '@/contexts/DialogsContext'

export default function GroupsTable({ groups = [], prospect, onAddToGroup }) {
  const { user } = useAuth()
  const { removeFromGroup, isRemovingFromGroup } = useGroups()
  const { confirm } = useDialogs()

  const handleRemoveFromGroup = async (group) => {
    if (!prospect?.linkedin_id) {
      toast.error('Missing required data')
      return
    }

    const ok = await confirm({
      title: 'Remove from group',
      description: `Are you sure you want to remove ${prospect?.first_name || ''} ${prospect?.last_name || ''} from "${group.name}"?`,
      confirmLabel: 'Remove',
      cancelLabel: 'Cancel'
    })

    if (!ok) {
      return
    }

    try {
      await removeFromGroup({
        prospect_ids: [prospect.linkedin_id],
        group_id: group.id
      })
      toast.success(`Removed from "${group.name}"`)
    } catch (error) {
      // Error handling is done in the context
    }
  }

  const handleAddToGroup = () => {
    if (onAddToGroup) {
      onAddToGroup()
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const columns = [
    {
      header: 'Group Name',
      accessorKey: 'name',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.name}
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.description || 'No description'}
        </div>
      ),
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {formatDate(row.original.created_at)}
        </div>
      ),
    },
  ]

  const getRowActions = (group) => [
    {
      id: 'remove',
      label: 'Remove from group',
      icon: TrashIcon,
      variant: 'destructive',
      disabled: isRemovingFromGroup,
      onSelect: () => handleRemoveFromGroup(group)
    }
  ]

  if (groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Groups (0)
            </CardTitle>
            <Button onClick={handleAddToGroup} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add to Group
            </Button>
          </div>
        </CardHeader>
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Groups ({groups.length})
          </CardTitle>
          <Button onClick={handleAddToGroup} size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add to Group
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={groups}
          rowId={(row) => row.id}
          enableSelection={false}
          emptyMessage="No groups found"
          rowActions={getRowActions}
          onRowClick={() => {}} // Disable row clicks
        />
      </CardContent>

    </Card>
  )
}
