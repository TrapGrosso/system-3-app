import * as React from "react"
import { useState, useEffect } from "react"
import { MessageSquare, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import { useNotes, useProspectNotes } from "@/contexts/NotesContext"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"
import EditableListItem from "@/components/shared/ui/EditableListItem"

function ProspectNotesDialog({ 
  prospect_id,
  prospect_name = "this prospect",
  onSuccess,
  trigger,
  open,
  onOpenChange
}) {
  const [newNoteContent, setNewNoteContent] = useState("")
  
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
  
  // Reset newNoteContent when dialog closes
  useEffect(() => {
    if (!open) {
      setNewNoteContent("")
    }
  }, [open])

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return
    
    await addNoteToProspect(prospect_id, newNoteContent.trim())
    setNewNoteContent("")
    onSuccess?.()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleAddNote()
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
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      icon={<MessageSquare className="h-5 w-5" />}
      title={`Notes for ${prospect_name}`}
      description="Add and manage notes for this prospect. Use Ctrl/⌘+Enter to save."
      size="lg"
    >
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      
      <DialogWrapper.Body className="flex flex-col gap-4">
        {/* Quick Add Note Section */}
        <FormField
          id="new-note"
          label="Add new note"
          type="textarea"
          value={newNoteContent}
          onChange={setNewNoteContent}
          placeholder="Enter your note here..."
          maxLength={1000}
          rows={4}
          disabled={isCreatingNote}
          helper="Ctrl/⌘+Enter to save"
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-end">
          <SpinnerButton 
            size="sm"
            loading={isCreatingNote}
            disabled={!newNoteContent.trim()}
            onClick={handleAddNote}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </SpinnerButton>
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
                  <EditableListItem
                    key={note.id}
                    item={note}
                    isLoading={isUpdatingNote}
                    isDeleting={isDeletingNote}
                    onSave={(val) => updateProspectNote(note.id, val).then(onSuccess)}
                    onDelete={() => deleteNotes([note.id]).then(onSuccess)}
                    renderMeta={({item}) => (
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.created_at)}
                      </span>
                    )}
                    renderView={({item}) => (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {item.body}
                      </p>
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogWrapper.Body>

      <DialogWrapper.Footer>
        <Button 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          disabled={isCreatingNote || isUpdatingNote || isDeletingNote}
        >
          Close
        </Button>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default ProspectNotesDialog
