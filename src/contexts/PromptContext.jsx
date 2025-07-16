import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useGetAllPrompts } from "@/api/prompt-context/getAllPrompts"
import { useCreatePrompt } from "@/api/prompt-context/createPrompt"
import { useUpdatePrompt } from "@/api/prompt-context/updatePrompt"
import { useDeletePrompt } from "@/api/prompt-context/deletePrompt"
import { useAuth } from "./AuthContext"

// Agent type enum
export const AGENT_TYPES = ['deep_research', 'create_variable']

const PromptContext = React.createContext(null)

export const PromptProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const user_id = user?.id

  // Create prompt mutation
  const createPromptMutation = useCreatePrompt({
    onSuccess: (data) => {
      const message = data.message || 'Prompt created successfully'
      toast.success(message)
      // Invalidate all prompts queries
      queryClient.invalidateQueries(['getAllPrompts', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create prompt")
    },
  })

  // Update prompt mutation
  const updatePromptMutation = useUpdatePrompt({
    onSuccess: (data) => {
      const message = data.message || 'Prompt updated successfully'
      toast.success(message)
      // Invalidate all prompts queries
      queryClient.invalidateQueries(['getAllPrompts', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update prompt")
    },
  })

  // Delete prompt mutation
  const deletePromptMutation = useDeletePrompt({
    onSuccess: (data) => {
      const message = data.message || 'Prompt deleted successfully'
      toast.success(message)
      // Invalidate all prompts queries
      queryClient.invalidateQueries(['getAllPrompts', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete prompt")
    },
  })

  // Helper functions
  const getPromptById = React.useCallback(
    (prompt_id) => {
      const prompts = queryClient.getQueryData(['getAllPrompts', user_id]) || []
      return prompts.find(prompt => prompt.id === prompt_id)
    },
    [queryClient, user_id]
  )

  const invalidateAllPrompts = React.useCallback(
    () => {
      queryClient.invalidateQueries(['getAllPrompts', user_id])
    },
    [queryClient, user_id]
  )

  const duplicatePrompt = React.useCallback(
    (prompt_id, overrides = {}) => {
      const originalPrompt = getPromptById(prompt_id)
      if (!originalPrompt) {
        toast.error("Prompt not found")
        return
      }

      const duplicatedPrompt = {
        user_id,
        prompt_name: overrides.prompt_name || `${originalPrompt.name} (Copy)`,
        prompt_description: overrides.prompt_description || originalPrompt.description,
        prompt_text: overrides.prompt_text || originalPrompt.prompt_text,
        agent_type: overrides.agent_type || originalPrompt.agent_type,
        tags: overrides.tags || originalPrompt.tags || []
      }

      return createPromptMutation.mutate(duplicatedPrompt)
    },
    [createPromptMutation, getPromptById, user_id]
  )

  const createPrompt = React.useCallback(
    (promptData) => {
      // Validate agent_type
      if (promptData.agent_type && !AGENT_TYPES.includes(promptData.agent_type)) {
        toast.error(`Invalid agent type. Must be one of: ${AGENT_TYPES.join(', ')}`)
        return
      }
      return createPromptMutation.mutate({
        user_id,
        ...promptData
      })
    },
    [createPromptMutation, user_id]
  )

  const updatePrompt = React.useCallback(
    (prompt_id, updates) => {
      // Validate agent_type if provided
      if (updates.updated_agent_type && !AGENT_TYPES.includes(updates.updated_agent_type)) {
        toast.error(`Invalid agent type. Must be one of: ${AGENT_TYPES.join(', ')}`)
        return
      }
      return updatePromptMutation.mutate({
        user_id,
        prompt_id,
        ...updates
      })
    },
    [updatePromptMutation, user_id]
  )

  const deletePrompt = React.useCallback(
    (prompt_id) => {
      return deletePromptMutation.mutate({
        user_id,
        prompt_id
      })
    },
    [deletePromptMutation, user_id]
  )

  const value = React.useMemo(
    () => ({
      // User ID
      user_id,

      // Agent types enum
      AGENT_TYPES,

      // Mutation objects (raw)
      createPromptMutation,
      updatePromptMutation,
      deletePromptMutation,

      // Helper functions
      getPromptById,
      invalidateAllPrompts,
      duplicatePrompt,
      
      // Wrapper functions
      createPrompt,
      updatePrompt,
      deletePrompt,

      // Loading states
      isCreatingPrompt: createPromptMutation.isPending,
      isUpdatingPrompt: updatePromptMutation.isPending,
      isDeletingPrompt: deletePromptMutation.isPending,
    }),
    [
      user_id,
      createPromptMutation,
      updatePromptMutation,
      deletePromptMutation,
      getPromptById,
      invalidateAllPrompts,
      duplicatePrompt,
      createPrompt,
      updatePrompt,
      deletePrompt,
    ]
  )

  return (
    <PromptContext.Provider value={value}>
      {children}
    </PromptContext.Provider>
  )
}

export const usePrompts = () => {
  const context = React.useContext(PromptContext)
  if (!context) {
    throw new Error("usePrompts must be used within a PromptProvider")
  }
  return context
}

// Hook for getting all user prompts
export const useAllPrompts = () => {
  const { user_id } = usePrompts()
  return useGetAllPrompts(user_id)
}
