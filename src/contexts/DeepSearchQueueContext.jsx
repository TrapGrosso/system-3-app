import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useGetDeepSearchQueueItems } from "@/api/deepSearchQueue-context/getDeepSearchQueueItems"
import { useAddToDeepSearchQueue } from "@/api/deepSearchQueue-context/addToDeepSearchQueue"
import { useUpdateDeepSearchQueueItems } from "@/api/deepSearchQueue-context/updateDeepSearchQueueItems"
import { useDeleteDeepSearchQueueItems } from "@/api/deepSearchQueue-context/deleteDeepSearchQueueItems"
import { useResolveDeepSearchQueue } from "@/api/deepSearchQueue-context/resolveDeepSearchQueue"
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

  // Resolve queue mutation
  const resolveQueueMutation = useResolveDeepSearchQueue({
    onSuccess: (data) => {
      const message = data.message || 'Queue resolved successfully'
      toast.success(message)
      queryClient.invalidateQueries(['getDeepSearchQueueItems', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resolve queue")
    },
  })

  // Core mutation wrappers
  const addProspects = React.useCallback(
    (prospect_ids, prompt_ids) => {
      return addToQueueMutation.mutate({
        user_id,
        prospect_ids: Array.isArray(prospect_ids) ? prospect_ids : [prospect_ids],
        prompt_ids: Array.isArray(prompt_ids) ? prompt_ids : [prompt_ids]
      })
    },
    [addToQueueMutation, user_id]
  )

  const updateProspects = React.useCallback(
    (prospect_ids, updated_prompt_ids) => {
      return updateQueueMutation.mutateAsync({
        user_id,
        prospect_ids: Array.isArray(prospect_ids) ? prospect_ids : [prospect_ids],
        updated_prompt_ids: Array.isArray(updated_prompt_ids) ? updated_prompt_ids : [updated_prompt_ids]
      })
    },
    [updateQueueMutation, user_id]
  )

  const deleteProspects = React.useCallback(
    (queue_item_ids) => {
      return deleteQueueMutation.mutateAsync({
        user_id,
        queue_item_ids: Array.isArray(queue_item_ids) ? queue_item_ids : [queue_item_ids]
      })
    },
    [deleteQueueMutation, user_id]
  )

  // Resolve prospects wrapper
  const resolveProspects = React.useCallback(
    (queue_ids) => {
      return resolveQueueMutation.mutate({
        user_id,
        queue_item_ids: Array.isArray(queue_ids) ? queue_ids : [queue_ids]
      })
    },
    [resolveQueueMutation, user_id]
  )

  const value = React.useMemo(
    () => ({
      // Data
      queueItems,
      isLoadingQueue,
      isErrorQueue,
      user_id,

      // Core mutations
      addProspects,
      updateProspects,
      deleteProspects,
      refetchQueue,
      resolveProspects,

      // Loading states
      isAddingToQueue: addToQueueMutation.isPending,
      isUpdatingQueue: updateQueueMutation.isPending,
      isDeletingQueue: deleteQueueMutation.isPending,
      isResolvingQueue: resolveQueueMutation.isPending,
    }),
    [
      queueItems,
      isLoadingQueue,
      isErrorQueue,
      user_id,
      addProspects,
      updateProspects,
      deleteProspects,
      refetchQueue,
      resolveProspects,
      addToQueueMutation.isPending,
      updateQueueMutation.isPending,
      deleteQueueMutation.isPending,
      resolveQueueMutation.isPending,
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
