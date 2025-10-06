import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquareIcon, PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useNotes } from '@/contexts/NotesContext'
import { DataTable } from '@/components/shared/table/DataTable'
import { useDialogs } from '@/contexts/DialogsContext'
import { formatAbsolute } from '@/utils/timeformat'

export default function NotesList({ notes = [], onAddNote }) {
  const { 
    deleteNotes, 
    isUpdatingNote, 
    isDeletingNote 
  } = useNotes()

  const { confirm } = useDialogs()

  const handleAddNote = () => {
    if (onAddNote) {
      onAddNote()
    }
  }

  const handleEditNote = (note) => {
    // For table-based editing, we'll open the dialog with the note pre-filled
    // The ProspectNotesDialog already handles editing
    if (onAddNote) {
      onAddNote()
    }
  }

  const rowActions = (note) => [
    {
      id: 'edit',
      label: 'Edit',
      icon: PencilIcon,
      onSelect: () => handleEditNote(note),
      disabled: isUpdatingNote || isDeletingNote
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: TrashIcon,
      variant: 'destructive',
      onSelect: async () => {
        const preview = note.body.slice(0, 40) + (note.body.length > 40 ? '...' : '')
        const ok = await confirm({
          title: 'Delete note',
          description: `Are you sure you want to delete this note? "${preview}"`,
          confirmLabel: 'Delete',
          cancelLabel: 'Cancel',
          icon: undefined
        })
        if (ok) {
          await deleteNotes([note.id])
        }
      },
      disabled: isDeletingNote
    }
  ]

  const bulkActions = [
    {
      id: 'delete',
      label: 'Delete selected',
      value: 'delete',
      icon: TrashIcon,
      variant: 'destructive',
      disabled: isDeletingNote,
      onSelect: async (ids) => {
        const ok = await confirm({
          title: 'Delete notes',
          description: `Delete ${ids.length} selected note(s)?`,
          confirmLabel: 'Delete',
          cancelLabel: 'Cancel'
        })
        if (ok) {
          await deleteNotes(ids)
        }
      },
    }
  ]


  const columns = [
    {
      header: 'Note',
      accessorKey: 'body',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="font-medium whitespace-pre-wrap break-words">
          {row.original.body}
        </div>
      ),
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-muted-foreground w-48">
          {formatAbsolute(row.original.created_at, { dateStyle: "short", timeStyle: "short" })}
        </div>
      ),
    },
  ]

  if (notes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquareIcon className="h-5 w-5" />
              Notes (0)
            </CardTitle>
            <Button onClick={handleAddNote} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <MessageSquareIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notes yet</p>
            <p className="text-sm">Add a note to keep track of your interactions with this prospect.</p>
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
            <MessageSquareIcon className="h-5 w-5" />
            Notes ({notes.length})
          </CardTitle>
          <Button onClick={handleAddNote} size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={notes}
          rowId={(row) => row.id}
          enableSelection={true}
          rowActions={rowActions}
          bulkActions={bulkActions}
          emptyMessage="No notes found"
          onRowClick={() => {}} // Disable row clicks
        />
      </CardContent>

    </Card>
  )
}
