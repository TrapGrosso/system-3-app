import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { MessageSquareIcon, PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useNotes } from '@/contexts/NotesContext'

export default function NotesList({ notes = [], onAddNote, onNotesChanged }) {
  const { 
    updateProspectNote, 
    deleteNotes, 
    isUpdatingNote, 
    isDeletingNote 
  } = useNotes()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Note</TableHead>
              <TableHead className="w-48">Created At</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.id}>
                <TableCell className="font-medium">
                  <div className="whitespace-pre-wrap break-words">
                    {note.body}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(note.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditNote(note)}
                      className="h-8 w-8 p-0"
                      disabled={isUpdatingNote || isDeletingNote}
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit note</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      disabled={isDeletingNote}
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">Delete note</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
