import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquareIcon, PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useNotes } from '@/contexts/NotesContext'
import { DataTable } from '@/components/shared/table/DataTable'
import DeleteDialog from '@/components/dialogs/DeleteDialog'
import useDeleteDialog from '@/components/shared/dialog/useDeleteDialog'

export default function NotesList({ notes = [], onAddNote, onNotesChanged }) {
  const { 
    deleteNotes, 
    isUpdatingNote, 
    isDeletingNote 
  } = useNotes()

  const {
    openDialog: openDeleteDialog,
    currentItem: noteToDelete,
    DeleteDialogProps
  } = useDeleteDialog(
    async (note) => await deleteNotes([note.id]),
    onNotesChanged
  )

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
      onSelect: () => openDeleteDialog(note),
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
        await deleteNotes(ids)
        onNotesChanged()
      },
    }
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
          {formatDate(row.original.created_at)}
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

      {noteToDelete && (
        <DeleteDialog
          {...DeleteDialogProps}
          title="Delete note"
          itemName={noteToDelete.body.slice(0, 40) + (noteToDelete.body.length > 40 ? '...' : '')}
        />
      )}
    </Card>
  )
}
