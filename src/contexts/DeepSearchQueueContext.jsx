import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useGetDeepSearchQueueItems } from "@/api/deepSearchQueue-context/getDeepSearchQueueItems"
import { useAddToDeepSearchQueue } from "@/api/deepSearchQueue-context/addToDeepSearchQueue"
import { useUpdateDeepSearchQueueItems } from "@/api/deepSearchQueue-context/updateDeepSearchQueueItems"
import { useDeleteDeepSearchQueueItems } from "@/api/deepSearchQueue-context/deleteDeepSearchQueueItems"
import { useAuth } from "./AuthContext"

const DeepSearchQueueContext = React.createContext(null)

export const DeepSearchQueueProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const user_id = user?.id

  // Fetch queue items
  const {
    data: queueItems = [],
    isLoading: isLoadingQueue,
    isError: isErrorQueue,
    refetch: refetchQueue,
  } = useGetDeepSearchQueueItems(user_id)

  // Add to queue mutation
  const addToQueueMutation = useAddToDeepSearchQueue({
    onSuccess: (data) => {
      const message = data.message || 'Successfully added to deep search queue'
      toast.success(message)
      queryClient.invalidateQueries(['getDeepSearchQueueItems', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add to deep search queue")
    },
  })

  // Update queue mutation
  const updateQueueMutation = useUpdateDeepSearchQueueItems({
    onSuccess: (data) => {
      const message = data.message || 'Queue items updated successfully'
      toast.success(message)
      queryClient.invalidateQueries(['getDeepSearchQueueItems', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update queue items")
    },
  })

  // Delete queue mutation
  const deleteQueueMutation = useDeleteDeepSearchQueueItems({
    onSuccess: (data) => {
      const message = data.message || 'Queue item(s) deleted successfully'
      toast.success(message)
      queryClient.invalidateQueries(['getDeepSearchQueueItems', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete queue item(s)")
    },
  })

  // Helper functions
  const getQueueItemByProspect = React.useCallback(
    (prospect_id) => {
      return queueItems.find((item) => item.prospect_id === prospect_id)
    },
    [queueItems]
  )

  const getQueueItemsByPrompt = React.useCallback(
    (prompt_id) => {
      return queueItems.filter((item) => item.prompt_id === prompt_id)
    },
    [queueItems]
  )

  const invalidateQueue = React.useCallback(
    () => queryClient.invalidateQueries(['getDeepSearchQueueItems', user_id]),
    [queryClient, user_id]
  )

  const addProspects = React.useCallback(
    (prospect_ids, prompt_id) => {
      return addToQueueMutation.mutate({
        user_id,
        prospect_ids: Array.isArray(prospect_ids) ? prospect_ids : [prospect_ids],
        prompt_id
      })
    },
    [addToQueueMutation, user_id]
  )

  const updateProspects = React.useCallback(
    (prospect_ids, updated_prompt_id) => {
      return updateQueueMutation.mutate({
        user_id,
        prospect_ids: Array.isArray(prospect_ids) ? prospect_ids : [prospect_ids],
        updated_prompt_id
      })
    },
    [updateQueueMutation, user_id]
  )

  const deleteProspects = React.useCallback(
    (prospect_prompt_ids) => {
      return deleteQueueMutation.mutate({
        user_id,
        prospect_prompt_ids: Array.isArray(prospect_prompt_ids) ? prospect_prompt_ids : [prospect_prompt_ids]
      })
    },
    [deleteQueueMutation, user_id]
  )

  const addSingleProspectToQueue = React.useCallback(
    (prospect_id, prompt_id) => {
      return addToQueueMutation.mutate({
        user_id,
        prospect_ids: [prospect_id],
        prompt_id
      })
    },
    [addToQueueMutation, user_id]
  )

  const removeSingleProspectFromQueue = React.useCallback(
    (prospect_id, prompt_id) => {
      return deleteQueueMutation.mutate({
        user_id,
        prospect_prompt_ids: [{
          prospect_id,
          prompt_id
        }]
      })
    },
    [deleteQueueMutation, user_id]
  )

  const value = React.useMemo(
    () => ({
      // Data
      queueItems,
      isLoadingQueue,
      isErrorQueue,
      user_id,

      // Mutations
      addToQueue: addToQueueMutation,
      updateQueue: updateQueueMutation,
      deleteQueue: deleteQueueMutation,

      // Helper functions
      getQueueItemByProspect,
      getQueueItemsByPrompt,
      invalidateQueue,
      addProspects,
      updateProspects,
      deleteProspects,
      addSingleProspectToQueue,
      removeSingleProspectFromQueue,
      refetchQueue,

      // Loading states
      isAddingToQueue: addToQueueMutation.isPending,
      isUpdatingQueue: updateQueueMutation.isPending,
      isDeletingQueue: deleteQueueMutation.isPending,
    }),
    [
      queueItems,
      isLoadingQueue,
      isErrorQueue,
      user_id,
      addToQueueMutation,
      updateQueueMutation,
      deleteQueueMutation,
      getQueueItemByProspect,
      getQueueItemsByPrompt,
      invalidateQueue,
      addProspects,
      updateProspects,
      deleteProspects,
      addSingleProspectToQueue,
      removeSingleProspectFromQueue,
      refetchQueue,
    ]
  )

  return (
    <DeepSearchQueueContext.Provider value={value}>
      {children}
    </DeepSearchQueueContext.Provider>
  )
}

export const useDeepSearchQueue = () => {
  const context = React.useContext(DeepSearchQueueContext)
  if (!context) {
    throw new Error("useDeepSearchQueue must be used within a DeepSearchQueueProvider")
  }
  return context
}

// Hook for getting queue items with caching
export const useUserDeepSearchQueueItems = (userIdOverride) => {
  const { user_id } = useDeepSearchQueue()
  return useGetDeepSearchQueueItems(userIdOverride || user_id)
}

// Hook for getting queue item for a specific prospect
export const useProspectQueueItem = (prospect_id) => {
  const { getQueueItemByProspect } = useDeepSearchQueue()
  return React.useMemo(
    () => getQueueItemByProspect(prospect_id),
    [getQueueItemByProspect, prospect_id]
  )
}

// Hook for checking if a prospect is in queue for a specific prompt
export const useIsProspectInQueue = (prospect_id, prompt_id) => {
  const { queueItems } = useDeepSearchQueue()
  return React.useMemo(
    () => queueItems.some(item => item.prospect_id === prospect_id && item.prompt_id === prompt_id),
    [queueItems, prospect_id, prompt_id]
  )
}
