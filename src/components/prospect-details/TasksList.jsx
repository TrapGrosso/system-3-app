import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckSquareIcon, CalendarIcon, PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useTasks } from '@/contexts/TaskContext'
import { DataTable } from '@/components/shared/table/DataTable'
import { useDialogs } from '@/contexts/DialogsContext'
import { useState, useEffect } from 'react'
import { formatAbsolute } from '@/utils/timeformat'

export default function TasksList({ tasks = [], onAddTask }) {
  const { 
    deleteTasks, 
    isDeletingTask 
  } = useTasks()

  const { confirm } = useDialogs()

  const [localTasks, setLocalTasks] = useState(tasks)

  useEffect(() => {
    setLocalTasks(tasks)
  }, [tasks])


  const handleAddTask = () => {
    if (onAddTask) {
      onAddTask()
    }
  }

  const handleEditTask = (task) => {
    // For table-based editing, we'll open the dialog with the task pre-filled
    // The ProspectTasksDialog already handles editing
    if (onAddTask) {
      onAddTask()
    }
  }

  const getRowActions = (task) => [
    {
      label: 'Edit',
      icon: PencilIcon,
      onSelect: () => handleEditTask(task),
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      variant: "destructive",
      disabled: isDeletingTask,
      onSelect: async (task) => {
        const ok = await confirm({
          title: 'Delete task',
          description: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
          confirmLabel: 'Delete'
        })
        if (ok) {
          await deleteTasks([task.id])
          setLocalTasks(prev => prev.filter(t => t.id !== task.id))
        }
      },
    },
  ]

  const bulkActions = [
    {
      label: 'Delete selected',
      icon: TrashIcon,
      variant: "destructive",
      onSelect: async (ids) => {
        const ok = await confirm({
          title: 'Delete tasks',
          description: `Delete ${ids.length} selected task(s)? This action cannot be undone.`,
          confirmLabel: 'Delete'
        })
        if (ok) {
          await deleteTasks(ids)
          setLocalTasks(prev => prev.filter(t => !ids.includes(t.id)))
        }
      },
    },
  ]

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'default'
      case 'completed':
        return 'secondary'
      case 'overdue':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const isOverdue = (dueDate, status) => {
    if (status?.toLowerCase() === 'completed') return false
    return new Date(dueDate) < new Date()
  }

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.title}
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-muted-foreground max-w-xs truncate">
          {row.original.description}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableSorting: false,
      cell: ({ row }) => {
        const overdue = isOverdue(row.original.due_date, row.original.status)
        return (
          <Badge variant={overdue ? 'destructive' : getStatusVariant(row.original.status)}>
            {overdue ? 'Overdue' : row.original.status}
          </Badge>
        )
      },
    },
    {
      header: 'Due Date',
      accessorKey: 'due_date',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-muted-foreground flex items-center gap-1 w-32">
          <CalendarIcon className="h-3 w-3" />
          {formatAbsolute(row.original.due_date, { dateStyle: "short" })}
        </div>
      ),
    },
  ]

  if (localTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquareIcon className="h-5 w-5" />
              Tasks (0)
            </CardTitle>
            <Button onClick={handleAddTask} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <CheckSquareIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tasks yet</p>
            <p className="text-sm">Create a task to track follow-ups and actions for this prospect.</p>
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
            <CheckSquareIcon className="h-5 w-5" />
            Tasks ({localTasks.length})
          </CardTitle>
          <Button onClick={handleAddTask} size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={localTasks}
          rowId={(row) => row.id}
          enableSelection={true}
          bulkActions={bulkActions}
          rowActions={getRowActions}
          emptyMessage="No tasks found"
          onBulkAction={(action, ids) => action.onClick(ids)}
          onRowClick={() => {}} // Disable row clicks
        />
      </CardContent>
    </Card>
  )
}
