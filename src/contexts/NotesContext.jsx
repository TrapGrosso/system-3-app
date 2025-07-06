import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useGetAllNotes } from "@/api/notes-context/getAllNotes"
import { useGetAllProspectNotes } from "@/api/notes-context/getAllProspectNotes"
import { useCreateNote } from "@/api/notes-context/createNote"
import { useUpdateNote } from "@/api/notes-context/updateNote"
import { useDeleteNote } from "@/api/notes-context/deleteNote"
import { useAuth } from "./AuthContext"

const NotesContext = React.createContext(null)

export const NotesProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const user_id = user?.id

  // Create note mutation
  const createNoteMutation = useCreateNote({
    onSuccess: (data) => {
      const message = data.message || 'Note created successfully'
      toast.success(message)
      // Invalidate all notes queries
      queryClient.invalidateQueries(['getAllNotes', user_id])
      // If notes were created for specific prospects, invalidate those queries too
      if (data.data?.notes) {
        data.data.notes.forEach(note => {
          if (note.prospect_id) {
            queryClient.invalidateQueries(['getAllProspectNotes', user_id, note.prospect_id])
          }
        })
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create note")
    },
  })

  // Update note mutation
  const updateNoteMutation = useUpdateNote({
    onSuccess: (data) => {
      const message = data.message || 'Note updated successfully'
      toast.success(message)
      // Invalidate all notes queries
      queryClient.invalidateQueries(['getAllNotes', user_id])
      // If the note has a prospect_id, invalidate that specific prospect's notes
      if (data.data?.note?.prospect_id) {
        queryClient.invalidateQueries(['getAllProspectNotes', user_id, data.data.note.prospect_id])
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update note")
    },
  })

  // Delete note mutation
  const deleteNoteMutation = useDeleteNote({
    onSuccess: (data) => {
      const message = data.message || 'Note(s) deleted successfully'
      toast.success(message)
      // Invalidate all notes queries
      queryClient.invalidateQueries(['getAllNotes', user_id])
      // Invalidate all prospect notes queries since we don't know which prospects were affected
      queryClient.invalidateQueries(['getAllProspectNotes', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete note(s)")
    },
  })

  // Helper functions
  const getProspectNotes = React.useCallback(
    (prospect_id) => {
      return queryClient.getQueryData(['getAllProspectNotes', user_id, prospect_id]) || []
    },
    [queryClient, user_id]
  )

  const invalidateProspectNotes = React.useCallback(
    (prospect_id) => {
      return queryClient.invalidateQueries(['getAllProspectNotes', user_id, prospect_id])
    },
    [queryClient, user_id]
  )

  const invalidateAllNotes = React.useCallback(
    () => {
      queryClient.invalidateQueries(['getAllNotes', user_id])
      queryClient.invalidateQueries(['getAllProspectNotes', user_id])
    },
    [queryClient, user_id]
  )

  const addNoteToProspect = React.useCallback(
    (prospect_id, note_body) => {
      return createNoteMutation.mutate({
        prospect_ids: [prospect_id],
        user_id,
        note_body
      })
    },
    [createNoteMutation, user_id]
  )

  const addGeneralNote = React.useCallback(
    (note_body) => {
      return createNoteMutation.mutate({
        user_id,
        note_body
      })
    },
    [createNoteMutation, user_id]
  )

  const updateProspectNote = React.useCallback(
    (note_id, updated_content) => {
      return updateNoteMutation.mutate({
        user_id,
        note_id,
        updated_content
      })
    },
    [updateNoteMutation, user_id]
  )

  const deleteNotes = React.useCallback(
    (note_ids) => {
      return deleteNoteMutation.mutate({
        user_id,
        note_ids: Array.isArray(note_ids) ? note_ids : [note_ids]
      })
    },
    [deleteNoteMutation, user_id]
  )

  const value = React.useMemo(
    () => ({
      // User ID
      user_id,

      // Mutations
      createNote: createNoteMutation,
      updateNote: updateNoteMutation,
      deleteNote: deleteNoteMutation,

      // Helper functions
      getProspectNotes,
      invalidateProspectNotes,
      invalidateAllNotes,
      addNoteToProspect,
      addGeneralNote,
      updateProspectNote,
      deleteNotes,

      // Loading states
      isCreatingNote: createNoteMutation.isPending,
      isUpdatingNote: updateNoteMutation.isPending,
      isDeletingNote: deleteNoteMutation.isPending,
    }),
    [
      user_id,
      createNoteMutation,
      updateNoteMutation,
      deleteNoteMutation,
      getProspectNotes,
      invalidateProspectNotes,
      invalidateAllNotes,
      addNoteToProspect,
      addGeneralNote,
      updateProspectNote,
      deleteNotes,
    ]
  )

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  )
}

export const useNotes = () => {
  const context = React.useContext(NotesContext)
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider")
  }
  return context
}

// Hook for getting prospect-specific notes with caching
export const useProspectNotes = (prospect_id) => {
  const { user_id } = useNotes()
  return useGetAllProspectNotes(user_id, prospect_id)
}

// Hook for getting all user notes
export const useAllNotes = () => {
  const { user_id } = useNotes()
  return useGetAllNotes(user_id)
}
