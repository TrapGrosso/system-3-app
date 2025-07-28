import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquareIcon, PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useNotes } from '@/contexts/NotesContext'
import { DataTable } from '@/components/shared/table/DataTable'

export default function NotesList({ notes = [], onAddNote, onNotesChanged }) {
  const { 
    deleteNotes, 
    isUpdatingNote, 
    isDeletingNote 
  } = useNotes()

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

  const handleDeleteNote = (noteId) => {
    deleteNotes([noteId])
    if (onNotesChanged) {
      // Call after a brief delay to allow for the mutation to complete
      setTimeout(() => onNotesChanged(), 100)
    }
  }

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
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1 w-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleEditNote(row.original)
              }}
              className="h-8 w-8 p-0"
              disabled={isUpdatingNote || isDeletingNote}
            >
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only">Edit note</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteNote(row.original.id)
              }}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              disabled={isDeletingNote}
            >
              <TrashIcon className="h-4 w-4" />
              <span className="sr-only">Delete note</span>
            </Button>
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
          enableSelection={false}
          emptyMessage="No notes found"
          onRowClick={() => {}} // Disable row clicks
        />
      </CardContent>
    </Card>
  )
}
