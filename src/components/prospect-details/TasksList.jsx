import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckSquareIcon, CalendarIcon } from 'lucide-react'

export default function TasksList({ tasks = [] }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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

  if (tasks.length === 0) {
    return (
      <Card>
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
        <CardTitle className="flex items-center gap-2">
          <CheckSquareIcon className="h-5 w-5" />
          Tasks ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const overdue = isOverdue(task.due_date, task.status)
              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    {task.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="max-w-xs truncate">
                      {task.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={overdue ? 'destructive' : getStatusVariant(task.status)}>
                      {overdue ? 'Overdue' : task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {formatDate(task.due_date)}
                    </div>
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
