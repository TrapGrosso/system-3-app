import * as React from "react"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon } from "lucide-react"
import { getStatusVariant } from './utils'

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.first_name || '—'}
      </div>
    ),
    filterFn: (row, id, value) => {
      const firstName = row.original.first_name || ''
      const lastName = row.original.last_name || ''
      const fullName = `${firstName} ${lastName}`.toLowerCase()
      return fullName.includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: ({ row }) => (
      <div>{row.original.last_name || '—'}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <div className="truncate" title={row.original.title || row.original.headline}>
          {row.original.title || row.original.headline || '—'}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.original.status)}>
        {row.original.status || 'Unknown'}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (value === 'all') return true
      return row.original.status?.toLowerCase() === value.toLowerCase()
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <div className="truncate" title={row.original.location}>
          {row.original.location || '—'}
        </div>
      </div>
    ),
    filterFn: (row, id, value) => {
      if (value === 'all') return true
      return row.original.location?.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div>
        {row.original.email ? (
          <a 
            href={`mailto:${row.original.email}`}
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.email}
          </a>
        ) : (
          '—'
        )}
      </div>
    ),
  },
  {
    accessorKey: "company_name",
    header: "Company",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <div className="truncate" title={row.original.company_name}>
          {row.original.company_name || '—'}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "note_count",
    header: "Notes",
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.note_count || 0}
      </div>
    ),
  },
  {
    accessorKey: "task_count",
    header: "Tasks",
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.task_count || 0}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              alert(`Add note for ${row.original.first_name} ${row.original.last_name}`)
            }}
          >
            Add Note
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              alert(`Create task for ${row.original.first_name} ${row.original.last_name}`)
            }}
          >
            Create Task
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              alert(`Delete ${row.original.first_name} ${row.original.last_name}`)
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
