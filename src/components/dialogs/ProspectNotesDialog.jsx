import * as React from "react"
import { useState } from "react"
import { Edit3, Trash2, Plus, MessageSquare } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import { useNotes, useProspectNotes } from "@/contexts/NotesContext"

function ProspectNotesDialog({ 
  prospect_id,
  prospect_name = "this prospect",
  onSuccess,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editingContent, setEditingContent] = useState("")
  
  // Get notes context
  const {
    addNoteToProspect,
    updateProspectNote,
    deleteNotes,
    isCreatingNote,
    isUpdatingNote,
    isDeletingNote,
  } = useNotes()
  
  // Get prospect notes
  const {
    data: prospectNotes = [],
    isLoading: isLoadingNotes,
    isError: isErrorNotes,
    refetch: refetchNotes,
  } = useProspectNotes(prospect_id)
  
  // Determine if this is controlled or uncontrolled
  const isControlled = controlledOpen !== undefined
  const dialogOpen = isControlled ? controlledOpen : internalOpen
  const setDialogOpen = isControlled ? controlledOnOpenChange : setInternalOpen

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return
    
    addNoteToProspect(prospect_id, newNoteContent.trim())
    setNewNoteContent("")
    onSuccess?.()
  }

  const handleStartEdit = (note) => {
    setEditingNoteId(note.id)
    setEditingContent(note.body)
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
    setEditingContent("")
  }

  const handleSaveEdit = () => {
    if (!editingContent.trim() || !editingNoteId) return
    
    updateProspectNote(editingNoteId, editingContent.trim())
    setEditingNoteId(null)
    setEditingContent("")
    onSuccess?.()
  }

  const handleDeleteNote = (noteId) => {
    deleteNotes([noteId])
    onSuccess?.()
  }

  const handleOpenChange = (newOpen) => {
    if (setDialogOpen) {
      setDialogOpen(newOpen)
    }
    if (!newOpen) {
      // Reset all state
      setNewNoteContent("")
      setEditingNoteId(null)
      setEditingContent("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (editingNoteId) {
        handleSaveEdit()
      } else {
        handleAddNote()
      }
    }
    if (e.key === 'Escape') {
      if (editingNoteId) {
        handleCancelEdit()
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Sort notes by creation date (newest first)
  const sortedNotes = [...prospectNotes].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Notes for {prospect_name}
          </DialogTitle>
          <DialogDescription>
            Add and manage notes for this prospect. Use Ctrl+Enter to quickly save.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Quick Add Note Section */}
          <div className="space-y-3">
            <Label htmlFor="new-note" className="text-sm font-medium">
              Add new note
            </Label>
            <Textarea
              id="new-note"
              placeholder="Enter your note here..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isCreatingNote}
              className="min-h-[80px] resize-none"
              autoFocus
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {newNoteContent.length}/1000 characters
              </span>
              <Button 
                onClick={handleAddNote}
                disabled={!newNoteContent.trim() || isCreatingNote}
                size="sm"
              >
                {isCreatingNote && <Spinner size="sm" className="mr-2" />}
                <Plus className="h-4 w-4 mr-1" />
                Add Note
              </Button>
            </div>
          </div>

          <Separator />

          {/* Notes List Section */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Previous Notes</h4>
              {!isLoadingNotes && (
                <Badge variant="secondary">
                  {sortedNotes.length} note{sortedNotes.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {isLoadingNotes ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-3 border rounded-md space-y-2">
                      <div className="flex justify-between items-start">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
              ) : isErrorNotes ? (
                <div className="text-center py-8">
                  <p className="text-sm text-destructive mb-2">Failed to load notes</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => refetchNotes()}
                  >
                    Retry
                  </Button>
                </div>
              ) : sortedNotes.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">No notes yet</p>
                  <p className="text-xs text-muted-foreground">
                    Add your first note above to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedNotes.map((note) => (
                    <div key={note.id} className="p-3 border rounded-md hover:bg-accent/50 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note.created_at)}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleStartEdit(note)}
                            disabled={editingNoteId === note.id || isUpdatingNote}
                          >
                            <Edit3 className="h-3 w-3" />
                            <span className="sr-only">Edit note</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteNote(note.id)}
                            disabled={isDeletingNote}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete note</span>
                          </Button>
                        </div>
                      </div>
                      
                      {editingNoteId === note.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isUpdatingNote}
                            className="min-h-[60px] resize-none"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              disabled={isUpdatingNote}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              disabled={!editingContent.trim() || isUpdatingNote}
                            >
                              {isUpdatingNote && <Spinner size="sm" className="mr-2" />}
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {note.body}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isCreatingNote || isUpdatingNote || isDeletingNote}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProspectNotesDialog
