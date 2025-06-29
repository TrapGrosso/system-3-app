import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MessageSquareIcon } from 'lucide-react'

export default function NotesList({ notes = [] }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (notes.length === 0) {
    return (
      <Card>
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
        <CardTitle className="flex items-center gap-2">
          <MessageSquareIcon className="h-5 w-5" />
          Notes ({notes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Note</TableHead>
              <TableHead className="w-48">Created At</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
